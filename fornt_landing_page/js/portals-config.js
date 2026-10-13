/**
 * Research & Development Portals Configuration
 * Centralized registry for all deployed university applications,
 * mapping User endpoints and Super Admin SSO endpoints.
 */
const PORTALS_CONFIG = [
  {
    id: "student-publication",
    name: "Student Publication Tracker",
    shortName: "Student Publication",
    category: "Publications",
    icon: "fa-book-bookmark",
    description: "Track student research papers, indexing (Scopus/SCI/UGC-CARE), citations, and approval workflows.",
    userUrl: "/student-publication",
    adminUrl: "/student-publication#admin",
    deployed: true,
    server: "Local Unified Server (Port 3000)",
    userBadge: "Open Student Portal",
    adminBadge: "Admin Console & Approval",
    metrics: "1,150+ Papers"
  },
  {
    id: "guideship-allotment",
    name: "Guideship Allotment System",
    shortName: "Guideship",
    category: "Faculty & Scholars",
    icon: "fa-user-tie",
    description: "Manage research supervisor allocations, scholar capacity, specialization matching, and RAC committee approvals.",
    userUrl: "/guideship",
    adminUrl: "/guideship/dashboard",
    deployed: true,
    server: "Local Unified Server (Port 3000)",
    userBadge: "Supervisor Recognition Form",
    adminBadge: "Guide Allotment Authority",
    metrics: "240+ Guides"
  },
  {
    id: "project-status",
    name: "Project Proposals Management (ProjectPi)",
    shortName: "ProjectPi",
    category: "Projects",
    icon: "fa-chart-pie",
    description: "Faculty project proposals submission, Co-PI management, grant tracking, sanction orders, and review appraisal reports.",
    userUrl: "/project-pi",
    adminUrl: "/project-pi/#admin",
    deployed: true,
    server: "Local Unified Server (Port 3000)",
    userBadge: "PI Proposal Submission",
    adminBadge: "Review & Sanctions Admin",
    metrics: "85+ Active Grants"
  },
  {
    id: "phd-scholar-tracking",
    name: "Ph.D Full-Time Scholars Tracking",
    shortName: "PhD Scholar Tracking",
    category: "Doctoral Research",
    icon: "fa-graduation-cap",
    description: "Full-time doctoral scholar progress monitoring, monthly attendance, stipend approvals, RAC reviews, and publication records.",
    userUrl: "/phd-tracking",
    adminUrl: "/phd-tracking#admin",
    deployed: true,
    server: "Local Unified Server (Port 3000)",
    userBadge: "Scholar Monthly Submission",
    adminBadge: "Dean R&D / Stipend Review",
    metrics: "229+ Registered Scholars"
  }
];

// Stats Configuration matching Image 3
const STATS_CONFIG = [
  { value: 4, suffix: "+", label: "Active Portals", icon: "fa-layer-group" },
  { value: 1850, suffix: "+", label: "Researchers & Faculty", icon: "fa-users" },
  { value: 1150, suffix: "+", label: "Published Papers", icon: "fa-file-lines" },
  { value: 229, suffix: "+", label: "Ph.D Scholars", icon: "fa-graduation-cap" }
];

// Image 2 VIMS Reference Categories
const VIMS_CATEGORIES = [
  { id: "cat-pub", title: "publications", icon: "fa-book-open-reader", color: "#2563eb", count: "1,150+" },
  { id: "cat-fac", title: "Faculty", icon: "fa-chalkboard-user", color: "#0ea5e9", count: "480+" },
  { id: "cat-stu", title: "Student", icon: "fa-user-graduate", color: "#6366f1", count: "12,400+" },
  { id: "cat-doc", title: "Doctoral Faculty", icon: "fa-id-card-clip", color: "#f59e0b", count: "310+" },
  { id: "cat-sem", title: "Seminar", icon: "fa-users-rectangle", color: "#ec4899", count: "95 Events" },
  { id: "cat-con", title: "Conference", icon: "fa-microphone-lines", color: "#8b5cf6", count: "42 Hosted" },
  { id: "cat-awa", title: "Awards", icon: "fa-trophy", color: "#eab308", count: "124 Honors" },
  { id: "cat-acc", title: "Accreditation", icon: "fa-shield-halved", color: "#10b981", count: "NAAC A+" },
  { id: "cat-pro", title: "Project", icon: "fa-diagram-project", color: "#14b8a6", count: "85 Grants" }
];

// Image 2 Radial Orbit Satellite Nodes
const RADIAL_NODES = [
  { id: "node-exam", label: "Exam Cell", icon: "fa-clipboard-check", angle: 270, portalId: "student-publication" },
  { id: "node-finance", label: "Finance", icon: "fa-coins", angle: 315, portalId: "project-status" },
  { id: "node-admissions", label: "Admissions", icon: "fa-graduation-cap", angle: 0, portalId: "phd-admissions" },
  { id: "node-library", label: "Library", icon: "fa-book-atlas", angle: 45, portalId: "student-publication" },
  { id: "node-mess", label: "Mess", icon: "fa-utensils", angle: 90, portalId: null },
  { id: "node-hostel", label: "Hostel", icon: "fa-hotel", angle: 135, portalId: null },
  { id: "node-student", label: "Student", icon: "fa-user", angle: 180, portalId: "student-publication" },
  { id: "node-transport", label: "Transport", icon: "fa-bus", angle: 225, portalId: null }
];
