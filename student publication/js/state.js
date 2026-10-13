/* ============================================
   R&D Publication Tracker — State & Constants
   ============================================ */

// ─── Connection State ───
let isConnected = false;

// ─── App State ───
const State = {
    publications: [],
    filteredData: [],
    currentPage: 1,
    pageSize: 10,
    sortField: 'created_at',
    sortOrder: 'desc',
    searchQuery: '',
    filters: {
        program: '',
        branch: '',
        type: '',
        indexing: '',
        tier: ''
    },
    charts: {},
    editingId: null,
    deletingId: null,
    session: null,
    userRole: null, // 'super_admin', 'admin', or null
    pendingImports: [],
    reimbursements: [],
    currentReimbursementData: null,
    pendingApprovalClaimId: null
};

// Global App Object
const App = {};
window.App = App;
