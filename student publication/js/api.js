/* ============================================
   R&D Publication Tracker — Database API (Local MySQL)
   ============================================ */

// Attach API methods to the App object
Object.assign(App, {
    // ── Local MySQL Init ──
    async initLocalMySQL() {
        try {
            this.updateConnectionStatus('connecting', 'Connecting to local server...');
            
            // 1. Detect server instance lifecycle (checks if server was restarted)
            let serverRestarted = false;
            try {
                const instRes = await fetch('/api/auth/server-instance');
                if (instRes.ok) {
                    const instData = await instRes.json();
                    const lastBootId = sessionStorage.getItem('vignan_server_boot_id');
                    if (lastBootId && lastBootId !== instData.serverBootId) {
                        serverRestarted = true;
                        console.log('Server restart detected. Clearing stale admin session.');
                    }
                    sessionStorage.setItem('vignan_server_boot_id', instData.serverBootId);
                }
            } catch (e) {
                serverRestarted = true;
            }

            if (serverRestarted) {
                localStorage.removeItem('vignan_rd_token');
                sessionStorage.removeItem('vignan_rd_token');
                State.token = null;
                State.session = null;
                State.userRole = null;
            }

            const savedToken = localStorage.getItem('vignan_rd_token') || sessionStorage.getItem('vignan_rd_token');
            if (savedToken && !serverRestarted) {
                try {
                    const response = await fetch('/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${savedToken}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        State.token = savedToken;
                        State.session = { user: { id: data.userId, email: data.email } };
                        State.userRole = data.role;
                        console.log('Successfully restored session for role:', State.userRole);
                    } else {
                        console.warn('Saved token is invalid or expired. Logging out.');
                        localStorage.removeItem('vignan_rd_token');
                        sessionStorage.removeItem('vignan_rd_token');
                        State.token = null;
                        State.session = null;
                        State.userRole = null;
                    }
                } catch (authErr) {
                    console.error('Failed to verify session token:', authErr);
                    localStorage.removeItem('vignan_rd_token');
                    sessionStorage.removeItem('vignan_rd_token');
                    State.token = null;
                    State.session = null;
                    State.userRole = null;
                }
            } else {
                State.token = null;
                State.session = null;
                State.userRole = null;
            }

            this.updateConnectionStatus('connected', State.session ? 'Connected (Admin)' : 'Connected');
            this.updateUIForRole();
            await this.loadData();
        } catch (err) {
            console.error('Local server init error:', err);
            this.updateConnectionStatus('error', 'Connection Failed');
            Toast.show('error', 'Connection Error', 'Failed to connect to local server.');
        }
    },

    // ── Data Operations ──
    async loadData() {
        let remotePubs = [];
        let fetchedSuccessfully = false;
        try {
            const headers = {};
            if (State.token) {
                headers['Authorization'] = `Bearer ${State.token}`;
            }
            const response = await fetch('/api/publications', { headers });
            if (response.ok) {
                const data = await response.json();
                remotePubs = data || [];
                fetchedSuccessfully = true;
                this.updateConnectionStatus('connected', State.session ? 'Connected (Admin)' : 'Connected');
            } else {
                console.warn('Failed to load publications from local API, status:', response.status);
                this.updateConnectionStatus('error', 'Connection Failed');
            }
        } catch (err) {
            console.error('Error loading data from local API:', err);
            this.updateConnectionStatus('error', 'Connection Failed');
        }

        if (fetchedSuccessfully) {
            State.publications = remotePubs;
            localStorage.setItem('vignan_rd_publications_v2', JSON.stringify(remotePubs));
        } else {
            const localPubsStr = localStorage.getItem('vignan_rd_publications_v2');
            let localPubs = localPubsStr ? JSON.parse(localPubsStr) : [];
            State.publications = localPubs;
        }

        await this.loadReimbursements();

        this.onDataLoaded();
    },

    onDataLoaded() {
        this.applyFilters();
        this.updateDashboard();

        // Prevent charts from flickering/re-rendering on background poll unless data actually changed
        const currentDataHash = `${(State.publications || []).length}_${(State.reimbursements || []).length}_${(State.publications || []).reduce((sum, p) => sum + parseFloat(p.funding_amount || 0), 0)}`;
        if (State.lastDataHash !== currentDataHash) {
            State.lastDataHash = currentDataHash;
            this.renderCharts();
        }

        this.renderRecentTable();
        this.renderLeaderboard();
        this.renderApprovedReimbursementsHistory();
    },

    async addPublication(formData) {
        const submitBtn = document.getElementById('formSubmitBtn');
        const loader = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
        const icon = submitBtn ? submitBtn.querySelector('i') : null;

        if (submitBtn) submitBtn.disabled = true;
        if (loader) loader.style.display = 'block';
        if (icon) icon.style.display = 'none';

        try {
            // Local Express API write
            const headers = { 'Content-Type': 'application/json' };
            if (State.token) {
                headers['Authorization'] = `Bearer ${State.token}`;
            }
            const response = await fetch('/api/publications', {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                State.publications.unshift(data[0]);
                localStorage.setItem('vignan_rd_publications_v2', JSON.stringify(State.publications));
                
                // Approve any pending claim linked to this publication save FIRST
                if (State.pendingApprovalClaimId) {
                    const claimIdToApprove = State.pendingApprovalClaimId;
                    State.pendingApprovalClaimId = null;
                    try {
                        await this.updateClaimStatus(claimIdToApprove, 'Approved');
                    } catch (claimErr) {
                        console.error('Failed to update claim status after publication save:', claimErr);
                    }
                }

                try {
                    this.onDataLoaded();
                } catch (uiErr) {
                    console.warn('UI update error after adding publication:', uiErr);
                }

                Toast.show('success', 'Publication Added & Approved!', `${formData.name}'s publication has been recorded.`);
                const pubForm = document.getElementById('publicationForm');
                if (pubForm) pubForm.reset();
                if (typeof this.resetToggles === 'function') this.resetToggles();
                this.switchView('publications');
                return;
            } else {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Server error.');
            }
        } catch (err) {
            console.warn('Local API write failed, falling back to localStorage:', err);
            
            // Fallback to local storage / demo mode
            const newPub = {
                id: crypto.randomUUID(),
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            State.publications.unshift(newPub);
            localStorage.setItem('vignan_rd_publications_v2', JSON.stringify(State.publications));
            
            if (State.pendingApprovalClaimId) {
                const claimIdToApprove = State.pendingApprovalClaimId;
                State.pendingApprovalClaimId = null;
                try {
                    await this.updateClaimStatus(claimIdToApprove, 'Approved');
                } catch (claimErr) {
                    console.error('Failed to update claim status locally:', claimErr);
                }
            }

            try {
                this.onDataLoaded();
            } catch (uiErr) {
                console.warn('UI update error after local publication save:', uiErr);
            }
            Toast.show('success', 'Publication Recorded Locally!', `${formData.name}'s publication has been recorded.`);
            const pubForm = document.getElementById('publicationForm');
            if (pubForm) pubForm.reset();
            if (typeof this.resetToggles === 'function') this.resetToggles();
            this.switchView('publications');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (loader) loader.style.display = 'none';
            if (icon) icon.style.display = '';
        }
    },

    async updatePublication(id, formData) {
        try {
            // Local Express API update
            const headers = { 'Content-Type': 'application/json' };
            if (State.token) {
                headers['Authorization'] = `Bearer ${State.token}`;
            }
            const response = await fetch(`/api/publications/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const idx = State.publications.findIndex(p => p.id === id);
                if (idx !== -1) {
                    State.publications[idx] = { ...State.publications[idx], ...formData, updated_at: new Date().toISOString() };
                }
                localStorage.setItem('vignan_rd_publications_v2', JSON.stringify(State.publications));
                this.onDataLoaded();
                this.closeModal('editModal');
                Toast.show('success', 'Updated!', 'Publication record has been updated in database.');
                return;
            } else {
                const errData = await response.json();
                throw new Error(errData.message || 'Server error.');
            }
        } catch (err) {
            console.warn('Local API update failed, updating locally:', err);
            const idx = State.publications.findIndex(p => p.id === id);
            if (idx !== -1) {
                State.publications[idx] = { ...State.publications[idx], ...formData, updated_at: new Date().toISOString() };
            }
            localStorage.setItem('vignan_rd_publications_v2', JSON.stringify(State.publications));
            this.onDataLoaded();
            this.closeModal('editModal');
            Toast.show('success', 'Updated Locally!', 'Publication record has been updated.');
        }
    },

    async deletePublication(id) {
        try {
            // Local Express API delete
            const headers = {};
            if (State.token) {
                headers['Authorization'] = `Bearer ${State.token}`;
            }
            const response = await fetch(`/api/publications/${id}`, {
                method: 'DELETE',
                headers
            });
            
            if (response.ok) {
                State.publications = State.publications.filter(p => p.id !== id);
                localStorage.setItem('vignan_rd_publications_v2', JSON.stringify(State.publications));
                this.onDataLoaded();
                this.closeModal('deleteModal');
                Toast.show('success', 'Deleted', 'Publication record has been removed from database.');
                return;
            } else {
                const errData = await response.json();
                throw new Error(errData.message || 'Server error.');
            }
        } catch (err) {
            console.warn('Local API delete failed, deleting locally:', err);
            State.publications = State.publications.filter(p => p.id !== id);
            localStorage.setItem('vignan_rd_publications_v2', JSON.stringify(State.publications));
            this.onDataLoaded();
            this.closeModal('deleteModal');
            Toast.show('success', 'Deleted Locally', 'Publication record has been removed.');
        }
    },

    getSampleData() {
        return [];
    },

    async loadReimbursements() {
        let remoteClaims = [];
        let fetchedSuccessfully = false;
        try {
            const response = await fetch('/api/reimbursements');
            if (response.ok) {
                remoteClaims = await response.json();
                fetchedSuccessfully = true;
            }
        } catch (err) {
            console.error('Failed to load remote reimbursements:', err);
        }

        const localData = localStorage.getItem('vignan_rd_reimbursements_v2');
        let localClaims = localData ? JSON.parse(localData) : [];

        if (fetchedSuccessfully) {
            State.reimbursements = remoteClaims;
            localStorage.setItem('vignan_rd_reimbursements_v2', JSON.stringify(remoteClaims));
        } else {
            State.reimbursements = localClaims;
        }

        this.renderReimbursementsTable();
        this.renderApprovedReimbursementsHistory();
        this.updateDashboard();
    },

    async submitReimbursementClaim(claimData) {
        const saveLocal = () => {
            const localData = localStorage.getItem('vignan_rd_reimbursements_v2');
            let list = localData ? JSON.parse(localData) : [];

            const year = new Date().getFullYear();
            const prefix = `${year}-`;
            // Find all local claims for this year that follow the year-number pattern
            const yearClaims = list.filter(c => c.id && c.id.match(new RegExp(`^${year}-\\d+$`)));
            let nextNum = 1;
            if (yearClaims.length > 0) {
                const nums = yearClaims.map(c => parseInt(c.id.split('-')[1], 10)).filter(n => !isNaN(n));
                if (nums.length > 0) {
                    nextNum = Math.max(...nums) + 1;
                }
            }
            const formattedId = `${year}-${String(nextNum).padStart(5, '0')}`;

            const newClaim = {
                id: formattedId,
                ...claimData,
                status: 'Submitted',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            list.unshift(newClaim);
            localStorage.setItem('vignan_rd_reimbursements_v2', JSON.stringify(list));
            State.reimbursements = list;
            this.renderReimbursementsTable();
            this.renderApprovedReimbursementsHistory();
            this.updateDashboard();
            return newClaim;
        };

        try {
            const response = await fetch('/api/reimbursements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(claimData)
            });
            if (response.ok) {
                const data = await response.json();
                await this.loadReimbursements();
                return data;
            } else {
                console.warn('Failed to save claim on server — saving locally:', response.status);
                return saveLocal();
            }
        } catch (err) {
            console.error('Failed to submit reimbursement claim to server:', err);
            return saveLocal();
        }
    },

    async deleteReimbursementClaim(id) {
        const removeFromLocal = () => {
            const localData = localStorage.getItem('vignan_rd_reimbursements_v2');
            if (localData) {
                let list = JSON.parse(localData);
                list = list.filter(c => c.id !== id);
                localStorage.setItem('vignan_rd_reimbursements_v2', JSON.stringify(list));
            }
            State.reimbursements = (State.reimbursements || []).filter(c => c.id !== id);
            this.renderReimbursementsTable();
            this.renderApprovedReimbursementsHistory();
            this.updateDashboard();
            this.renderCharts();
        };

        try {
            const headers = {};
            if (State.token) {
                headers['Authorization'] = `Bearer ${State.token}`;
            }
            const response = await fetch(`/api/reimbursements/${id}`, {
                method: 'DELETE',
                headers
            });
            if (!response.ok) {
                console.warn('Delete reimbursement claim failed on server, status:', response.status);
            }
        } catch (err) {
            console.error('Failed to delete claim from server:', err);
        }

        removeFromLocal();
    },

    async updateClaimStatus(id, newStatus) {
        const updateLocal = () => {
            const localData = localStorage.getItem('vignan_rd_reimbursements_v2');
            if (localData) {
                try {
                    let list = JSON.parse(localData);
                    list = list.map(c => c.id === id ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c);
                    localStorage.setItem('vignan_rd_reimbursements_v2', JSON.stringify(list));
                } catch (e) {
                    console.warn('Error saving reimbursements to localStorage:', e);
                }
            }
            if (State.reimbursements) {
                State.reimbursements = State.reimbursements.map(c => c.id === id ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c);
            }
            try { this.renderReimbursementsTable(); } catch (e) { console.warn('Error in renderReimbursementsTable:', e); }
            try { this.renderApprovedReimbursementsHistory(); } catch (e) { console.warn('Error in renderApprovedReimbursementsHistory:', e); }
            try { this.updateDashboard(); } catch (e) { console.warn('Error in updateDashboard:', e); }
            try { this.renderCharts(); } catch (e) { console.warn('Error in renderCharts:', e); }
        };

        try {
            const response = await fetch(`/api/reimbursements/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
            });
            if (!response.ok) {
                console.warn('Failed to update status on server, status:', response.status);
            }
        } catch (err) {
            console.error('Failed to update status on server:', err);
        }

        updateLocal();
    },

    getSampleReimbursements() {
        return [];
    }
});
