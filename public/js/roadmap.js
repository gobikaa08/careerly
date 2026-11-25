/**
 * CAREERLY - Learning Roadmap Controller
 * Multi-phase sequential curriculum, interactive checklist milestones, resource links, progress computation.
 */

document.addEventListener("DOMContentLoaded", () => {
  const careers = window.CAREER_DATABASE || [];
  const careerSelect = document.getElementById("roadmap-career-select");
  const roadmapTitle = document.getElementById("roadmap-title");
  const roadmapTagline = document.getElementById("roadmap-tagline");
  const roadmapCategoryBadge = document.getElementById("roadmap-category-badge");
  const phasesContainer = document.getElementById("roadmap-phases-container");
  const overallProgressText = document.getElementById("overall-progress-text");
  const overallProgressBar = document.getElementById("overall-progress-bar");
  const completedCountBadge = document.getElementById("completed-count-badge");
  const filterPills = document.querySelectorAll(".filter-pill");
  const resetBtn = document.getElementById("reset-roadmap-progress-btn");

  const milestoneModal = document.getElementById("milestone-modal");
  const milestoneModalText = document.getElementById("milestone-modal-text");

  let currentFilter = "all";

  // Check URL query param or Storage
  const urlParams = new URLSearchParams(window.location.search);
  const careerParam = urlParams.get("career");
  let selectedCareerId = careerParam || (window.CareerlyStorage ? window.CareerlyStorage.getTargetCareerId() : careers[0].id);

  // Populate Dropdown
  careerSelect.innerHTML = careers.map(c => `
    <option value="${c.id}" ${c.id === selectedCareerId ? 'selected' : ''}>${c.title}</option>
  `).join('');

  careerSelect.addEventListener("change", (e) => {
    selectedCareerId = e.target.value;
    if (window.CareerlyStorage) {
      window.CareerlyStorage.setTargetCareer(selectedCareerId);
    }
    renderRoadmap();
  });

  // Filter Pill Click Handlers
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => {
        p.className = "badge filter-pill";
        p.style.background = "var(--bg-subtle)";
        p.style.color = "var(--text-main)";
      });
      pill.className = "badge badge-primary filter-pill active";
      pill.style.background = "";
      pill.style.color = "";

      currentFilter = pill.getAttribute("data-filter");
      renderRoadmap();
    });
  });

  // Reset Progress Button
  resetBtn.addEventListener("click", () => {
    window.showConfirmModal({
      title: "Reset Roadmap Progress?",
      message: "Are you sure you want to uncheck all milestones for this career track? This cannot be undone.",
      confirmText: "Reset Milestones",
      onConfirm: () => {
        if (window.CareerlyStorage) {
          const parsed = JSON.parse(localStorage.getItem(window.CareerlyStorage.STORAGE_KEYS.ROADMAP) || "{}");
          parsed[selectedCareerId] = [];
          localStorage.setItem(window.CareerlyStorage.STORAGE_KEYS.ROADMAP, JSON.stringify(parsed));
          window.CareerlyStorage.notify("roadmap-progress-updated", { careerId: selectedCareerId, milestones: [] });
          window.showToast("Roadmap progress reset", "warning");
          renderRoadmap();
        }
      }
    });
  });

  function renderRoadmap() {
    const career = careers.find(c => c.id === selectedCareerId) || careers[0];
    const completedList = window.CareerlyStorage ? window.CareerlyStorage.getRoadmapProgress(career.id) : [];

    roadmapTitle.textContent = `${career.title} Roadmap`;
    roadmapTagline.textContent = career.tagline;
    roadmapCategoryBadge.textContent = career.category;

    // Calculate Overall Metrics
    const metrics = window.CareerlyStorage ? window.CareerlyStorage.calculateRoadmapMetrics(career.id) : { completedCount: 0, totalMilestones: 0, percentage: 0 };

    overallProgressText.textContent = `${metrics.percentage}% Mastered`;
    overallProgressBar.style.width = `${metrics.percentage}%`;
    completedCountBadge.textContent = `${metrics.completedCount} of ${metrics.totalMilestones} Milestones`;

    // Render Phases
    phasesContainer.innerHTML = career.roadmapPhases.map((phase, pIdx) => {
      // Calculate Phase Specific Progress
      const phaseMilestoneIds = [
        ...(phase.topics ? phase.topics.map(t => t.id) : []),
        ...(phase.tasks ? phase.tasks.map(t => t.id) : []),
        `project-${phase.id}`
      ];
      const phaseTotal = phaseMilestoneIds.length;
      const phaseCompletedCount = phaseMilestoneIds.filter(id => completedList.includes(id)).length;
      const phasePct = phaseTotal > 0 ? Math.round((phaseCompletedCount / phaseTotal) * 100) : 0;
      const isPhaseComplete = phasePct === 100;

      // Filter topics based on active filter
      let visibleTopics = phase.topics || [];
      if (currentFilter === "completed") {
        visibleTopics = visibleTopics.filter(t => completedList.includes(t.id));
      } else if (currentFilter === "incomplete") {
        visibleTopics = visibleTopics.filter(t => !completedList.includes(t.id));
      }

      return `
        <div class="card timeline-phase animate-fade-in" style="border-left: 4px solid ${isPhaseComplete ? 'var(--success)' : 'var(--primary)'}; padding: 2rem;">
          
          <!-- Phase Header -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <span class="badge ${isPhaseComplete ? 'badge-success' : 'badge-primary'}">${phase.timeline}</span>
                ${isPhaseComplete ? '<span class="badge badge-success">✓ 100% Phase Mastered</span>' : ''}
              </div>
              <h2 style="font-size:1.45rem; color:var(--text-main);">${phase.title}</h2>
              <p style="font-size:0.92rem; color:var(--text-muted); margin-top:0.35rem; max-width:680px;">${phase.description}</p>
            </div>

            <!-- Phase Progress Pill -->
            <div style="min-width:140px; text-align:right;">
              <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:0.35rem;">
                Phase Mastery: <strong style="color:var(--text-main);">${phasePct}%</strong>
              </div>
              <div class="progress-bar-container" style="height:8px;">
                <div class="progress-bar-fill ${isPhaseComplete ? 'success' : ''}" style="width:${phasePct}%;"></div>
              </div>
            </div>
          </div>

          <!-- Section 1: Topics & Curated Documentation -->
          <div style="margin-bottom:1.75rem;">
            <h4 style="font-size:1rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.04em; margin-bottom:0.75rem;">
              Core Topics &amp; Official References
            </h4>
            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              ${visibleTopics.map(topic => {
                const isChecked = completedList.includes(topic.id);
                return `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.15rem; background:${isChecked ? 'var(--primary-light)' : 'var(--bg-subtle)'}; border-radius:var(--radius-md); border:1px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}; transition:all 0.2s;">
                    <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer; flex:1;">
                      <input type="checkbox" ${isChecked ? 'checked' : ''} 
                             style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;"
                             onchange="toggleMilestone('${career.id}', '${topic.id}', '${phase.title}')">
                      <span style="font-size:0.95rem; font-weight:500; color:var(--text-main); ${isChecked ? 'text-decoration:line-through; opacity:0.8;' : ''}">
                        ${topic.title}
                      </span>
                    </label>

                    ${topic.resourceUrl ? `
                      <a href="${topic.resourceUrl}" target="_blank" rel="noopener noreferrer" 
                         style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.82rem; font-weight:600; color:var(--primary); margin-left:1rem; white-space:nowrap;"
                         title="Open Documentation">
                        Docs <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>
                      </a>
                    ` : ''}
                  </div>
                `;
              }).join('')}
              ${visibleTopics.length === 0 ? '<div style="font-size:0.88rem; color:var(--text-muted); padding:0.5rem 0;">No topics matching current filter.</div>' : ''}
            </div>
          </div>

          <!-- Section 2: Practical Exercises / Tasks -->
          ${phase.tasks && phase.tasks.length > 0 ? `
            <div style="margin-bottom:1.75rem;">
              <h4 style="font-size:1rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.04em; margin-bottom:0.75rem;">
                Hands-On Practice Drills
              </h4>
              <div style="display:flex; flex-direction:column; gap:0.6rem;">
                ${phase.tasks.map(task => {
                  const isChecked = completedList.includes(task.id);
                  return `
                    <div style="display:flex; align-items:center; padding:0.75rem 1rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                      <label style="display:flex; align-items:center; gap:0.75rem; cursor:pointer; width:100%;">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} 
                               style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;"
                               onchange="toggleMilestone('${career.id}', '${task.id}', '${phase.title}')">
                        <span style="font-size:0.9rem; color:var(--text-main); ${isChecked ? 'text-decoration:line-through; opacity:0.7;' : ''}">
                          ${task.title}
                        </span>
                      </label>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Section 3: Recommended Capstone Project for Phase -->
          ${phase.project ? `
            <div style="padding:1.25rem; background:var(--primary-light); border:1px solid var(--border-focus); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="width:36px; height:36px; border-radius:8px; background:var(--primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
                  🚀
                </div>
                <div>
                  <div style="font-size:0.75rem; font-weight:700; color:var(--primary); text-transform:uppercase;">Phase Capstone Deliverable</div>
                  <strong style="font-size:0.95rem; color:var(--text-main);">${phase.project}</strong>
                </div>
              </div>

              <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                <input type="checkbox" ${completedList.includes(`project-${phase.id}`) ? 'checked' : ''}
                       style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;"
                       onchange="toggleMilestone('${career.id}', 'project-${phase.id}', '${phase.title}')">
                <span style="font-size:0.88rem; font-weight:600; color:var(--primary);">Completed &amp; Deployed</span>
              </label>
            </div>
          ` : ''}

        </div>
      `;
    }).join('');
  }

  // Toggle milestone handler
  window.toggleMilestone = (careerId, milestoneId, phaseTitle) => {
    if (window.CareerlyStorage) {
      const updatedList = window.CareerlyStorage.toggleRoadmapMilestone(careerId, milestoneId);
      const isNowChecked = updatedList.includes(milestoneId);

      if (isNowChecked) {
        window.showToast("Milestone completed! +1 to roadmap score", "success", 2000);
      }

      // Check if phase is newly completed
      const career = careers.find(c => c.id === careerId);
      if (career) {
        const targetPhase = career.roadmapPhases.find(p => p.title === phaseTitle);
        if (targetPhase) {
          const allPhaseIds = [
            ...(targetPhase.topics ? targetPhase.topics.map(t => t.id) : []),
            ...(targetPhase.tasks ? targetPhase.tasks.map(t => t.id) : []),
            `project-${targetPhase.id}`
          ];
          const allCompleted = allPhaseIds.every(id => updatedList.includes(id));
          if (allCompleted && isNowChecked) {
            milestoneModalText.textContent = `Brilliant work! You completed all topics and deliverables for "${phaseTitle}". Your job readiness score has increased.`;
            milestoneModal.classList.add("active");
          }
        }
      }

      renderRoadmap();
    }
  };

  // Initial render
  renderRoadmap();
});
