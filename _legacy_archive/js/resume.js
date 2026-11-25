/**
 * CAREERLY - Resume Improvement & Audit Controller
 * 32 ATS criteria checklist, dynamic score calculation, improvement suggestions, and live resume preview.
 */

document.addEventListener("DOMContentLoaded", () => {
  const criteria = window.RESUME_CRITERIA || [];
  const checklistContainer = document.getElementById("checklist-categories-container");
  const suggestionsContainer = document.getElementById("top-suggestions-container");

  const scoreNumber = document.getElementById("resume-score-number");
  const gaugeCircle = document.getElementById("resume-gauge-circle");
  const gradeText = document.getElementById("resume-grade-text");
  const summaryText = document.getElementById("resume-summary-text");

  const tabAudit = document.getElementById("view-tab-audit");
  const tabPreview = document.getElementById("view-tab-preview");
  const sectionAudit = document.getElementById("section-audit-view");
  const sectionPreview = document.getElementById("section-preview-view");

  const checkAllBtn = document.getElementById("check-all-btn");
  const resetBtn = document.getElementById("reset-checklist-btn");
  const copyPlainTextBtn = document.getElementById("copy-plain-text-btn");
  const printBtn = document.getElementById("print-resume-btn");

  // Tab Switching
  tabAudit.addEventListener("click", () => {
    tabAudit.className = "btn btn-sm btn-primary";
    tabPreview.className = "btn btn-sm btn-secondary";
    sectionAudit.style.display = "block";
    sectionPreview.style.display = "none";
  });

  tabPreview.addEventListener("click", () => {
    tabPreview.className = "btn btn-sm btn-primary";
    tabAudit.className = "btn btn-sm btn-secondary";
    sectionPreview.style.display = "block";
    sectionAudit.style.display = "none";
    renderResumeDocument();
  });

  // Calculate & Update Metrics
  function updateScoreDisplay() {
    const metrics = window.CareerlyStorage ? window.CareerlyStorage.calculateResumeScore() : { score: 0, grade: "Needs Attention", checkedCount: 0, topSuggestions: [] };

    scoreNumber.textContent = `${metrics.score}%`;
    gradeText.textContent = metrics.grade;
    gradeText.style.color = metrics.gradeColor;

    // Circumference of radius 42 is 263.89
    const circumference = 264;
    const offset = circumference - (metrics.score / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;
    gaugeCircle.style.stroke = metrics.gradeColor;

    summaryText.textContent = `${metrics.checkedCount} of 32 industry ATS requirements satisfied. ${metrics.score >= 90 ? 'Your resume is primed to beat automated filters.' : 'Fix remaining high-weight gaps to boost recruiter callbacks.'}`;

    // Render Suggestions
    renderTopSuggestions(metrics.topSuggestions);
  }

  // Render Categorized Checklist
  function renderChecklist() {
    const checked = window.CareerlyStorage ? window.CareerlyStorage.getResumeChecklist() : {};

    checklistContainer.innerHTML = criteria.map(cat => {
      return `
        <div class="card" style="padding: 1.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.15rem; color: var(--text-main);">${cat.category}</h3>
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">
              ${cat.items.filter(i => checked[i.id]).length} / ${cat.items.length} Checked
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${cat.items.map(item => {
              const isChecked = !!checked[item.id];
              return `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 1rem; background: ${isChecked ? 'var(--primary-light)' : 'var(--bg-subtle)'}; border-radius: var(--radius-sm); border: 1px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}; transition: all 0.2s;">
                  <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''} 
                         style="width: 18px; height: 18px; margin-top: 3px; accent-color: var(--primary); cursor: pointer;"
                         onchange="handleCheckToggle('${item.id}')">
                  <label for="${item.id}" style="cursor: pointer; flex: 1; font-size: 0.92rem; color: var(--text-main); ${isChecked ? 'font-weight: 500;' : ''}">
                    ${item.text}
                  </label>
                  <span class="badge ${item.weight >= 4 ? 'badge-primary' : 'badge-secondary'}" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; flex-shrink: 0;">
                    +${item.weight} pts
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    updateScoreDisplay();
  }

  // Handle Item Toggle
  window.handleCheckToggle = (itemId) => {
    if (window.CareerlyStorage) {
      const isNowChecked = window.CareerlyStorage.toggleResumeItem(itemId);
      if (isNowChecked) {
        window.showToast("Requirement checked! Score boosted.", "success", 1800);
      }
      renderChecklist();
    }
  };

  // Render Top Suggestions
  function renderTopSuggestions(suggestions) {
    if (!suggestions || suggestions.length === 0) {
      suggestionsContainer.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; background: var(--success-light); border-radius: var(--radius-md); border: 1px solid var(--success);">
          <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">✨</div>
          <strong style="color: var(--success); font-size: 0.95rem;">100% Audit Requirements Met!</strong>
          <p style="font-size: 0.82rem; color: var(--text-main); margin-top: 0.25rem;">Your resume meets top-tier tech recruiting benchmarks.</p>
        </div>
      `;
      return;
    }

    suggestionsContainer.innerHTML = suggestions.map(sug => `
      <div style="padding: 0.85rem 1rem; background: var(--bg-subtle); border-radius: var(--radius-sm); border-left: 3px solid var(--warning); display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
        <div>
          <strong style="font-size: 0.88rem; color: var(--text-main); display: block; margin-bottom: 0.2rem;">${sug.text}</strong>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Impact: High (+${sug.weight}% Score Boost)</span>
        </div>
        <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.3rem 0.6rem; flex-shrink: 0;" onclick="handleCheckToggle('${sug.id}')">
          Check
        </button>
      </div>
    `).join('');
  }

  // Check All / Reset Buttons
  checkAllBtn.addEventListener("click", () => {
    if (window.CareerlyStorage) {
      const allChecked = {};
      criteria.forEach(cat => {
        cat.items.forEach(item => {
          allChecked[item.id] = true;
        });
      });
      localStorage.setItem(window.CareerlyStorage.STORAGE_KEYS.RESUME_CHECKLIST, JSON.stringify(allChecked));
      window.CareerlyStorage.notify("resume-checklist-updated", allChecked);
      window.showToast("All 32 criteria marked as completed!", "success");
      renderChecklist();
    }
  });

  resetBtn.addEventListener("click", () => {
    window.showConfirmModal({
      title: "Reset Resume Checklist?",
      message: "Are you sure you want to reset all resume checklist items?",
      confirmText: "Reset",
      onConfirm: () => {
        if (window.CareerlyStorage) {
          localStorage.setItem(window.CareerlyStorage.STORAGE_KEYS.RESUME_CHECKLIST, JSON.stringify({}));
          window.CareerlyStorage.notify("resume-checklist-updated", {});
          window.showToast("Resume checklist reset", "warning");
          renderChecklist();
        }
      }
    });
  });

  // Render Document in Preview Tab
  function renderResumeDocument() {
    const draft = window.CareerlyStorage ? window.CareerlyStorage.getResumeDraft() : {};
    const targetCareer = window.CareerlyStorage ? window.CareerlyStorage.getTargetCareer() : { title: "Software Engineer" };

    const docFullname = document.getElementById("doc-fullname");
    const docJobtitle = document.getElementById("doc-jobtitle");
    const docSummary = document.getElementById("doc-summary");
    const docSkills = document.getElementById("doc-skills");
    const docProjects = document.getElementById("doc-projects-list");

    if (docFullname) docFullname.textContent = draft.fullName || "Alex Morgan";
    if (docJobtitle) docJobtitle.textContent = draft.jobTitle || targetCareer.title;
    if (docSummary) docSummary.textContent = draft.summary || "";
    if (docSkills) docSkills.innerHTML = `<strong>Core Skills:</strong> ${draft.skillsTechnical || ""}`;

    if (docProjects && draft.projects) {
      docProjects.innerHTML = draft.projects.map(proj => `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
            <strong style="font-size: 0.95rem; color: #0F172A;">${proj.name}</strong>
            <span style="font-size: 0.8rem; color: #4F46E5; font-weight: 600;">${proj.demoUrl} • ${proj.githubUrl}</span>
          </div>
          <div style="font-size: 0.82rem; color: #475569; font-style: italic; margin-bottom: 0.35rem;">
            Stack: ${proj.stack}
          </div>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: #1E293B; display: flex; flex-direction: column; gap: 0.3rem;">
            ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `).join('');
    }
  }

  // Copy Plain Text for ATS Applications
  copyPlainTextBtn.addEventListener("click", () => {
    const draft = window.CareerlyStorage ? window.CareerlyStorage.getResumeDraft() : {};
    const plainText = `
${draft.fullName || "Alex Morgan"}
${draft.jobTitle || "Full-Stack Software Engineer"}
Email: ${draft.email} | Phone: ${draft.phone} | Location: ${draft.location}
LinkedIn: ${draft.linkedin} | GitHub: ${draft.github}

PROFESSIONAL SUMMARY
${draft.summary}

TECHNICAL COMPETENCIES
${draft.skillsTechnical}

FEATURED PROJECTS
${draft.projects ? draft.projects.map(p => `
* ${p.name} (${p.stack})
  Demo: ${p.demoUrl} | GitHub: ${p.githubUrl}
  ${p.bullets.map(b => `- ${b}`).join('\n  ')}
`).join('\n') : ''}

EDUCATION & CREDENTIALS
${draft.education}
    `.trim();

    navigator.clipboard.writeText(plainText).then(() => {
      window.showToast("Plain text resume copied to clipboard!", "success");
    }).catch(() => {
      window.showToast("Failed to copy automatically. Please select text.", "warning");
    });
  });

  // Print / Save PDF
  printBtn.addEventListener("click", () => {
    window.print();
  });

  // Initial Load
  renderChecklist();
});
