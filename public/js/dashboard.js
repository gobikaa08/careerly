/**
 * CAREERLY - Job Readiness Dashboard Controller
 * Aggregates all user progress, renders charts (Weekly Activity, Skill Radar, Readiness Doughnut),
 * calculates overall readiness, and generates dynamic next actions.
 */

document.addEventListener("DOMContentLoaded", () => {
  const userGreeting = document.getElementById("user-greeting");
  const userHeadline = document.getElementById("user-headline");
  const targetCareerName = document.getElementById("target-career-name");
  const capsuleCareerTitle = document.getElementById("capsule-career-title");
  const capsuleCareerSalary = document.getElementById("capsule-career-salary");

  const gaugeCircle = document.getElementById("dashboard-gauge-circle");
  const readinessNumber = document.getElementById("dashboard-readiness-number");
  const statusLabel = document.getElementById("dashboard-status-label");

  // 4 Pillar Elements
  const pillarAssessmentScore = document.getElementById("pillar-assessment-score");
  const pillarAssessmentDesc = document.getElementById("pillar-assessment-desc");
  const pillarAssessmentBadge = document.getElementById("pillar-assessment-badge");

  const pillarSkillsScore = document.getElementById("pillar-skills-score");
  const pillarSkillsDesc = document.getElementById("pillar-skills-desc");
  const pillarSkillsBadge = document.getElementById("pillar-skills-badge");

  const pillarRoadmapScore = document.getElementById("pillar-roadmap-score");
  const pillarRoadmapDesc = document.getElementById("pillar-roadmap-desc");
  const pillarRoadmapBadge = document.getElementById("pillar-roadmap-badge");

  const pillarResumeScore = document.getElementById("pillar-resume-score");
  const pillarResumeDesc = document.getElementById("pillar-resume-desc");
  const pillarResumeBadge = document.getElementById("pillar-resume-badge");

  // Actions Container
  const nextActionsContainer = document.getElementById("next-actions-container");
  const logHourBtn = document.getElementById("log-hour-btn");

  // Chart Canvases
  const activityCanvas = document.getElementById("weekly-activity-chart");
  const radarCanvas = document.getElementById("dashboard-radar-chart");
  const doughnutCanvas = document.getElementById("readiness-doughnut-chart");

  let activityChart = null;
  let radarChart = null;
  let doughnutChart = null;

  function renderDashboard() {
    if (!window.CareerlyStorage) return;

    const profile = window.CareerlyStorage.getProfile();
    const targetCareer = window.CareerlyStorage.getTargetCareer();
    const readiness = window.CareerlyStorage.calculateOverallReadiness();
    const skillMetrics = readiness.components.skillGap.metrics;
    const roadmapMetrics = readiness.components.roadmap.metrics;
    const resumeMetrics = readiness.components.resume.metrics;
    const assessmentCompleted = readiness.components.assessment.completed;

    // Greeting & Header
    userGreeting.textContent = `Welcome back, ${profile.name || 'Alex'}!`;
    targetCareerName.textContent = targetCareer.title;
    capsuleCareerTitle.textContent = targetCareer.title;
    capsuleCareerSalary.textContent = targetCareer.salaryRange;

    // Overall Readiness Gauge
    const score = readiness.overallScore;
    readinessNumber.textContent = `${score}%`;
    statusLabel.textContent = readiness.readinessStatus;

    // SVG Gauge: circumference of r=42 is 263.89
    const circumference = 264;
    const offset = circumference - (score / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;

    let scoreColor = "var(--primary)";
    if (score >= 85) scoreColor = "var(--success)";
    else if (score >= 60) scoreColor = "var(--primary)";
    else if (score >= 40) scoreColor = "var(--warning)";
    else scoreColor = "var(--danger)";
    gaugeCircle.style.stroke = scoreColor;

    // Pillar 1: Assessment
    pillarAssessmentScore.textContent = assessmentCompleted ? "100%" : "0%";
    pillarAssessmentBadge.textContent = assessmentCompleted ? "Completed" : "Pending";
    pillarAssessmentBadge.className = assessmentCompleted ? "badge badge-success" : "badge badge-warning";
    pillarAssessmentDesc.textContent = assessmentCompleted ? "Evaluation matches computed" : "Take 8-question evaluation";

    // Pillar 2: Skills
    pillarSkillsScore.textContent = `${skillMetrics.overallPercentage}%`;
    pillarSkillsBadge.textContent = `${skillMetrics.masteredCount}/${skillMetrics.totalSkills} Met`;
    pillarSkillsDesc.textContent = `${skillMetrics.gapCount} competencies requiring focus`;

    // Pillar 3: Roadmap
    pillarRoadmapScore.textContent = `${roadmapMetrics.percentage}%`;
    pillarRoadmapBadge.textContent = `${roadmapMetrics.completedCount} Done`;
    pillarRoadmapDesc.textContent = `${roadmapMetrics.completedCount} of ${roadmapMetrics.totalMilestones} milestones checked`;

    // Pillar 4: Resume
    pillarResumeScore.textContent = `${resumeMetrics.score}%`;
    pillarResumeBadge.textContent = resumeMetrics.score >= 80 ? "Interview Ready" : "Audit Needed";
    pillarResumeBadge.className = resumeMetrics.score >= 80 ? "badge badge-success" : "badge badge-warning";
    pillarResumeDesc.textContent = `${resumeMetrics.checkedCount} of 32 criteria verified`;

    // Render Next Best Actions
    renderNextActions(readiness.nextActions);

    // Render Charts
    renderActivityChart();
    renderRadarChart(targetCareer);
    renderDoughnutChart(readiness.components);
  }

  // Render Next Best Actions Widget
  function renderNextActions(actions) {
    if (!actions || actions.length === 0) {
      nextActionsContainer.innerHTML = `
        <div style="padding:1rem; background:var(--success-light); border-radius:var(--radius-md); text-align:center;">
          <strong style="color:var(--success);">All recommended actions completed!</strong>
        </div>
      `;
      return;
    }

    nextActionsContainer.innerHTML = actions.map(act => `
      <div class="card card-interactive" onclick="location.href='${act.link}'" style="padding:1rem; cursor:pointer; background:var(--bg-surface); border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
            <span class="badge badge-primary" style="font-size:0.7rem; padding:0.15rem 0.5rem;">${act.badge}</span>
            <strong style="font-size:0.92rem; color:var(--text-main);">${act.title}</strong>
          </div>
          <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${act.description}</p>
        </div>
        <div style="color:var(--primary); font-size:1.1rem; flex-shrink:0;">
          →
        </div>
      </div>
    `).join('');
  }

  // Render Weekly Study Activity Chart
  function renderActivityChart() {
    if (!activityCanvas) return;
    const activities = window.CareerlyStorage.getStudyActivity();

    const labels = activities.map(a => a.day);
    const data = activities.map(a => a.hours);

    if (activityChart) activityChart.destroy();

    activityChart = new window.Chart(activityCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Study Hours Logged',
          data: data,
          backgroundColor: '#4F46E5',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Render Skill Gap Radar Chart
  function renderRadarChart(targetCareer) {
    if (!radarCanvas) return;
    const userLevels = window.CareerlyStorage.getSkillGapData(targetCareer.id);

    const labels = targetCareer.skills.map(s => s.name);
    const userData = targetCareer.skills.map(s => userLevels[s.id] !== undefined ? userLevels[s.id] : 0);
    const benchmarkData = targetCareer.skills.map(s => s.benchmark || 80);

    if (radarChart) radarChart.destroy();

    radarChart = new window.Chart(radarCanvas, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Your Current Competency',
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
    });
  }

  // Render Readiness Doughnut Chart
  function renderDoughnutChart(components) {
    if (!doughnutCanvas) return;

    if (doughnutChart) doughnutChart.destroy();

    doughnutChart = new window.Chart(doughnutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Assessment (15%)', 'Skill Gap (35%)', 'Roadmap (30%)', 'Resume (20%)'],
        datasets: [{
          data: [
            components.assessment.score * 0.15,
            components.skillGap.score * 0.35,
            components.roadmap.score * 0.30,
            components.resume.score * 0.20
          ],
          backgroundColor: ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Log 1 Study Hour Button
  if (logHourBtn) {
    logHourBtn.addEventListener("click", () => {
      window.CareerlyStorage.logStudyHours(1);
      window.showToast("Logged 1 study hour! Great momentum.", "success", 2000);
      renderDashboard();
    });
  }

  // Initial Load
  renderDashboard();
});
