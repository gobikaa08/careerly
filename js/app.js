/**
 * CAREERLY - Main Application Controller
 * Handles navigation, mobile drawers, theme toggling, toasts, modals, and header badges.
 */

// Toast notification helper
function showToast(message, type = "success", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconName = type === "success" ? "checkCircle" : type === "warning" ? "alertCircle" : "alertCircle";
  const iconSvg = window.renderIcon ? window.renderIcon(iconName, "", 18) : "";

  toast.innerHTML = `
    ${iconSvg}
    <span style="font-size:0.9rem;font-weight:500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Confirmation Modal Dialog Helper
function showConfirmModal({ title = "Confirm Action", message = "Are you sure?", confirmText = "Confirm", cancelText = "Cancel", onConfirm }) {
  let modal = document.getElementById("careerly-confirm-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "careerly-confirm-modal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content animate-fade-in" style="max-width:440px;">
      <div class="modal-header">
        <h3 style="font-size:1.2rem;display:flex;align-items:center;gap:0.5rem;">
          ${window.renderIcon ? window.renderIcon("alertCircle", "", 20) : ""}
          ${title}
        </h3>
        <button class="modal-close-btn" id="confirm-modal-close" aria-label="Close dialog">
          ${window.renderIcon ? window.renderIcon("x", "", 18) : "&times;"}
        </button>
      </div>
      <p style="margin-bottom:1.5rem;font-size:0.95rem;color:var(--text-muted);">${message}</p>
      <div style="display:flex;justify-content:flex-end;gap:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="confirm-modal-cancel">${cancelText}</button>
        <button class="btn btn-danger btn-sm" id="confirm-modal-action">${confirmText}</button>
      </div>
    </div>
  `;

  modal.classList.add("active");

  const closeModal = () => modal.classList.remove("active");

  document.getElementById("confirm-modal-close").onclick = closeModal;
  document.getElementById("confirm-modal-cancel").onclick = closeModal;
  document.getElementById("confirm-modal-action").onclick = () => {
    closeModal();
    if (typeof onConfirm === "function") onConfirm();
  };
}

// Initialize Application UI
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-nav-drawer");

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      mobileToggle.innerHTML = isOpen 
        ? (window.renderIcon ? window.renderIcon("x", "", 24) : "&times;")
        : (window.renderIcon ? window.renderIcon("menu", "", 24) : "&#9776;");
      mobileToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close drawer when clicking outside or on a link
    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        if (mobileToggle) {
          mobileToggle.innerHTML = window.renderIcon ? window.renderIcon("menu", "", 24) : "&#9776;";
          mobileToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // 2. Theme toggle button
  const themeToggleButtons = document.querySelectorAll(".theme-toggle-btn");
  const updateThemeButtons = (currentTheme) => {
    themeToggleButtons.forEach(btn => {
      btn.innerHTML = currentTheme === "dark" 
        ? (window.renderIcon ? window.renderIcon("sun", "", 18) : "☀️")
        : (window.renderIcon ? window.renderIcon("moon", "", 18) : "🌙");
      btn.setAttribute("title", currentTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
      btn.setAttribute("aria-label", "Toggle dark or light theme");
    });

    // Update logo SVG for dark mode if present
    const logoImgs = document.querySelectorAll(".brand-logo-img");
    logoImgs.forEach(img => {
      const isPagesDir = window.location.pathname.includes("/pages/");
      const prefix = isPagesDir ? "../assets/logo/" : "assets/logo/";
      img.src = currentTheme === "dark" ? `${prefix}logo-dark.svg` : `${prefix}logo.svg`;
    });
  };

  const initialTheme = window.CareerlyStorage ? window.CareerlyStorage.getTheme() : "light";
  updateThemeButtons(initialTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (window.CareerlyStorage) {
        const nextTheme = window.CareerlyStorage.toggleTheme();
        updateThemeButtons(nextTheme);
        showToast(`Theme changed to ${nextTheme} mode`, "success", 1800);
      }
    });
  });

  // 3. Update Readiness Pill in Header
  const updateHeaderReadiness = () => {
    const pill = document.getElementById("header-readiness-pill");
    if (!pill || !window.CareerlyStorage) return;

    const readiness = window.CareerlyStorage.calculateOverallReadiness();
    const targetCareer = window.CareerlyStorage.getTargetCareer();

    pill.innerHTML = `
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--success);margin-right:6px;"></span>
      <span style="font-weight:700;">${readiness.overallScore}%</span>
      <span style="opacity:0.8;font-size:0.82rem;margin-left:4px;">Readiness</span>
    `;
    pill.setAttribute("title", `Target: ${targetCareer.title} (${readiness.readinessStatus})`);
  };

  updateHeaderReadiness();

  // Listen for storage changes to refresh UI dynamically
  window.addEventListener("careerly:assessment-completed", updateHeaderReadiness);
  window.addEventListener("careerly:skill-gap-updated", updateHeaderReadiness);
  window.addEventListener("careerly:roadmap-progress-updated", updateHeaderReadiness);
  window.addEventListener("careerly:resume-checklist-updated", updateHeaderReadiness);
  window.addEventListener("careerly:demo-data-loaded", () => {
    updateHeaderReadiness();
    showToast("Sample demo data loaded successfully!", "success");
    setTimeout(() => window.location.reload(), 600);
  });
  window.addEventListener("careerly:data-reset", () => {
    updateHeaderReadiness();
    showToast("All progress has been reset.", "warning");
    setTimeout(() => window.location.reload(), 600);
  });
});

window.showToast = showToast;
window.showConfirmModal = showConfirmModal;
