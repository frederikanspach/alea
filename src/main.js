'use strict';

import './styles.scss';
import {
  ALEA_DATA,
  generatePassword,
  generateFileName,
  generateLotto
} from './modules/alea-engine.js';

const _STORAGE_KEY_CONFIG = "alea_config";
const _STORAGE_KEY_THEME = "alea_theme";

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

let _spinInterval = null;

const toggleTheme = (forceDark = null) => {
  const isDark = forceDark !== null ? forceDark : !document.body.classList.contains('dark-theme');
  document.body.classList.toggle('dark-theme', isDark);
  if ($themeIcon) $themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  localStorage.setItem(_STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
};

const updateInfo = () => {
  const $selected = document.querySelector('input[name="system"]:checked');
  if ($selected && $actionInfo) {
    const type = $selected.value;
    $actionInfo.textContent = ALEA_DATA[type]?.preview || "";
  }
};

const syncValue = ($numField, $sliderField, val, min, max) => {
  let n = parseInt(val);
  if (isNaN(n)) return;
  if (n < min) n = min;
  if (n > max) n = max;

  $numField.value = n;
  $sliderField.value = n;
};

const handleLiveInput = ($numField, $sliderField, min, max) => {
  let val = parseInt($numField.value);
  if (!isNaN(val) && val >= min && val <= max) {
    $sliderField.value = val;
  }
};

const finalizeInput = ($numField, $sliderField, min, max) => {
  syncValue($numField, $sliderField, $numField.value, min, max);
};

const startSpin = (action) => {
  action();
  _spinInterval = setTimeout(() => {
    _spinInterval = setInterval(action, 80);
  }, 400);
};

const stopSpin = () => {
  clearTimeout(_spinInterval);
  clearInterval(_spinInterval);
  _spinInterval = null;
};

$spinUp.addEventListener('mouseleave', stopSpin);
$spinDown.addEventListener('mouseleave', stopSpin);
$spinUpCount.addEventListener('mouseleave', stopSpin);
$spinDownCount.addEventListener('mouseleave', stopSpin);

function createResultRow(text) {
  const $row = document.createElement('div');
  $row.className = 'result-row';
  $row.innerHTML = `
    <input type="text" value="${text}" readonly>
    <button class="copy-btn-small">
      <span class="material-symbols-outlined">content_copy</span>
    </button>
  `;

  const $btn = $row.querySelector('.copy-btn-small');
  $btn.addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      const $icon = $btn.querySelector('.material-symbols-outlined');
      $icon.textContent = 'check';
      $btn.classList.add('copied');
      setTimeout(() => {
        $icon.textContent = 'content_copy';
        $btn.classList.remove('copied');
      }, 2000);
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
    let result = "";
    if (system === 'pw') result = generatePassword(length);
    else if (system === 'file') result = generateFileName(length);
    else if (system === 'lotto') result = generateLotto();
    createResultRow(result);
  }
};

$lengthSlider.addEventListener('input', (e) => syncValue($lengthNum, $lengthSlider, e.target.value, 3, 256));
$lengthNum.addEventListener('input', () => handleLiveInput($lengthNum, $lengthSlider, 3, 256));
$lengthNum.addEventListener('blur', () => finalizeInput($lengthNum, $lengthSlider, 3, 256));

$spinUp.addEventListener('mousedown', () => startSpin(() => syncValue($lengthNum, $lengthSlider, parseInt($lengthNum.value) + 1, 3, 256)));
$spinDown.addEventListener('mousedown', () => startSpin(() => syncValue($lengthNum, $lengthSlider, parseInt($lengthNum.value) - 1, 3, 256)));

$countSlider.addEventListener('input', (e) => syncValue($countNum, $countSlider, e.target.value, 1, 99));
$countNum.addEventListener('input', () => handleLiveInput($countNum, $countSlider, 1, 99));
$countNum.addEventListener('blur', () => finalizeInput($countNum, $countSlider, 1, 99));

$spinUpCount.addEventListener('mousedown', () => startSpin(() => syncValue($countNum, $countSlider, parseInt($countNum.value) + 1, 1, 99)));
$spinDownCount.addEventListener('mousedown', () => startSpin(() => syncValue($countNum, $countSlider, parseInt($countNum.value) - 1, 1, 99)));

window.addEventListener('mouseup', stopSpin);
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
  alert('ALEA Konfiguration gelöscht.');
});

document.querySelectorAll('input[name="system"]').forEach($el => {
  $el.addEventListener('change', updateInfo);
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem(_STORAGE_KEY_THEME);
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    toggleTheme(true);
  }

  const saved = JSON.parse(localStorage.getItem(_STORAGE_KEY_CONFIG));
  if (saved) {
    syncValue($lengthNum, $lengthSlider, saved.length || 12, 3, 256);
    syncValue($countNum, $countSlider, saved.count || 1, 1, 99);
    const $radio = document.querySelector(`input[name="system"][value="${saved.system}"]`);
    if ($radio) $radio.checked = true;
  }

  updateInfo();
  document.body.classList.add('loaded');
});