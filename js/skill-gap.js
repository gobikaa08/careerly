/**
 * CAREERLY - Skill Gap Analysis Controller
 * Interactive proficiency matrix, benchmark comparisons, dynamic radar charts, priority recommendations.
 */

document.addEventListener("DOMContentLoaded", () => {
  const careers = window.CAREER_DATABASE || [];
  const careerSelect = document.getElementById("target-career-select");
  const matrixContainer = document.getElementById("skills-matrix-container");
  const radarCanvas = document.getElementById("skill-gap-radar-canvas");
  const priorityContainer = document.getElementById("priority-gaps-container");

  const metricReadinessBadge = document.getElementById("metric-readiness-badge");
  const metricReadinessLabel = document.getElementById("metric-readiness-label");
  const metricMasteredCount = document.getElementById("metric-mastered-count");
  const metricMasteredLabel = document.getElementById("metric-mastered-label");
  const metricGapsCount = document.getElementById("metric-gaps-count");
  const metricGapsLabel = document.getElementById("metric-gaps-label");
  const goToRoadmapBtn = document.getElementById("go-to-roadmap-btn");

  const presetBeginnerBtn = document.getElementById("preset-beginner-btn");
  const presetIntermediateBtn = document.getElementById("preset-intermediate-btn");

  let radarChartInstance = null;

  // Determine current career from URL param or LocalStorage
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
    renderSkillGapView();
  });

  // Level selector metadata
  const LEVELS = [
    { label: "None", value: 0 },
    { label: "Beginner", value: 25 },
    { label: "Intermed.", value: 50 },
    { label: "Advanced", value: 75 },
    { label: "Expert", value: 100 }
  ];

  function renderSkillGapView() {
    const career = careers.find(c => c.id === selectedCareerId) || careers[0];
    const userLevels = window.CareerlyStorage ? window.CareerlyStorage.getSkillGapData(career.id) : {};
    const metrics = window.CareerlyStorage ? window.CareerlyStorage.calculateSkillGapMetrics(career.id) : { overallPercentage: 0, masteredCount: 0, gapCount: 0, criticalGaps: [] };

    // Update Top Summary Cards
    metricReadinessBadge.textContent = `${metrics.overallPercentage}%`;
    metricReadinessLabel.textContent = `${metrics.overallPercentage}% Match`;

    metricMasteredCount.textContent = metrics.masteredCount;
    metricMasteredLabel.textContent = `${metrics.masteredCount} of ${career.skills.length} Met`;

    metricGapsCount.textContent = metrics.gapCount;
    metricGapsLabel.textContent = `${metrics.gapCount} Need Practice`;

    if (goToRoadmapBtn) {
      goToRoadmapBtn.href = `roadmap.html?career=${career.id}`;
    }

    // Render Skill Rows Matrix
    matrixContainer.innerHTML = career.skills.map(skill => {
      const benchmark = skill.benchmark || 80;
      const currentVal = userLevels[skill.id] !== undefined ? userLevels[skill.id] : 0;
      const isMastered = currentVal >= benchmark;
      const gap = benchmark - currentVal;

      let statusBadge = `<span class="badge badge-warning" style="font-size:0.75rem;">Gap: -${gap}%</span>`;
      if (isMastered) {
        statusBadge = `<span class="badge badge-success" style="font-size:0.75rem;">✓ Benchmark Met</span>`;
      } else if (currentVal === 0) {
        statusBadge = `<span class="badge badge-danger" style="font-size:0.75rem;">Not Started</span>`;
      }

      return `
        <div class="card" style="padding: 1.25rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <strong style="color: var(--text-main); font-size: 0.98rem;">${skill.name}</strong>
                <span class="badge badge-secondary" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;">${skill.category}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
                Target Benchmark: <strong style="color: var(--secondary);">${benchmark}%</strong> • Your Level: <strong style="color: var(--primary);">${currentVal}%</strong>
              </div>
            </div>
            <div>${statusBadge}</div>
          </div>

          <!-- Dual Visual Comparison Bar -->
          <div style="position: relative; height: 10px; background: var(--bg-subtle); border-radius: var(--radius-full); margin-bottom: 1rem; overflow: hidden;">
            <!-- Benchmark Marker Line -->
            <div style="position: absolute; left: ${benchmark}%; top: 0; bottom: 0; width: 3px; background: var(--secondary); z-index: 2;" title="Target Benchmark: ${benchmark}%"></div>
            <!-- User Progress Bar Fill -->
            <div style="height: 100%; width: ${currentVal}%; background: ${isMastered ? 'var(--success)' : 'var(--primary-gradient)'}; border-radius: var(--radius-full); transition: width 0.3s ease;"></div>
          </div>

          <!-- Interactive Level Selector Buttons -->
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${LEVELS.map(lvl => {
              const active = currentVal === lvl.value;
              return `
                <button class="btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}" 
                        style="padding: 0.35rem 0.75rem; font-size: 0.78rem; flex: 1; min-width: 65px;" 
                        onclick="setSkillLevel('${career.id}', '${skill.id}', ${lvl.value})">
                  ${lvl.label} (${lvl.value}%)
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Render Priority Actions Column
    renderPriorityGaps(metrics.criticalGaps, career);

    // Render Radar Chart
    renderRadarChart(career, userLevels);
  }

  // Set Skill Level Handler
  window.setSkillLevel = (careerId, skillId, levelValue) => {
    if (window.CareerlyStorage) {
      window.CareerlyStorage.saveSkillLevel(careerId, skillId, levelValue);
      renderSkillGapView();
    }
  };

  // Render Priority Gaps List
  function renderPriorityGaps(criticalGaps, career) {
    if (!criticalGaps || criticalGaps.length === 0) {
      priorityContainer.innerHTML = `
        <div style="text-align: center; padding: 1.5rem 1rem; background: var(--success-light); border-radius: var(--radius-md); border: 1px solid var(--success);">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">🎉</div>
          <strong style="color: var(--success); font-size: 0.95rem;">All Core Benchmarks Met!</strong>
          <p style="font-size: 0.82rem; color: var(--text-main); margin-top: 0.25rem;">You are primed for production roadmap projects and interview audits.</p>
        </div>
      `;
      return;
    }

    priorityContainer.innerHTML = criticalGaps.map((item, idx) => `
      <div style="padding: 0.85rem 1rem; background: var(--bg-subtle); border-radius: var(--radius-sm); border-left: 3px solid var(--warning); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--warning); text-transform: uppercase;">Priority #${idx + 1} Deficit</div>
          <strong style="font-size: 0.92rem; color: var(--text-main);">${item.skill.name}</strong>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${item.skill.category}</div>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-warning" style="font-size: 0.78rem;">-${item.gap}%</span>
        </div>
      </div>
    `).join('');
  }

  // Render Radar Chart with Chart.js
  function renderRadarChart(career, userLevels) {
    if (!radarCanvas) return;

    const labels = career.skills.map(s => s.name);
    const userData = career.skills.map(s => userLevels[s.id] !== undefined ? userLevels[s.id] : 0);
    const benchmarkData = career.skills.map(s => s.benchmark || 80);

    if (radarChartInstance) {
      radarChartInstance.destroy();
    }

    const config = {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Your Current Level',
            data: userData,
            backgroundColor: 'rgba(79, 70, 229, 0.25)',
            borderColor: '#4F46E5',
            pointBackgroundColor: '#4F46E5'
          },
          {
            label: 'Target Benchmark',
            data: benchmarkData,
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
            borderColor: '#8B5CF6',
            borderDash: [4, 4]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };

    radarChartInstance = new window.Chart(radarCanvas, config);
  }

  // Quick Preset Handlers for Rapid Testing
  presetBeginnerBtn.addEventListener("click", () => {
    const career = careers.find(c => c.id === selectedCareerId) || careers[0];
    career.skills.forEach(s => {
      window.CareerlyStorage.saveSkillLevel(career.id, s.id, 25);
    });
    window.showToast("All competencies set to Beginner (25%)", "success");
    renderSkillGapView();
  });

  presetIntermediateBtn.addEventListener("click", () => {
    const career = careers.find(c => c.id === selectedCareerId) || careers[0];
    career.skills.forEach(s => {
      window.CareerlyStorage.saveSkillLevel(career.id, s.id, 50);
    });
    window.showToast("All competencies set to Intermediate (50%)", "success");
    renderSkillGapView();
  });

  // Initial Load
  renderSkillGapView();
});
