const comparisonSection = `
  <section class="section comparisons" id="comparisons">
    <div class="section-kicker">COMPARISONS</div>
    <div class="section-head">
      <h2>Control Strategies.</h2>
    </div>
    <div class="comparison-prompt">
      <span>OBJECTIVE</span>
      <p>Trace a rectangular trajectory while maintaining the camera's original orientation, then return to the starting position.</p>
      <p class="comparison-explanation"><strong>Preset Only</strong> executes the rectangular trajectory in front of the central sculpture, so the sculpture remains continuously visible. The <strong>WorldPlay Agent</strong> instead moves around the sculpture, causing it to leave and later re-enter the field of view. This distinction is essential when evaluating world-model memory: keeping the sculpture <strong>continuously visible</strong> can artificially inflate geometric-consistency scores and <strong>does not demonstrate memory</strong>. <strong>A stronger memory test requires the model to reconstruct the sculpture consistently after it has disappeared from view.</strong></p>
    </div>
    <div class="comparison-grid">
      <figure class="comparison-card comparison-card-combined">
        <div class="comparison-video-shell">
          <video controls playsinline preload="metadata" poster="/project/PlayWorld/comparisons/control-strategies-gc002.jpg" src="/project/PlayWorld/comparisons/control-strategies-gc002-720p.mp4">
            Your browser does not support video playback.
          </video>
        </div>
      </figure>
    </div>
  </section>
`;

const fullProcessPrompts = {
  LS010: 'Rotate the camera 360 degrees clockwise in place, then return to the original angle facing the original view.',
  OE014: 'Turn the camera left 90 degrees, then turn back to the original view.',
  GC008: 'Walk forward 5 steps, tilt the view 30 degrees up, then tilt the view 30 degrees down to look back at the original height.',
  GC010: 'Turn right 90 degrees, then turn back left to the starting view.',
  GC022: 'Rotate the camera 360 degrees clockwise in place, then return to the original angle facing the original view.',
  GC033: 'Turn the camera left 90 degrees, then turn back to face the display window.',
};

function ensureComparisonStyles() {
  if (document.querySelector('link[data-playworld-comparisons]')) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/project/PlayWorld/assets/comparisons.css?v=20260818';
  stylesheet.dataset.playworldComparisons = 'true';
  document.head.append(stylesheet);
}

function mountComparisons() {
  ensureComparisonStyles();

  const fullProcess = document.querySelector('#full-process');
  if (!fullProcess || document.querySelector('#comparisons')) return;

  fullProcess.insertAdjacentHTML('beforebegin', comparisonSection);
  document.querySelector('#comparisons video')?.load();

  const nav = document.querySelector('.nav-links');
  const fullProcessLink = nav?.querySelector('a[href="#full-process"]');
  if (nav && fullProcessLink && !nav.querySelector('a[href="#comparisons"]')) {
    const comparisonLink = document.createElement('a');
    comparisonLink.href = '#comparisons';
    comparisonLink.textContent = 'Comparisons';
    nav.insertBefore(comparisonLink, fullProcessLink);
  }
}

function mountFullProcessPrompts() {
  document.querySelectorAll('.full-process-videos figure').forEach((figure) => {
    if (figure.querySelector('.full-process-prompt')) return;

    const caseId = figure.querySelector('figcaption strong')?.textContent?.trim();
    const prompt = caseId ? fullProcessPrompts[caseId] : null;
    if (!prompt) return;

    const promptElement = document.createElement('p');
    promptElement.className = 'full-process-prompt';
    promptElement.innerHTML = `<span>PROMPT</span>${prompt}`;
    figure.append(promptElement);
  });
}

function initializeComparisons() {
  mountComparisons();
  mountFullProcessPrompts();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    mountComparisons();
    mountFullProcessPrompts();
  }));

  const observer = new MutationObserver(() => {
    mountComparisons();
    mountFullProcessPrompts();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

const scheduleComparisons = () => window.setTimeout(initializeComparisons, 1500);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleComparisons, { once: true });
} else {
  scheduleComparisons();
}
