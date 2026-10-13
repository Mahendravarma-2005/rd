/* ============================================
   R&D Publication Tracker — Main Lifecycle & Event Bindings
   ============================================ */

Object.assign(App, {
    async init() {
        await this.initLocalMySQL();
        this.bindEvents();
        this.initSlideshow();
        this.checkHashRoute();
        this.setupInputValidation();
        this.initSessionTimeoutTracker();
        
        // Start background polling to sync data dynamically every 15 seconds
        setInterval(async () => {
            // Only poll if tab is active (to save resources) and user is not editing a modal
            if (!document.hidden && !State.editingId) {
                try {
                    await this.loadData();
                } catch (err) {
                    console.warn('Background data sync failed:', err);
                }
            }
        }, 15000);

        if (!window.location.hash) {
            if (State.userRole === 'super_admin' || State.userRole === 'admin') {
                this.switchView('dashboard');
            } else {
                this.switchView('home');
            }
        }
        
        // Dynamically limit date selectors to prevent choosing future dates
        const reimbDateInput = document.getElementById('reimbConfDates');
        if (reimbDateInput) {
            reimbDateInput.max = new Date().toISOString().split('T')[0];
        }

        this.loadReimbursementDraft();
        this.hideLoading();
    },

    // ── Background Slideshow for College Campus Pictures ──
    initSlideshow() {
        const images = [
            'assets/Ablock.jpg.jpeg',
            'assets/H block.jpg.jpeg',
            'assets/u block.jpg.jpeg'
        ];
        let currentIndex = 0;
        const bg1 = document.getElementById('hero-bg-1');
        const bg2 = document.getElementById('hero-bg-2');
        if (!bg1 || !bg2) return;

        // Change background every 5 seconds
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            const activeBg = bg1.style.opacity === '0' ? bg2 : bg1;
            const nextBg = bg1.style.opacity === '0' ? bg1 : bg2;

            // Load and switch
            nextBg.src = images[nextIndex];
            nextBg.style.opacity = '1';
            activeBg.style.opacity = '0';

            currentIndex = nextIndex;
        }, 5000);
    },

    // ── Event Bindings ──
    bindEvents() {
        // Navigation links click handlers
        document.querySelectorAll('.nav-link').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView(item.dataset.view);
            });
        });

        // Logo click handler (admin vs public home router)
        const navBrand = document.querySelector('.nav-brand');
        if (navBrand) {
            navBrand.addEventListener('click', (e) => {
                e.preventDefault();
                if (State.userRole === 'super_admin' || State.userRole === 'admin') {
                    this.switchView('dashboard');
                } else {
                    this.switchView('home');
                }
            });
        }

        // Mobile drawer toggle
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const navLinks = document.getElementById('navLinks');
                if (navLinks) navLinks.classList.toggle('open');
            });
        }

        // Clickable Dashboard Stat Cards to auto-filter publications
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const valueEl = card.querySelector('.stat-card-value');
                if (!valueEl) return;

                const id = valueEl.id;
                // Target 'home' for public view, 'publications' if logged in as admin
                const targetView = State.userRole ? 'publications' : 'home';

                // Clear all filters first
                this.clearAllFilters();

                if (id === 'statUG') {
                    State.filters.program = 'UG';
                    const select = document.getElementById('filterProgram');
                    if (select) select.value = 'UG';
                } else if (id === 'statPG') {
                    State.filters.program = 'PG';
                    const select = document.getElementById('filterProgram');
                    if (select) select.value = 'PG';
                } else if (id === 'statJournal') {
                    State.filters.type = 'Journal';
                    const select = document.getElementById('filterType');
                    if (select) select.value = 'Journal';
                } else if (id === 'statConference') {
                    State.filters.type = 'Conference';
                    const select = document.getElementById('filterType');
                    if (select) select.value = 'Conference';
                }

                this.switchView(targetView);
            });
        });

        // Toggle pills (Program & Type selectors)
        document.querySelectorAll('.toggle-pills').forEach(group => {
            group.querySelectorAll('.pill').forEach(btn => {
                btn.addEventListener('click', () => {
                    group.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        });

        // Add Publication Form Submission
        const publicationForm = document.getElementById('publicationForm');
        if (publicationForm) {
            publicationForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const confDateInput = document.getElementById('confDate')?.value.trim() || '';
                const currentYear = new Date().getFullYear();
                const yearMatch = confDateInput.match(/\b(20\d{2})\b/);
                if (yearMatch) {
                    const yearVal = parseInt(yearMatch[1]);
                    if (yearVal > currentYear) {
                        Toast.show('error', 'Invalid Date', 'Future dates are not allowed. Please enter a valid date.');
                        return;
                    }
                }

                const formData = {
                    roll_no: document.getElementById('rollNo').value.trim(),
                    name: document.getElementById('studentName').value.trim(),
                    program: document.querySelector('#programToggle .pill.active').dataset.value,
                    branch: document.getElementById('branch').value.trim(),
                    dept: document.getElementById('dept') ? document.getElementById('dept').value.trim() : '',
                    article_title: document.getElementById('articleTitle').value.trim(),
                    publication_type: document.querySelector('#typeToggle .pill.active').dataset.value,
                    indexing: document.getElementById('indexing').value,
                    journal_conference_title: document.getElementById('journalTitle').value.trim(),
                    sponsorship: document.getElementById('sponsorship').value,
                    mentor_name: document.getElementById('mentorName').value.trim(),
                    paper_link: document.getElementById('paperLink').value.trim(),
                    funding_amount: parseFloat(document.getElementById('fundingAmount').value) || 0,
                    nirf_ranking: document.getElementById('nirfRanking') ? document.getElementById('nirfRanking').value.trim() : '',
                    naac_ranking: document.getElementById('naacRanking') ? document.getElementById('naacRanking').value.trim() : '',
                    conf_date: confDateInput
                };
                await this.addPublication(formData);
            });
        }

        // Edit Publication Form Submission
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    roll_no: document.getElementById('editRollNo').value.trim(),
                    name: document.getElementById('editName').value.trim(),
                    program: document.getElementById('editProgram').value,
                    branch: document.getElementById('editBranch').value,
                    article_title: document.getElementById('editArticleTitle').value.trim(),
                    publication_type: document.getElementById('editType').value,
                    indexing: document.getElementById('editIndexing').value,
                    journal_conference_title: document.getElementById('editJournalTitle').value.trim(),
                    sponsorship: document.getElementById('editSponsorship').value.trim() || null,
                    mentor_name: document.getElementById('editMentorName').value.trim(),
                    paper_link: document.getElementById('editPaperLink').value.trim() || null,
                    funding_amount: parseFloat(document.getElementById('editFundingAmount').value) || 0
                };
                await this.updatePublication(State.editingId, formData);
            });
        }

        // Modal triggers
        const modalClose = document.getElementById('modalClose');
        if (modalClose) modalClose.addEventListener('click', () => this.closeModal('editModal'));
        const modalCancelBtn = document.getElementById('modalCancelBtn');
        if (modalCancelBtn) modalCancelBtn.addEventListener('click', () => this.closeModal('editModal'));
        const deleteModalClose = document.getElementById('deleteModalClose');
        if (deleteModalClose) deleteModalClose.addEventListener('click', () => this.closeModal('deleteModal'));
        const deleteCancelBtn = document.getElementById('deleteCancelBtn');
        if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', () => this.closeModal('deleteModal'));

        // Delete confirmation
        const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
        if (deleteConfirmBtn) {
            deleteConfirmBtn.addEventListener('click', () => {
                if (State.deletingId) this.deletePublication(State.deletingId);
            });
        }

        // Close modal overlay on background clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeModal(overlay.id);
            });
        });

        // Search inputs listeners
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        let searchTimeout;
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    State.searchQuery = searchInput.value.trim();
                    if (searchClear) searchClear.style.display = State.searchQuery ? 'flex' : 'none';
                    this.applyFilters();
                }, 300);
            });
        }
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                State.searchQuery = '';
                searchClear.style.display = 'none';
                this.applyFilters();
            });
        }

        // Public Search Input listeners
        const publicSearchInput = document.getElementById('publicSearchInput');
        const publicSearchClear = document.getElementById('publicSearchClear');
        let publicSearchTimeout;
        if (publicSearchInput) {
            publicSearchInput.addEventListener('input', () => {
                clearTimeout(publicSearchTimeout);
                publicSearchTimeout = setTimeout(() => {
                    const q = publicSearchInput.value.trim();
                    if (publicSearchClear) publicSearchClear.style.display = q ? 'flex' : 'none';
                    this.applyFilters();
                }, 300);
            });
        }
        if (publicSearchClear) {
            publicSearchClear.addEventListener('click', () => {
                if (publicSearchInput) publicSearchInput.value = '';
                publicSearchClear.style.display = 'none';
                this.applyFilters();
            });
        }

        // Reimbursement Search listeners
        const approvedReimbSearchInput = document.getElementById('approvedReimbSearchInput');
        if (approvedReimbSearchInput) {
            approvedReimbSearchInput.addEventListener('input', () => this.renderApprovedReimbursementsHistory());
        }

        // Filter triggers
        ['filterProgram', 'filterBranch', 'filterType', 'filterIndexing'].forEach(filterId => {
            const el = document.getElementById(filterId);
            if (el) {
                el.addEventListener('change', (e) => {
                    const key = filterId.replace('filter', '').toLowerCase();
                    State.filters[key] = e.target.value;
                    this.applyFilters();
                });
            }
        });

        // Date / Year trigger
        const filterDateEl = document.getElementById('filterDate');
        if (filterDateEl) {
            filterDateEl.addEventListener('input', () => {
                this.applyFilters();
            });
        }

        // Sorting
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.dataset.sort;
                if (State.sortField === field) {
                    State.sortOrder = State.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    State.sortField = field;
                    State.sortOrder = 'asc';
                }
                this.applyFilters();
            });
        });

        // Pagination buttons
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (State.currentPage > 1) {
                    State.currentPage--;
                    this.renderPublicationsTable();
                }
            });
        }
        if (nextPage) {
            nextPage.addEventListener('click', () => {
                const totalPages = Math.ceil(State.filteredData.length / State.pageSize);
                if (State.currentPage < totalPages) {
                    State.currentPage++;
                    this.renderPublicationsTable();
                }
            });
        }

        // Keyboard triggers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('editModal');
                this.closeModal('deleteModal');
                this.closeModal('loginModal');
                this.closeModal('printPreviewModal');
            }
        });

        // Auth Login Form Submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;
                const submitBtn = document.getElementById('loginSubmitBtn');

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Signing In...';
                }
                try {
                    // Try to log in via local MySQL API server
                    let loginSuccessful = false;
                    let errorMessage = 'Invalid email or password.';
                    try {
                        const response = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password })
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            State.token = data.token;
                            localStorage.setItem('vignan_rd_token', data.token);
                            sessionStorage.setItem('vignan_rd_token', data.token);
                            if (data.serverBootId) {
                                sessionStorage.setItem('vignan_server_boot_id', data.serverBootId);
                            }
                            State.session = { user: { id: data.user.id, email: data.user.email } };
                            State.userRole = data.role;
                            loginSuccessful = true;
                            
                            Toast.show('success', 'Login Successful', 'Welcome back!');
                            this.closeModal('loginModal');
                            document.getElementById('loginEmail').value = '';
                            document.getElementById('loginPassword').value = '';
                        } else {
                            const errData = await response.json();
                            errorMessage = errData.message || 'Invalid email or password.';
                            console.warn('Local login failed:', errorMessage);
                        }
                    } catch (apiErr) {
                        console.error('Local API login exception:', apiErr);
                        errorMessage = 'Cannot connect to server. Please check your database connection.';
                    }

                    if (!loginSuccessful) {
                        throw new Error(errorMessage);
                    }

                    this.updateUIForRole();
                    await this.loadData();
                    if (typeof this.resetSessionTimer === 'function') this.resetSessionTimer();

                    if (State.userRole === 'super_admin' || State.userRole === 'admin') {
                        this.switchView('dashboard');
                    }
                } catch (err) {
                    console.error('Login error:', err);
                    Toast.show('error', 'Login Failed', err.message);
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="ri-login-box-line"></i> Sign In';
                    }
                }
            });
        }

        // Hash Routing change listener
        window.addEventListener('hashchange', () => this.checkHashRoute());

        // Initial reimbursement subform generator
        this.generateAuthorInputs();
        this.initCustomReimbursementDropdowns();

        // Reimbursement Receipt file change previewer
        const receiptInput = document.getElementById('reimbReceiptFile');
        if (receiptInput) {
            receiptInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const preview = document.getElementById('reimbReceiptPreview');
                const img = document.getElementById('reimbReceiptImg');
                const label = document.getElementById('reimbReceiptFileLabel');
                if (file) {
                    if (label) label.textContent = file.name;
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (img) img.src = event.target.result;
                            if (preview) preview.style.display = 'block';
                        };
                        reader.readAsDataURL(file);
                    } else {
                        if (preview) preview.style.display = 'none';
                        if (img) img.src = '';
                    }
                } else {
                    if (label) label.textContent = 'Choose Fee Receipt';
                    if (preview) preview.style.display = 'none';
                    if (img) img.src = '';
                }
            });
        }

        // Reimbursement Paper Proof file change previewer
        const proofInput = document.getElementById('reimbPaperProofFile');
        if (proofInput) {
            proofInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const preview = document.getElementById('reimbPaperProofPreview');
                const img = document.getElementById('reimbPaperProofImg');
                const label = document.getElementById('reimbPaperProofFileLabel');
                if (file) {
                    if (label) label.textContent = file.name;
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            if (img) img.src = event.target.result;
                            if (preview) preview.style.display = 'block';
                        };
                        reader.readAsDataURL(file);
                    } else {
                        if (preview) preview.style.display = 'none';
                        if (img) img.src = '';
                    }
                } else {
                    if (label) label.textContent = 'Choose Paper Proof';
                    if (preview) preview.style.display = 'none';
                    if (img) img.src = '';
                }
            });
        }

        // Reimbursement Form submit claim builder
        const reimbursementForm = document.getElementById('reimbursementForm');
        if (reimbursementForm) {
            reimbursementForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Prevent submission if student has claimed within last 12 months
                if (App.isReimbursementEligible === false) {
                    Toast.show('error', 'Submission Blocked', 'You have already submitted a claim within the last 12 months.');
                    return;
                }

                // Validate no future dates
                const confDatesInput = document.getElementById('reimbConfDates');
                if (confDatesInput && confDatesInput.value) {
                    const selectedDate = new Date(confDatesInput.value);
                    const todayDate = new Date();
                    selectedDate.setHours(0,0,0,0);
                    todayDate.setHours(0,0,0,0);
                    if (selectedDate > todayDate) {
                        Toast.show('error', 'Invalid Date', 'Future dates are not allowed.');
                        return;
                    }
                }

                const authors = [];
                const nameInputs = document.querySelectorAll('.reimb-author-name');
                const roleSelects = document.querySelectorAll('.reimb-author-role');
                const deptInputs = document.querySelectorAll('.reimb-author-dept');
                const rollInputs = document.querySelectorAll('.reimb-author-roll');
                const branchInputs = document.querySelectorAll('.reimb-author-branch');
                const empcodeInputs = document.querySelectorAll('.reimb-author-empcode');

                let studentIndex = 0;
                let facultyIndex = 0;

                nameInputs.forEach((input, index) => {
                    const name = input.value.trim();
                    const role = roleSelects[index].value;
                    const dept = deptInputs[index] ? deptInputs[index].value.trim() : '';
                    let rollNo = '';
                    let branch = '';
                    let empCode = '';

                    let program = 'UG';

                    if (role === 'student') {
                        rollNo = rollInputs[studentIndex] ? rollInputs[studentIndex].value.trim() : '';
                        branch = branchInputs[studentIndex] ? branchInputs[studentIndex].value.trim() : '';
                        const programSelect = document.querySelector('.reimb-author-program');
                        if (programSelect) program = programSelect.value;
                        studentIndex++;
                    } else {
                        empCode = empcodeInputs[facultyIndex] ? empcodeInputs[facultyIndex].value.trim() : '';
                        facultyIndex++;
                    }

                    authors.push({ name, role, dept, rollNo, branch, empCode, program });
                });

                const studentBranches = authors.filter(a => a.role === 'student').map(s => s.branch).filter(Boolean);
                const combinedBranch = studentBranches.join(', ');

                const formData = {
                    paperTitle: document.getElementById('reimbPaperTitle').value.trim(),
                    pubType: document.getElementById('reimbPubType')?.value || 'Conference',
                    hostInst: document.getElementById('reimbHostInst').value.trim(),
                    confName: document.getElementById('reimbConfName').value.trim(),
                    confDates: document.getElementById('reimbConfDates').value.trim(),
                    paperDoi: document.getElementById('reimbPaperDoi')?.value.trim() || '',
                    paperId: document.getElementById('reimbPaperId')?.value.trim() || '',
                    nirfRanking: document.getElementById('reimbNirfRanking')?.value.trim() || '',
                    naacRanking: document.getElementById('reimbNaacRanking')?.value.trim() || '',
                    branch: combinedBranch,
                    feePaid: parseFloat(document.getElementById('reimbFeePaid').value) || 0,
                    authors: authors,
                    bank: {
                        accHolder: document.getElementById('reimbAccHolder').value.trim(),
                        accNo: document.getElementById('reimbAccNo').value.trim(),
                        bankName: document.getElementById('reimbBankName').value.trim(),
                        branchName: document.getElementById('reimbBankBranch').value.trim(),
                        ifsc: document.getElementById('reimbIFSC').value.trim().toUpperCase()
                    }
                };

                const receiptFile = receiptInput ? receiptInput.files[0] : null;
                const proofFile = proofInput ? proofInput.files[0] : null;

                const readAsDataURL = (file) => {
                    return new Promise((resolve) => {
                        if (!file || !file.type.startsWith('image/')) {
                            resolve('');
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.readAsDataURL(file);
                    });
                };

                Promise.all([readAsDataURL(receiptFile), readAsDataURL(proofFile)]).then(([receiptDataUrl, proofDataUrl]) => {
                    this.renderAndOpenPrintModal(formData, receiptDataUrl, proofDataUrl);
                    this.clearReimbursementDraft();
                });
            });
        }

        // Auto-save reimbursement draft as the user types
        if (reimbursementForm) {
            reimbursementForm.addEventListener('input', () => this.saveReimbursementDraft());
            reimbursementForm.addEventListener('change', () => this.saveReimbursementDraft());
        }

        // Autocomplete suggestions box click and typing listeners
        const searchInputEl = document.getElementById('searchInput');
        const suggestionsBox = document.getElementById('searchSuggestions');
        if (searchInputEl && suggestionsBox) {
            searchInputEl.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                if (!query) {
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                    return;
                }

                const suggestions = new Set();
                State.publications.forEach(p => {
                    if ((p.name || '').toLowerCase().includes(query)) suggestions.add(p.name);
                    if ((p.roll_no || '').toLowerCase().includes(query)) suggestions.add(p.roll_no);
                    if ((p.mentor_name || '').toLowerCase().includes(query)) suggestions.add(p.mentor_name);
                });

                const matchArray = Array.from(suggestions).slice(0, 8);
                if (matchArray.length === 0) {
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                    return;
                }

                suggestionsBox.innerHTML = matchArray.map(item => {
                    const icon = /^[0-9]/i.test(item) ? 'ri-hashtag' : 'ri-user-line';
                    const matchRegex = new RegExp(`(${query})`, 'gi');
                    const highlighted = item.replace(matchRegex, '<mark>$1</mark>');
                    return `<div class="suggestion-item" data-value="${this.escapeHtml(item)}">
                        <i class="${icon}"></i>
                        <span>${highlighted}</span>
                    </div>`;
                }).join('');
                suggestionsBox.style.display = 'block';
            });

            suggestionsBox.addEventListener('click', (e) => {
                const item = e.target.closest('.suggestion-item');
                if (item) {
                    const value = item.dataset.value;
                    searchInputEl.value = value;
                    State.searchQuery = value;
                    const searchClear = document.getElementById('searchClear');
                    if (searchClear) searchClear.style.display = 'flex';
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                    this.applyFilters();
                }
            });

            document.addEventListener('click', (e) => {
                if (!searchInputEl.contains(e.target) && !suggestionsBox.contains(e.target)) {
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                }
            });
        }

        // Bulk spreadsheet Excel dropzone listeners
        const dropzone = document.getElementById('dropzone');
        const bulkFile = document.getElementById('bulkUploadFile');
        if (dropzone && bulkFile) {
            dropzone.addEventListener('click', () => bulkFile.click());

            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('dragover');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    bulkFile.files = e.dataTransfer.files;
                    this.handleBulkFileSelect(e.dataTransfer.files[0]);
                }
            });

            bulkFile.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleBulkFileSelect(e.target.files[0]);
                }
            });
        }
    },

    async handleAuthClick() {
        if (State.session) {
            try {
                State.session = null;
                State.userRole = null;
                State.token = null;
                localStorage.removeItem('vignan_rd_token');
                localStorage.removeItem('vignan_rd_publications_v2');
                localStorage.removeItem('vignan_rd_reimbursements_v2');
                localStorage.removeItem('reimbursement_draft');
                
                this.updateUIForRole();
                await this.loadData();
                
                window.location.hash = ''; // Clear the admin hash to hide the button
                Toast.show('success', 'Logged Out', 'Successfully logged out.');
            } catch (err) {
                console.error('Logout error:', err);
                Toast.show('error', 'Logout Failed', err.message);
            }
        } else {
            this.openModal('loginModal');
        }
    },

    checkHashRoute() {
        const hash = window.location.hash;
        if (hash === '#admin' || hash === '#login') {
            document.body.classList.add('show-auth-trigger');
            if (!State.session) {
                this.openModal('loginModal');
            } else {
                if (State.userRole === 'super_admin' || State.userRole === 'admin') {
                    this.switchView('dashboard');
                }
            }
        } else {
            document.body.classList.remove('show-auth-trigger');
        }
    },

    resetToggles() {
        document.querySelectorAll('#programToggle .pill').forEach(b => b.classList.remove('active'));
        const firstProgram = document.querySelector('#programToggle .pill[data-value="UG"]');
        if (firstProgram) firstProgram.classList.add('active');

        document.querySelectorAll('#typeToggle .pill').forEach(b => b.classList.remove('active'));
        const firstType = document.querySelector('#typeToggle .pill[data-value="Journal"]');
        if (firstType) firstType.classList.add('active');
    },

    setupInputValidation() {
        const validateRoll = (el) => {
            const val = el.value.trim();
            if (val === '') {
                el.classList.remove('is-valid', 'is-invalid');
                return;
            }
            const pattern = /^[a-zA-Z0-9]{8,10}$/;
            if (pattern.test(val)) {
                el.classList.add('is-valid');
                el.classList.remove('is-invalid');
            } else {
                el.classList.add('is-invalid');
                el.classList.remove('is-valid');
            }
        };

        const rollInput = document.getElementById('rollNo');
        const editRollInput = document.getElementById('editRollNo');
        if (rollInput) {
            rollInput.addEventListener('input', () => validateRoll(rollInput));
        }
        if (editRollInput) {
            editRollInput.addEventListener('input', () => validateRoll(editRollInput));
        }

        const adminEmail = document.getElementById('adminEmail');
        if (adminEmail) {
            adminEmail.addEventListener('input', () => {
                const email = adminEmail.value.trim();
                if (email === '') {
                    adminEmail.classList.remove('is-valid', 'is-invalid');
                    return;
                }
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailPattern.test(email) && email.toLowerCase().endsWith('@vignan.ac.in')) {
                    adminEmail.classList.add('is-valid');
                    adminEmail.classList.remove('is-invalid');
                } else {
                    adminEmail.classList.add('is-invalid');
                    adminEmail.classList.remove('is-valid');
                }
            });
        }

        const indexingGuides = {
            'IEEE': 'IEEE Xplore — Highly recommended for Engineering conferences and publications.',
            'Scopus': 'Scopus Index — Widely recognized indexing for premium international journals & conferences.',
            'Wos': 'Clarivate Web of Science — Elite indexing standard matching global metrics.',
            'EUDL': 'European Union Digital Library — Prestigious open access publication repository.',
            'Spinger': 'Springer Link Publisher — Leading global scientific publisher with high citation index.',
            'ITM web of Conference': 'ITM Web of Conferences — Reputable open access proceedings journal.'
        };

        const setupIndexingGuide = (selectId, helperId) => {
            const select = document.getElementById(selectId);
            const helper = document.getElementById(helperId);
            if (select && helper) {
                select.addEventListener('change', () => {
                    helper.textContent = indexingGuides[select.value] || '';
                });
            }
        };

        const initCustomSelect = (containerId, hiddenInputId, defaultPlaceholder) => {
            const container = document.getElementById(containerId);
            const hiddenInput = document.getElementById(hiddenInputId);
            if (!container || !hiddenInput) return;

            const trigger = container.querySelector('.custom-select-trigger');
            const optionsBox = container.querySelector('.custom-select-options');
            const options = container.querySelectorAll('.custom-select-option');

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close other custom options boxes
                document.querySelectorAll('.custom-select-options').forEach(box => {
                    if (box !== optionsBox) box.style.display = 'none';
                });
                optionsBox.style.display = optionsBox.style.display === 'block' ? 'none' : 'block';
            });

            options.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = opt.dataset.value;
                    const text = opt.textContent;

                    hiddenInput.value = val;
                    trigger.querySelector('span').textContent = text;
                    optionsBox.style.display = 'none';

                    options.forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');

                    hiddenInput.dispatchEvent(new Event('change'));
                });
            });

            // Listen for change events on the hidden input to update the custom UI dynamically
            hiddenInput.addEventListener('change', () => {
                const val = hiddenInput.value;
                const opt = Array.from(options).find(o => o.dataset.value === val);
                if (opt) {
                    trigger.querySelector('span').textContent = opt.textContent;
                    options.forEach(o => o.classList.remove('selected'));
                    opt.classList.add('selected');
                } else {
                    trigger.querySelector('span').textContent = defaultPlaceholder;
                    options.forEach(o => o.classList.remove('selected'));
                }
            });

            // Close when clicking anywhere else
            document.addEventListener('click', () => {
                optionsBox.style.display = 'none';
            });
        };

        // Initialize custom selects for indexing
        initCustomSelect('indexingSelectContainer', 'indexing', 'Select Indexing');
        initCustomSelect('editIndexingSelectContainer', 'editIndexing', 'Select Indexing');

        setupIndexingGuide('indexing', 'indexingHelper');
        setupIndexingGuide('editIndexing', 'editIndexingHelper');
    },

    // ─── Session Timeout Tracker (10 minutes) ───
    initSessionTimeoutTracker() {
        let timeoutTimer = null;
        const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

        const resetTimer = () => {
            if (timeoutTimer) clearTimeout(timeoutTimer);
            
            // Only set timeout if there is an active session
            if (State.session) {
                timeoutTimer = setTimeout(() => {
                    this.expireSession();
                }, TIMEOUT_MS);
            }
        };

        // Reset timer on user activity
        ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        // Track tab visibility to detect when user switches back
        let hiddenTime = 0;
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                hiddenTime = Date.now();
            } else {
                if (hiddenTime && State.session) {
                    const elapsed = Date.now() - hiddenTime;
                    if (elapsed >= TIMEOUT_MS) {
                        this.expireSession();
                    } else {
                        resetTimer();
                    }
                }
                hiddenTime = 0;
            }
        });

        // Trigger a timer check whenever admin logs in
        const originalHandleAuth = this.handleAuthClick;
        const originalLoginSubmit = document.getElementById('loginForm');

        // Reset/start timer on user activity reset trigger
        App.resetSessionTimer = resetTimer;
    },

    async expireSession() {
        if (State.session) {
            State.session = null;
            State.userRole = null;
            State.token = null;
            localStorage.removeItem('vignan_rd_token');
            localStorage.removeItem('vignan_rd_publications_v2');
            localStorage.removeItem('vignan_rd_reimbursements_v2');
            localStorage.removeItem('reimbursement_draft');
            
            this.updateUIForRole();
            await this.loadData();
            
            window.location.hash = '';
            this.switchView('home');
            Toast.show('warning', 'Session Expired', 'You have been logged out due to 10 minutes of inactivity or switching tabs.');
        }
    }
});

// ─── Toast Notification System ───
const Toast = {
    show(type, title, message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const icons = {
            success: 'ri-check-double-line',
            error: 'ri-error-warning-line',
            warning: 'ri-alarm-warning-line',
            info: 'ri-information-line'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="Toast.dismiss(this)">
                <i class="ri-close-line"></i>
            </button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            this.remove(toast);
        }, 4000);
    },

    dismiss(btn) {
        this.remove(btn.closest('.toast'));
    },

    remove(toast) {
        if (!toast || toast.classList.contains('removing')) return;
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }
};

window.Toast = Toast;

// ─── Initialize on DOM Ready ───
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
