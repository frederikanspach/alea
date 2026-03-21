import './styles.scss';
import {
  ALEA_DATA,
  generatePassword,
  generateFileName,
  generateLotto,
  getStrength
} from './modules/alea-engine.js';

const _STORAGE_KEY_CONFIG = 'alea_config';
const _STORAGE_KEY_THEME = 'alea_theme';

const $lengthSlider = document.querySelector('#length-slider');
const $lengthNum = document.querySelector('#length-num');
const $spinUp = document.querySelector('#spin-up');
const $spinDown = document.querySelector('#spin-down');

const $countSlider = document.querySelector('#count-slider');
const $countNum = document.querySelector('#count-num');
const $spinUpCount = document.querySelector('#spin-up-count');
const $spinDownCount = document.querySelector('#spin-down-count');

const $generateBtn = document.querySelector('#generate-btn');
const $resetBtn = document.querySelector('#reset-btn');
const $clearLcBtn = document.querySelector('#clear-lc-btn');
const $themeToggle = document.querySelector('#theme-toggle');
const $themeIcon = document.querySelector('#theme-icon');
const $outputContainer = document.querySelector('#output-container');
const $actionInfo = document.querySelector('#action-info');

let _spinTimeout = null;
let _spinInterval = null;

const toggleTheme = (forceDark = null) => {
  const isDark = forceDark !== null
    ? forceDark
    : !document.body.classList.contains('dark-theme');

  document.body.classList.toggle('dark-theme', isDark);
  if ($themeIcon) $themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  localStorage.setItem(_STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
};

const updateInfo = () => {
  const $selected = document.querySelector('input[name="system"]:checked');
  if ($selected && $actionInfo) {
    $actionInfo.textContent = ALEA_DATA[$selected.value]?.preview ?? '';
  }
};

const syncValue = ($numField, $sliderField, val, min, max) => {
  let n = parseInt(val);
  if (isNaN(n)) return;
  n = Math.min(max, Math.max(min, n));
  $numField.value = n;
  $sliderField.value = n;
};

const handleLiveInput = ($numField, $sliderField, min, max) => {
  const val = parseInt($numField.value);
  if (!isNaN(val) && val >= min && val <= max) {
    $sliderField.value = val;
  }
};

const finalizeInput = ($numField, $sliderField, min, max) => {
  syncValue($numField, $sliderField, $numField.value, min, max);
};

const startSpin = (action) => {
  action();
  _spinTimeout = setTimeout(() => {
    _spinInterval = setInterval(action, 80);
  }, 400);
};

const stopSpin = () => {
  clearTimeout(_spinTimeout);
  clearInterval(_spinInterval);
  _spinTimeout = null;
  _spinInterval = null;
};

$spinUp.addEventListener('mousedown', () => startSpin(() => syncValue($lengthNum, $lengthSlider, parseInt($lengthNum.value) + 1, 3, 256)));
$spinDown.addEventListener('mousedown', () => startSpin(() => syncValue($lengthNum, $lengthSlider, parseInt($lengthNum.value) - 1, 3, 256)));

$spinUpCount.addEventListener('mousedown', () => startSpin(() => syncValue($countNum, $countSlider, parseInt($countNum.value) + 1, 1, 99)));
$spinDownCount.addEventListener('mousedown', () => startSpin(() => syncValue($countNum, $countSlider, parseInt($countNum.value) - 1, 1, 99)));

$spinUp.addEventListener('touchstart', (e) => { e.preventDefault(); startSpin(() => syncValue($lengthNum, $lengthSlider, parseInt($lengthNum.value) + 1, 3, 256)); });
$spinDown.addEventListener('touchstart', (e) => { e.preventDefault(); startSpin(() => syncValue($lengthNum, $lengthSlider, parseInt($lengthNum.value) - 1, 3, 256)); });
$spinUpCount.addEventListener('touchstart', (e) => { e.preventDefault(); startSpin(() => syncValue($countNum, $countSlider, parseInt($countNum.value) + 1, 1, 99)); });
$spinDownCount.addEventListener('touchstart', (e) => { e.preventDefault(); startSpin(() => syncValue($countNum, $countSlider, parseInt($countNum.value) - 1, 1, 99)); });

[$spinUp, $spinDown, $spinUpCount, $spinDownCount].forEach($el => {
  $el.addEventListener('mouseleave', stopSpin);
  $el.addEventListener('touchend', stopSpin);
  $el.addEventListener('touchcancel', stopSpin);
});

window.addEventListener('mouseup', stopSpin);

function createResultRow(text, system, index) {
  const $row = document.createElement('div');
  $row.className = 'result-row fade-in';
  $row.style.animationDelay = `${index * 250}ms`;

  const strength = system === 'pw' ? getStrength(text) : '';

  $row.innerHTML = `
    <div class="input-group">
      <input type="text" readonly>
      <div class="strength-meter ${strength}">
        <div class="bar bar-1"></div>
        <div class="bar bar-2"></div>
        <div class="bar bar-3"></div>
      </div>
    </div>
    <button class="copy-btn-small" aria-label="Kopieren">
      <span class="material-symbols-outlined">content_copy</span>
    </button>
  `;

  $row.querySelector('input').value = text;

  const $btn = $row.querySelector('.copy-btn-small');
  const $icon = $btn.querySelector('.material-symbols-outlined');

  $btn.addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      $icon.textContent = 'check';
      $btn.classList.add('copied');
      setTimeout(() => {
        $icon.textContent = 'content_copy';
        $btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      $icon.textContent = 'error';
      setTimeout(() => { $icon.textContent = 'content_copy'; }, 2000);
    });
  });

  $outputContainer.appendChild($row);
}

