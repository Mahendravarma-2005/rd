const PROGRAM_DATA = {
    "UG": {
        branches: [
            {
                name: "B. Tech.",
                departments: [
                    "Biotechnology",
                    "Chemical Engineering",
                    "Civil Engineering",
                    "Computer Science & Engineering",
                    "Electronics and Communication Engineering",
                    "Electrical and Electronics Engineering",
                    "Information Technology",
                    "Mechanical Engineering",
                    "Mechatronics",
                    "Automobile Engineering",
                    "Textile & Fashion Technology",
                    "Agriculture Engineering",
                    "Electronics & Computer Engineering",
                    "Bioinformatics",
                    "Food Technology",
                    "Biomedical Engineering",
                    "Petroleum Engineering",
                    "Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
                    "Computer Science and Engineering (Cyber Security)",
                    "Computer Science and Business System",
                    "Robotics and Automation",
                    "Textile Technology",
                    "Computer Science and Engineering (Data Science)",
                    "Computer Science and Engineering (IOT)",
                    "Electronics Engineering (VLSI Design and Technology)",
                    "Technical Textiles"
                ]
            },
            {
                name: "Diploma",
                departments: [
                    "Computer Science and Engineering",
                    "Electronics and Communication Engineering",
                    "Electrical and Electronics Engineering",
                    "Artificial Intelligence (AI) and Machine Learning",
                    "Mechanical Engineering"
                ]
            },
            {
                name: "B.A (Hons.)",
                departments: ["B.A. (Hons.) Political Science"]
            },
            {
                name: "BBM",
                departments: ["General"]
            },
            {
                name: "BCA",
                departments: ["Bachelor of Computer Applications"]
            },
            {
                name: "BBA",
                departments: ["Bachelor of Business Administration"]
            },
            {
                name: "B. Sc.",
                departments: [
                    "Mathematics, Statistics and Computer Science",
                    "Psychology",
                    "Actuarial Science",
                    "Data Science"
                ]
            },
            {
                name: "B.Pharmacy",
                departments: ["Bachelor of Pharmacy"]
            },
            {
                name: "ITEP",
                departments: [
                    "B.A. B.Ed. English Literature",
                    "B.A. B.Ed. Economics",
                    "B.Sc. B.Ed. Botany",
                    "B.Sc. B.Ed. Zoology",
                    "B.Sc. B.Ed. Mathematics",
                    "B.Sc. B.Ed. Chemistry"
                ]
            },
            {
                name: "BA.LLB (Hons.)",
                departments: ["BA.LLB (Hons.)"]
            },
            {
                name: "BBA.LLB (Hons.)",
                departments: ["BBA. LLB (Hons.)"]
            },
            {
                name: "B.Sc. (Hons.)",
                departments: [
                    "B.Sc. (Hons.) Agriculture",
                    "B.Sc. (Hons.) Data Science"
                ]
            },
            {
                name: "B. Com.",
                departments: ["General"]
            }
        ]
    },
    "PG": {
        branches: [
            {
                name: "M. Tech.",
                departments: [
                    "Biotechnology & Bioprocess Engineering",
                    "Chemical Engineering",
                    "Communication & Signal Processing",
                    "Computer Science & Engineering",
                    "Digital Electronics & Communication Systems",
                    "Embedded Systems",
                    "Energy Engineering",
                    "Information Technology",
                    "Machine Design",
                    "Power Electronics and Drives",
                    "VLSI",
                    "Food Processing Technology",
                    "Power Systems",
                    "CAD/CAM/CAE",
                    "Structural Engineering",
                    "Computer Networks and Information Security",
                    "Thermal Engineering",
                    "Machine Learning",
                    "Data Communication & Networking",
                    "Petroleum Engineering",
                    "Farm Machinery",
                    "Image Processing & Machine Vision",
                    "Data Science",
                    "Internet of Things",
                    "Electrical Vehicle Technology",
                    "Artificial Intelligence and Data Science",
                    "Smart Manufacturing",
                    "Autonomous Electric Vehicles",
                    "Sustainable Smart Construction"
                ]
            },
            {
                name: "MBA",
                departments: [
                    "General",
                    "Finance",
                    "Human Resource"
                ]
            },
            {
                name: "MCA",
                departments: ["Master of Computer Applications"]
            },
            {
                name: "M.Pharmacy",
                departments: ["M. Pharmacy (Pharmaceutics)"]
            },
            {
                name: "M. A.",
                departments: ["English"]
            },
            {
                name: "M.Sc.",
                departments: [
                    "Chemistry",
                    "Organic Chemistry",
                    "Data Science",
                    "Pharmaceutical Chemistry",
                    "Psychology",
                    "Agronomy",
                    "Entomology",
                    "Soil Science",
                    "Agricultural Economics",
                    "Vegetable Science",
                    "Floriculture and Landscaping",
                    "Plant Pathology",
                    "Genetics & Plant Breeding"
                ]
            },
            {
                name: "Pharm. D.",
                departments: ["Doctor of Pharmacy"]
            }
        ]
    }
};


