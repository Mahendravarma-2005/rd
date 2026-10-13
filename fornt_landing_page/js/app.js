/**
 * RESEARCH & DEVELOPMENT CENTRAL PORTAL - APPLICATION LOGIC
 * Features:
 * - Super Admin SSO Authentication & Session Management
 * - Dual-Perspective (Admin vs User) Matrix Controller (Image 1)
 * - Radial Orbital Launch Hub & Categorized Grid Controller (Image 2)
 * - Live Metrics Counters & Quick Launch Pills (Image 3)
 * - Internal Server (192.168.10.79) Health Monitoring
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    isSuperAdmin: localStorage.getItem("vignan_super_admin") === "true",
    adminUser: (() => {
      try { return JSON.parse(localStorage.getItem("vignan_super_admin_user")) || null; }
      catch (e) { return null; }
    })(),
    activeView: localStorage.getItem("vignan_super_admin") === "true" ? "admin" : "user",
    activeCategory: null,
    searchQuery: ""
  };

  // DOM Elements
  const superLoginBtn = document.getElementById("footerSuperLoginBtn") || document.getElementById("headerSuperLoginBtn");
  const ssoModal = document.getElementById("ssoModal");
  const closeSsoModalBtn = document.getElementById("closeSsoModal");
  const modalHeaderTitle = document.getElementById("modalHeaderTitle");
  const modalHeaderSubtitle = document.getElementById("modalHeaderSubtitle");
  const authAlertBox = document.getElementById("authAlertBox");

  // Auth Views
  const authLoginView = document.getElementById("authLoginView");
  const authForgotView = document.getElementById("authForgotView");
  const authResetView = document.getElementById("authResetView");

  // Forms & Buttons
  const ssoLoginForm = document.getElementById("ssoLoginForm");
  const ssoForgotForm = document.getElementById("ssoForgotForm");
  const ssoResetForm = document.getElementById("ssoResetForm");
  const toggleSsoPassBtn = document.getElementById("toggleSsoPassBtn");
  const btnOpenForgot = document.getElementById("btnOpenForgot");
  const btnBackToLoginFromForgot = document.getElementById("btnBackToLoginFromForgot");
  const btnSkipReset = document.getElementById("btnSkipReset");

  const viewToggleButtons = document.querySelectorAll(".toggle-btn");
  const adminCardsContainer = document.getElementById("adminCardsContainer");
  const userCardsContainer = document.getElementById("userCardsContainer");

  // ========================================================================
  // 1. INITIALIZATION & SERVER RESTART LIVENESS CHECK
  // ========================================================================
  function init() {
    verifyServerInstance();
    updateAuthStateUI();
    renderDualMatrix();
    setupEventListeners();
    animateStatsCounters();

    // Periodically verify server restart status (every 45s)
    setInterval(verifyServerInstance, 45000);
  }

  /**
   * Verify server bootId to invalidate session if server was restarted
   */
  async function verifyServerInstance() {
    try {
      const res = await fetch("/api/auth/server-instance");
      if (!res.ok) return;
      const data = await res.json();
      const currentStoredBootId = localStorage.getItem("vignan_server_boot_id");

      if (state.isSuperAdmin && currentStoredBootId && data.serverBootId !== currentStoredBootId) {
        // Server was restarted while user was logged in
        setSuperAdminAuth(false, null, true);
        showToast("Server restarted: Super Admin session has expired. Please log in again.", "warning");
      }
    } catch (err) {
      // Offline or network error
    }
  }

  // ========================================================================
  // 2. SUPER ADMIN AUTHENTICATION & MODAL CONTROLLERS
  // ========================================================================
  function setSuperAdminAuth(isAuth, authData = null, silent = false) {
    state.isSuperAdmin = isAuth;
    state.activeView = isAuth ? "admin" : "user";
    if (isAuth && authData) {
      localStorage.setItem("vignan_super_admin", "true");
      if (authData.token) localStorage.setItem("vignan_super_admin_token", authData.token);
      if (authData.serverBootId) localStorage.setItem("vignan_server_boot_id", authData.serverBootId);
      if (authData.admin) {
        localStorage.setItem("vignan_super_admin_user", JSON.stringify(authData.admin));
        state.adminUser = authData.admin;
      }
      if (!silent) {
        showToast(`Super Admin Authenticated (ID: ${authData.admin ? authData.admin.employeeId : '1001'}). Admin consoles unlocked!`, "success");
      }
    } else {
      localStorage.removeItem("vignan_super_admin");
      localStorage.removeItem("vignan_super_admin_token");
      localStorage.removeItem("vignan_super_admin_user");
      localStorage.removeItem("vignan_server_boot_id");
      state.adminUser = null;
      if (!silent) {
        showToast("Super Admin session closed. Showing User View.", "info");
      }
    }
    updateAuthStateUI();
    renderDualMatrix();
  }

  function updateAuthStateUI() {
    if (!superLoginBtn) return;
    if (state.isSuperAdmin) {
      const empId = state.adminUser ? state.adminUser.employeeId : "1001";
      superLoginBtn.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket"></i>`;
      superLoginBtn.classList.add("logged-in");
      superLoginBtn.title = `Super Admin (${empId}) - Click to Log Out`;
      superLoginBtn.setAttribute("aria-label", `Super Admin (${empId}) - Click to Log Out`);
    } else {
      superLoginBtn.innerHTML = `<i class="fa-solid fa-arrow-right-to-bracket"></i>`;
      superLoginBtn.classList.remove("logged-in");
      superLoginBtn.title = "Super Admin Login";
      superLoginBtn.setAttribute("aria-label", "Super Admin Login");
    }
  }

  function setAuthAlert(msg, type = "error") {
    if (!authAlertBox) return;
    if (!msg) {
      authAlertBox.className = "auth-alert-message";
      authAlertBox.style.display = "none";
      authAlertBox.innerHTML = "";
      return;
    }
    const icon = type === "success"
      ? "fa-circle-check"
      : type === "info"
      ? "fa-circle-info"
      : "fa-circle-exclamation";

    authAlertBox.className = `auth-alert-message ${type}`;
    authAlertBox.style.display = "flex";
    authAlertBox.innerHTML = `
      <i class="fa-solid ${icon}" style="font-size: 1rem; margin-top: 2px;"></i>
      <span>${msg}</span>
    `;
  }

  function switchAuthView(viewName) {
    setAuthAlert("");
    if (viewName === "login") {
      if (authLoginView) authLoginView.style.display = "block";
      if (authForgotView) authForgotView.style.display = "none";
      if (authResetView) authResetView.style.display = "none";
      if (modalHeaderTitle) modalHeaderTitle.textContent = "Super Admin SSO Gateway";
      if (modalHeaderSubtitle) modalHeaderSubtitle.textContent = "Unified Single Sign-On for all internal R&D application admin consoles";
      const empInput = document.getElementById("ssoEmployeeId");
      if (empInput) setTimeout(() => empInput.focus(), 80);
    } else if (viewName === "forgot") {
      if (authLoginView) authLoginView.style.display = "none";
      if (authForgotView) authForgotView.style.display = "block";
      if (authResetView) authResetView.style.display = "none";
      if (modalHeaderTitle) modalHeaderTitle.textContent = "Administrator Password Recovery";
      if (modalHeaderSubtitle) modalHeaderSubtitle.textContent = "Dispatch temporary password to registered Dean Outlook address";
      const forgotInput = document.getElementById("forgotEmployeeId");
      if (forgotInput) {
        const prefill = document.getElementById("ssoEmployeeId")?.value;
        if (prefill) forgotInput.value = prefill;
        setTimeout(() => forgotInput.focus(), 80);
      }
    } else if (viewName === "reset") {
      if (authLoginView) authLoginView.style.display = "none";
      if (authForgotView) authForgotView.style.display = "none";
      if (authResetView) authResetView.style.display = "block";
      if (modalHeaderTitle) modalHeaderTitle.textContent = "Update Permanent Password";
      if (modalHeaderSubtitle) modalHeaderSubtitle.textContent = "Replace temporary credentials with your new administrative password";
      const resetCurrent = document.getElementById("resetCurrentPassword");
      if (resetCurrent) setTimeout(() => resetCurrent.focus(), 80);
    }
  }

  function openSsoModal() {
    switchAuthView("login");
    ssoModal.classList.add("open");
  }

  function closeSsoModal() {
    ssoModal.classList.remove("open");
    setAuthAlert("");
  }

  // ========================================================================
  // 3. DUAL PERSPECTIVE MATRIX (Image 1 Sketch)
  // ========================================================================
  function renderDualMatrix() {
    if (!adminCardsContainer || !userCardsContainer) return;

    // Render Admin Column Cards
    adminCardsContainer.innerHTML = PORTALS_CONFIG.map(portal => {
      return `
        <div class="portal-card ${!portal.deployed ? 'coming-soon' : ''}" id="admin-card-${portal.id}">
          <div class="portal-card-top">
            <div class="portal-card-icon">
              <i class="fa-solid ${portal.icon}"></i>
            </div>
          </div>
          <h4>${portal.name}</h4>
          <p>${portal.description}</p>
          <div class="portal-card-footer admin-card-footer">
            ${
              portal.deployed
                ? `<button class="btn-launch-card btn-launch-center btn-launch-admin" onclick="handleAdminLaunch('${portal.adminUrl}', '${portal.name}')">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Admin Console
                   </button>`
                : `<span style="font-size: 0.72rem; color: var(--slate-400); font-weight: 600;">Phase 2</span>`
            }
          </div>
        </div>
      `;
    }).join("");

    // Render User Column Cards
    userCardsContainer.innerHTML = PORTALS_CONFIG.map(portal => {
      return `
        <div class="portal-card ${!portal.deployed ? 'coming-soon' : ''}" id="user-card-${portal.id}">
          <div class="portal-card-top">
            <div class="portal-card-icon">
              <i class="fa-solid ${portal.icon}"></i>
            </div>
          </div>
          <h4>${portal.name}</h4>
          <p>${portal.description}</p>
          <div class="portal-card-footer user-card-footer">
            ${
              portal.deployed
                ? `<a href="${portal.userUrl}" target="_blank" rel="noopener noreferrer" class="btn-launch-card btn-launch-center">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Open Portal
                   </a>`
                : `<span style="font-size: 0.72rem; color: var(--slate-400); font-weight: 600;">Phase 2</span>`
            }
          </div>
        </div>
      `;
    }).join("");

    updateRoleBasedViews();
  }

  function updateRoleBasedViews() {
    const adminCol = document.getElementById("adminColumn");
    const userCol = document.getElementById("userColumn");
    const container = document.getElementById("dualSplitContainer");
    const adminControls = document.getElementById("adminModeControls");
    const titleEl = document.getElementById("sectionHeadingTitle");
    const subtitleEl = document.getElementById("sectionHeadingSubtitle");
    const toggleAdminBtn = document.getElementById("toggleAdminBtn");
    const toggleUserBtn = document.getElementById("toggleUserBtn");

    if (!state.isSuperAdmin) {
      // Default: Public / User Point of View ONLY
      state.activeView = "user";
      if (adminCol) adminCol.style.display = "none";
      if (userCol) {
        userCol.style.display = "flex";
        userCol.style.width = "100%";
      }
      if (container) container.style.gridTemplateColumns = "1fr";
      if (adminControls) adminControls.style.display = "none";
      if (titleEl) titleEl.innerHTML = 'Research & Development <span class="gradient-text">Portals</span>';
      if (subtitleEl) subtitleEl.textContent = "Direct access portals for students, research scholars, and faculty members";
    } else {
      // Super Admin logged in: Admin View visible by default
      if (adminControls) adminControls.style.display = "flex";
      applyViewFilter(state.activeView || "admin");
    }
  }

  // Window handler for Admin portal click
  window.handleAdminLaunch = function(url, portalName) {
    showToast(`Launching ${portalName} Admin Console...`, "info");
    window.open(url, "_blank");
  };

  // View Switcher logic (Admin View vs User View for Super Admin)
  function applyViewFilter(viewType) {
    state.activeView = viewType;
    const adminCol = document.getElementById("adminColumn");
    const userCol = document.getElementById("userColumn");
    const container = document.getElementById("dualSplitContainer");
    const titleEl = document.getElementById("sectionHeadingTitle");
    const subtitleEl = document.getElementById("sectionHeadingSubtitle");
    const toggleAdminBtn = document.getElementById("toggleAdminBtn");
    const toggleUserBtn = document.getElementById("toggleUserBtn");

    if (viewType === "admin") {
      if (adminCol) {
        adminCol.style.display = "flex";
        adminCol.style.width = "100%";
      }
      if (userCol) userCol.style.display = "none";
      if (container) container.style.gridTemplateColumns = "1fr";
      if (titleEl) titleEl.innerHTML = 'Research & Development <span class="gradient-text">Portals</span>';
      if (subtitleEl) subtitleEl.textContent = "Direct access portals for students, research scholars, and faculty members";
      if (toggleAdminBtn) toggleAdminBtn.classList.add("active");
      if (toggleUserBtn) toggleUserBtn.classList.remove("active");
    } else if (viewType === "user") {
      if (adminCol) adminCol.style.display = "none";
      if (userCol) {
        userCol.style.display = "flex";
        userCol.style.width = "100%";
      }
      if (container) container.style.gridTemplateColumns = "1fr";
      if (titleEl) titleEl.innerHTML = 'Research & Development <span class="gradient-text">Portals</span>';
      if (subtitleEl) subtitleEl.textContent = "Direct access portals for students, research scholars, and faculty members";
      if (toggleAdminBtn) toggleAdminBtn.classList.remove("active");
      if (toggleUserBtn) toggleUserBtn.classList.add("active");
    }
  }

  // ========================================================================
  // 4. LIVE METRIC COUNTERS
  // ========================================================================
  function animateStatsCounters() {
    const statCounters = document.querySelectorAll(".stat-number");
    if (!statCounters || statCounters.length === 0) return;
    statCounters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || "";
      let current = 0;
      const increment = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = `${target.toLocaleString()}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${current.toLocaleString()}${suffix}`;
        }
      }, 35);
    });
  }

  // ========================================================================
  // 5. EVENT LISTENERS & MODAL HANDLERS
  // ========================================================================
  let pendingAuthData = null;

  function setupEventListeners() {
    // Header Super Login / Logout
    if (superLoginBtn) {
      superLoginBtn.addEventListener("click", () => {
        if (state.isSuperAdmin) {
          if (confirm("Are you sure you want to end your Super Admin SSO Session?")) {
            setSuperAdminAuth(false);
          }
        } else {
          openSsoModal();
        }
      });
    }

    // Modal Close
    if (closeSsoModalBtn) {
      closeSsoModalBtn.addEventListener("click", closeSsoModal);
    }
    if (ssoModal) {
      ssoModal.addEventListener("click", (e) => {
        if (e.target === ssoModal) closeSsoModal();
      });
    }

    // Toggle Password Visibility
    if (toggleSsoPassBtn) {
      toggleSsoPassBtn.addEventListener("click", () => {
        const passInput = document.getElementById("ssoPassword");
        const icon = toggleSsoPassBtn.querySelector("i");
        if (passInput.type === "password") {
          passInput.type = "text";
          icon.className = "fa-solid fa-eye-slash";
        } else {
          passInput.type = "password";
          icon.className = "fa-solid fa-eye";
        }
      });
    }

    // View Navigators
    if (btnOpenForgot) {
      btnOpenForgot.addEventListener("click", () => switchAuthView("forgot"));
    }
    if (btnBackToLoginFromForgot) {
      btnBackToLoginFromForgot.addEventListener("click", () => switchAuthView("login"));
    }
    if (btnSkipReset) {
      btnSkipReset.addEventListener("click", () => {
        if (pendingAuthData) {
          setSuperAdminAuth(true, pendingAuthData);
        }
        closeSsoModal();
      });
    }

    // 1. Super Admin Login Submission
    if (ssoLoginForm) {
      ssoLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const employeeId = document.getElementById("ssoEmployeeId")?.value.trim();
        const password = document.getElementById("ssoPassword")?.value;
        const submitBtn = document.getElementById("ssoSubmitBtn");

        if (!employeeId || !password) {
          setAuthAlert("Please enter both Employee ID and password.", "error");
          return;
        }

        setAuthAlert("");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...`;

        try {
          const res = await fetch("/api/portal/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employee_id: employeeId, password })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Invalid Employee ID or password.");
          }

          if (data.mustResetPassword) {
            // Temporary password detected -> prompt password change
            pendingAuthData = data;
            const resetEmpInput = document.getElementById("resetEmployeeId");
            const resetCurrPassInput = document.getElementById("resetCurrentPassword");
            if (resetEmpInput) resetEmpInput.value = employeeId;
            if (resetCurrPassInput) resetCurrPassInput.value = password;
            switchAuthView("reset");
            setAuthAlert("Logged in via temporary code. Please set a new permanent password.", "info");
          } else {
            setSuperAdminAuth(true, data);
            closeSsoModal();
            ssoLoginForm.reset();
          }
        } catch (err) {
          setAuthAlert(err.message, "error");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Authenticate & Unlock All Portals`;
        }
      });
    }

    // 2. Forgot Password Submission
    if (ssoForgotForm) {
      ssoForgotForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const employeeId = document.getElementById("forgotEmployeeId")?.value.trim();
        const submitBtn = document.getElementById("forgotSubmitBtn");

        if (!employeeId) {
          setAuthAlert("Please enter your Employee ID.", "error");
          return;
        }

        setAuthAlert("");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating Temporary Password...`;

        try {
          const res = await fetch("/api/portal/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employee_id: employeeId })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to process password recovery.");
          }

          // Pre-fill login with employeeId
          const loginEmpInput = document.getElementById("ssoEmployeeId");
          if (loginEmpInput) loginEmpInput.value = employeeId;

          // Switch to login view and show success notice
          switchAuthView("login");
          let noticeText = data.message;
          if (data.tempPasswordNotice) {
            noticeText += ` (Temporary password: ${data.tempPasswordNotice})`;
          }
          setAuthAlert(noticeText, "success");
          showToast(data.message, "success");
        } catch (err) {
          setAuthAlert(err.message, "error");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Temporary Password`;
        }
      });
    }

    // 3. Reset Password Submission
    if (ssoResetForm) {
      ssoResetForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const employeeId = document.getElementById("resetEmployeeId")?.value || document.getElementById("ssoEmployeeId")?.value;
        const currentOrTempPassword = document.getElementById("resetCurrentPassword")?.value;
        const newPassword = document.getElementById("resetNewPassword")?.value;
        const confirmPassword = document.getElementById("resetConfirmPassword")?.value;
        const submitBtn = document.getElementById("resetSubmitBtn");

        if (!currentOrTempPassword || !newPassword || !confirmPassword) {
          setAuthAlert("Please fill in all password fields.", "error");
          return;
        }

        if (newPassword !== confirmPassword) {
          setAuthAlert("New password and confirm password do not match.", "error");
          return;
        }

        if (newPassword.length < 4) {
          setAuthAlert("New password must be at least 4 characters.", "error");
          return;
        }

        setAuthAlert("");
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving Password...`;

        try {
          const res = await fetch("/api/portal/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              employee_id: employeeId,
              currentOrTempPassword,
              newPassword
            })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to reset password.");
          }

          showToast("Permanent password updated successfully!", "success");
          if (pendingAuthData) {
            setSuperAdminAuth(true, pendingAuthData);
          }
          closeSsoModal();
          ssoResetForm.reset();
        } catch (err) {
          setAuthAlert(err.message, "error");
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Save New Password & Proceed`;
        }
      });
    }

    // View Switcher Buttons (Admin vs User toggle for Super Admin)
    viewToggleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        applyViewFilter(btn.dataset.view);
      });
    });
  }

  // ========================================================================
  // 9. TOAST NOTIFICATIONS
  // ========================================================================
  function showToast(message, type = "info") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" 
      ? "fa-circle-check" 
      : type === "warning" 
      ? "fa-triangle-exclamation" 
      : "fa-circle-info";

    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="font-size: 1.1rem;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // Expose toast globally
  window.showToast = showToast;

  // Run initial setup
  init();
});
