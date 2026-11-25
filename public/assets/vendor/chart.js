/**
 * CAREERLY - Lightweight Self-Contained Chart Engine (Chart.js compatible)
 * Provides high-performance, responsive Canvas rendering for Radar, Doughnut, Bar, and Line charts.
 * 100% offline-ready with zero external CDN dependencies.
 */

class CareerlyChart {
  constructor(ctx, config) {
    this.canvas = typeof ctx === 'string' ? document.getElementById(ctx) : ctx;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.config = config || {};
    this.type = config.type || 'bar';
    this.data = config.data || { labels: [], datasets: [] };
    this.options = config.options || {};
    
    // Auto-handle high DPI retina displays
    this.setupHiDPI();
    this.render();

    // Responsive resize handler
    window.addEventListener('resize', () => {
      this.setupHiDPI();
      this.render();
    });
  }

  setupHiDPI() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || this.canvas.width || 300;
    const height = rect.height || this.canvas.height || 220;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = width;
    this.height = height;
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.textColor = isDark ? '#94A3B8' : '#64748B';
    this.gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';

    switch (this.type) {
      case 'doughnut':
        this.renderDoughnut();
        break;
      case 'radar':
        this.renderRadar();
        break;
      case 'line':
        this.renderLine();
        break;
      case 'bar':
      default:
        this.renderBar();
        break;
    }
  }

  renderDoughnut() {
    const dataset = this.data.datasets[0];
    if (!dataset || !dataset.data) return;

    const data = dataset.data;
    const colors = dataset.backgroundColor || ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B'];
    const total = data.reduce((a, b) => a + b, 0);

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const innerRadius = radius * 0.68;

    let startAngle = -Math.PI / 2;

    data.forEach((val, i) => {
      const sliceAngle = total > 0 ? (val / total) * 2 * Math.PI : 0;
      const endAngle = startAngle + sliceAngle;

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      this.ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      this.ctx.closePath();

      this.ctx.fillStyle = colors[i % colors.length];
      this.ctx.fill();

      startAngle = endAngle;
    });

    // Inner text / label if supplied
    if (this.options.plugins && this.options.plugins.centerText) {
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = 'bold 20px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(this.options.plugins.centerText, centerX, centerY);
    }
  }

  renderBar() {
    const dataset = this.data.datasets[0];
    if (!dataset || !dataset.data) return;

    const labels = this.data.labels || [];
    const data = dataset.data;
    const padding = 40;
    const chartWidth = this.width - padding * 2;
    const chartHeight = this.height - padding * 1.5;
    const maxVal = Math.max(...data, 10);

    const barWidth = Math.min(36, (chartWidth / data.length) * 0.6);
    const stepX = chartWidth / data.length;

    // Grid lines
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.width - padding, y);
      this.ctx.stroke();

      // Y-axis labels
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = '10px Inter, sans-serif';
      this.ctx.textAlign = 'right';
      const labelVal = Math.round(maxVal - (maxVal / 4) * i);
      this.ctx.fillText(labelVal, padding - 8, y + 3);
    }

    // Bars
    data.forEach((val, i) => {
      const x = padding + stepX * i + (stepX - barWidth) / 2;
      const barH = (val / maxVal) * chartHeight;
      const y = padding + chartHeight - barH;

      const grad = this.ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, dataset.backgroundColor || '#4F46E5');
      grad.addColorStop(1, '#7C3AED');

      this.ctx.fillStyle = grad;
      this.roundRect(x, y, barWidth, barH, 6);
      this.ctx.fill();

      // X Label
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = '11px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      const label = labels[i] || '';
      this.ctx.fillText(label, x + barWidth / 2, this.height - 10);
    });
  }

  renderLine() {
    const dataset = this.data.datasets[0];
    if (!dataset || !dataset.data) return;

    const labels = this.data.labels || [];
    const data = dataset.data;
    const padding = 36;
    const chartWidth = this.width - padding * 2;
    const chartHeight = this.height - padding * 1.6;
    const maxVal = Math.max(...data, 5);

    const stepX = chartWidth / Math.max(1, data.length - 1);

    // Grid
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(this.width - padding, y);
      this.ctx.stroke();
    }

    // Line Path
    this.ctx.beginPath();
    data.forEach((val, i) => {
      const x = padding + stepX * i;
      const y = padding + chartHeight - (val / maxVal) * chartHeight;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    });

    this.ctx.strokeStyle = dataset.borderColor || '#4F46E5';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Points
    data.forEach((val, i) => {
      const x = padding + stepX * i;
      const y = padding + chartHeight - (val / maxVal) * chartHeight;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fill();
      this.ctx.strokeStyle = dataset.borderColor || '#4F46E5';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      // X Label
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = '11px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(labels[i] || '', x, this.height - 10);
    });
  }

  renderRadar() {
    const dataset = this.data.datasets[0];
    if (!dataset || !dataset.data) return;

    const labels = this.data.labels || [];
    const data = dataset.data;
    const count = data.length;
    if (count === 0) return;

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 35;
    const angleStep = (Math.PI * 2) / count;

    // Web polygons
    for (let level = 1; level <= 4; level++) {
      const r = (maxRadius / 4) * level;
      this.ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = this.gridColor;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // Spokes
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = this.gridColor;
      this.ctx.stroke();

      // Label
      const labelX = centerX + Math.cos(angle) * (maxRadius + 18);
      const labelY = centerY + Math.sin(angle) * (maxRadius + 18);
      this.ctx.fillStyle = this.textColor;
      this.ctx.font = '10px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      const shortLabel = (labels[i] || '').split(' ')[0];
      this.ctx.fillText(shortLabel, labelX, labelY);
    }

    // Benchmark Target (Dataset 1 if available)
    if (this.data.datasets[1]) {
      const bench = this.data.datasets[1].data;
      this.ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const val = bench[i] || 0;
        const r = (val / 100) * maxRadius;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = '#8B5CF6';
      this.ctx.setLineDash([4, 4]);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // User Data Polygon
    this.ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const val = data[i] || 0;
      const r = (val / 100) * maxRadius;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();

    this.ctx.fillStyle = dataset.backgroundColor || 'rgba(79, 70, 229, 0.25)';
    this.ctx.fill();
    this.ctx.strokeStyle = dataset.borderColor || '#4F46E5';
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Data points
    for (let i = 0; i < count; i++) {
      const val = data[i] || 0;
      const r = (val / 100) * maxRadius;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fill();
      this.ctx.strokeStyle = '#4F46E5';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  roundRect(x, y, w, h, r) {
    if (h < r) r = h / 2;
    if (r < 0) r = 0;
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h);
    this.ctx.lineTo(x, y + h);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
    this.ctx.closePath();
  }

  update() {
    this.render();
  }

  destroy() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

// Attach globally as Chart (compatible with standard Chart.js syntax)
if (typeof window !== 'undefined') {
  if (!window.Chart) {
    window.Chart = CareerlyChart;
  }
}
