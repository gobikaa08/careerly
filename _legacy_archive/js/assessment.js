/**
 * CAREERLY - Career Assessment Controller
 * Multi-step interactive questionnaire, client-side validation, rule-based recommendation logic.
 */

document.addEventListener("DOMContentLoaded", () => {
  const questions = window.ASSESSMENT_QUESTIONS || [];
  let currentStep = 0;
  const answers = window.CareerlyStorage ? window.CareerlyStorage.getAssessmentAnswers() : {};

  // Check if assessment was previously completed
  const existingResults = window.CareerlyStorage ? window.CareerlyStorage.getAssessmentResults() : null;

  const stepperView = document.getElementById("assessment-stepper-view");
  const resultsView = document.getElementById("assessment-results-view");
  const questionContainer = document.getElementById("question-container");
  const backBtn = document.getElementById("assessment-back-btn");
  const nextBtn = document.getElementById("assessment-next-btn");
  const clearBtn = document.getElementById("assessment-clear-btn");
  const phaseBadge = document.getElementById("assessment-phase-badge");
  const stepCounter = document.getElementById("assessment-step-counter");
  const percentText = document.getElementById("assessment-percent-text");
  const progressBar = document.getElementById("assessment-progress-bar");

  // If user already took it and visits page, show results with option to retake
  if (existingResults && Object.keys(answers).length >= questions.length) {
    renderResults(existingResults);
    return;
  }

  // Render current question
  function renderQuestion(stepIndex) {
    const q = questions[stepIndex];
    if (!q) return;

    // Update Progress header
    const currentNum = stepIndex + 1;
    const total = questions.length;
    const pct = Math.round((currentNum / total) * 100);

    phaseBadge.textContent = q.phase;
    stepCounter.textContent = `Question ${currentNum} of ${total}`;
    percentText.textContent = `${pct}%`;
    progressBar.style.width = `${pct}%`;

    // Back button state
    backBtn.disabled = stepIndex === 0;

    // Next button label
    if (stepIndex === questions.length - 1) {
      nextBtn.innerHTML = `Calculate Recommendations <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      nextBtn.innerHTML = `Next Question <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    }

    const currentSelected = answers[q.id];

    // Build question markup
    questionContainer.innerHTML = `
      <div class="animate-fade-in">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-main);">
          ${q.question}
        </h2>
        <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 2rem;">
          ${q.subtitle}
        </p>

        <div style="display: flex; flex-direction: column; gap: 1rem;" id="options-list">
          ${q.options.map(opt => {
            const isSelected = currentSelected === opt.id;
            const iconSvg = window.renderIcon ? window.renderIcon(opt.icon || "star", "", 20) : "";
            return `
              <div class="card option-card" data-opt-id="${opt.id}" style="padding: 1.25rem 1.5rem; border: 2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; background: ${isSelected ? 'var(--primary-light)' : 'var(--bg-surface)'}; cursor: pointer; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="color: ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}; display: flex; align-items: center;">
                    ${iconSvg}
                  </div>
                  <span style="font-size: 0.95rem; font-weight: 500; color: var(--text-main);">
                    ${opt.text}
                  </span>
                </div>
                <div style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}; background: ${isSelected ? 'var(--primary)' : 'transparent'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Attach click listeners to option cards
    document.querySelectorAll(".option-card").forEach(card => {
      card.addEventListener("click", () => {
        const optId = card.getAttribute("data-opt-id");
        answers[q.id] = optId;
        renderQuestion(currentStep);
      });
    });
  }

  // Next / Calculate Button Handler
  nextBtn.addEventListener("click", () => {
    const q = questions[currentStep];
    if (!answers[q.id]) {
      window.showToast("Please choose an option to proceed.", "warning");
      return;
    }

    if (currentStep < questions.length - 1) {
      currentStep++;
      renderQuestion(currentStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished all questions! Run rule-based calculation
      const results = window.CareerlyStorage.calculateAssessmentRecommendations(answers);
      renderResults(results);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Back Button Handler
  backBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      renderQuestion(currentStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Render Results Screen
  function renderResults(results) {
    stepperView.style.display = "none";
    resultsView.style.display = "block";

    const top = results.topRecommendation;
    const secondaries = results.secondaryRecommendations || [];

    resultsView.innerHTML = `
      <div style="text-align: center; margin-bottom: 2.5rem;">
        <div class="badge badge-success" style="margin-bottom: 0.75rem; font-size: 0.85rem; padding: 0.4rem 1rem;">
          ✓ Assessment Completed Successfully
        </div>
        <h2>Your Personalized Career Recommendations</h2>
        <p style="max-width: 620px; margin: 0.5rem auto 0; font-size: 1.05rem;">
          Based on our transparent rule-based algorithm evaluating your technical affinity, cognitive strengths, and goals.
        </p>
      </div>

      <!-- Top Career Recommendation Card (Prominent Hero) -->
      <div class="card" style="border: 2px solid var(--primary); background: var(--bg-surface); box-shadow: var(--shadow-xl); padding: 2.5rem 2rem; margin-bottom: 2.5rem; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; background: var(--primary-gradient); color: #FFFFFF; font-size: 0.75rem; font-weight: 800; padding: 0.35rem 1.25rem; border-bottom-left-radius: 12px; letter-spacing: 0.05em;">
          TOP RECOMMENDATION • ${top.matchPercentage}% MATCH
        </div>

        <div style="display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 280px;">
            <div class="badge badge-primary" style="margin-bottom: 0.5rem;">
              ${top.careerCategory}
            </div>
            <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem; color: var(--text-main);">
              ${top.careerTitle}
            </h3>
            <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--text-muted);">
              ${top.career.overview}
            </p>

            <div style="padding: 1rem 1.25rem; background: var(--primary-light); border-radius: var(--radius-md); border-left: 4px solid var(--primary); margin-bottom: 1.5rem;">
              <strong style="font-size: 0.85rem; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">
                Why This Matches You:
              </strong>
              <span style="font-size: 0.92rem; color: var(--text-main);">
                ${top.reason} You demonstrated high interest in creating complete, usable systems with immediate practical impact.
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; margin-bottom: 1.75rem;">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">AVERAGE SALARY</div>
                <strong style="font-size: 1.05rem; color: var(--text-main);">${top.salaryRange}</strong>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">INDUSTRY GROWTH</div>
                <strong style="font-size: 1.05rem; color: var(--success);">${top.career.projectedGrowth}</strong>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">ENTRY BARRIER</div>
                <strong style="font-size: 1.05rem; color: var(--text-main);">${top.career.difficulty}</strong>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="selectCareerAndNavigate('${top.careerId}', 'skill-gap.html')">
                Set as Target &amp; Analyze Skill Gap
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <button class="btn btn-secondary" onclick="selectCareerAndNavigate('${top.careerId}', 'roadmap.html')">
                View Learning Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Recommendations Section -->
      <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem;">Strong Secondary Matches</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        ${secondaries.map(sec => `
          <div class="card card-interactive" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="badge badge-secondary">${sec.careerCategory}</span>
                <span class="badge badge-primary" style="font-weight: 800;">${sec.matchPercentage}% Match</span>
              </div>
              <h4 style="font-size: 1.2rem; margin-bottom: 0.4rem; color: var(--text-main);">${sec.careerTitle}</h4>
              <p style="font-size: 0.88rem; margin-bottom: 1rem; line-height: 1.5;">${sec.career.tagline}</p>
              
              <div style="font-size: 0.82rem; color: var(--text-muted); padding: 0.75rem; background: var(--bg-subtle); border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
                ${sec.reason}
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="selectCareerAndNavigate('${sec.careerId}', 'skill-gap.html')">
                Skill Gap
              </button>
              <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="selectCareerAndNavigate('${sec.careerId}', 'roadmap.html')">
                Set as Target
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Retake or Navigate Controls -->
      <div style="text-align: center; padding-top: 1.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: center; gap: 1rem;">
        <button class="btn btn-secondary" onclick="retakeAssessment()">
          🔄 Retake Career Assessment
        </button>
        <a href="dashboard.html" class="btn btn-primary">
          Go to Job Readiness Dashboard →
        </a>
      </div>
    `;
  }

  // Retake Assessment handler
  window.retakeAssessment = () => {
    currentStep = 0;
    stepperView.style.display = "block";
    resultsView.style.display = "none";
    renderQuestion(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Career & Navigate handler
  window.selectCareerAndNavigate = (careerId, targetPage) => {
    if (window.CareerlyStorage) {
      window.CareerlyStorage.setTargetCareer(careerId);
      window.showToast("Target career updated!", "success");
    }
    setTimeout(() => {
      window.location.href = targetPage;
    }, 250);
  };

  // Initial render
  renderQuestion(0);
});
