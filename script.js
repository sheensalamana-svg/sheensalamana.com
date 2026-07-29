// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.site-nav-links');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll-reveal for experience cards, badges, and the project card
const revealTargets = document.querySelectorAll('.exp-card, .badge-card, .project-card');

if ('IntersectionObserver' in window && revealTargets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  // Fallback: no IntersectionObserver support, just show everything
  revealTargets.forEach((el) => el.classList.add('in-view'));
}

// ---- Live clock (Pasay City / Asia-Manila time) ----
const liveTimeEl = document.getElementById('liveTime');

function updateClock() {
  if (!liveTimeEl) return;
  try {
    const formatter = new Intl.DateTimeFormat('en-PH', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    liveTimeEl.textContent = formatter.format(new Date());
  } catch (e) {
    liveTimeEl.textContent = '';
  }
}

updateClock();
setInterval(updateClock, 15000);

// ---- Live weather (Pasay City, via Open-Meteo — no API key required) ----
const liveWeatherEl = document.getElementById('liveWeather');
const liveWeatherSepEl = document.getElementById('liveWeatherSep');

const WEATHER_CODE_MAP = {
  0: '☀ Clear', 1: '🌤 Mostly clear', 2: '⛅ Partly cloudy', 3: '☁ Cloudy',
  45: '🌫 Foggy', 48: '🌫 Foggy',
  51: '🌦 Drizzle', 53: '🌦 Drizzle', 55: '🌦 Drizzle',
  61: '🌧 Rain', 63: '🌧 Rain', 65: '🌧 Heavy rain',
  71: '🌨 Snow', 73: '🌨 Snow', 75: '🌨 Snow',
  80: '🌦 Showers', 81: '🌦 Showers', 82: '🌧 Heavy showers',
  95: '⛈ Thunderstorm', 96: '⛈ Thunderstorm', 99: '⛈ Thunderstorm',
};

async function updateWeather() {
  if (!liveWeatherEl) return;
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=14.5378&longitude=120.9896&current_weather=true&timezone=Asia%2FManila'
    );
    if (!res.ok) throw new Error('weather request failed');
    const data = await res.json();
    const temp = Math.round(data.current_weather.temperature);
    const label = WEATHER_CODE_MAP[data.current_weather.weathercode] || '';
    liveWeatherEl.textContent = `${temp}°C ${label}`;
    if (liveWeatherSepEl) liveWeatherSepEl.hidden = false;
  } catch (e) {
    // Silently hide the weather portion if the request fails (e.g. offline preview)
    if (liveWeatherSepEl) liveWeatherSepEl.hidden = true;
    liveWeatherEl.textContent = '';
  }
}

updateWeather();
setInterval(updateWeather, 30 * 60 * 1000); // refresh every 30 minutes

// ---- Rotating hero tagline ----
const taglineEl = document.getElementById('rotatingTagline');
const TAGLINES = [
  'Administrative & ICT Professional',
  'Records & Documentation Specialist',
  'Self-Taught Web Developer',
  'Government Service, Technical Mind',
];
let taglineIndex = 0;

if (taglineEl) {
  setInterval(() => {
    taglineEl.classList.add('fade-out');
    setTimeout(() => {
      taglineIndex = (taglineIndex + 1) % TAGLINES.length;
      taglineEl.textContent = TAGLINES[taglineIndex];
      taglineEl.classList.remove('fade-out');
    }, 400);
  }, 3800);
}

// ---- Dark mode toggle ----
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'sms-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
  });
}


