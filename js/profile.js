/**
 * CAREERLY - Profile & Settings Controller
 * Handles user profile updates, learning preference configurations, theme toggling,
 * JSON data export/import, and confirmation-guarded data resets.
 */

document.addEventListener("DOMContentLoaded", () => {
  const careers = window.CAREER_DATABASE || [];

  // Form Elements
  const profileForm = document.getElementById("profile-form");
  const preferencesForm = document.getElementById("preferences-form");

  const nameInput = document.getElementById("profile-name");
  const headlineInput = document.getElementById("profile-headline");
  const emailInput = document.getElementById("profile-email");
  const phoneInput = document.getElementById("profile-phone");
  const locationInput = document.getElementById("profile-location");
  const linkedinInput = document.getElementById("profile-linkedin");
  const githubInput = document.getElementById("profile-github");
  const bioInput = document.getElementById("profile-bio");

  const prefTargetCareer = document.getElementById("pref-target-career");
  const prefWeeklyHours = document.getElementById("pref-weekly-hours");
  const prefLearningStyle = document.getElementById("pref-learning-style");
  const prefTargetDate = document.getElementById("pref-target-date");

  // Theme Buttons
  const themeBtnLight = document.getElementById("theme-btn-light");
  const themeBtnDark = document.getElementById("theme-btn-dark");

  // Summary Elements
  const summaryReadiness = document.getElementById("summary-readiness-val");
  const summaryAssessment = document.getElementById("summary-assessment-val");
  const summaryRoadmap = document.getElementById("summary-roadmap-val");
  const summaryResume = document.getElementById("summary-resume-val");

  // Data Buttons
  const exportBtn = document.getElementById("export-json-btn");
  const importFileInput = document.getElementById("import-json-file");
  const resetAllBtn = document.getElementById("reset-all-data-btn");

  // Populate Target Career Dropdown
  const currentTargetId = window.CareerlyStorage ? window.CareerlyStorage.getTargetCareerId() : careers[0].id;
  prefTargetCareer.innerHTML = careers.map(c => `
    <option value="${c.id}" ${c.id === currentTargetId ? 'selected' : ''}>${c.title}</option>
  `).join('');

  // Load Initial Form Data
  function loadFormData() {
    if (!window.CareerlyStorage) return;

    const profile = window.CareerlyStorage.getProfile();
    nameInput.value = profile.name || "";
    headlineInput.value = profile.headline || "";
    emailInput.value = profile.email || "";
    phoneInput.value = profile.phone || "";
    locationInput.value = profile.location || "";
    linkedinInput.value = profile.linkedin || "";
    githubInput.value = profile.github || "";
    bioInput.value = profile.bio || "";

    prefWeeklyHours.value = profile.weeklyCommitment || 12;
    prefLearningStyle.value = profile.learningStyle || "hands-on";
    prefTargetDate.value = profile.targetDate || "2027-06-01";
    prefTargetCareer.value = window.CareerlyStorage.getTargetCareerId();

    updateThemeUI(window.CareerlyStorage.getTheme());
    updateProgressSummary();
  }

  // Update Theme Buttons UI
  function updateThemeUI(currentTheme) {
    if (currentTheme === "dark") {
      themeBtnDark.style.border = "2px solid var(--primary)";
      themeBtnDark.style.background = "var(--primary-light)";
      themeBtnLight.style.border = "1px solid var(--border-color)";
      themeBtnLight.style.background = "var(--bg-surface)";
    } else {
      themeBtnLight.style.border = "2px solid var(--primary)";
      themeBtnLight.style.background = "var(--primary-light)";
      themeBtnDark.style.border = "1px solid var(--border-color)";
      themeBtnDark.style.background = "var(--bg-surface)";
    }
  }

  // Update Progress Summary Card
  function updateProgressSummary() {
    if (!window.CareerlyStorage) return;

    const readiness = window.CareerlyStorage.calculateOverallReadiness();
    summaryReadiness.textContent = `${readiness.overallScore}%`;

    const assessmentResults = window.CareerlyStorage.getAssessmentResults();
    summaryAssessment.textContent = assessmentResults ? `Completed (${assessmentResults.topRecommendation.matchPercentage}% Top Match)` : "Pending";

    const roadmapMetrics = readiness.components.roadmap.metrics;
    summaryRoadmap.textContent = `${roadmapMetrics.completedCount} / ${roadmapMetrics.totalMilestones} Milestones`;

    const resumeMetrics = readiness.components.resume.metrics;
    summaryResume.textContent = `${resumeMetrics.score} / 100 (${resumeMetrics.grade.split(' ')[0]})`;
  }

  // Personal Info Form Submit
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (window.CareerlyStorage) {
      window.CareerlyStorage.saveProfile({
        name: nameInput.value.trim(),
        headline: headlineInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        location: locationInput.value.trim(),
        linkedin: linkedinInput.value.trim(),
        github: githubInput.value.trim(),
        bio: bioInput.value.trim()
      });
      window.showToast("Profile details updated successfully!", "success");
    }
  });

  // Learning Preferences Form Submit
  preferencesForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (window.CareerlyStorage) {
      window.CareerlyStorage.setTargetCareer(prefTargetCareer.value);
      window.CareerlyStorage.saveProfile({
        weeklyCommitment: Number(prefWeeklyHours.value),
        learningStyle: prefLearningStyle.value,
        targetDate: prefTargetDate.value
      });
      window.showToast("Learning preferences saved!", "success");
      updateProgressSummary();
    }
  });

  // Theme Select Buttons
  themeBtnLight.addEventListener("click", () => {
    if (window.CareerlyStorage) {
      window.CareerlyStorage.setTheme("light");
      updateThemeUI("light");
      window.showToast("Switched to Light theme", "success", 1800);
    }
  });

  themeBtnDark.addEventListener("click", () => {
    if (window.CareerlyStorage) {
      window.CareerlyStorage.setTheme("dark");
      updateThemeUI("dark");
      window.showToast("Switched to Dark theme", "success", 1800);
    }
  });

  // Export Progress JSON File
  exportBtn.addEventListener("click", () => {
    if (window.CareerlyStorage) {
      const dataStr = window.CareerlyStorage.exportBackupJSON();
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `careerly-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.showToast("Backup JSON file downloaded!", "success");
    }
  });

  // Import Progress JSON File
  importFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonContent = event.target.result;
      if (window.CareerlyStorage.importBackupJSON(jsonContent)) {
        window.showToast("Progress successfully imported from backup!", "success");
        setTimeout(() => window.location.reload(), 600);
      } else {
        window.showToast("Failed to parse JSON backup file.", "error");
      }
    };
    reader.readAsText(file);
  });

  // Reset All Careerly Data
  resetAllBtn.addEventListener("click", () => {
    window.showConfirmModal({
      title: "Reset All Careerly Data?",
      message: "This will permanently erase all assessments, skill gap evaluations, roadmap progress, and resume drafts saved in LocalStorage. Are you sure?",
      confirmText: "Erase All Data",
      onConfirm: () => {
        window.CareerlyStorage.resetAllData();
      }
    });
  });

  // Initial Load
  loadFormData();
});
