/* ============================================
   R&D Publication Tracker — UI Renderer & Controllers
   ============================================ */

Object.assign(App, {
    // ── Loader Overlay Toggles ──
    showLoading(text = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const span = overlay ? overlay.querySelector('.loader span') : null;
        if (span) span.textContent = text;
        if (overlay) overlay.classList.add('active');
    },

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.remove('active');
    },

    // ── Animate Dashboard Metrics ──
    animateNumber(elementId, target) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const start = parseInt(el.textContent) || 0;
        const duration = 600;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.round(start + (target - start) * eased);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    },

    getPaperUrl(linkOrDoi) {
        if (!linkOrDoi) return '';
        const str = String(linkOrDoi).trim();
        if (!str) return '';
        if (str.startsWith('http://') || str.startsWith('https://')) return str;
        if (str.startsWith('10.')) return `https://doi.org/${str}`;
        return `https://${str}`;
    },

    updateDashboard() {
        const data = State.publications || [];
        const total = data.length;
        const ug = data.filter(p => p.program === 'UG').length;
        const pg = data.filter(p => p.program === 'PG').length;
        const journals = data.filter(p => p.publication_type === 'Journal').length;
        const conferences = data.filter(p => p.publication_type === 'Conference').length;

        this.animateNumber('statTotal', total);
        this.animateNumber('statUG', ug);
        this.animateNumber('statPG', pg);
        this.animateNumber('statJournal', journals);
        this.animateNumber('statConference', conferences);

        const reimbursements = State.reimbursements || [];
        const pendingClaims = reimbursements.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
        const totalClaims = reimbursements.length;

        this.animateNumber('statPendingClaims', pendingClaims);
        this.animateNumber('statTotalClaims', totalClaims);

        // Super Admin Claims Stats
        let approvedCount = 0;
        let approvedAmount = 0;
        const processedClaimKeys = new Set();

        // 1. Process from Approved Reimbursements
        const approvedClaims = (State.reimbursements || []).filter(c => c.status === 'Approved');
        approvedClaims.forEach(c => {
            const amt = parseFloat(c.fee_paid || 0);
            if (amt > 0) {
                approvedCount++;
                approvedAmount += amt;
                if (c.roll_no && c.paper_title) {
                    processedClaimKeys.add(`${c.roll_no.trim().toLowerCase()}_${c.paper_title.trim().toLowerCase()}`);
                }
            }
        });

        // 2. Process from Publications
        (data || []).forEach(p => {
            const amt = parseFloat(p.funding_amount || 0);
            const key = (p.roll_no && p.article_title) ? `${p.roll_no.trim().toLowerCase()}_${p.article_title.trim().toLowerCase()}` : null;
            if (amt > 0 && (!key || !processedClaimKeys.has(key))) {
                approvedCount++;
                approvedAmount += amt;
            }
        });

        this.animateNumber('statApprovedReimbursementsCount', approvedCount);

        const amountEl = document.getElementById('statApprovedReimbursementsAmount');
        if (amountEl) {
            amountEl.textContent = '₹' + approvedAmount.toLocaleString();
        }
    },

    renderLeaderboard() {
        const data = State.publications || [];

        // 1. Top Branches Calculation
        const branchCounts = {};
        data.forEach(p => {
            if (p.branch) {
                const branch = p.branch.trim().toUpperCase();
                branchCounts[branch] = (branchCounts[branch] || 0) + 1;
            }
        });
        const sortedBranches = Object.entries(branchCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const branchesEl = document.getElementById('leaderboardBranches');
        if (branchesEl) {
            if (sortedBranches.length === 0) {
                branchesEl.innerHTML = `<li style="color: var(--text-muted); text-align: center; padding: 20px 0;">No publications recorded yet.</li>`;
            } else {
                branchesEl.innerHTML = sortedBranches.map(([branch, count], index) => `
                    <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: 500; font-size: 14px;">
                        <span style="color: var(--navy); display: flex; align-items: center; gap: 8px;">
                            <span style="background: rgba(0, 119, 182, 0.1); color: var(--blue); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">${index + 1}</span>
                            ${this.escapeHtml(branch)}
                        </span>
                        <span class="badge" style="background: rgba(0, 119, 182, 0.1); color: var(--blue); font-weight: 600; padding: 4px 8px; border-radius: 4px;">${count} Pubs</span>
                    </li>
                `).join('');
            }
        }

        // 2. Star Student Researchers Calculation
        const studentCounts = {};
        data.forEach(p => {
            if (p.roll_no && p.name) {
                const key = `${p.roll_no.trim()}|${p.name.trim()}|${p.branch || ''}`;
                studentCounts[key] = (studentCounts[key] || 0) + 1;
            }
        });
        const sortedStudents = Object.entries(studentCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const studentsEl = document.getElementById('leaderboardStudents');
        if (studentsEl) {
            if (sortedStudents.length === 0) {
                studentsEl.innerHTML = `<li style="color: var(--text-muted); text-align: center; padding: 20px 0;">No student researchers recorded yet.</li>`;
            } else {
                studentsEl.innerHTML = sortedStudents.map(([key, count], index) => {
                    const [rollNo, name, branch] = key.split('|');
                    return `
                        <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: 500; font-size: 14px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="background: rgba(240, 180, 41, 0.1); color: #b48500; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">${index + 1}</span>
                                <div>
                                    <div style="color: var(--navy); font-weight: 600; text-align: left;">${this.escapeHtml(name)}</div>
                                    <div style="font-size: 11px; color: var(--text-muted); text-align: left;">${this.escapeHtml(rollNo)} (${this.escapeHtml(branch)})</div>
                                </div>
                            </div>
                            <span class="badge" style="background: rgba(240, 180, 41, 0.1); color: #b48500; font-weight: 600; padding: 4px 8px; border-radius: 4px;">${count} Pubs</span>
                        </li>
                    `;
                }).join('');
            }
        }

        // 3. Distinguished Mentors Calculation
        const mentorCounts = {};
        data.forEach(p => {
            if (p.mentor_name) {
                const mentor = p.mentor_name.trim();
                mentorCounts[mentor] = (mentorCounts[mentor] || 0) + 1;
            }
        });
        const sortedMentors = Object.entries(mentorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const mentorsEl = document.getElementById('leaderboardMentors');
        if (mentorsEl) {
            if (sortedMentors.length === 0) {
                mentorsEl.innerHTML = `<li style="color: var(--text-muted); text-align: center; padding: 20px 0;">No mentors recorded yet.</li>`;
            } else {
                mentorsEl.innerHTML = sortedMentors.map(([mentor, count], index) => `
                    <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: 500; font-size: 14px;">
                        <span style="color: var(--navy); display: flex; align-items: center; gap: 8px;">
                            <span style="background: rgba(36, 180, 126, 0.1); color: #1e8a60; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold;">${index + 1}</span>
                            ${this.escapeHtml(mentor)}
                        </span>
                        <span class="badge" style="background: rgba(36, 180, 126, 0.1); color: #1e8a60; font-weight: 600; padding: 4px 8px; border-radius: 4px;">${count} Pubs</span>
                    </li>
                `).join('');
            }
        }
    },

    // Inline plugin to draw data value labels on top of bar charts and inside pie slices
    getChartValueLabelsPlugin() {
        return {
            id: 'chartValueLabels',
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || !meta.data) return;
                    meta.data.forEach((element, index) => {
                        const val = dataset.data[index];
                        if (val === undefined || val === null || val === 0) return;

                        ctx.save();

                        if (chart.config.type === 'bar') {
                            const isHorizontal = chart.config.options.indexAxis === 'y';
                            ctx.font = 'bold 11px Inter, sans-serif';
                            ctx.fillStyle = '#0f172a';
                            if (isHorizontal) {
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                const text = typeof val === 'number' && val >= 100 ? '₹' + val.toLocaleString() : String(val);
                                ctx.fillText(text, element.x + 6, element.y);
                            } else {
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                const text = typeof val === 'number' && val >= 100 ? '₹' + val.toLocaleString() : String(val);
                                ctx.fillText(text, element.x, element.y - 4);
                            }
                        } else if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
                            const total = dataset.data.reduce((a, b) => a + b, 0);
                            if (total > 0 && element.circumference > 0.15) {
                                const percentage = Math.round((val / total) * 100) + '%';
                                const center = element.tooltipPosition();
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.font = 'bold 12px Inter, sans-serif';
                                ctx.fillStyle = '#ffffff';
                                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                                ctx.shadowBlur = 4;
                                ctx.fillText(percentage, center.x, center.y);
                            }
                        }
                        ctx.restore();
                    });
                });
            }
        };
    },

    // ── Charts Rendering ──
    renderCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js is not loaded, skipping chart rendering.');
            return;
        }
        try {
            if (!State.charts) State.charts = {};
            const data = State.publications || [];
            this.populateFundingBranchYearDropdown();
            this.renderTypeChart(data);
            this.renderBranchChart(data);
            this.renderIndexingChart(data);
            this.renderFundingBranchChart(data);
            this.renderFundingYearChart(data);
        } catch (err) {
            console.warn('Error rendering charts:', err);
        }
    },

    populateFundingBranchYearDropdown() {
        const select = document.getElementById('fundingBranchYearSelect');
        if (!select) return;

        const currentSelection = select.value || 'all';

        // Extract distinct years from publications and reimbursements
        const yearsSet = new Set();
        (State.publications || []).forEach(p => {
            const dateStr = p.conf_date || p.created_at;
            if (dateStr) {
                const yearMatch = dateStr.toString().match(/\b(20\d{2})\b/);
                if (yearMatch) yearsSet.add(yearMatch[1]);
            }
        });
        (State.reimbursements || []).forEach(c => {
            const dateStr = c.conf_dates || c.created_at;
            if (dateStr) {
                const yearMatch = dateStr.toString().match(/\b(20\d{2})\b/);
                if (yearMatch) yearsSet.add(yearMatch[1]);
            }
        });

        const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

        // Rebuild options list
        let html = '<option value="all">All Years</option>';
        sortedYears.forEach(year => {
            html += `<option value="${year}">${year}</option>`;
        });
        select.innerHTML = html;

        // Restore previous selection if it still exists
        if (sortedYears.includes(currentSelection)) {
            select.value = currentSelection;
        } else {
            select.value = 'all';
        }

        // Bind selection event listener once
        if (!select.dataset.listenerBound) {
            select.addEventListener('change', () => {
                this.renderFundingBranchChart(State.publications);
            });
            select.dataset.listenerBound = 'true';
        }
    },

    renderFundingBranchChart(data) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('chartFundingBranch');
        if (!ctx) return;

        const yearSelect = document.getElementById('fundingBranchYearSelect');
        const selectedYear = yearSelect ? yearSelect.value : 'all';

        if (!State.charts) State.charts = {};
        if (State.charts.fundingBranch && typeof State.charts.fundingBranch.destroy === 'function') {
            try { State.charts.fundingBranch.destroy(); } catch (e) {}
        }

        const branchFunding = {};
        const processedKeys = new Set();

        // 1. Accumulate funding from Approved Reimbursements
        const approvedClaims = (State.reimbursements || []).filter(c => c.status === 'Approved');
        approvedClaims.forEach(c => {
            // Check year filter
            if (selectedYear !== 'all') {
                const dateStr = c.conf_dates || c.created_at;
                const yearMatch = dateStr ? dateStr.toString().match(/\b(20\d{2})\b/) : null;
                if (!yearMatch || yearMatch[1] !== selectedYear) return;
            }

            if (c.branch) {
                const branch = c.branch.trim().toUpperCase();
                const amt = parseFloat(c.fee_paid || 0);
                if (amt > 0) {
                    branchFunding[branch] = (branchFunding[branch] || 0) + amt;
                    if (c.roll_no && c.paper_title) {
                        processedKeys.add(`${c.roll_no.trim().toLowerCase()}_${c.paper_title.trim().toLowerCase()}`);
                    }
                }
            }
        });

        // 2. Accumulate funding from Publications
        (data || []).forEach(p => {
            // Check year filter
            if (selectedYear !== 'all') {
                const dateStr = p.conf_date || p.created_at;
                const yearMatch = dateStr ? dateStr.toString().match(/\b(20\d{2})\b/) : null;
                if (!yearMatch || yearMatch[1] !== selectedYear) return;
            }

            if (p.branch) {
                const branch = p.branch.trim().toUpperCase();
                const amt = parseFloat(p.funding_amount || 0);
                const key = (p.roll_no && p.article_title) ? `${p.roll_no.trim().toLowerCase()}_${p.article_title.trim().toLowerCase()}` : null;
                if (amt > 0 && (!key || !processedKeys.has(key))) {
                    branchFunding[branch] = (branchFunding[branch] || 0) + amt;
                }
            }
        });

        const sortedBranches = Object.entries(branchFunding).sort((a, b) => b[1] - a[1]);
        const labels = sortedBranches.map(entry => entry[0]);
        const values = sortedBranches.map(entry => entry[1]);

        const colors = [
            '#2563eb', // Royal Blue
            '#059669', // Emerald Green
            '#7c3aed', // Purple
            '#ea580c', // Orange
            '#db2777', // Pink
            '#0284c7', // Sky Blue
            '#d97706', // Amber
            '#4f46e5'  // Indigo
        ];

        State.charts.fundingBranch = new Chart(ctx, {
            type: 'bar',
            plugins: [this.getChartValueLabelsPlugin()],
            data: {
                labels,
                datasets: [{
                    label: 'Funding Amount (₹)',
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: colors.slice(0, labels.length),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => ' Funding: ₹' + context.raw.toLocaleString()
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Funding Amount (₹)',
                            color: '#1e293b',
                            font: { family: 'Inter', size: 12, weight: '700' }
                        },
                        ticks: {
                            color: '#334155',
                            font: { family: 'Inter', size: 11, weight: '600' },
                            callback: value => '₹' + value.toLocaleString()
                        },
                        grid: { color: '#e2e8f0' }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Department / Branch',
                            color: '#1e293b',
                            font: { family: 'Inter', size: 12, weight: '700' }
                        },
                        ticks: {
                            color: '#334155',
                            font: { family: 'Inter', size: 11, weight: '600' }
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    renderFundingYearChart(data) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('chartFundingYear');
        if (!ctx) return;
        if (!State.charts) State.charts = {};
        if (State.charts.fundingYear && typeof State.charts.fundingYear.destroy === 'function') {
            try { State.charts.fundingYear.destroy(); } catch (e) {}
        }

        const yearFunding = {};
        const processedKeys = new Set();

        const approvedClaims = (State.reimbursements || []).filter(c => c.status === 'Approved');
        approvedClaims.forEach(c => {
            const dateStr = c.updated_at || c.created_at;
            const amt = parseFloat(c.fee_paid || 0);
            if (amt > 0 && dateStr) {
                const year = new Date(dateStr).getFullYear();
                yearFunding[year] = (yearFunding[year] || 0) + amt;
                if (c.roll_no && c.paper_title) {
                    processedKeys.add(`${c.roll_no.trim().toLowerCase()}_${c.paper_title.trim().toLowerCase()}`);
                }
            }
        });

        (data || []).forEach(p => {
            const dateStr = p.created_at;
            const amt = parseFloat(p.funding_amount || 0);
            const key = (p.roll_no && p.article_title) ? `${p.roll_no.trim().toLowerCase()}_${p.article_title.trim().toLowerCase()}` : null;
            if (amt > 0 && dateStr && (!key || !processedKeys.has(key))) {
                const year = new Date(dateStr).getFullYear();
                yearFunding[year] = (yearFunding[year] || 0) + amt;
            }
        });

        const sortedYears = Object.entries(yearFunding).sort((a, b) => a[0] - b[0]);
        const labels = sortedYears.map(entry => entry[0]);
        const values = sortedYears.map(entry => entry[1]);

        State.charts.fundingYear = new Chart(ctx, {
            type: 'bar',
            plugins: [this.getChartValueLabelsPlugin()],
            data: {
                labels,
                datasets: [{
                    label: 'Total Funding Amount (₹)',
                    data: values,
                    backgroundColor: '#d97706', // Solid Amber
                    borderColor: '#b45309',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => ' Funding: ₹' + context.raw.toLocaleString()
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year',
                            color: '#1e293b',
                            font: { family: 'Inter', size: 12, weight: '700' }
                        },
                        ticks: {
                            color: '#334155',
                            font: { family: 'Inter', size: 11, weight: '600' }
                        },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Reimbursement Funding Amount (₹)',
                            color: '#1e293b',
                            font: { family: 'Inter', size: 12, weight: '700' }
                        },
                        ticks: {
                            color: '#334155',
                            font: { family: 'Inter', size: 11, weight: '600' },
                            callback: value => '₹' + value.toLocaleString()
                        },
                        grid: { color: '#e2e8f0' }
                    }
                }
            }
        });
    },

    renderTypeChart(data) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('chartType');
        if (!ctx) return;
        if (!State.charts) State.charts = {};
        if (State.charts.type && typeof State.charts.type.destroy === 'function') {
            try { State.charts.type.destroy(); } catch (e) {}
        }

        const journals = (data || []).filter(p => p.publication_type === 'Journal').length;
        const conferences = (data || []).filter(p => p.publication_type === 'Conference').length;

        State.charts.type = new Chart(ctx, {
            type: 'doughnut',
            plugins: [this.getChartValueLabelsPlugin()],
            data: {
                labels: ['Journals', 'Conferences'],
                datasets: [{
                    data: [journals, conferences],
                    backgroundColor: ['#1e3a8a', '#2563eb'], // Deep Navy & Royal Blue
                    borderColor: ['#1e3a8a', '#2563eb'],
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#1e293b',
                            padding: 16,
                            font: { family: 'Inter', size: 12, weight: '600' },
                            usePointStyle: true,
                            pointStyleWidth: 10
                        }
                    }
                }
            }
        });
    },

    renderBranchChart(data) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('chartBranch');
        if (!ctx) return;
        if (!State.charts) State.charts = {};
        if (State.charts.branch && typeof State.charts.branch.destroy === 'function') {
            try { State.charts.branch.destroy(); } catch (e) {}
        }

        const branchCounts = {};
        (data || []).forEach(p => {
            if (p.branch) {
                branchCounts[p.branch] = (branchCounts[p.branch] || 0) + 1;
            }
        });

        const labels = Object.keys(branchCounts);
        const values = Object.values(branchCounts);

        const colors = [
            '#2563eb', // Blue
            '#059669', // Emerald
            '#7c3aed', // Purple
            '#ea580c', // Orange
            '#db2777', // Pink
            '#0284c7', // Sky Blue
            '#d97706', // Amber
            '#4f46e5', // Indigo
            '#16a34a', // Green
            '#dc2626'  // Red
        ];

        State.charts.branch = new Chart(ctx, {
            type: 'bar',
            plugins: [this.getChartValueLabelsPlugin()],
            data: {
                labels,
                datasets: [{
                    label: 'Number of Publications',
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: colors.slice(0, labels.length),
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Department / Branch',
                            color: '#1e293b',
                            font: { family: 'Inter', size: 12, weight: '700' }
                        },
                        ticks: { color: '#334155', font: { family: 'Inter', size: 11, weight: '600' } },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Publications',
                            color: '#1e293b',
                            font: { family: 'Inter', size: 12, weight: '700' }
                        },
                        ticks: {
                            color: '#334155',
                            font: { family: 'Inter', size: 11, weight: '600' },
                            stepSize: 1
                        },
                        grid: { color: '#e2e8f0' }
                    }
                }
            }
        });
    },

    renderIndexingChart(data) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById('chartIndexing');
        if (!ctx) return;
        if (!State.charts) State.charts = {};
        if (State.charts.indexing && typeof State.charts.indexing.destroy === 'function') {
            try { State.charts.indexing.destroy(); } catch (e) {}
        }

        const indexCounts = {};
        (data || []).forEach(p => {
            if (p.indexing) {
                indexCounts[p.indexing] = (indexCounts[p.indexing] || 0) + 1;
            }
        });

        const labels = Object.keys(indexCounts);
        const values = Object.values(indexCounts);

        const colors = [
            '#1e3a8a',
            '#2563eb',
            '#3b82f6',
            '#60a5fa',
            '#93c5fd',
            '#cbd5e1'
        ];

        State.charts.indexing = new Chart(ctx, {
            type: 'pie',
            plugins: [this.getChartValueLabelsPlugin()],
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#1e293b',
                            padding: 12,
                            font: { family: 'Inter', size: 11, weight: '600' },
                            usePointStyle: true,
                            pointStyleWidth: 8
                        }
                    }
                }
            }
        });
    },

    // ── Table Rendering ──
    renderRecentTable() {
        const tbody = document.getElementById('recentTableBody');
        const empty = document.getElementById('recentEmpty');
        if (!tbody) return;
        const recent = State.publications.slice(0, 5);

        if (recent.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';
        tbody.innerHTML = recent.map(p => `
            <tr>
                <td>${this.escapeHtml(p.roll_no)}</td>
                <td><strong>${this.escapeHtml(p.name)}</strong></td>
                <td><span class="badge badge-${p.program.toLowerCase()}">${p.program}</span></td>
                <td title="${this.escapeHtml(p.article_title)}">${this.escapeHtml(this.truncate(p.article_title, 40))}</td>
                <td><span class="badge badge-${p.publication_type.toLowerCase()}">${p.publication_type}</span></td>
                <td><span class="badge badge-indexing">${this.escapeHtml(p.indexing || '—')}</span></td>
            </tr>
        `).join('');
    },

    applyFilters() {
        if (!State.filters) State.filters = {};
        let data = [...(State.publications || [])];

        // Public search (visible to all users)
        const publicSearchEl = document.getElementById('publicSearchInput');
        const publicQuery = publicSearchEl ? publicSearchEl.value.trim().toLowerCase() : '';
        if (publicQuery) {
            data = data.filter(p =>
                (p.roll_no || '').toLowerCase().includes(publicQuery) ||
                (p.article_title || '').toLowerCase().includes(publicQuery) ||
                (p.mentor_name || '').toLowerCase().includes(publicQuery) ||
                (p.name || '').toLowerCase().includes(publicQuery)
            );
        }

        // Admin search
        if (State.searchQuery) {
            const q = State.searchQuery.toLowerCase();
            data = data.filter(p =>
                (p.roll_no || '').toLowerCase().includes(q) ||
                (p.name || '').toLowerCase().includes(q) ||
                (p.article_title || '').toLowerCase().includes(q) ||
                (p.journal_conference_title || '').toLowerCase().includes(q) ||
                (p.branch || '').toLowerCase().includes(q)
            );
        }

        // Filters
        if (State.filters.program) data = data.filter(p => p.program === State.filters.program);
        if (State.filters.branch) data = data.filter(p => p.branch === State.filters.branch);
        if (State.filters.type) data = data.filter(p => p.publication_type === State.filters.type);
        if (State.filters.indexing) data = data.filter(p => p.indexing === State.filters.indexing);
        // Date / Year filter
        const dateQuery = document.getElementById('filterDate') ? document.getElementById('filterDate').value.trim() : '';
        if (dateQuery) {
            const dqLower = dateQuery.toLowerCase();
            data = data.filter(p => {
                if (!p.conf_date) return false;
                const pDateLower = p.conf_date.toLowerCase();

                // 1. Simple substring matching (matches year like "2025", month names like "July", etc.)
                if (pDateLower.includes(dqLower)) {
                    return true;
                }

                // 2. Format conversion: If query is entered in DD-MM-YYYY format (e.g. 07-07-2026)
                // and database stores it in YYYY-MM-DD format (e.g. 2026-07-07)
                const dd_mm_yyyy_match = dateQuery.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
                if (dd_mm_yyyy_match) {
                    const day = dd_mm_yyyy_match[1].padStart(2, '0');
                    const month = dd_mm_yyyy_match[2].padStart(2, '0');
                    const year = dd_mm_yyyy_match[3];
                    const convertedDate = `${year}-${month}-${day}`;
                    if (pDateLower.includes(convertedDate)) {
                        return true;
                    }
                }

                // 3. Format conversion: If query is entered in YYYY-MM-DD format (e.g. 2026-07-07)
                // and database stores it in DD-MM-YYYY format (e.g. 07-07-2026)
                const yyyy_mm_dd_match = dateQuery.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
                if (yyyy_mm_dd_match) {
                    const year = yyyy_mm_dd_match[1];
                    const month = yyyy_mm_dd_match[2].padStart(2, '0');
                    const day = yyyy_mm_dd_match[3].padStart(2, '0');
                    const convertedDate = `${day}-${month}-${year}`;
                    if (pDateLower.includes(convertedDate)) {
                        return true;
                    }
                }

                return false;
            });
        }

        // Sort
        data.sort((a, b) => {
            const aVal = (a[State.sortField] || '').toString().toLowerCase();
            const bVal = (b[State.sortField] || '').toString().toLowerCase();
            if (State.sortOrder === 'asc') return aVal.localeCompare(bVal);
            return bVal.localeCompare(aVal);
        });

        State.filteredData = data;
        State.currentPage = 1;
        this.renderPublicationsTable();
        this.renderActiveFilterBadges();
    },

    renderActiveFilterBadges() {
        const container = document.getElementById('activeFilters');
        if (!container) return;

        const searchEl = document.getElementById('searchInput');
        const publicSearchEl = document.getElementById('publicSearchInput');
        const filters = [
            { id: 'publicSearchInput', label: 'Search', value: publicSearchEl ? publicSearchEl.value : '' },
            { id: 'searchInput', label: 'Admin Search', value: searchEl ? searchEl.value : '' },
            { id: 'filterProgram', label: 'Program', value: document.getElementById('filterProgram') ? document.getElementById('filterProgram').value : '' },
            { id: 'filterBranch', label: 'Branch', value: document.getElementById('filterBranch') ? document.getElementById('filterBranch').value : '' },
            { id: 'filterType', label: 'Type', value: document.getElementById('filterType') ? document.getElementById('filterType').value : '' },
            { id: 'filterIndexing', label: 'Indexing', value: document.getElementById('filterIndexing') ? document.getElementById('filterIndexing').value : '' },
            { id: 'filterDate', label: 'Date/Year', value: document.getElementById('filterDate') ? document.getElementById('filterDate').value : '' }
        ];

        const activeFilters = filters.filter(f => f.value && f.value.trim() !== '');

        if (activeFilters.length === 0) {
            container.innerHTML = '';
            return;
        }

        let html = '';
        activeFilters.forEach(f => {
            const displayValue = f.id === 'searchInput' ? `"${f.value}"` : f.value;
            html += `
                <div class="filter-badge">
                    <span>${f.label}: ${displayValue}</span>
                    <span class="filter-badge-close" onclick="App.clearSingleFilter('${f.id}')">✕</span>
                </div>
            `;
        });

        html += `<button class="clear-all-filters-btn" onclick="App.clearAllFilters()">Clear All</button>`;
        container.innerHTML = html;
    },

    clearSingleFilter(id) {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
            if (id === 'searchInput') {
                const clearBtn = document.getElementById('searchClear');
                if (clearBtn) clearBtn.style.display = 'none';
                State.searchQuery = '';
            } else if (id === 'publicSearchInput') {
                const clearBtn = document.getElementById('publicSearchClear');
                if (clearBtn) clearBtn.style.display = 'none';
            } else {
                const key = id.replace('filter', '').toLowerCase();
                State.filters[key] = '';
            }
            this.applyFilters();
        }
    },

    clearAllFilters() {
        ['searchInput', 'publicSearchInput', 'filterProgram', 'filterBranch', 'filterType', 'filterIndexing', 'filterDate'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const clearBtn = document.getElementById('searchClear');
        if (clearBtn) clearBtn.style.display = 'none';
        const publicClearBtn = document.getElementById('publicSearchClear');
        if (publicClearBtn) publicClearBtn.style.display = 'none';

        State.searchQuery = '';
        State.filters.program = '';
        State.filters.branch = '';
        State.filters.type = '';
        State.filters.indexing = '';
        State.filters.tier = '';

        this.applyFilters();
    },

    renderPublicationsTable() {
        const tbody = document.getElementById('pubTableBody');
        const empty = document.getElementById('pubEmpty');
        const table = document.getElementById('pubTable');
        const countEl = document.getElementById('pubCount');
        if (!tbody) return;

        const data = State.filteredData;
        const totalPages = Math.max(1, Math.ceil(data.length / State.pageSize));
        const start = (State.currentPage - 1) * State.pageSize;
        const end = start + State.pageSize;
        const pageData = data.slice(start, end);

        if (countEl) countEl.textContent = `${data.length} publication${data.length !== 1 ? 's' : ''} found`;

        if (pageData.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.style.display = 'block';
            if (table) table.style.display = 'none';
        } else {
            if (empty) empty.style.display = 'none';
            if (table) table.style.display = '';
            tbody.innerHTML = pageData.map(p => {
                const titleHtml = p.paper_link
                    ? `<a href="${p.paper_link}" target="_blank" style="color: var(--accent-light, #2196f3); text-decoration: none; font-weight: 500;" class="paper-link" title="View Publication">${this.escapeHtml(this.truncate(p.article_title, 35))} <i class="ri-external-link-line" style="font-size: 11px;"></i></a>`
                    : this.escapeHtml(this.truncate(p.article_title, 35));

                // Quality badges
                let qualityBadges = '';
                if (p.journal_tier) {
                    let tierClass = 'tier-badge';
                    if (p.journal_tier === 'Q1') tierClass += ' q1';
                    else if (p.journal_tier === 'Q2') tierClass += ' q2';
                    else if (p.journal_tier === 'Q3') tierClass += ' q3';
                    else if (p.journal_tier === 'Q4') tierClass += ' q4';
                    qualityBadges += `<span class="badge ${tierClass}" title="Journal Tier">${p.journal_tier}</span>`;
                }
                if (p.impact_factor) {
                    qualityBadges += ` <span class="badge badge-impact" title="Impact Factor">IF: ${p.impact_factor}</span>`;
                }

                let fundingAmt = parseFloat(p.funding_amount || 0);
                if (!fundingAmt && State.reimbursements) {
                    const matchedClaim = State.reimbursements.find(c =>
                        (c.roll_no && p.roll_no && c.roll_no.trim().toLowerCase() === p.roll_no.trim().toLowerCase()) ||
                        (c.paper_title && p.article_title && c.paper_title.trim().toLowerCase() === p.article_title.trim().toLowerCase())
                    );
                    if (matchedClaim && matchedClaim.fee_paid) {
                        fundingAmt = parseFloat(matchedClaim.fee_paid || 0);
                    }
                }

                return `
                    <tr>
                        <td class="clickable-copy" onclick="App.copyToClipboard('${p.roll_no}', 'Student ID')" title="Click to copy Student ID"><strong>${this.escapeHtml(p.roll_no)}</strong> <i class="ri-file-copy-line copy-ico"></i></td>
                        <td class="admin-only">${this.escapeHtml(p.name)}</td>
                        <td class="admin-only"><span class="badge badge-${p.program.toLowerCase()}">${p.program}</span></td>
                        <td class="admin-only">${this.escapeHtml(p.branch)}</td>
                        <td title="${this.escapeHtml(p.article_title)}">${titleHtml}</td>
                        <td class="admin-only"><span class="badge badge-${p.publication_type.toLowerCase()}">${p.publication_type}</span></td>
                        <td class="admin-only">
                            <span class="badge badge-indexing">${this.escapeHtml(p.indexing || '—')}</span>
                            ${qualityBadges}
                        </td>
                        <td class="admin-only" title="${this.escapeHtml(p.journal_conference_title || '')}">${this.escapeHtml(this.truncate(p.journal_conference_title || '—', 25))}</td>
                        <td class="clickable-copy" onclick="App.copyToClipboard('${this.escapeHtml(p.conf_date || '')}', 'Date')" title="Click to copy Date">${this.escapeHtml(p.conf_date || '—')} <i class="ri-file-copy-line copy-ico"></i></td>
                        <td class="admin-only">${this.escapeHtml(p.sponsorship || '—')}</td>
                        <td class="admin-only clickable-copy" onclick="App.copyToClipboard('${this.escapeHtml(p.mentor_name || '')}', 'Mentor Name')" title="Click to copy Mentor Name">${this.escapeHtml(p.mentor_name || '—')} <i class="ri-file-copy-line copy-ico"></i></td>
                        <td class="super-admin-only">₹${fundingAmt.toLocaleString()}</td>
                        <td class="admin-only">
                            <div class="actions-cell">
                                <button class="act-btn edit" onclick="App.openEditModal('${p.id}')" title="Edit">
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button class="act-btn delete" onclick="App.openDeleteModal('${p.id}')" title="Delete">
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Pagination
        const pageInfo = document.getElementById('pageInfo');
        const prevPage = document.getElementById('prevPage');
        const nextPage = document.getElementById('nextPage');
        if (pageInfo) pageInfo.textContent = `Page ${State.currentPage} of ${totalPages}`;
        if (prevPage) prevPage.disabled = State.currentPage <= 1;
        if (nextPage) nextPage.disabled = State.currentPage >= totalPages;
    },

    // ── Modals & View Switches ──
    openEditModal(id) {
        const pub = State.publications.find(p => p.id === id);
        if (!pub) return;

        State.editingId = id;
        document.getElementById('editId').value = id;
        document.getElementById('editRollNo').value = pub.roll_no;
        document.getElementById('editName').value = pub.name;
        document.getElementById('editProgram').value = pub.program;
        document.getElementById('editBranch').value = pub.branch;
        document.getElementById('editArticleTitle').value = pub.article_title;
        document.getElementById('editType').value = pub.publication_type;
        const editIndexingSelect = document.getElementById('editIndexing');
        if (editIndexingSelect) {
            editIndexingSelect.value = pub.indexing || '';
            editIndexingSelect.dispatchEvent(new Event('change'));
        }
        document.getElementById('editJournalTitle').value = pub.journal_conference_title || '';
        document.getElementById('editSponsorship').value = pub.sponsorship || '';
        document.getElementById('editMentorName').value = pub.mentor_name || '';
        document.getElementById('editPaperLink').value = pub.paper_link || '';
        document.getElementById('editFundingAmount').value = pub.funding_amount || 0;

        this.openModal('editModal');
    },

    openDeleteModal(id) {
        const pub = State.publications.find(p => p.id === id);
        if (!pub) return;

        State.deletingId = id;
        document.getElementById('deleteInfo').innerHTML = `
            <strong>${this.escapeHtml(pub.name)}</strong> — ${this.escapeHtml(pub.article_title)}
        `;
        this.openModal('deleteModal');
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    },

    switchView(viewName) {
        // Update nav active classes
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });

        const activeViewId = viewName;

        // Toggle active views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        const targetView = document.getElementById(`view-${activeViewId}`);
        if (targetView) targetView.classList.add('active');

        // Hide/Show Hero Slideshow Section
        const heroSection = document.getElementById('heroSection');
        const mainWrapper = document.querySelector('.main-wrapper');
        const viewPublications = document.getElementById('view-publications');
        const footer = document.querySelector('.site-footer');

        if (viewName === 'home') {
            document.body.classList.add('home-layout');
            if (heroSection) {
                heroSection.style.display = 'block';
                heroSection.style.height = '';
            }
            if (mainWrapper) {
                mainWrapper.style.display = 'none';
            }
            if (footer) footer.style.display = 'block';
        } else {
            document.body.classList.remove('home-layout');
            if (heroSection) heroSection.style.display = 'none';
            if (mainWrapper) {
                mainWrapper.style.display = 'block';
                mainWrapper.style.paddingTop = 'calc(var(--nav-height) + 32px)';
            }
            if (footer) footer.style.display = '';
            if (activeViewId === 'publications' && viewPublications) {
                viewPublications.classList.add('centered-layout');
            }
        }

        if (activeViewId === 'publications') {
            this.applyFilters();
        } else if (activeViewId === 'dashboard') {
            this.updateDashboard();
            this.renderCharts();
            this.renderApprovedReimbursementsHistory();
        } else if (activeViewId === 'manage-claims') {
            this.loadReimbursements();
        }

        // Close mobile drawer menu
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('open');
    },

    // ── Export Triggers ──
    exportCSV() {
        if (State.publications.length === 0) {
            Toast.show('warning', 'No Data', 'There are no publications to export.');
            return;
        }

        const isSuperAdmin = State.userRole === 'super_admin';
        const headers = ['Roll No', 'Name', 'Program', 'Branch', 'Article Title', 'Type (J/C)', 'Indexing', 'Journal/Conference Title', 'Sponsorship', 'Mentor / Guide', 'Paper Link / DOI'];
        if (isSuperAdmin) headers.push('Funding Amount (₹)');

        const rows = State.publications.map(p => {
            const row = [
                p.roll_no,
                p.name,
                p.program,
                p.branch,
                p.article_title,
                p.publication_type,
                p.indexing || '',
                p.journal_conference_title || '',
                p.sponsorship || '',
                p.mentor_name || '',
                p.paper_link || ''
            ];
            if (isSuperAdmin) row.push(p.funding_amount || 0);
            return row;
        });

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
        });

        this.downloadFile(csv, 'publications_export.csv', 'text/csv');
        Toast.show('success', 'CSV Exported', `${State.publications.length} records exported successfully.`);
    },

    exportToXLSX(data, filename) {
        try {
            const isSuperAdmin = State.userRole === 'super_admin';
            const wsData = data.map(p => {
                const item = {
                    'Roll No': p.roll_no,
                    'Student Name': p.name,
                    'Program': p.program,
                    'Branch': p.branch,
                    'Article Title': p.article_title,
                    'Type': p.publication_type,
                    'Indexing': p.indexing || '',
                    'Journal/Conference Title': p.journal_conference_title || '',
                    'Sponsorship': p.sponsorship || '',
                    'Mentor / Guide': p.mentor_name || '',
                    'Paper Link / DOI': p.paper_link || ''
                };
                if (isSuperAdmin) {
                    item['Funding Amount (₹)'] = p.funding_amount || 0;
                }
                return item;
            });
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, "Publications");
            XLSX.writeFile(wb, filename);
        } catch (err) {
            console.error('Error generating Excel file:', err);
            Toast.show('error', 'Export Failed', 'An error occurred while generating Excel file.');
        }
    },

    exportXLSX() {
        if (State.publications.length === 0) {
            Toast.show('warning', 'No Data', 'There are no publications to export.');
            return;
        }
        this.exportToXLSX(State.publications, 'Vignan_Publications_All.xlsx');
        Toast.show('success', 'Excel Exported', `${State.publications.length} records exported successfully.`);
    },

    exportFilteredXLSX() {
        if (State.filteredData.length === 0) {
            Toast.show('warning', 'No Data', 'There is no filtered data to export.');
            return;
        }
        this.exportToXLSX(State.filteredData, 'Vignan_Publications_Filtered.xlsx');
        Toast.show('success', 'Excel Exported', `${State.filteredData.length} filtered records exported.`);
    },

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    updateUIForRole() {
        const role = State.userRole;
        const body = document.body;

        body.classList.remove('super-admin-mode', 'admin-mode');
        if (role === 'super_admin') {
            body.classList.add('super-admin-mode');
        } else if (role === 'admin') {
            body.classList.add('admin-mode');
        }

        // Toggle display of public-only elements dynamically based on user role
        document.querySelectorAll('.public-only').forEach(el => {
            if (role) {
                el.style.setProperty('display', 'none', 'important');
            } else {
                el.style.display = '';
            }
        });

        const authBtnText = document.getElementById('authBtnText');
        const authBtnIcon = document.querySelector('#authBtn i');
        if (State.session) {
            if (authBtnText) authBtnText.textContent = 'Logout';
            if (authBtnIcon) {
                authBtnIcon.className = 'ri-logout-box-r-line';
            }
        } else {
            if (authBtnText) authBtnText.textContent = 'Admin Login';
            if (authBtnIcon) {
                authBtnIcon.className = 'ri-login-box-line';
            }
        }

        // Hide/Show Home navigation link for logged-in users
        const navHome = document.getElementById('nav-home');
        if (navHome) {
            if (role) {
                navHome.style.setProperty('display', 'none', 'important');
            } else {
                navHome.style.display = '';
            }
        }

        // Adjust view based on role
        const currentView = document.querySelector('.view.active');
        if (currentView) {
            const viewId = currentView.id.replace('view-', '');
            if (role === 'super_admin') {
                if (viewId !== 'dashboard' && viewId !== 'publications') {
                    this.switchView('dashboard');
                }
            } else if (role === 'admin') {
                if (viewId !== 'dashboard' && viewId !== 'publications' && viewId !== 'add' && viewId !== 'manage-claims' && viewId !== 'export') {
                    this.switchView('dashboard');
                }
            } else if (viewId === 'dashboard' && !role) {
                this.switchView('home');
            } else if (viewId === 'add' && !role) {
                this.switchView('home');
            } else if (viewId === 'export' && !role) {
                this.switchView('home');
            } else if (viewId === 'manage-claims' && !role) {
                this.switchView('home');
            } else if (viewId === 'reimbursement' && role) {
                this.switchView('home');
            }
        } else {
            if (role === 'super_admin' || role === 'admin') {
                this.switchView('dashboard');
            }
        }
    },

    updateConnectionStatus(status, text) {
        const el = document.getElementById('connectionStatus');
        if (!el) return;
        const dot = el.querySelector('.conn-dot');
        const span = el.querySelector('span');
        if (dot) dot.className = 'conn-dot';
        if (status === 'connected') {
            if (dot) dot.classList.add('connected');
            isConnected = true;
        } else if (status === 'error') {
            if (dot) dot.classList.add('error');
            isConnected = false;
        }
        if (span) span.textContent = text;
        el.title = text;
    },

    renderReimbursementsTable() {
        const tbody = document.getElementById('reimbursementsTableBody');
        if (!tbody) return;

        const data = State.reimbursements || [];
        const activeClaims = data.filter(c => c.status !== 'Approved' && c.status !== 'Rejected');

        if (activeClaims.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px 0;">No active reimbursement claims to review.</td></tr>`;
            return;
        }

        // Sort active claims by creation date (oldest first)
        const sortedActiveClaims = [...activeClaims].sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });

        tbody.innerHTML = sortedActiveClaims.map((c, index) => {
            const dateStr = new Date(c.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            let statusClass = 'pending';
            if (c.status === 'Approved') statusClass = 'ug';
            else if (c.status === 'Under Review') statusClass = 'pg';
            else if (c.status === 'Rejected') statusClass = 'rejected';

            const paperUrl = this.getPaperUrl(c.paper_doi || c.paper_link || c.doi_link);
            const titleHtml = paperUrl
                ? `<a href="${paperUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--blue, #0077b6); font-weight: 600; text-decoration: underline;" title="Click to open paper: ${this.escapeHtml(c.paper_title)}">${this.escapeHtml(c.paper_title)} <i class="ri-external-link-line" style="font-size: 11px;"></i></a>`
                : `<span style="font-weight: 500; font-size: 13px; color: var(--navy);" title="${this.escapeHtml(c.paper_title)}">${this.escapeHtml(c.paper_title)}</span>`;

            // Only the oldest active claim in the queue gets action buttons. Others are in queue.
            const isFirstInQueue = index === 0;
            const actionsHtml = isFirstInQueue ? `
                <div style="display: flex; gap: 6px; align-items: center; justify-content: center;">
                    <button class="btn btn-sm" onclick="App.viewClaimApplication('${c.id}')" title="View Application" style="padding: 4px 8px; background: rgba(0, 119, 182, 0.05); border: 1px solid var(--blue); color: var(--blue); border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 0;">
                        <i class="ri-eye-line"></i> View
                    </button>
                    <button class="btn btn-sm" onclick="App.acceptClaim('${c.id}')" title="Accept Claim" style="padding: 4px 8px; background: #2ecc71; color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 0;">
                        <i class="ri-check-line"></i> Accept
                    </button>
                    <button class="btn btn-sm" onclick="App.rejectClaim('${c.id}')" title="Reject Claim" style="padding: 4px 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 0;">
                        <i class="ri-close-line"></i> Reject
                    </button>
                </div>
            ` : `
                <div style="display: flex; align-items: center; justify-content: center; gap: 4px; color: var(--text-muted); font-size: 12px; font-style: italic;">
                    <i class="ri-lock-line" style="color: var(--gold); font-size: 14px;"></i> In Queue
                </div>
            `;

            return `
                <tr>
                    <td style="text-align: left;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 3px;">No: ${this.escapeHtml(c.id)}</div>
                        <strong style="color: var(--navy); font-size: 13px;">${this.escapeHtml(c.roll_no)}</strong>
                    </td>
                    <td>
                        <div style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left;">
                            ${titleHtml}
                        </div>
                        ${c.paper_id ? `<div style="font-size: 11px; font-weight: bold; color: var(--blue); text-align: left;">Paper ID: ${this.escapeHtml(c.paper_id)}</div>` : ''}
                        <div style="font-size: 11px; color: var(--text-muted); text-align: left;">${this.escapeHtml(c.conf_name)}</div>
                        <div style="font-size: 11px; color: var(--text-muted); text-align: left;">${this.escapeHtml(c.conf_dates)}</div>
                    </td>
                    <td style="font-weight: 600; color: var(--navy);">₹${parseFloat(c.fee_paid || 0).toLocaleString()}</td>
                    <td style="font-size: 12px; line-height: 1.4; text-align: left;">
                        <div><strong>Holder:</strong> ${this.escapeHtml(c.bank_acc_holder)}</div>
                        <div><strong>A/C:</strong> ${this.escapeHtml(c.bank_acc_no)}</div>
                        <div><strong>Bank:</strong> ${this.escapeHtml(c.bank_name)} (${this.escapeHtml(c.bank_branch)})</div>
                        <div><strong>IFSC:</strong> ${this.escapeHtml(c.ifsc)}</div>
                    </td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dateStr}</td>
                    <td>
                        <span class="badge badge-${statusClass}">${this.escapeHtml(c.status)}</span>
                    </td>
                    <td>
                        ${actionsHtml}
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderApprovedReimbursementsHistory() {
        const tbody = document.getElementById('approvedReimbursementsTableBody');
        if (!tbody) return;

        const searchInput = document.getElementById('approvedReimbSearchInput');
        const searchClear = document.getElementById('approvedReimbSearchClear');
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (searchClear) searchClear.style.display = query ? 'flex' : 'none';

        const data = State.reimbursements || [];
        let approvedClaims = data.filter(c => c.status === 'Approved');

        if (query) {
            approvedClaims = approvedClaims.filter(c =>
                (c.roll_no && c.roll_no.toLowerCase().includes(query)) ||
                (c.student_name && c.student_name.toLowerCase().includes(query)) ||
                (c.paper_title && c.paper_title.toLowerCase().includes(query)) ||
                (c.paper_id && c.paper_id.toLowerCase().includes(query)) ||
                (c.conf_name && c.conf_name.toLowerCase().includes(query)) ||
                (c.branch && c.branch.toLowerCase().includes(query)) ||
                (c.dept && c.dept.toLowerCase().includes(query)) ||
                (c.fee_paid && String(c.fee_paid).toLowerCase().includes(query))
            );
        }

        if (approvedClaims.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px 0;">${query ? 'No matching approved reimbursement claims found.' : 'No approved reimbursement claims yet.'}</td></tr>`;
            return;
        }

        tbody.innerHTML = approvedClaims.map(c => {
            const approvedDate = c.updated_at || c.created_at;
            const dateStr = new Date(approvedDate).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const paperUrl = this.getPaperUrl(c.paper_doi || c.paper_link || c.doi_link);
            const titleHtml = paperUrl
                ? `<a href="${paperUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--blue, #0077b6); font-weight: 600; text-decoration: underline;" title="Click to open paper: ${this.escapeHtml(c.paper_title)}">${this.escapeHtml(c.paper_title)} <i class="ri-external-link-line" style="font-size: 11px;"></i></a>`
                : `<span style="font-weight: 500; font-size: 13px; color: var(--navy);" title="${this.escapeHtml(c.paper_title)}">${this.escapeHtml(c.paper_title)}</span>`;

            return `
                <tr>
                    <td style="text-align: left;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 3px;">No: ${this.escapeHtml(c.id)}</div>
                        <strong style="color: var(--navy); font-size: 13px;">${this.escapeHtml(c.roll_no)}</strong>
                    </td>
                    <td>
                        <div style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left;">
                            ${titleHtml}
                        </div>
                        ${c.paper_id ? `<div style="font-size: 11px; font-weight: bold; color: var(--blue); text-align: left;">Paper ID: ${this.escapeHtml(c.paper_id)}</div>` : ''}
                        <div style="font-size: 11px; color: var(--text-muted); text-align: left;">${this.escapeHtml(c.conf_name)}</div>
                        <div style="font-size: 11px; color: var(--text-muted); text-align: left;">${this.escapeHtml(c.conf_dates)}</div>
                    </td>
                    <td style="font-weight: 600; color: var(--teal);">₹${parseFloat(c.fee_paid || 0).toLocaleString()}</td>
                    <td style="font-size: 12px; color: var(--text-muted);">${dateStr}</td>
                </tr>
            `;
        }).join('');
    },

    clearApprovedReimbSearch() {
        const searchInput = document.getElementById('approvedReimbSearchInput');
        if (searchInput) searchInput.value = '';
        this.renderApprovedReimbursementsHistory();
    },

    async acceptClaim(id) {
        const claims = State.reimbursements || [];
        const claim = claims.find(c => c.id === id);
        if (!claim) return;

        if (!confirm('Are you sure you want to ACCEPT this claim? You will be redirected to verify details and select Indexing.')) {
            return;
        }

        try {
            this.showLoading('Loading claim details...');
            State.pendingApprovalClaimId = id;
            State.activeApprovalClaim = claim;

            // Populate display elements
            const fields = {
                approveRollNo: claim.roll_no,
                approveStudentName: claim.student_name,
                approveProgram: claim.program || 'UG',
                approveBranch: claim.branch,
                approveDept: claim.dept || claim.department || '-',
                approveArticleTitle: claim.paper_title,
                approvePublicationType: claim.conf_name && (claim.conf_name.toLowerCase().includes('journal') || claim.conf_name.toLowerCase().includes('transactions')) ? 'Journal' : 'Conference',
                approveJournalTitle: claim.conf_name,
                approveConfDate: claim.conf_dates || claim.conf_date || '-',
                approvePaperId: claim.paper_id || '-',
                approveHostInst: claim.host_inst || claim.host_institute || '-',
                approveNirfRanking: claim.nirf_ranking || '-',
                approveNaacRanking: claim.naac_ranking || '-',
                approveMentorName: claim.guide_name || claim.mentor_name || '-',
                approveFundingAmount: '₹' + parseFloat(claim.fee_paid || 0).toLocaleString(),
                approveSponsorship: 'VFSTR'
            };

            for (const [key, value] of Object.entries(fields)) {
                const el = document.getElementById(key);
                if (el) el.textContent = value || '-';
            }

            // Set DOI Link
            const doiUrl = this.getPaperUrl(claim.paper_doi || claim.paper_link || claim.doi_link || '');
            const doiLinkEl = document.getElementById('approveDoiLink');
            if (doiLinkEl) {
                doiLinkEl.href = doiUrl || '#';
                doiLinkEl.innerHTML = doiUrl ? `${doiUrl} <i class="ri-external-link-line"></i>` : '-';
            }

            // Reset Indexing selection
            const indexingEl = document.getElementById('approveIndexing');
            if (indexingEl) indexingEl.value = '';

            // Toggle active container
            const noClaimCont = document.getElementById('approveNoClaimContainer');
            const detailsCont = document.getElementById('approveClaimDetailsContainer');
            if (noClaimCont) noClaimCont.style.display = 'none';
            if (detailsCont) detailsCont.style.display = 'block';

            // Ensure Claim Approval panel is showing (not the manual add form)
            const approvePanel = document.getElementById('approveClaimPanel');
            const manualPanel = document.getElementById('manualAddFormPanel');
            const titleEl = document.getElementById('activePanelTitle');
            const toggleBtn = document.getElementById('toggleApproveAddBtn');
            if (approvePanel && approvePanel.style.display === 'none') {
                approvePanel.style.display = 'block';
                manualPanel.style.display = 'none';
                if (titleEl) {
                    titleEl.innerHTML = `
                        <i class="ri-folder-shield-2-line" style="color: var(--blue); font-size: 18px;"></i>
                        CLAIM APPROVAL VIEW
                    `;
                }
                if (toggleBtn) {
                    toggleBtn.innerHTML = `<i class="ri-add-line"></i> Add Publication`;
                    toggleBtn.style.background = 'var(--blue)';
                }
            }

            // Navigate to Approve Publication page
            this.switchView('add');
        } catch (err) {
            console.error('Failed to pre-fill claim:', err);
            Toast.show('error', 'Action Failed', 'Could not process the claim.');
        } finally {
            this.hideLoading();
        }
    },

    toggleApproveManualView() {
        const approvePanel = document.getElementById('approveClaimPanel');
        const manualPanel = document.getElementById('manualAddFormPanel');
        const titleEl = document.getElementById('activePanelTitle');
        const toggleBtn = document.getElementById('toggleApproveAddBtn');

        if (!approvePanel || !manualPanel) return;

        const isApproveVisible = approvePanel.style.display !== 'none';
        if (isApproveVisible) {
            // Switch to manual add form
            approvePanel.style.display = 'none';
            manualPanel.style.display = 'block';
            if (titleEl) {
                titleEl.innerHTML = `
                    <i class="ri-add-circle-line" style="color: var(--blue); font-size: 18px;"></i>
                    MANUAL ADD PUBLICATION
                `;
            }
            if (toggleBtn) {
                toggleBtn.innerHTML = `<i class="ri-arrow-left-line"></i> Back to Approval`;
                toggleBtn.style.background = 'var(--text-secondary)';
            }
        } else {
            // Switch back to approval panel
            approvePanel.style.display = 'block';
            manualPanel.style.display = 'none';
            if (titleEl) {
                titleEl.innerHTML = `
                    <i class="ri-folder-shield-2-line" style="color: var(--blue); font-size: 18px;"></i>
                    CLAIM APPROVAL VIEW
                `;
            }
            if (toggleBtn) {
                toggleBtn.innerHTML = `<i class="ri-add-line"></i> Add Publication`;
                toggleBtn.style.background = 'var(--blue)';
            }
        }
    },

    cancelApprovePublication() {
        State.activeApprovalClaim = null;
        State.pendingApprovalClaimId = null;

        const noClaimCont = document.getElementById('approveNoClaimContainer');
        const detailsCont = document.getElementById('approveClaimDetailsContainer');
        if (noClaimCont) noClaimCont.style.display = 'block';
        if (detailsCont) detailsCont.style.display = 'none';

        this.switchView('manage-claims');
    },

    async submitApprovePublication() {
        const indexingEl = document.getElementById('approveIndexing');
        const indexing = indexingEl ? indexingEl.value : '';
        if (!indexing) {
            Toast.show('error', 'Indexing Required', 'Please select an Indexing option for this publication.');
            return;
        }

        const claim = State.activeApprovalClaim;
        if (!claim) {
            Toast.show('error', 'Invalid State', 'No active claim selected.');
            return;
        }

        const submitBtn = document.getElementById('approveSubmitBtn');
        if (submitBtn) submitBtn.disabled = true;

        try {
            this.showLoading('Approving claim & recording publication...');
            
            const formData = {
                roll_no: claim.roll_no || '',
                name: claim.student_name || '',
                program: claim.program || 'UG',
                branch: claim.branch || '',
                dept: claim.dept || claim.department || '',
                article_title: claim.paper_title || '',
                publication_type: claim.conf_name && (claim.conf_name.toLowerCase().includes('journal') || claim.conf_name.toLowerCase().includes('transactions')) ? 'Journal' : 'Conference',
                indexing: indexing,
                journal_conference_title: claim.conf_name || '',
                sponsorship: 'VFSTR',
                mentor_name: claim.guide_name || claim.mentor_name || '',
                paper_link: claim.paper_doi || claim.paper_link || claim.doi_link || '',
                funding_amount: parseFloat(claim.fee_paid || 0),
                nirf_ranking: claim.nirf_ranking || '',
                naac_ranking: claim.naac_ranking || '',
                conf_date: claim.conf_dates || claim.conf_date || ''
            };

            await this.addPublication(formData);

            // Clean state & views
            State.activeApprovalClaim = null;
            State.pendingApprovalClaimId = null;

            const noClaimCont = document.getElementById('approveNoClaimContainer');
            const detailsCont = document.getElementById('approveClaimDetailsContainer');
            if (noClaimCont) noClaimCont.style.display = 'block';
            if (detailsCont) detailsCont.style.display = 'none';
        } catch (err) {
            console.error('Failed to approve publication:', err);
            Toast.show('error', 'Submission Failed', 'Could not approve and record the publication.');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            this.hideLoading();
        }
    },

    async rejectClaim(id) {
        if (!confirm('Are you sure you want to REJECT and DELETE this claim? It will be permanently removed from the review list.')) {
            return;
        }

        try {
            this.showLoading('Deleting rejected claim...');
            await this.deleteReimbursementClaim(id);
            Toast.show('success', 'Claim Rejected & Deleted', 'The claim record has been removed from the database.');
        } catch (err) {
            console.error('Failed to reject claim:', err);
            Toast.show('error', 'Action Failed', 'Could not reject the claim.');
        } finally {
            this.hideLoading();
        }
    },

    viewClaimApplication(id) {
        const claims = State.reimbursements || [];
        const claim = claims.find(c => c.id === id);
        if (!claim) return;

        const previewContent = document.getElementById('print-preview-content');
        if (!previewContent) return;

        // Render Cover Letter
        const coverLetterHtml = `
            <div class="print-page">
                <div class="print-header" style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #333; padding-bottom: 12px;">
                    <h2 style="margin: 0; color: #1e3d59; text-transform: uppercase;">Vignan's Foundation for Science, Technology & Research</h2>
                    <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #555;">Department of Research & Development</p>
                </div>
                
                <div style="text-align: right; margin-bottom: 24px;">
                    <strong>Date:</strong> ${new Date(claim.created_at).toLocaleDateString()}
                </div>

                <div style="margin-bottom: 24px; line-height: 1.6;">
                    <div><strong>To,</strong></div>
                    <div>The Dean of R&D,</div>
                    <div>Vignan's Foundation for Science, Technology & Research,</div>
                    <div>Vadlamudi, Guntur (Dist.), AP</div>
                </div>

                <div style="margin-bottom: 24px;">
                    <strong>Subject:</strong> Request for Reimbursement of Registration Fee for Paper Publication - Reg.
                </div>

                <div style="line-height: 1.6; text-align: justify; margin-bottom: 24px;">
                    Respected Sir,<br><br>
                    I, <strong>${this.escapeHtml(claim.student_name)}</strong>, bearing Roll No. <strong>${this.escapeHtml(claim.roll_no)}</strong> of <strong>${this.escapeHtml(claim.branch)}</strong> department, have published a paper titled <strong>"${this.escapeHtml(claim.paper_title)}"</strong> in the conference/journal <strong>"${this.escapeHtml(claim.conf_name)}"</strong> held on <strong>${this.escapeHtml(claim.conf_dates)}</strong>.
                    The registration fee paid for the publication is <strong>₹${parseFloat(claim.fee_paid || 0).toLocaleString()}</strong>.
                    I kindly request you to approve the reimbursement of the registration fee.
                </div>

                <p style="margin-top: 30px;">Thanking you,</p>
            </div>
        `;

        // Render Claim Form
        const formHtml = `
            <div class="print-page" style="page-break-before: always; margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 40px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h3 style="margin: 0; color: #1e3d59; text-transform: uppercase;">REGISTRATION FEE REIMBURSEMENT FORM</h3>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;" border="1" cellpadding="8">
                    <tr>
                        <th colspan="2" style="background-color: #f2f2f2; text-align: left;">1. Paper details</th>
                    </tr>
                    <tr>
                        <td style="width: 30%;"><strong>Paper ID:</strong></td>
                        <td>${this.escapeHtml(claim.paper_id || 'N/A')}</td>
                    </tr>
                    <tr>
                        <td><strong>Paper Title:</strong></td>
                        <td>${this.escapeHtml(claim.paper_title)}</td>
                    </tr>
                    <tr>
                        <td><strong>Journal/Conference:</strong></td>
                        <td>${this.escapeHtml(claim.conf_name)}</td>
                    </tr>
                    <tr>
                        <td><strong>Dates of Conference:</strong></td>
                        <td>${this.escapeHtml(claim.conf_dates)}</td>
                    </tr>
                    <tr>
                        <td><strong>Host Institute/Organizer:</strong></td>
                        <td>${this.escapeHtml(claim.host_inst)}</td>
                    </tr>
                    
                    <tr>
                        <th colspan="2" style="background-color: #f2f2f2; text-align: left;">2. Student Details</th>
                    </tr>
                    <tr>
                        <td><strong>Candidate Name:</strong></td>
                        <td>${this.escapeHtml(claim.student_name)}</td>
                    </tr>
                    <tr>
                        <td><strong>Roll Number:</strong></td>
                        <td>${this.escapeHtml(claim.roll_no)}</td>
                    </tr>
                    <tr>
                        <td><strong>Branch & Department:</strong></td>
                        <td>${this.escapeHtml(claim.branch)} / ${this.escapeHtml(claim.dept)}</td>
                    </tr>

                    <tr>
                        <th colspan="2" style="background-color: #f2f2f2; text-align: left;">3. Bank details (for credit)</th>
                    </tr>
                    <tr>
                        <td><strong>Account Holder Name:</strong></td>
                        <td>${this.escapeHtml(claim.bank_acc_holder)}</td>
                    </tr>
                    <tr>
                        <td><strong>Bank Account Number:</strong></td>
                        <td>${this.escapeHtml(claim.bank_acc_no)}</td>
                    </tr>
                    <tr>
                        <td><strong>Bank Name:</strong></td>
                        <td>${this.escapeHtml(claim.bank_name)}</td>
                    </tr>
                    <tr>
                        <td><strong>Bank Branch:</strong></td>
                        <td>${this.escapeHtml(claim.bank_branch)}</td>
                    </tr>
                    <tr>
                        <td><strong>IFSC Code:</strong></td>
                        <td>${this.escapeHtml(claim.ifsc)}</td>
                    </tr>
                    <tr>
                        <td><strong>Fee Paid:</strong></td>
                        <td style="font-weight: bold; color: #1e3d59;">₹${parseFloat(claim.fee_paid || 0).toLocaleString()}</td>
                    </tr>
                </table>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; font-size: 12px; text-align: center; margin-top: 50px;">
                    <div>
                        <div style="height: 40px;"></div>
                        <p style="border-top: 1px solid #000; margin: 0; padding-top: 4px; font-weight: bold;">Signature of HOD ${claim.dept ? `(${this.escapeHtml(claim.dept)})` : ''}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="height: 40px;"></div>
                        <p style="border-top: 1px solid #000; margin: 0; padding-top: 4px; font-weight: bold;">Dean R&D / Principal / Registrar</p>
                    </div>
                </div>
            </div>
        `;

        previewContent.innerHTML = coverLetterHtml + formHtml;

        // Toggle Modal buttons to show only download/print actions
        const preSubmit = document.getElementById('reimbPreSubmitActions');
        const postSubmit = document.getElementById('reimbPostSubmitActions');
        if (preSubmit) preSubmit.style.display = 'none';
        if (postSubmit) postSubmit.style.display = 'flex';

        // Show print preview modal
        this.openModal('printPreviewModal');
    },

    trackReimbursementStatus() {
        const rollInput = document.getElementById('trackerRollNo');
        const resultsEl = document.getElementById('trackerResults');
        if (!rollInput || !resultsEl) return;

        const rollNo = rollInput.value.trim().toUpperCase();
        if (!rollNo) {
            Toast.show('warning', 'Input Required', 'Please enter a Roll Number to track.');
            return;
        }

        // Search through State.reimbursements (if empty, load first from localstorage/DB)
        const runTrack = () => {
            const matches = State.reimbursements.filter(c => c.roll_no.trim().toUpperCase() === rollNo);

            resultsEl.style.display = 'block';
            if (matches.length === 0) {
                resultsEl.innerHTML = `
                    <div style="text-align: center; padding: 24px; background: rgba(240, 180, 41, 0.05); border: 1px dashed rgba(240, 180, 41, 0.3); border-radius: 8px; color: var(--navy); font-weight: 500;">
                        <i class="ri-alert-line" style="font-size: 24px; color: #f0b429; display: block; margin-bottom: 8px;"></i>
                        No fee reimbursement claims found for Roll Number <strong>${this.escapeHtml(rollNo)}</strong>.
                    </div>
                `;
                return;
            }

            resultsEl.innerHTML = `
                <h4 style="margin-bottom: 16px; color: var(--navy); border-bottom: 1px solid var(--border-light); padding-bottom: 8px;">
                    Claims Found for ${this.escapeHtml(rollNo)} (${matches.length})
                </h4>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${matches.map(c => {
                const dateStr = new Date(c.created_at).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric'
                });

                const isSubmitted = true;
                const isUnderReview = c.status === 'Under Review' || c.status === 'Approved' || c.status === 'Rejected';
                const isApproved = c.status === 'Approved';
                const isRejected = c.status === 'Rejected';

                let step3Label = 'Approved';
                let step3Icon = 'ri-checkbox-circle-line';
                let step3Color = 'var(--emerald, #24b47e)';

                if (isRejected) {
                    step3Label = 'Rejected';
                    step3Icon = 'ri-close-circle-line';
                    step3Color = '#c62828';
                }

                return `
                            <div style="background: var(--bg-light); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px;">
                                <div style="font-weight: 600; color: var(--navy); margin-bottom: 4px; font-size: 14px; text-align: left;">${this.escapeHtml(c.paper_title)}</div>
                                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 24px; text-align: left;">
                                    <strong>Organizer:</strong> ${this.escapeHtml(c.conf_name)} | <strong>Submitted on:</strong> ${dateStr}
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; position: relative; margin-top: 10px; padding: 0 10px;">
                                    <div style="position: absolute; top: 14px; left: 40px; right: 40px; height: 3px; background: var(--border-light); z-index: 1;">
                                        <div style="width: ${isApproved || isRejected ? '100%' : (isUnderReview ? '50%' : '0%')}; height: 100%; background: var(--blue); transition: width 0.3s ease;"></div>
                                    </div>
                                    
                                    <div style="display: flex; flex-direction: column; align-items: center; z-index: 2; width: 80px; text-align: center;">
                                        <div style="width: 30px; height: 30px; border-radius: 50%; background: ${isSubmitted ? 'var(--blue)' : 'var(--border-light)'}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-bottom: 4px;">
                                            <i class="ri-send-plane-line"></i>
                                        </div>
                                        <span style="font-size: 11px; font-weight: 600; color: ${isSubmitted ? 'var(--navy)' : 'var(--text-muted)'};">Submitted</span>
                                    </div>

                                    <div style="display: flex; flex-direction: column; align-items: center; z-index: 2; width: 80px; text-align: center;">
                                        <div style="width: 30px; height: 30px; border-radius: 50%; background: ${isUnderReview ? 'var(--blue)' : 'var(--border-light)'}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-bottom: 4px;">
                                            <i class="ri-eye-line"></i>
                                        </div>
                                        <span style="font-size: 11px; font-weight: 600; color: ${isUnderReview ? 'var(--navy)' : 'var(--text-muted)'};">Under Review</span>
                                    </div>

                                    <div style="display: flex; flex-direction: column; align-items: center; z-index: 2; width: 80px; text-align: center;">
                                        <div style="width: 30px; height: 30px; border-radius: 50%; background: ${isApproved || isRejected ? step3Color : 'var(--border-light)'}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-bottom: 4px;">
                                            <i class="${step3Icon}"></i>
                                        </div>
                                        <span style="font-size: 11px; font-weight: 600; color: ${isApproved || isRejected ? step3Color : 'var(--text-muted)'};">${step3Label}</span>
                                    </div>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        };

        if (State.reimbursements.length === 0) {
            // Fetch from local API
            fetch('/api/reimbursements')
                .then(response => {
                    if (response.ok) return response.json();
                    return null;
                })
                .then(data => {
                    if (data) {
                        State.reimbursements = data;
                    } else {
                        const localData = localStorage.getItem('vignan_rd_reimbursements_v2');
                        State.reimbursements = localData ? JSON.parse(localData) : this.getSampleReimbursements();
                    }
                    runTrack();
                })
                .catch(() => {
                    const localData = localStorage.getItem('vignan_rd_reimbursements_v2');
                    State.reimbursements = localData ? JSON.parse(localData) : this.getSampleReimbursements();
                    runTrack();
                });
        } else {
            runTrack();
        }
    },

    generateAppreciationCertificate(id) {
        const pub = State.publications.find(p => p.id === id);
        if (!pub) {
            Toast.show('error', 'Error', 'Publication not found');
            return;
        }

        const dateStr = new Date(pub.created_at || Date.now()).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        // Set class on body to trigger landscape @page printing
        document.body.classList.add('print-landscape-mode');

        const titleHeader = document.querySelector('#printPreviewModal h3');
        if (titleHeader) {
            titleHeader.innerHTML = `<i class="ri-award-line" style="color: var(--gold);"></i> Certificate of Appreciation`;
        }

        // Build premium certificate HTML
        const html = `
            <div class="print-page certificate-container" style="
                width: 100%;
                box-sizing: border-box;
                padding: 40px;
                background: #fff;
                color: #1a202c;
                font-family: 'Times New Roman', Times, serif;
                text-align: center;
                border: 15px solid #d4af37;
                outline: 3px double #d4af37;
                outline-offset: -10px;
                position: relative;
                min-height: 520px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                overflow: hidden;
            ">
                <!-- Top Header -->
                <div style="width: 100%;">
                    <div style="font-size: 26px; font-weight: bold; color: #7b1113; letter-spacing: 1.5px; text-transform: uppercase;">
                        Vignan's Foundation for Science, Technology & Research
                    </div>
                    <div style="font-size: 13px; color: #4a5568; margin-top: 4px; font-style: italic;">
                        (Deemed to be University estd. u/s 3 of UGC Act 1956) | Accredited by NAAC with A+ Grade
                    </div>
                    <div style="margin: 15px auto 5px; width: 80px; height: 3px; background-color: #d4af37;"></div>
                </div>

                <!-- Main Certificate Title -->
                <div style="width: 100%; margin-top: 10px;">
                    <div style="font-family: 'Times New Roman', serif; font-size: 38px; font-weight: bold; color: #7b1113; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 15px;">
                        Certificate of Appreciation
                    </div>
                    <div style="font-size: 16px; font-style: italic; color: #4a5568; margin-bottom: 15px;">
                        This certificate is proudly presented to
                    </div>
                    <div style="font-size: 26px; font-weight: bold; color: #1a202c; border-bottom: 1px solid #d4af37; display: inline-block; padding: 0 30px 5px; margin-bottom: 8px;">
                        ${this.escapeHtml(pub.name)}
                    </div>
                    <div style="font-size: 15px; color: #4a5568; margin-bottom: 15px;">
                        Roll No: <strong>${this.escapeHtml(pub.roll_no)}</strong> | Branch: <strong>${this.escapeHtml(pub.branch)}</strong>
                    </div>
                </div>

                <!-- Core Appreciation Body -->
                <div style="width: 90%; max-width: 750px; font-size: 16px; line-height: 1.8; color: #2d3748; margin: 0 auto 20px;">
                    in recognition of their outstanding research contribution by successfully publishing the paper titled
                    <div style="font-size: 18px; font-weight: bold; color: #7b1113; margin: 8px 0; font-style: italic; line-height: 1.4;">
                        "${this.escapeHtml(pub.article_title)}"
                    </div>
                    in the publication index <strong>${this.escapeHtml(pub.indexing || 'Scopus')}</strong> - <strong>${this.escapeHtml(pub.publication_type)}</strong> forum 
                    (${this.escapeHtml(pub.journal_conference_title || '—')}) during the academic year 2025-2026.
                </div>

                <!-- Bottom Footer (Signatures) -->
                <div style="width: 90%; display: flex; justify-content: space-between; align-items: flex-end; margin-top: 10px; padding: 0 40px;">
                    <div style="text-align: center; width: 180px;">
                        <div style="height: 35px; border-bottom: 1px solid #a0aec0; margin-bottom: 6px; position: relative;">
                            <span style="position: absolute; bottom: 0; left: 0; right: 0; font-family: cursive; color: #4a5568; font-size: 14px;">R&D Cell</span>
                        </div>
                        <div style="font-size: 12px; font-weight: bold; color: #4a5568; text-transform: uppercase;">Dean, R&D</div>
                    </div>
                    
                    <!-- Gold Seal Emblem -->
                    <div style="position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; fill: #d4af37;">
                            <path d="M50,5 C25.1,5 5,25.1 5,50 C5,74.9 25.1,95 50,95 C74.9,95 95,74.9 95,50 C95,25.1 74.9,5 50,5 Z M50,90 C27.9,90 10,72.1 10,50 C10,27.9 27.9,10 50,10 C72.1,10 90,27.9 90,50 C90,72.1 72.1,90 50,90 Z" />
                            <polygon points="50,18 54,30 67,30 56,38 60,50 50,42 40,50 44,38 33,30 46,30" />
                        </svg>
                        <div style="position: absolute; font-size: 8px; font-weight: bold; color: #7b1113; text-transform: uppercase; text-align: center; line-height: 1.2;">
                            VIGNAN<br>R&D
                        </div>
                    </div>

                    <div style="text-align: center; width: 180px;">
                        <div style="height: 35px; border-bottom: 1px solid #a0aec0; margin-bottom: 6px; position: relative;">
                            <span style="position: absolute; bottom: 0; left: 0; right: 0; font-family: cursive; color: #4a5568; font-size: 14px;">Registrar Office</span>
                        </div>
                        <div style="font-size: 12px; font-weight: bold; color: #4a5568; text-transform: uppercase;">Registrar</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('print-preview-content').innerHTML = html;
        this.openModal('printPreviewModal');

        // Override closeModal to remove landscape class
        const originalClose = this.closeModal;
        this.closeModal = (modalId) => {
            if (modalId === 'printPreviewModal') {
                document.body.classList.remove('print-landscape-mode');
                if (titleHeader) {
                    titleHeader.innerHTML = `<i class="ri-printer-line" style="color: var(--gold);"></i> Reimbursement Application Preview`;
                }
                this.closeModal = originalClose;
            }
            originalClose.call(this, modalId);
        };
    },

    // ── Utility Helpers ──
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    copyToClipboard(text, label) {
        if (!text || text === '—') return;
        navigator.clipboard.writeText(text).then(() => {
            Toast.show('success', 'Copied!', `${label} copied to clipboard.`);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    },

    truncate(text, maxLen) {
        if (!text) return '';
        return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
    }
});
