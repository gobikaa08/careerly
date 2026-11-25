/**
 * CAREERLY - Career Explorer Controller
 * Search, multi-category filtering, sorting, responsive card rendering, and detail modal.
 */

document.addEventListener("DOMContentLoaded", () => {
  const careers = window.CAREER_DATABASE || [];
  const searchInput = document.getElementById("career-search-input");
  const categoryFilter = document.getElementById("career-category-filter");
  const sortSelect = document.getElementById("career-sort-select");
  const pillsContainer = document.getElementById("category-pills");
  const gridContainer = document.getElementById("careers-grid-container");
  const emptyState = document.getElementById("careers-empty-state");
  const targetAlert = document.getElementById("target-career-alert");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");

  const modal = document.getElementById("career-detail-modal");
  const modalClose = document.getElementById("modal-close-btn");
  const modalBody = document.getElementById("modal-body-content");
  const modalCategoryBadge = document.getElementById("modal-category-badge");

  let currentCategory = "all";
  let currentSearch = "";
  let currentSort = "featured";

  // Update Target Career Alert Banner
  function updateTargetBanner() {
    if (!targetAlert || !window.CareerlyStorage) return;
    const currentTarget = window.CareerlyStorage.getTargetCareer();
    const readiness = window.CareerlyStorage.calculateOverallReadiness();

    targetAlert.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <div style="width:36px; height:36px; border-radius:50%; background:var(--primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
        </div>
        <div>
          <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; letter-spacing:0.04em;">CURRENT TARGET CAREER</div>
          <strong style="font-size:1.1rem; color:var(--text-main);">${currentTarget.title}</strong>
          <span style="font-size:0.88rem; color:var(--text-muted); margin-left:8px;">(${readiness.overallScore}% Ready)</span>
        </div>
      </div>
      <div style="display:flex; gap:0.5rem;">
        <a href="skill-gap.html" class="btn btn-primary btn-sm">Skill Gap Analysis</a>
        <a href="roadmap.html" class="btn btn-secondary btn-sm">View Roadmap</a>
      </div>
    `;
  }

  // Filter & Sort Logic
  function getFilteredCareers() {
    let list = [...careers];

    // 1. Category Filter
    if (currentCategory !== "all") {
      list = list.filter(c => c.categoryKey === currentCategory);
    }

    // 2. Keyword Search
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      list = list.filter(c => {
        const titleMatch = c.title.toLowerCase().includes(q);
        const descMatch = c.tagline.toLowerCase().includes(q) || c.overview.toLowerCase().includes(q);
        const toolsMatch = c.tools.some(t => t.toLowerCase().includes(q));
        const skillsMatch = c.skills.some(s => s.name.toLowerCase().includes(q));
        return titleMatch || descMatch || toolsMatch || skillsMatch;
      });
    }

    // 3. Sorting
    if (currentSort === "growth") {
      list.sort((a, b) => {
        const numA = parseInt(a.projectedGrowth.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.projectedGrowth.replace(/\D/g, '')) || 0;
        return numB - numA;
      });
    } else if (currentSort === "salary") {
      list.sort((a, b) => {
        const numA = parseInt(a.salaryRange.split('-')[1]?.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.salaryRange.split('-')[1]?.replace(/\D/g, '')) || 0;
        return numB - numA;
      });
    } else if (currentSort === "difficulty") {
      const order = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
      list.sort((a, b) => (order[a.difficulty] || 2) - (order[b.difficulty] || 2));
    }

    return list;
  }

  // Render Careers Cards
  function renderCareers() {
    const list = getFilteredCareers();
    const currentTargetId = window.CareerlyStorage ? window.CareerlyStorage.getTargetCareerId() : null;
    const assessmentResults = window.CareerlyStorage ? window.CareerlyStorage.getAssessmentResults() : null;

    if (list.length === 0) {
      gridContainer.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    gridContainer.style.display = "grid";
    emptyState.style.display = "none";

    gridContainer.innerHTML = list.map(c => {
      const isTarget = c.id === currentTargetId;
      
      // Check if assessment gave a match percentage for this career
      let matchBadge = "";
      if (assessmentResults && assessmentResults.allRanked) {
        const match = assessmentResults.allRanked.find(r => r.careerId === c.id);
        if (match) {
          matchBadge = `<span class="badge badge-primary" style="font-weight:800;">${match.matchPercentage}% Match</span>`;
        }
      }

      return `
        <div class="card card-interactive animate-fade-in" style="display:flex; flex-direction:column; justify-content:space-between; ${isTarget ? 'border: 2px solid var(--primary);' : ''}">
          <div>
            <!-- Card Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; gap:0.5rem;">
              <span class="badge badge-secondary">${c.category}</span>
              <div style="display:flex; gap:0.35rem; align-items:center;">
                ${matchBadge}
                ${isTarget ? '<span class="badge badge-success">Target</span>' : ''}
              </div>
            </div>

            <!-- Role Title & Tagline -->
            <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color:var(--text-main);">${c.title}</h3>
            <p style="font-size:0.9rem; line-height:1.5; margin-bottom:1.25rem; color:var(--text-muted);">${c.tagline}</p>

            <!-- Key Metrics -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; padding:0.75rem 1rem; background:var(--bg-subtle); border-radius:var(--radius-sm); margin-bottom:1.25rem;">
              <div>
                <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Salary Range</div>
                <strong style="font-size:0.92rem; color:var(--text-main);">${c.salaryRange.split('/')[0]}</strong>
              </div>
              <div>
                <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Job Growth</div>
                <strong style="font-size:0.92rem; color:var(--success);">${c.projectedGrowth.split(' ')[0]}</strong>
              </div>
            </div>

            <!-- Core Tools Stack -->
            <div style="margin-bottom:1.5rem;">
              <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">Tools &amp; Stack</div>
              <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                ${c.tools.slice(0, 5).map(t => `<span style="font-size:0.75rem; padding:0.2rem 0.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:4px;">${t}</span>`).join('')}
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div style="display:flex; flex-direction:column; gap:0.6rem; border-top:1px solid var(--border-color); padding-top:1.2rem;">
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="openCareerModal('${c.id}')">
                Role Details
              </button>
              <button class="btn btn-primary btn-sm" style="flex:1;" onclick="setTargetCareer('${c.id}')">
                ${isTarget ? '✓ Selected' : 'Set as Target'}
              </button>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <a href="skill-gap.html?career=${c.id}" class="btn btn-outline btn-sm" style="flex:1; text-align:center;">
                Skill Gap
              </a>
              <a href="roadmap.html?career=${c.id}" class="btn btn-outline btn-sm" style="flex:1; text-align:center;">
                Roadmap
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open Modal Details
  window.openCareerModal = (careerId) => {
    const c = careers.find(item => item.id === careerId);
    if (!c) return;

    modalCategoryBadge.textContent = c.category;

    modalBody.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h2 style="font-size:1.75rem; margin-bottom:0.5rem; color:var(--text-main);">${c.title}</h2>
        <p style="font-size:1.05rem; color:var(--text-muted); line-height:1.6;">${c.overview}</p>
      </div>

      <!-- Quick Stats Band -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:1rem; padding:1.25rem; background:var(--bg-subtle); border-radius:var(--radius-md); margin-bottom:1.75rem;">
        <div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">SALARY BAND</div>
          <strong style="font-size:1.05rem; color:var(--text-main);">${c.salaryRange}</strong>
        </div>
        <div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">INDUSTRY GROWTH</div>
          <strong style="font-size:1.05rem; color:var(--success);">${c.projectedGrowth}</strong>
        </div>
        <div>
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">COMPLEXITY LEVEL</div>
          <strong style="font-size:1.05rem; color:var(--text-main);">${c.difficulty}</strong>
        </div>
      </div>

      <!-- Daily Responsibilities -->
      <div style="margin-bottom:1.75rem;">
        <h4 style="font-size:1.1rem; margin-bottom:0.75rem; color:var(--text-main);">Typical Responsibilities</h4>
        <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.4rem; color:var(--text-main); font-size:0.92rem;">
          ${c.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <!-- Required Core Skills & Benchmarks -->
      <div style="margin-bottom:1.75rem;">
        <h4 style="font-size:1.1rem; margin-bottom:0.75rem; color:var(--text-main);">Required Core Competencies</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          ${c.skills.map(s => `
            <div style="padding:0.75rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-sm);">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.35rem;">
                <span style="font-weight:600; color:var(--text-main);">${s.name}</span>
                <span style="font-weight:700; color:var(--primary);">${s.benchmark}%</span>
              </div>
              <div class="progress-bar-container" style="height:6px;">
                <div class="progress-bar-fill" style="width:${s.benchmark}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Career Progression Ladder -->
      <div style="margin-bottom:2rem;">
        <h4 style="font-size:1.1rem; margin-bottom:0.75rem; color:var(--text-main);">Career Ladder &amp; Compensation Progression</h4>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          ${c.progression.map((p, idx) => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:${idx === 0 ? 'var(--primary-light)' : 'var(--bg-surface)'};">
              <div>
                <strong style="color:var(--text-main); font-size:0.92rem;">${p.role}</strong>
                <span style="font-size:0.82rem; color:var(--text-muted); margin-left:8px;">${p.exp}</span>
              </div>
              <span style="font-weight:700; color:var(--primary); font-size:0.95rem;">${p.salary}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Modal Actions -->
      <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
        <button class="btn btn-secondary" onclick="closeCareerModal()">Close</button>
        <button class="btn btn-primary" onclick="setTargetCareer('${c.id}'); closeCareerModal();">
          Set as My Target Career
        </button>
      </div>
    `;

    modal.classList.add("active");
  };

  window.closeCareerModal = () => {
    modal.classList.remove("active");
  };

  modalClose.addEventListener("click", window.closeCareerModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) window.closeCareerModal();
  });

  // Set Target Career handler
  window.setTargetCareer = (careerId) => {
    if (window.CareerlyStorage) {
      window.CareerlyStorage.setTargetCareer(careerId);
      window.showToast("Target career updated!", "success");
      updateTargetBanner();
      renderCareers();
    }
  };

  // Event Listeners
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderCareers();
  });

  categoryFilter.addEventListener("change", (e) => {
    currentCategory = e.target.value;
    updatePillsActive();
    renderCareers();
  });

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderCareers();
  });

  // Pills Click
  pillsContainer.querySelectorAll(".pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCategory = btn.getAttribute("data-cat");
      categoryFilter.value = currentCategory;
      updatePillsActive();
      renderCareers();
    });
  });

  function updatePillsActive() {
    pillsContainer.querySelectorAll(".pill-btn").forEach(btn => {
      const cat = btn.getAttribute("data-cat");
      if (cat === currentCategory) {
        btn.className = "badge badge-primary pill-btn active";
        btn.style.background = "";
        btn.style.color = "";
      } else {
        btn.className = "badge pill-btn";
        btn.style.background = "var(--bg-subtle)";
        btn.style.color = "var(--text-main)";
      }
    });
  }

  resetFiltersBtn.addEventListener("click", () => {
    currentSearch = "";
    currentCategory = "all";
    currentSort = "featured";
    searchInput.value = "";
    categoryFilter.value = "all";
    sortSelect.value = "featured";
    updatePillsActive();
    renderCareers();
  });

  // Initial Load
  updateTargetBanner();
  renderCareers();
});
