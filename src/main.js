'use strict';

import './styles.scss';
import {
  ALEA_DATA,
  generatePassword,
  generateFileName,
  generateLotto,
  getStrength
} from './modules/alea-engine.js';

const _STORAGE_KEY_CONFIG = "alea_config";
const _STORAGE_KEY_THEME = "alea_theme";

const $lengthSlider = document.querySelector('#length-slider');
const $lengthValue = document.querySelector('#length-value');
const $countSlider = document.querySelector('#count-slider');
const $countValue = document.querySelector('#count-value');
const $generateBtn = document.querySelector('#generate-btn');
const $resetBtn = document.querySelector('#reset-btn');
const $clearLcBtn = document.querySelector('#clear-lc-btn');
const $themeToggle = document.querySelector('#theme-toggle');
const $themeIcon = document.querySelector('#theme-icon');
const $outputContainer = document.querySelector('#output-container');
const $actionInfo = document.querySelector('#action-info');

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
  const count = parseInt($countSlider.value);

  localStorage.setItem(_STORAGE_KEY_CONFIG, JSON.stringify({ length, count, system }));

  $outputContainer.innerHTML = '';
  $outputContainer.style.display = 'flex';

  for (let i = 0; i < count; i++) {
    let result = "";
    if (system === 'pw') {
      const length = parseInt($lengthSlider.value);
      result = generatePassword(length);
    } else if (system === 'file') {
      const length = parseInt($lengthSlider.value);
      result = generateFileName(length);
    } else if (system === 'lotto') {
      result = generateLotto();
    }
    createResultRow(result);
  }
};

$themeToggle.addEventListener('click', () => toggleTheme());

$lengthSlider.addEventListener('input', () => $lengthValue.textContent = $lengthSlider.value);
$countSlider.addEventListener('input', () => $countValue.textContent = $countSlider.value);

document.querySelectorAll('input[name="system"]').forEach($el => {
  $el.addEventListener('change', updateInfo);
});

$generateBtn.addEventListener('click', handleGeneration);

$resetBtn.addEventListener('click', () => {
  $outputContainer.innerHTML = '';
  $outputContainer.style.display = 'none';
});

$clearLcBtn.addEventListener('click', () => {
  localStorage.removeItem(_STORAGE_KEY_CONFIG);
  alert('ALEA Konfiguration gelöscht.');
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem(_STORAGE_KEY_THEME);
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    toggleTheme(true);
  }

  const saved = JSON.parse(localStorage.getItem(_STORAGE_KEY_CONFIG));
  if (saved) {
    $lengthSlider.value = saved.length || 16;
    $countSlider.value = saved.count || 1;
    const $radio = document.querySelector(`input[name="system"][value="${saved.system}"]`);
    if ($radio) $radio.checked = true;
  }

  $lengthValue.textContent = $lengthSlider.value;
  $countValue.textContent = $countSlider.value;
  updateInfo();
});