Object.assign(App, {
    // ── Fee Reimbursement Draft Auto-save ──
    saveReimbursementDraft() {
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

            if (role === 'student') {
                rollNo = rollInputs[studentIndex] ? rollInputs[studentIndex].value.trim() : '';
                branch = branchInputs[studentIndex] ? branchInputs[studentIndex].value.trim() : '';
                studentIndex++;
            } else {
                empCode = empcodeInputs[facultyIndex] ? empcodeInputs[facultyIndex].value.trim() : '';
                facultyIndex++;
            }

            authors.push({ name, role, dept, rollNo, branch, empCode });
        });

        const draft = {
            paperTitle: document.getElementById('reimbPaperTitle')?.value.trim() || '',
            pubType: document.getElementById('reimbPubType')?.value || 'Conference',
            hostInst: document.getElementById('reimbHostInst')?.value.trim() || '',
            confName: document.getElementById('reimbConfName')?.value.trim() || '',
            confDates: document.getElementById('reimbConfDates')?.value.trim() || '',
            paperDoi: document.getElementById('reimbPaperDoi')?.value.trim() || '',
            paperId: document.getElementById('reimbPaperId')?.value.trim() || '',
            nirfRanking: document.getElementById('reimbNirfRanking')?.value.trim() || '',
            naacRanking: document.getElementById('reimbNaacRanking')?.value.trim() || '',
            program: document.querySelector('.reimb-author-program')?.value || 'UG',
            feePaid: document.getElementById('reimbFeePaid')?.value || '',
            accHolder: document.getElementById('reimbAccHolder')?.value.trim() || '',
            accNo: document.getElementById('reimbAccNo')?.value.trim() || '',
            bankName: document.getElementById('reimbBankName')?.value.trim() || '',
            branchName: document.getElementById('reimbBankBranch')?.value.trim() || '',
            ifsc: document.getElementById('reimbIFSC')?.value.trim() || '',
            authors: authors
        };

        localStorage.setItem('reimbursement_draft', JSON.stringify(draft));
    },

    loadReimbursementDraft() {
        const raw = localStorage.getItem('reimbursement_draft');
        if (!raw) return;

        try {
            const draft = JSON.parse(raw);
            if (document.getElementById('reimbPaperTitle')) document.getElementById('reimbPaperTitle').value = draft.paperTitle;
            if (document.getElementById('reimbPubType')) {
                document.getElementById('reimbPubType').value = draft.pubType || 'Conference';
                this.handlePubTypeChange();
            }
            if (document.getElementById('reimbHostInst')) document.getElementById('reimbHostInst').value = draft.hostInst;
            if (document.getElementById('reimbConfName')) document.getElementById('reimbConfName').value = draft.confName;
            if (document.getElementById('reimbConfDates')) document.getElementById('reimbConfDates').value = draft.confDates;
            if (document.getElementById('reimbPaperDoi')) document.getElementById('reimbPaperDoi').value = draft.paperDoi || '';
            if (document.getElementById('reimbPaperId')) document.getElementById('reimbPaperId').value = draft.paperId || '';
            if (document.getElementById('reimbNirfRanking')) document.getElementById('reimbNirfRanking').value = draft.nirfRanking || '';
            if (document.getElementById('reimbNaacRanking')) document.getElementById('reimbNaacRanking').value = draft.naacRanking || '';
            
            const progSelect = document.querySelector('.reimb-author-program');
            if (progSelect && draft.program) {
                progSelect.value = draft.program;
            }

            if (document.getElementById('reimbFeePaid')) document.getElementById('reimbFeePaid').value = draft.feePaid;
            if (document.getElementById('reimbAccHolder')) document.getElementById('reimbAccHolder').value = draft.accHolder;
            if (document.getElementById('reimbAccNo')) document.getElementById('reimbAccNo').value = draft.accNo;
            if (document.getElementById('reimbBankName')) document.getElementById('reimbBankName').value = draft.bankName;
            if (document.getElementById('reimbBankBranch')) document.getElementById('reimbBankBranch').value = draft.branchName;
            if (document.getElementById('reimbIFSC')) document.getElementById('reimbIFSC').value = draft.ifsc;

            // Generate author rows first
            this.generateAuthorInputs();

            // Populate author rows
            const nameInputs = document.querySelectorAll('.reimb-author-name');
            const deptInputs = document.querySelectorAll('.reimb-author-dept');
            const rollInputs = document.querySelectorAll('.reimb-author-roll');
            const branchInputs = document.querySelectorAll('.reimb-author-branch');
            const empcodeInputs = document.querySelectorAll('.reimb-author-empcode');

            let studentIndex = 0;
            let facultyIndex = 0;

            draft.authors.forEach((author, index) => {
                if (index < nameInputs.length) {
                    nameInputs[index].value = author.name;
                    if (deptInputs[index]) deptInputs[index].value = author.dept;
                    if (author.role === 'student') {
                        if (rollInputs[studentIndex]) rollInputs[studentIndex].value = author.rollNo;
                        if (branchInputs[studentIndex]) branchInputs[studentIndex].value = author.branch;
                        studentIndex++;
                    } else {
                        if (empcodeInputs[facultyIndex]) empcodeInputs[facultyIndex].value = author.empCode;
                        facultyIndex++;
                    }
                }
            });

            // Sync custom dropdown displays
            const programVal = draft.program || '';
            const studentBranchVal = (draft.authors && draft.authors[0]) ? draft.authors[0].branch : '';
            const studentDeptVal = (draft.authors && draft.authors[0]) ? draft.authors[0].dept : '';

            const branchHidden = document.getElementById('reimbStudentBranch');
            const branchVisible = document.getElementById('reimbStudentBranchInput');
            const otherBranchField = document.getElementById('otherBranchField');
            const otherInput = document.getElementById('reimbStudentBranchOther');
            const deptSelect = document.getElementById('reimbStudentDept');

            if (branchHidden && branchVisible && otherBranchField && otherInput && deptSelect) {
                // Populate dropdowns based on program
                this.populateBranchDropdown(programVal);
                this.populateDeptDropdown(studentBranchVal, programVal);

                if (studentBranchVal) {
                    branchHidden.value = studentBranchVal;
                    const data = PROGRAM_DATA[programVal];
                    const isKnown = data && data.branches.some(b => b.name === studentBranchVal);
                    if (isKnown) {
                        branchVisible.value = studentBranchVal;
                        otherBranchField.style.display = 'none';
                        otherInput.value = "";
                        otherInput.required = false;
                    } else {
                        branchVisible.value = 'Others';
                        otherBranchField.style.display = 'block';
                        otherInput.value = studentBranchVal;
                        otherInput.required = true;
                    }
                }

                if (studentDeptVal) {
                    this.selectDept(studentDeptVal);
                }
            }
        } catch (e) {
            console.error('Error loading reimbursement draft:', e);
        }
    },

    clearReimbursementDraft() {
        localStorage.removeItem('reimbursement_draft');
    },

    handleReimbursementReset() {
        this.clearReimbursementDraft();

        const receiptLabel = document.getElementById('reimbReceiptFileLabel');
        if (receiptLabel) receiptLabel.textContent = 'Choose Fee Receipt';

        const proofLabel = document.getElementById('reimbPaperProofFileLabel');
        if (proofLabel) proofLabel.textContent = 'Choose Paper Proof';

        const receiptPreview = document.getElementById('reimbReceiptPreview');
        const receiptImg = document.getElementById('reimbReceiptImg');
        if (receiptPreview) receiptPreview.style.display = 'none';
        if (receiptImg) receiptImg.src = '';

        const proofPreview = document.getElementById('reimbPaperProofPreview');
        const proofImg = document.getElementById('reimbPaperProofImg');
        if (proofPreview) proofPreview.style.display = 'none';
        if (proofImg) proofImg.src = '';

        const studentCount = document.getElementById('reimbStudentCount');
        if (studentCount) studentCount.value = '0';

        const facultyCount = document.getElementById('reimbFacultyCount');
        if (facultyCount) facultyCount.value = '0';

        const paperId = document.getElementById('reimbPaperId');
        if (paperId) paperId.value = '';

        App.isReimbursementEligible = true;
        const submitBtn = document.getElementById('reimbSubmitBtn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = '';
            submitBtn.title = '';
        }

        const banner = document.getElementById('reimbEligibilityContainer');
        if (banner) banner.style.display = 'none';

        const branchHidden = document.getElementById('reimbStudentBranch');
        const branchVisible = document.getElementById('reimbStudentBranchInput');
        const otherBranchField = document.getElementById('otherBranchField');
        const otherInput = document.getElementById('reimbStudentBranchOther');
        const deptHidden = document.getElementById('reimbStudentDept');
        const deptVisible = document.getElementById('reimbStudentDeptInput');
        const deptOptionsList = document.getElementById('deptOptionsList');
        
        if (branchHidden) branchHidden.value = "";
        if (branchVisible) branchVisible.value = "";
        if (otherBranchField) otherBranchField.style.display = 'none';
        if (otherInput) {
            otherInput.value = "";
            otherInput.required = false;
        }
        if (deptHidden) deptHidden.value = "";
        if (deptVisible) deptVisible.value = "";
        if (deptOptionsList) {
            deptOptionsList.innerHTML = `<div style="padding: 8px 12px; font-size: 13px; color: var(--text-muted); text-align: center;">Please select branch first</div>`;
        }

        this.generateAuthorInputs();
    },

    handlePubTypeChange() {
        const pubType = document.getElementById('reimbPubType')?.value;
        const nameLabel = document.querySelector('label[for="reimbConfName"]');
        const nameInput = document.getElementById('reimbConfName');
        const datesLabel = document.querySelector('label[for="reimbConfDates"]');
        const datesInput = document.getElementById('reimbConfDates');
        const hostLabel = document.querySelector('label[for="reimbHostInst"]');
        const hostInput = document.getElementById('reimbHostInst');

        if (pubType === 'Journal') {
            if (nameLabel) nameLabel.innerHTML = `Name of Journal <span class="req">*</span>`;
            if (nameInput) nameInput.placeholder = 'e.g. IEEE Transactions on Medical Imaging';
            if (datesLabel) datesLabel.innerHTML = `Date of Publication <span class="req">*</span>`;
            if (datesInput) datesInput.placeholder = 'e.g. June 2026';
            if (hostLabel) hostLabel.innerHTML = `Publisher / Host Institute <span class="req">*</span>`;
            if (hostInput) hostInput.placeholder = 'e.g. IEEE or Elsevier';
        } else {
            if (nameLabel) nameLabel.innerHTML = `Name of Conference <span class="req">*</span>`;
            if (nameInput) nameInput.placeholder = 'e.g. IEEE SPICES 2026';
            if (datesLabel) datesLabel.innerHTML = `Dates of Conference <span class="req">*</span>`;
            if (datesInput) datesInput.placeholder = 'e.g. June 15-17, 2026';
            if (hostLabel) hostLabel.innerHTML = `Host Institute / Organizer <span class="req">*</span>`;
            if (hostInput) hostInput.placeholder = 'e.g. IIT Madras or IEEE Madras Section';
        }
    },

    // ── Fee Reimbursement Logic ──
    generateAuthorInputs() {
        // Since authors information cards are now static in the DOM,
        // we only bind the eligibility checks on the Registration Number input
        const rollInput = document.getElementById('reimbStudentRoll');
        if (rollInput) {
            // Trigger check initially if it already has a value (e.g. from loaded draft)
            if (rollInput.value.trim()) {
                this.triggerClaimEligibilityCheck(rollInput.value.trim());
            }

            // Listen for keystrokes and focus changes
            rollInput.addEventListener('input', (e) => {
                this.triggerClaimEligibilityCheck(e.target.value.trim());
            });
            rollInput.addEventListener('change', (e) => {
                this.target = e.target;
                this.triggerClaimEligibilityCheck(e.target.value.trim());
            });
        }
    },

    handleAuthorRoleChange(selectEl) {
        const row = selectEl.closest('.author-row');
        if (!row) return;
        const deptField = row.querySelector('.reimb-dept-field');
        const deptInput = row.querySelector('.reimb-author-dept');
        if (selectEl.value === 'student') {
            deptField.style.display = 'block';
            if (deptInput) deptInput.required = true;
        } else {
            deptField.style.display = 'none';
            if (deptInput) {
                deptInput.required = false;
                deptInput.value = '';
            }
        }
    },

    renderAndOpenPrintModal(formData, receiptDataUrl, proofDataUrl, isSubmitted = false) {
        State.currentReimbursementData = formData;

        const printBtn = document.getElementById('reimbPrintBtn');
        if (printBtn) printBtn.style.setProperty('display', isSubmitted ? 'flex' : 'none', 'important');

        const checkbox = document.getElementById('claimDeclarationCheckbox');
        if (checkbox) checkbox.checked = false;

        const submitBtn = document.getElementById('reimbRDSubmitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ri-send-plane-line"></i> Submit to R&D';
        }

        const preSubmit = document.getElementById('reimbPreSubmitActions');
        const postSubmit = document.getElementById('reimbPostSubmitActions');
        if (preSubmit) preSubmit.style.display = isSubmitted ? 'none' : 'flex';
        if (postSubmit) postSubmit.style.display = isSubmitted ? 'flex' : 'none';

        const previewContent = document.getElementById('print-preview-content');
        if (!previewContent) return;

        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const students = formData.authors.filter(a => a.role === 'student');
        const firstStudentDept = students.length > 0 ? students[0].dept : 'R&D Cell';

        // 1. Cover Letter Page
        let coverLetterHtml = `
            <div class="print-page cover-letter-page" style="page-break-after: always; padding: 20px; color: #000; font-family: 'Times New Roman', Times, serif; font-size: 15px; line-height: 1.6;">
                <div style="display: flex; justify-content: flex-end; align-items: flex-start; margin-bottom: 30px;">
                    <div style="text-align: right;">
                        <strong>Date:</strong> ${today}
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <strong>From:</strong><br>
                    ${students.map(s => `${s.name} (Regd. No: ${s.rollNo || ''}, ${s.branch || ''}, Dept. of ${s.dept || ''})`).join('<br>')}<br>
                    Vignan's Foundation for Science, Technology & Research<br>
                    Vadlamudi, Guntur (Dist.), AP
                </div>

                <div style="margin-bottom: 30px;">
                    <strong>To:</strong><br>
                    The Dean of R&D,<br>
                    Vignan's Foundation for Science, Technology & Research,<br>
                    Vadlamudi, Guntur (Dist.), AP
                </div>

                <div style="margin-bottom: 20px;">
                    <strong>Through:</strong> Faculty Guide
                </div>

                <div style="margin-bottom: 25px; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; font-weight: bold; text-transform: uppercase; font-size: 14px;">
                    SUBJECT: Request for registration fee reimbursement for publication of paper - Reg.
                </div>

                <p>Respected Sir/Madam,</p>
                
                <p>
                    We, the student(s) of the Department of ${firstStudentDept}, ${formData.branch} program, have successfully published and presented our research paper. The details of the publication are as follows:
                </p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                    <tr>
                        <td style="width: 30%; font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">Paper Title:</td>
                        <td style="padding: 8px; border: 1px solid #000;">${formData.paperTitle}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">Publication Type:</td>
                        <td style="padding: 8px; border: 1px solid #000;">${formData.pubType}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">${formData.pubType === 'Journal' ? 'Journal Name' : 'Conference Name'}:</td>
                        <td style="padding: 8px; border: 1px solid #000;">${formData.confName}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">${formData.pubType === 'Journal' ? 'Publisher' : 'Host Institute / Organizer'}:</td>
                        <td style="padding: 8px; border: 1px solid #000;">${formData.hostInst}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">${formData.pubType === 'Journal' ? 'Date of Publication' : 'Dates of Conference'}:</td>
                        <td style="padding: 8px; border: 1px solid #000;">${formData.confDates}</td>
                    </tr>
                    ${formData.paperDoi ? `
                    <tr>
                        <td style="font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">DOI Link:</td>
                        <td style="padding: 8px; border: 1px solid #000;"><a href="${formData.paperDoi}" target="_blank" style="color: #000; text-decoration: none;">${formData.paperDoi}</a></td>
                    </tr>
                    ` : ''}
                    ${formData.paperId ? `
                    <tr>
                        <td style="font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">Paper ID:</td>
                        <td style="padding: 8px; border: 1px solid #000;">${formData.paperId}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="font-weight: bold; padding: 8px; border: 1px solid #000; background: #fcfcfc;">Registration Fee Paid:</td>
                        <td style="padding: 8px; border: 1px solid #000; font-weight: bold;">₹${parseFloat(formData.feePaid).toLocaleString()}</td>
                    </tr>
                </table>

                <p>
                    We have successfully presented our work and paid the registration fee. The fee payment receipt, copy of the paper, and bank passbook first page are attached with this application for your reference. 
                    We kindly request you to recommend this application for reimbursement of the registration fee amount.
                </p>

                <p style="margin-top: 30px;">Thanking you,</p>
            </div>
        `;

        // 2. Claim Form Page
        let formHtml = `
            <div class="print-page reimbursement-form-page" style="page-break-after: always; padding: 20px; color: #000; font-family: 'Arial', sans-serif; font-size: 13px; line-height: 1.5;">
                <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; position: relative;">
                    <h2 style="margin: 0; text-transform: uppercase; font-size: 16px; font-weight: bold;">VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH</h2>
                    <p style="margin: 3px 0 0 0; font-size: 11px;">(Deemed to be University, Estd u/s 3 of UGC Act 1956) | Vadlamudi, Guntur District</p>
                    <h3 style="margin: 8px 0 0 0; background: #f2f2f2; padding: 5px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border: 1px solid #ccc; font-weight: bold;">R&D Cell — Registration Fee Reimbursement Claim Form</h3>
                </div>

                <h4 style="margin: 0 0 6px 0; border-bottom: 1px solid #000; padding-bottom: 2px; font-size: 12px; font-weight: bold; text-transform: uppercase;">A. PUBLICATION & EVENT DETAILS</h4>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <tr>
                        <td style="width: 25%; border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Title of the Paper:</td>
                        <td style="border: 1px solid #000; padding: 5px;" colspan="3">${formData.paperTitle}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Publication Type:</td>
                        <td style="border: 1px solid #000; padding: 5px;" colspan="3">${formData.pubType}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">${formData.pubType === 'Journal' ? 'Journal Name' : 'Conference Name'}:</td>
                        <td style="border: 1px solid #000; padding: 5px;" colspan="3">${formData.confName}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">${formData.pubType === 'Journal' ? 'Publisher' : 'Host Institute'}:</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 30%;">${formData.hostInst}</td>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9; width: 15%;">${formData.pubType === 'Journal' ? 'Publication Date' : 'Dates'}:</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 30%;">${formData.confDates}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">DOI Link:</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 30%;">${formData.paperDoi || '—'}</td>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9; width: 15%;">Paper ID:</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 30%;">${formData.paperId || '—'}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Branch / Program:</td>
                        <td style="border: 1px solid #000; padding: 5px;">${formData.branch}</td>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Fee Paid:</td>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">₹${parseFloat(formData.feePaid).toLocaleString()}</td>
                    </tr>
                </table>

                <h4 style="margin: 0 0 6px 0; border-bottom: 1px solid #000; padding-bottom: 2px; font-size: 12px; font-weight: bold; text-transform: uppercase;">B. AUTHOR(S) DETAILS</h4>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; text-align: center; font-size: 12px;">
                    <thead>
                        <tr style="background: #f2f2f2; font-weight: bold;">
                            <th style="border: 1px solid #000; padding: 5px; width: 6%;">S.No</th>
                            <th style="border: 1px solid #000; padding: 5px; width: 32%; text-align: left;">Full Name</th>
                            <th style="border: 1px solid #000; padding: 5px; width: 18%;">Regd. No / Emp Code</th>
                            <th style="border: 1px solid #000; padding: 5px; width: 14%;">Role</th>
                            <th style="border: 1px solid #000; padding: 5px; width: 15%; text-align: left;">Branch</th>
                            <th style="border: 1px solid #000; padding: 5px; width: 15%; text-align: left;">Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${formData.authors.map((author, index) => `
                            <tr>
                                <td style="border: 1px solid #000; padding: 5px;">${index + 1}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align: left;">${author.name}</td>
                                <td style="border: 1px solid #000; padding: 5px;">${author.role === 'faculty' ? (author.empCode || '—') : (author.rollNo || '—')}</td>
                                <td style="border: 1px solid #000; padding: 5px;">${author.role === 'faculty' ? 'Faculty Guide' : 'Student'}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align: left;">${author.role === 'faculty' ? '—' : (author.branch || '—')}</td>
                                <td style="border: 1px solid #000; padding: 5px; text-align: left;">${author.dept || '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h4 style="margin: 0 0 6px 0; border-bottom: 1px solid #000; padding-bottom: 2px; font-size: 12px; font-weight: bold; text-transform: uppercase;">C. BANK ACCOUNT DETAILS (FOR CREDIT)</h4>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <tr>
                        <td style="width: 25%; border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Account Holder Name:</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 25%;">${formData.bank.accHolder}</td>
                        <td style="width: 25%; border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Bank Name:</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 25%;">${formData.bank.bankName}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Account Number:</td>
                        <td style="border: 1px solid #000; padding: 5px;">${formData.bank.accNo}</td>
                        <td style="border: 1px solid #000; padding: 5px; font-weight: bold; background: #f9f9f9;">Branch & IFSC:</td>
                        <td style="border: 1px solid #000; padding: 5px;">${formData.bank.branchName} (${formData.bank.ifsc})</td>
                    </tr>
                </table>

                <div style="background: #fafafa; border: 1px dashed #000; padding: 10px; margin-bottom: 25px; font-size: 11px; border-radius: 4px; line-height: 1.4;">
                    <strong>Required Attachments (Enclose the following in order):</strong>
                    <ol style="margin: 4px 0 0 0; padding-left: 18px;">
                        <li>Copy of the published paper (first page / with authors lists).</li>
                        <li>Original Registration Fee Receipt (must show date and amount).</li>
                        <li>First page of Bank Passbook / Cancelled Cheque (with IFSC & Account details).</li>
                    </ol>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; font-size: 12px; text-align: center; margin-top: 50px;">
                    <div>
                        <div style="height: 40px;"></div>
                        <p style="border-top: 1px solid #000; margin: 0; padding-top: 4px; font-weight: bold;">Signature of HOD ${firstStudentDept ? `(${firstStudentDept})` : ''}</p>
                    </div>
                    <div>
                        <div style="height: 40px;"></div>
                        <p style="border-top: 1px solid #000; margin: 0; padding-top: 4px; font-weight: bold;">Dean R&D / Principal / Registrar</p>
                    </div>
                </div>
            </div>
        `;

        // 3. Receipt Attachment Page
        let receiptHtml = '';
        if (typeof isReprint === 'undefined' || !isReprint) {
            receiptHtml = `
                <div class="print-page receipt-attachment-page" style="padding: 20px; color: #000; font-family: 'Arial', sans-serif; font-size: 13px;">
                    <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 8px;">
                        <h3 style="margin: 0; text-transform: uppercase; font-size: 14px; font-weight: bold;">Attachment: Registration Fee Receipt</h3>
                        <p style="margin: 4px 0 0 0; font-size: 11px; color: #555;">Candidate: ${formData.bank.accHolder} | Amount: ₹${parseFloat(formData.feePaid).toLocaleString()}</p>
                    </div>
                    
                    ${receiptDataUrl ? `
                        <div style="text-align: center; margin-top: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 6px; background: #fff;">
                            <img src="${receiptDataUrl}" style="max-width: 100%; max-height: 70vh; height: auto; object-fit: contain; box-shadow: 0 1px 5px rgba(0,0,0,0.1);">
                        </div>
                    ` : `
                        <div style="border: 2px dashed #999; height: 450px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 30px; background: #fbfbfb; border-radius: 6px; text-align: center; color: #555; padding: 20px;">
                            <i class="ri-attachment-line" style="font-size: 40px; color: #888; margin-bottom: 10px;"></i>
                            <h4 style="margin: 0 0 6px 0; color: #222; font-weight: bold;">Staple / Paste Original Fee Receipt Here</h4>
                            <p style="margin: 0; font-size: 12px; line-height: 1.4;">(Please attach the payment confirmation receipt or invoice generated from the conference / journal portal)</p>
                        </div>
                    `}
                </div>
            `;
        }

        // 4. Proof Attachment Page
        let proofHtml = '';
        if (typeof isReprint === 'undefined' || !isReprint) {
            proofHtml = `
                <div class="print-page proof-attachment-page" style="padding: 20px; color: #000; font-family: 'Arial', sans-serif; font-size: 13px; page-break-before: always;">
                    <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 8px;">
                        <h3 style="margin: 0; text-transform: uppercase; font-size: 14px; font-weight: bold;">Attachment: First Page of Paper (Proof)</h3>
                        <p style="margin: 4px 0 0 0; font-size: 11px; color: #555;">Title: ${formData.paperTitle}</p>
                    </div>
                    
                    ${proofDataUrl ? `
                        <div style="text-align: center; margin-top: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 6px; background: #fff;">
                            <img src="${proofDataUrl}" style="max-width: 100%; max-height: 70vh; height: auto; object-fit: contain; box-shadow: 0 1px 5px rgba(0,0,0,0.1);">
                        </div>
                    ` : `
                        <div style="border: 2px dashed #999; height: 450px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 30px; background: #fbfbfb; border-radius: 6px; text-align: center; color: #555; padding: 20px;">
                            <i class="ri-article-line" style="font-size: 40px; color: #888; margin-bottom: 10px;"></i>
                            <h4 style="margin: 0 0 6px 0; color: #222; font-weight: bold;">Staple / Paste First Page of Paper Here</h4>
                            <p style="margin: 0; font-size: 12px; line-height: 1.4;">(Please attach the first page of the published journal or conference paper showing title and authors list)</p>
                        </div>
                    `}
                </div>
            `;
        }

        previewContent.innerHTML = coverLetterHtml + formHtml + receiptHtml + proofHtml;
        this.openModal('printPreviewModal');
    },

    printApplication() {
        const originalTitle = document.title;
        try {
            const formData = State.currentReimbursementData;
            if (formData) {
                const primaryStudent = formData.authors.find(a => a.role === 'student');
                if (primaryStudent) {
                    const studentName = (primaryStudent.name || 'Student').trim().replace(/[^a-zA-Z0-9]/g, '_');
                    const rollNo = (primaryStudent.rollNo || '').trim().replace(/[^a-zA-Z0-9]/g, '_');
                    const filename = `${studentName}_${rollNo}_Reimbursement_Application`;
                    document.title = filename;
                }
            }
        } catch (e) {
            console.error('Failed to set print filename:', e);
        }
        
        window.print();
        
        // Restore title after print dialog closes
        setTimeout(() => {
            document.title = originalTitle;
        }, 100);
    },

    handleDeclarationChange() {
        const checkbox = document.getElementById('claimDeclarationCheckbox');
        const submitBtn = document.getElementById('reimbRDSubmitBtn');
        if (checkbox && submitBtn) {
            if (checkbox.checked) {
                // Open custom confirmation modal
                this.openModal('confirmSubmissionModal');
                // Keep checkbox unchecked until accepted in the modal
                checkbox.checked = false;
                submitBtn.disabled = true;
            } else {
                submitBtn.disabled = true;
            }
        }
    },

    acceptDeclarationCheck() {
        const checkbox = document.getElementById('claimDeclarationCheckbox');
        const submitBtn = document.getElementById('reimbRDSubmitBtn');
        if (checkbox) checkbox.checked = true;
        if (submitBtn) submitBtn.disabled = false;
        
        this.closeModal('confirmSubmissionModal');
        Toast.show('success', 'Declaration Accepted', 'Please complete your submission by clicking Submit to R&D.');
    },

    cancelDeclarationCheck() {
        const checkbox = document.getElementById('claimDeclarationCheckbox');
        const submitBtn = document.getElementById('reimbRDSubmitBtn');
        if (checkbox) checkbox.checked = false;
        if (submitBtn) submitBtn.disabled = true;
        
        this.closeModal('confirmSubmissionModal');
    },

    async handleReimbursementRDSubmit() {
        if (typeof isConnected !== 'undefined' && !isConnected) {
            Toast.show('error', 'Database Offline', 'The university server is offline. Your submission cannot be completed. Please try again later.');
            return;
        }

        const formData = State.currentReimbursementData;
        if (!formData) {
            Toast.show('error', 'Error', 'No reimbursement data found.');
            return;
        }

        const submitBtn = document.getElementById('reimbRDSubmitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Submitting...';
        }

        const primaryStudent = formData.authors.find(a => a.role === 'student');
        const primaryGuide = formData.authors.find(a => a.role !== 'student');
        const claimData = {
            paper_title: formData.paperTitle,
            host_inst: formData.hostInst,
            conf_name: formData.confName,
            conf_dates: formData.confDates,
            fee_paid: formData.feePaid,
            roll_no: primaryStudent ? primaryStudent.rollNo : '',
            student_name: primaryStudent ? primaryStudent.name : '',
            program: primaryStudent ? primaryStudent.program : 'UG',
            branch: primaryStudent ? primaryStudent.branch : '',
            dept: primaryStudent ? primaryStudent.dept : '',
            guide_name: primaryGuide ? primaryGuide.name : '',
            bank_acc_holder: formData.bank.accHolder,
            bank_acc_no: formData.bank.accNo,
            bank_name: formData.bank.bankName,
            bank_branch: formData.bank.branchName,
            ifsc: formData.bank.ifsc,
            paper_id: formData.paperId || '',
            paper_doi: formData.paperDoi || '',
            nirf_ranking: formData.nirfRanking || '',
            naac_ranking: formData.naacRanking || '',
            status: 'Submitted'
        };

        try {
            const savedClaim = await this.submitReimbursementClaim(claimData);

            if (savedClaim && savedClaim.id) {
                State.currentReimbursementData.id = savedClaim.id;
            }

            // Hide pre-submit and show post-submit UI
            const preSubmit = document.getElementById('reimbPreSubmitActions');
            const postSubmit = document.getElementById('reimbPostSubmitActions');
            if (preSubmit) preSubmit.style.display = 'none';
            if (postSubmit) postSubmit.style.display = 'flex';

            // Show Print/Save PDF button in the header
            const printBtn = document.getElementById('reimbPrintBtn');
            if (printBtn) printBtn.style.setProperty('display', 'flex', 'important');

            // Force rendering of the admin claims table to reflect the new submission
            this.renderReimbursementsTable();

            // Reset the reimbursement form in the DOM
            const form = document.getElementById('reimbursementForm');
            if (form) {
                form.reset();
                this.generateAuthorInputs();
            }

            // Hide file previews
            const receiptPreview = document.getElementById('reimbReceiptPreview');
            const proofPreview = document.getElementById('reimbPaperProofPreview');
            if (receiptPreview) receiptPreview.style.display = 'none';
            if (proofPreview) proofPreview.style.display = 'none';

            Toast.show('success', 'Claim Submitted', 'Your fee reimbursement application has been registered.');
            
            // Automatically trigger the print/download dialog!
            setTimeout(() => {
                this.printApplication();
            }, 600);
        } catch (err) {
            console.error('Submission failed:', err);
            Toast.show('error', 'Submission Failed', err.message || 'Could not register reimbursement claim.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="ri-send-plane-line"></i> Submit to R&D';
            }
        }
    },

    async checkClaimEligibility(rollNo) {
        if (!rollNo) return { eligible: true, count: 0, claims: [] };
        
        let claims = [];
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const isoString = oneYearAgo.toISOString();

        try {
            // Fetch non-rejected claims from local API
            const response = await fetch('/api/reimbursements');
            if (response.ok) {
                const allClaims = await response.json();
                claims = allClaims.filter(c =>
                    c.roll_no && c.roll_no.trim().toUpperCase() === rollNo.trim().toUpperCase() &&
                    c.status !== 'Rejected' &&
                    new Date(c.created_at) >= oneYearAgo
                );
            }
        } catch (err) {
            console.error('Failed to query eligibility from local API:', err);
        }

        // Check local storage too
        const localData = localStorage.getItem('vignan_rd_reimbursements_v2');
        if (localData) {
            try {
                const localList = JSON.parse(localData);
                const localMatches = localList.filter(c => 
                    c.roll_no.trim().toUpperCase() === rollNo.trim().toUpperCase() &&
                    c.status !== 'Rejected' &&
                    new Date(c.created_at) >= oneYearAgo
                );
                
                // Merge claims avoiding duplicates by ID
                const claimMap = new Map();
                claims.forEach(c => claimMap.set(c.id, c));
                localMatches.forEach(c => claimMap.set(c.id, c));
                claims = Array.from(claimMap.values());
            } catch (err) {
                console.error('Failed to query eligibility from local storage:', err);
            }
        }

        // Sort claims by date descending
        claims.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return {
            eligible: claims.length === 0,
            count: claims.length,
            claims: claims
        };
    },

    async triggerClaimEligibilityCheck(rollNo) {
        if (!rollNo || rollNo.trim().length < 3) {
            App.isReimbursementEligible = true;
            const submitBtn = document.getElementById('reimbSubmitBtn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.style.cursor = '';
                submitBtn.title = '';
            }
            const banner = document.getElementById('reimbEligibilityContainer');
            if (banner) banner.style.display = 'none';
            return;
        }

        const result = await this.checkClaimEligibility(rollNo);
        App.isReimbursementEligible = result.eligible;
        this.updateEligibilityBanner(result);
    },

    updateEligibilityBanner(result) {
        const banner = document.getElementById('reimbEligibilityContainer');
        const submitBtn = document.getElementById('reimbSubmitBtn');
        if (!banner) return;

        banner.style.display = 'block';
        if (result.eligible) {
            banner.innerHTML = `
                <div style="background: rgba(36, 180, 126, 0.08); border: 1px solid rgba(36, 180, 126, 0.3); border-radius: 8px; padding: 12px 16px; display: flex; gap: 12px; align-items: flex-start; color: #1b7a54; text-align: left;">
                    <i class="ri-checkbox-circle-line" style="font-size: 20px; color: var(--emerald, #24b47e); margin-top: 1px;"></i>
                    <div>
                        <div style="font-weight: 700; margin-bottom: 2px;">✓ 1st Claim within 1 Year</div>
                        <div style="font-size: 12px; color: #2e8a60; line-height: 1.4;">The student is eligible for fee reimbursement. No active or approved claims were found for this registration number within the last 12 months.</div>
                    </div>
                </div>
            `;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.style.cursor = '';
                submitBtn.title = '';
            }
        } else {
            const lastClaim = result.claims[0];
            const lastClaimDate = new Date(lastClaim.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            const lastPaperTitle = lastClaim.paper_title || 'Untitled Paper';

            banner.innerHTML = `
                <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 16px; display: flex; gap: 12px; align-items: flex-start; color: #b91c1c; text-align: left;">
                    <i class="ri-close-circle-line" style="font-size: 20px; color: #ef4444; margin-top: 1px;"></i>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; margin-bottom: 2px;">❌ Ineligible: Already claimed within 1 year</div>
                        <div style="font-size: 12px; color: #c83232; line-height: 1.4; margin-bottom: 12px;">
                            This student has already submitted a reimbursement claim on <strong>${lastClaimDate}</strong> for the paper <em>"${this.escapeHtml(lastPaperTitle)}"</em>.<br>
                            Under R&D policy, authors can only claim reimbursement <strong>once every year (12 months)</strong>.<br>
                            <strong style="color: #a81c1c;">Submission of this application is blocked.</strong>
                        </div>
                        <div>
                            <button type="button" class="btn" style="background: var(--navy); color: #fff; border: none; font-size: 12px; font-weight: 600; padding: 8px 14px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;" onclick="App.reprintExistingApplication('${lastClaim.id}')">
                                <i class="ri-printer-line"></i> Download / Print Submitted Application
                            </button>
                        </div>
                    </div>
                </div>
            `;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
                submitBtn.title = 'Submission blocked: Claim already made in last 12 months.';
            }
        }
    },

    // ── Custom Dropdowns for Program, Branch and Department ──
    initCustomReimbursementDropdowns() {
        const programSelect = document.getElementById('reimbStudentProgram');
        const container = document.getElementById('branchSelectContainer');
        const menu = document.getElementById('branchDropdownMenu');
        const searchInput = document.getElementById('branchSearchInput');
        const otherBranchField = document.getElementById('otherBranchField');
        const otherInput = document.getElementById('reimbStudentBranchOther');
        const branchHidden = document.getElementById('reimbStudentBranch');
        const branchVisible = document.getElementById('reimbStudentBranchInput');

        // Department Custom Dropdown Elements
        const deptContainer = document.getElementById('deptSelectContainer');
        const deptMenu = document.getElementById('deptDropdownMenu');
        const deptSearchInput = document.getElementById('deptSearchInput');
        const deptHidden = document.getElementById('reimbStudentDept');
        const deptVisible = document.getElementById('reimbStudentDeptInput');

        if (!programSelect || !container || !menu || !searchInput || !otherBranchField || !otherInput || !branchHidden || !branchVisible) return;
        if (!deptContainer || !deptMenu || !deptSearchInput || !deptHidden || !deptVisible) return;

        // Populate initially
        this.populateBranchDropdown("");
        this.populateDeptDropdown("", "");

        // On Program Change
        programSelect.addEventListener('change', (e) => {
            const program = e.target.value;
            // Clear selection
            branchHidden.value = "";
            branchVisible.value = "";
            otherInput.value = "";
            otherInput.required = false;
            otherBranchField.style.display = 'none';

            // Clear department selection
            deptHidden.value = "";
            deptVisible.value = "";

            this.populateBranchDropdown(program);
            this.populateDeptDropdown("", program);

            if (typeof this.saveReimbursementDraft === 'function') {
                this.saveReimbursementDraft();
            }
        });

        // Toggle custom branch dropdown menu visibility
        const toggleMenu = (show) => {
            if (show) {
                // Check if program is selected
                if (!programSelect.value) {
                    Toast.show('warning', 'Select Program', 'Please select a program first.');
                    return;
                }
                menu.style.display = 'block';
                searchInput.value = "";
                this.filterBranchesList("");
                searchInput.focus();
            } else {
                menu.style.display = 'none';
            }
        };

        // Toggle custom department dropdown menu visibility
        const toggleDeptMenu = (show) => {
            if (show) {
                // Check if program is selected
                if (!programSelect.value) {
                    Toast.show('warning', 'Select Program', 'Please select a program first.');
                    return;
                }
                // Check if branch is selected
                if (!branchHidden.value) {
                    Toast.show('warning', 'Select Branch', 'Please select a branch first.');
                    return;
                }
                deptMenu.style.display = 'block';
                deptSearchInput.value = "";
                this.filterDeptsList("");
                deptSearchInput.focus();
            } else {
                deptMenu.style.display = 'none';
            }
        };

        container.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = menu.style.display === 'block';
            toggleMenu(!isVisible);
        });

        deptContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = deptMenu.style.display === 'block';
            toggleDeptMenu(!isVisible);
        });

        // Search filtering logic for Branch
        searchInput.addEventListener('input', (e) => {
            this.filterBranchesList(e.target.value);
        });

        searchInput.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent closing
        });

        // Search filtering logic for Department
        deptSearchInput.addEventListener('input', (e) => {
            this.filterDeptsList(e.target.value);
        });

        deptSearchInput.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent closing
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !menu.contains(e.target)) {
                toggleMenu(false);
            }
            if (!deptContainer.contains(e.target) && !deptMenu.contains(e.target)) {
                toggleDeptMenu(false);
            }
        });

        // Other branch input logic
        otherInput.addEventListener('input', (e) => {
            branchHidden.value = e.target.value.trim();
            if (typeof this.saveReimbursementDraft === 'function') {
                this.saveReimbursementDraft();
            }
        });
    },

    populateBranchDropdown(program) {
        const optionsList = document.getElementById('branchOptionsList');
        const branchHidden = document.getElementById('reimbStudentBranch');
        if (!optionsList) return;

        optionsList.innerHTML = "";

        if (!program || !PROGRAM_DATA[program]) {
            optionsList.innerHTML = `<div style="padding: 8px 12px; font-size: 13px; color: var(--text-muted); text-align: center;">Please select a program first</div>`;
            return;
        }

        const data = PROGRAM_DATA[program];
        
        // Add branches
        data.branches.forEach(branch => {
            const opt = document.createElement('div');
            opt.className = 'custom-dropdown-option';
            opt.dataset.value = branch.name;
            opt.textContent = branch.name;

            if (branchHidden.value === branch.name) {
                opt.classList.add('selected');
            }

            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectBranch(branch.name);
            });

            optionsList.appendChild(opt);
        });

        // Add "Others" option
        const otherOpt = document.createElement('div');
        otherOpt.className = 'custom-dropdown-option';
        otherOpt.dataset.value = 'Others';
        otherOpt.textContent = 'Others';
        
        // check if selected is Others or is not in the list of branches
        const isKnown = data.branches.some(b => b.name === branchHidden.value);
        if (branchHidden.value && !isKnown) {
            otherOpt.classList.add('selected');
        }

        otherOpt.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectBranch('Others');
        });

        optionsList.appendChild(otherOpt);
    },

    populateDeptDropdown(branchName, program) {
        const optionsList = document.getElementById('deptOptionsList');
        const deptHidden = document.getElementById('reimbStudentDept');
        const deptVisible = document.getElementById('reimbStudentDeptInput');
        if (!optionsList || !deptHidden) return;

        optionsList.innerHTML = "";

        if (!program || !PROGRAM_DATA[program] || !branchName) {
            optionsList.innerHTML = `<div style="padding: 8px 12px; font-size: 13px; color: var(--text-muted); text-align: center;">Please select branch first</div>`;
            return;
        }

        let departments = [];
        const data = PROGRAM_DATA[program];

        if (branchName === 'Others') {
            const uniqueDepts = new Set();
            data.branches.forEach(b => {
                b.departments.forEach(d => uniqueDepts.add(d));
            });
            departments = Array.from(uniqueDepts).sort();
        } else {
            const branchObj = data.branches.find(b => b.name === branchName);
            departments = branchObj ? branchObj.departments : [];
        }

        // Add departments to options list
        departments.forEach(dept => {
            const opt = document.createElement('div');
            opt.className = 'custom-dropdown-option';
            opt.dataset.value = dept;
            opt.textContent = dept;

            if (deptHidden.value === dept) {
                opt.classList.add('selected');
            }

            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectDept(dept);
            });

            optionsList.appendChild(opt);
        });

        // If only 1 department exists, auto-select it
        if (departments.length === 1) {
            this.selectDept(departments[0]);
        } else if (deptHidden.value && departments.includes(deptHidden.value)) {
            this.selectDept(deptHidden.value);
        } else {
            // Clear current if it is no longer valid
            if (deptHidden.value && !departments.includes(deptHidden.value)) {
                deptHidden.value = "";
                if (deptVisible) deptVisible.value = "";
            }
        }
    },

    selectDept(deptName) {
        const deptHidden = document.getElementById('reimbStudentDept');
        const deptVisible = document.getElementById('reimbStudentDeptInput');
        const deptMenu = document.getElementById('deptDropdownMenu');
        if (!deptHidden || !deptVisible) return;

        deptHidden.value = deptName;
        deptVisible.value = deptName;

        // Update selected class
        const optionsList = document.getElementById('deptOptionsList');
        if (optionsList) {
            optionsList.querySelectorAll('.custom-dropdown-option').forEach(opt => {
                if (opt.dataset.value === deptName) {
                    opt.classList.add('selected');
                } else {
                    opt.classList.remove('selected');
                }
            });
        }

        if (deptMenu) deptMenu.style.display = 'none';

        if (typeof this.saveReimbursementDraft === 'function') {
            this.saveReimbursementDraft();
        }
    },

    filterDeptsList(query) {
        const optionsList = document.getElementById('deptOptionsList');
        if (!optionsList) return;

        const options = optionsList.querySelectorAll('.custom-dropdown-option');
        const q = query.trim().toLowerCase();

        options.forEach(opt => {
            const val = opt.dataset.value.toLowerCase();
            if (val.includes(q)) {
                opt.style.display = 'flex';
            } else {
                opt.style.display = 'none';
            }
        });
    },

    filterBranchesList(query) {
        const optionsList = document.getElementById('branchOptionsList');
        if (!optionsList) return;

        const options = optionsList.querySelectorAll('.custom-dropdown-option');
        const q = query.trim().toLowerCase();

        options.forEach(opt => {
            const val = opt.dataset.value.toLowerCase();
            if (val.includes(q)) {
                opt.style.display = 'flex';
            } else {
                opt.style.display = 'none';
            }
        });

        // If no matches, make sure "Others" is still visible
        const otherOpt = Array.from(options).find(opt => opt.dataset.value === 'Others');
        if (otherOpt) {
            otherOpt.style.display = 'flex';
        }
    },

    selectBranch(branchName) {
        const programSelect = document.getElementById('reimbStudentProgram');
        const branchHidden = document.getElementById('reimbStudentBranch');
        const branchVisible = document.getElementById('reimbStudentBranchInput');
        const otherBranchField = document.getElementById('otherBranchField');
        const otherInput = document.getElementById('reimbStudentBranchOther');
        const menu = document.getElementById('branchDropdownMenu');

        if (!programSelect || !branchHidden || !branchVisible || !otherBranchField || !otherInput || !menu) return;

        const program = programSelect.value;

        // Update selected class in options list
        const optionsList = document.getElementById('branchOptionsList');
        if (optionsList) {
            optionsList.querySelectorAll('.custom-dropdown-option').forEach(opt => {
                if (opt.dataset.value === branchName) {
                    opt.classList.add('selected');
                } else {
                    opt.classList.remove('selected');
                }
            });
        }

        if (branchName === 'Others') {
            branchVisible.value = 'Others';
            branchHidden.value = otherInput.value.trim();
            otherBranchField.style.display = 'block';
            otherInput.required = true;
            otherInput.focus();
        } else {
            branchVisible.value = branchName;
            branchHidden.value = branchName;
            otherBranchField.style.display = 'none';
            otherInput.value = "";
            otherInput.required = false;
        }

        // Populate department dropdown based on selected branch
        this.populateDeptDropdown(branchName, program);

        // Close menu
        menu.style.display = 'none';

        // Trigger auto-save
        if (typeof this.saveReimbursementDraft === 'function') {
            this.saveReimbursementDraft();
        }
    },

    reprintExistingApplication(claimId) {
        const claim = State.reimbursements.find(c => c.id === claimId);
        if (!claim) {
            Toast.show('error', 'Error', 'Application details not found in cache.');
            return;
        }

        // Instruction popup alert
        alert("Important Instruction:\n\nOnly the Cover Letter and Claim Form (first 2 pages) will be generated.\n\nYou must physically attach the following documents before submitting the physical copy to the R&D Cell:\n1. Original Registration Fee Receipt\n2. First Page of the Paper (Proof)");

        const inferredPubType = (claim.conf_name && claim.conf_name.toLowerCase().includes('journal')) ? 'Journal' : 'Conference';
        const formData = {
            id: claim.id,
            paperTitle: claim.paper_title,
            pubType: inferredPubType,
            hostInst: claim.host_inst,
            confName: claim.conf_name,
            confDates: claim.conf_dates,
            feePaid: claim.fee_paid,
            paperDoi: claim.paper_doi || '',
            paperId: claim.paper_id || '',
            nirfRanking: claim.nirf_ranking || '',
            naacRanking: claim.naac_ranking || '',
            branch: claim.branch,
            authors: [
                {
                    name: claim.student_name,
                    role: 'student',
                    dept: claim.dept,
                    rollNo: claim.roll_no,
                    branch: claim.branch,
                    empCode: ''
                },
                {
                    name: claim.guide_name || 'Faculty Guide',
                    role: 'faculty',
                    dept: claim.dept,
                    rollNo: '',
                    branch: '',
                    empCode: ''
                }
            ],
            bank: {
                accHolder: claim.bank_acc_holder,
                accNo: claim.bank_acc_no,
                bankName: claim.bank_name,
                branchName: claim.bank_branch,
                ifsc: claim.ifsc
            }
        };

        this.renderAndOpenPrintModal(formData, null, null, true, true);
    }
});
