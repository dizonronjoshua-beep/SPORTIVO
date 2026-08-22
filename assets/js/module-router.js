/* =========================================================
   SPORTIVO MODULE ROUTER
   ---------------------------------------------------------
   Every portal module has its own HTML file.
   This file connects those HTML pages to the shared system
   logic stored in app.js and trainee.js.
========================================================= */

const MODULE_FILES = {
  user: {
    dashboard: "dashboard.html",
    book: "book-a-court.html",
    bookings: "my-bookings.html",
    announcements: "announcements.html",
    "training-application": "training-request.html",
    profile: "profile.html"
  },

  trainee: {
    dashboard: "dashboard.html",
    book: "book-a-court.html",
    bookings: "my-bookings.html",
    announcements: "announcements.html",
    "training-application": "training-request.html",
    training: "my-training.html",
    "training-schedule": "training-schedule.html",
    sessions: "my-sessions.html",
    progress: "progress.html",
    profile: "profile.html"
  },

  coach: {
    dashboard: "dashboard.html",
    "coach-requests": "training-requests.html",
    "coach-schedule": "my-schedule.html",
    "coach-groups": "training-groups.html",
    "coach-trainees": "trainee-management.html",
    "coach-plans": "training-plans.html",
    "coach-attendance": "attendance.html",
    "coach-progress": "progress-update.html",
    "coach-logs": "activity-log.html",
    profile: "profile.html"
  },

  admin: {
    dashboard: "dashboard.html",
    users: "user-management.html",
    "coach-access": "coach-management.html",
    master: "master-schedule.html",
    courts: "court-management.html",
    "admin-bookings": "court-bookings.html",
    "admin-progress": "progress-monitoring.html",
    "admin-announcements": "announcements.html",
    appeals: "appeals.html",
    reports: "reports.html",
    logs: "activity-logs.html",
    settings: "settings.html",
    profile: "profile.html"
  }
};

const MODULE_LABELS = {
  dashboard: "Dashboard",
  book: "Book a Court",
  bookings: "My Bookings",
  announcements: "Announcements",
  "training-application": "Training Request",
  training: "My Training",
  "training-schedule": "Training Schedule",
  sessions: "My Sessions",
  attendance: "Attendance",
  progress: "Progress",
  "coach-requests": "Training Requests",
  "coach-schedule": "My Schedule",
  "coach-groups": "Training Groups",
  "coach-trainees": "Trainee Management",
  "coach-plans": "Training Plans",
  "coach-attendance": "Attendance",
  "coach-progress": "Progress Update",
  "coach-logs": "Activity Log",
  users: "User Management",
  "coach-access": "Coach Management",
  master: "Master Schedule",
  courts: "Court Management",
  "admin-bookings": "Court Bookings",
  "admin-progress": "Progress Monitoring",
  "admin-announcements": "Announcements",
  appeals: "Appeals",
  reports: "Reports",
  logs: "Activity Logs",
  settings: "Settings",
  profile: "Profile"
};

const MODULE_ICONS = {};

function effectivePortalRole(user) {
  if (user.role === "admin") return "admin";
  if (user.role === "coach") return "coach";
  if (user.traineeAccess) return "trainee";
  return "user";
}

function moduleFile(role, route) {
  const roleMap = MODULE_FILES[role] || MODULE_FILES.user;
  return roleMap[route] || roleMap.dashboard;
}

function moduleHref(role, route) {
  return moduleFile(role, route);
}

function moduleList(role) {
  const roleMap = MODULE_FILES[role] || {};

  return Object.keys(roleMap)
    .filter(route => route !== "profile" && !(role === "trainee" && route === "training-application"))
    .map(route => ({
      route,
      label: MODULE_LABELS[route] || route,
      icon: ""
    }));
}

function initialsFor(user) {
  const first = (user.first || "").charAt(0);
  const last = (user.last || "").charAt(0);
  return (first + last).toUpperCase() || "SP";
}