const handleGeneration = () => {
  const $selected = document.querySelector('input[name="system"]:checked');
  if (!$selected) return;

  const system = $selected.value;
  const count = parseInt($countNum.value);
  const length = parseInt($lengthNum.value);

  localStorage.setItem(_STORAGE_KEY_CONFIG, JSON.stringify({ length, count, system }));

  $outputContainer.innerHTML = '';
  $outputContainer.style.display = 'flex';

  for (let i = 0; i < count; i++) {
    let result = '';
    if (system === 'pw') result = generatePassword(length);
    if (system === 'file') result = generateFileName(length);
    if (system === 'lotto') result = generateLotto();
    createResultRow(result, system, i);
  }
};

$lengthSlider.addEventListener('input', (e) => syncValue($lengthNum, $lengthSlider, e.target.value, 3, 256));
$lengthNum.addEventListener('input', () => handleLiveInput($lengthNum, $lengthSlider, 3, 256));
$lengthNum.addEventListener('blur', () => finalizeInput($lengthNum, $lengthSlider, 3, 256));

$countSlider.addEventListener('input', (e) => syncValue($countNum, $countSlider, e.target.value, 1, 99));
$countNum.addEventListener('input', () => handleLiveInput($countNum, $countSlider, 1, 99));
$countNum.addEventListener('blur', () => finalizeInput($countNum, $countSlider, 1, 99));

[$lengthNum, $countNum].forEach($el => $el.addEventListener('focus', () => $el.select()));

$generateBtn.addEventListener('click', handleGeneration);
$themeToggle.addEventListener('click', () => toggleTheme());

$resetBtn.addEventListener('click', () => {
  $outputContainer.innerHTML = '';
  $outputContainer.style.display = 'none';
});

$clearLcBtn.addEventListener('click', () => {
  localStorage.removeItem(_STORAGE_KEY_CONFIG);
  localStorage.removeItem(_STORAGE_KEY_THEME);
  const original = $clearLcBtn.textContent;
  $clearLcBtn.textContent = 'Zurückgesetzt ✓';
  setTimeout(() => { $clearLcBtn.textContent = original; }, 2000);
});

document.querySelectorAll('input[name="system"]').forEach($el => {
  $el.addEventListener('change', updateInfo);
});

window.addEventListener('DOMContentLoaded', () => {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(_STORAGE_KEY_THEME);
  } catch {
    localStorage.removeItem(_STORAGE_KEY_THEME);
  }
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    toggleTheme(true);
  }

  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(_STORAGE_KEY_CONFIG));
  } catch {
    localStorage.removeItem(_STORAGE_KEY_CONFIG);
  }
  if (saved) {
    syncValue($lengthNum, $lengthSlider, saved.length ?? 12, 3, 256);
    syncValue($countNum, $countSlider, saved.count ?? 1, 1, 99);
    const $radio = document.querySelector(`input[name="system"][value="${saved.system}"]`);
    if ($radio) $radio.checked = true;
  }

  updateInfo();
  document.body.classList.add('loaded');
});