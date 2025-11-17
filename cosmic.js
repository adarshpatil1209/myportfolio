// cosmic.js
// Handles responsive planet repositioning for mobile landscape

function isMobileLandscape() {
  return (window.innerWidth <= 900 && window.innerWidth > window.innerHeight);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyMobileLandscapePlanets() {
  const planets = Array.from(document.querySelectorAll('.planet-float'));
  if (!planets.length) return;

  planets.forEach((p) => {
    // place planets randomly across the top portion (2% - 30%)
    const topPct = randomInt(2, 30);
    const leftPct = randomInt(5, 90);

    p.style.top = topPct + '%';
    p.style.left = leftPct + '%';
    p.style.right = 'auto';
    p.style.bottom = 'auto';
    // nudge transforms so they float upward but keep a slight horizontal
    p.style.transform = 'translate(-50%, 0)';
    // randomize animation delay so motion feels organic
    p.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
  });
}

function restoreDesktopPlanets() {
  const planets = Array.from(document.querySelectorAll('.planet-float'));
  if (!planets.length) return;
  planets.forEach((p) => {
    p.style.top = '';
    p.style.left = '';
    p.style.right = '';
    p.style.bottom = '';
    p.style.transform = '';
    p.style.animationDelay = '';
  });
}

// Debounce helper
function debounce(fn, ms){
  let t;
  return function(){
    clearTimeout(t);
    t = setTimeout(()=> fn.apply(this, arguments), ms);
  };
}

function adjustPlanetsIfNeeded(){
  if (isMobileLandscape()) {
    applyMobileLandscapePlanets();
  } else {
    restoreDesktopPlanets();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // initial adjustment
  adjustPlanetsIfNeeded();

  // re-run on resize & orientation change with debounce
  const handler = debounce(adjustPlanetsIfNeeded, 120);
  window.addEventListener('resize', handler);
  window.addEventListener('orientationchange', handler);
});