function redirectToCorrectPortal(user) {
  const actualRole = effectivePortalRole(user);
  const requestedRole = document.body.dataset.role;

  if (actualRole === requestedRole) return false;

  const target = `../${actualRole}/dashboard.html`;
  window.location.replace(target);
  return true;
}

function buildPortalShell(user, role, route) {
  const root = document.getElementById("moduleRoot");
  const items = moduleList(role);
  const title = MODULE_LABELS[route] || "Dashboard";

  root.innerHTML = `
    <div class="portal-shell">
      <aside class="sidebar">
        <a
          class="brand"
          href="${moduleHref(role, "dashboard")}"
          aria-label="SPORTIVO dashboard"
        >
          <span class="brand-dots">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <strong>SPORTIVO</strong>
        </a>

        <a
          class="side-account profile-entry role-${user.role}"
          href="${moduleHref(role, "profile")}"
          aria-label="Open ${roleName(user)} profile"
        >
          <span class="profile-avatar" aria-hidden="true">
            ${initialsFor(user)}
          </span>

          <span class="profile-copy">
            <strong>${userName(user)}</strong>
            <small>${roleName(user)}</small>
          </span>

          <span class="profile-arrow" aria-hidden="true">↗</span>
        </a>

        <div class="nav-label">MODULES</div>

        <nav class="side-nav module-nav">
          ${items.map(item => `
            <a
              class="${item.route === route ? "active" : ""}"
              href="${moduleHref(role, item.route)}"
            >
              <span>${item.label}</span>
            </a>
          `).join("")}
        </nav>

        <div class="nav-label account-label">ACCOUNT</div>

        <nav class="side-nav account-nav">
          <button
            type="button"
            id="logoutButton"
          >
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main class="portal-main">
        <header class="topbar">
          <div class="top-title">
            <h1>${title}</h1>
          </div>

          <label class="top-search">
            <span aria-hidden="true">⌕</span>
            <input
              id="portalSearch"
              type="search"
              placeholder="Search current records..."
            >
          </label>

          <button
            class="icon-btn"
            id="bellButton"
            type="button"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>
          </button>
        </header>

        <section
          class="portal-page"
          id="view"
        ></section>
      </main>
    </div>
  `;
}

function overrideLegacyNavigation(role) {
  window.go = function goToModule(route) {
    const file = moduleFile(role, route);
    window.location.href = file;
  };
}

function bindSharedPortalControls() {
  const search = document.getElementById("portalSearch");
  const bell = document.getElementById("bellButton");
  const logout = document.getElementById("logoutButton");

  search?.addEventListener("input", event => {
    const term = event.target.value.toLowerCase();

    document.querySelectorAll(".data-table tbody tr").forEach(row => {
      const matches = row.textContent.toLowerCase().includes(term);
      row.style.display = matches ? "" : "none";
    });
  });

  bell?.addEventListener("click", toggleNotifications);
  logout?.addEventListener("click", logoutConfirm);
}

function startModulePage() {
  const state = load();
  const user = currentUser(state);

  if (!user) {
    window.location.href = typeof authPageHref === "function" ? authPageHref("login.html") : "../login.html";
    return;
  }

  if (redirectToCorrectPortal(user)) return;

  const role = effectivePortalRole(user);
  const route = document.body.dataset.module || "dashboard";
  const allowed = new Set([...Object.keys(MODULE_FILES[role]), "profile"]);

  if (!allowed.has(route)) {
    window.location.replace(moduleFile(role, "dashboard"));
    return;
  }

  overrideLegacyNavigation(role);
  buildPortalShell(user, role, route);

  const view = document.getElementById("view");
  view.innerHTML = renderModule(user, route, state);

  bindModule(user, route);
  bindSharedPortalControls();
  renderNotifications();

  runNoShowSweep();
}

window.addEventListener("DOMContentLoaded", startModulePage);
