import './styles.scss';

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

const CHARSETS = {
  pw: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?",
  linux: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-",
  ios: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-",
  windows: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-",
  lotto: "1-49",
  all: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-!@#$%^&*()"
};

const SYMBOL_PREVIEW = {
  pw: "Zeichen: a-z, A-Z, 0-9, !@#$%^&*()-_=+...",
  linux: "Zeichen: a-z, A-Z, 0-9, . _ -",
  ios: "Zeichen: a-z, A-Z, 0-9, . _ -",
  windows: "Zeichen: a-z, A-Z, 0-9, . _ -",
  lotto: "Zahlen: 1 bis 49 (kryptografisch einzigartig)",
  all: "Zeichen: a-z, A-Z, 0-9, . _ - ! @ # $ % ^ & * ( )"
};

const updateInfo = () => {
  const $selected = document.querySelector('input[name="system"]:checked');
  if ($selected) $actionInfo.textContent = SYMBOL_PREVIEW[$selected.value];
};

const toggleTheme = (forceDark = null) => {
  const isDark = forceDark !== null ? forceDark : !document.body.classList.contains('dark-theme');
  document.body.classList.toggle('dark-theme', isDark);
  $themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  localStorage.setItem('alea_theme', isDark ? 'dark' : 'light');
};

$themeToggle.addEventListener('click', () => toggleTheme());

function generateLotto() {
  const numbers = new Set();
  while (numbers.size < 6) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const num = (array[0] % 49) + 1;
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b).join(', ');
}

function generateSecureString(length, charset) {
  let result = "";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
}

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('alea_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    toggleTheme(true);
  }

  const saved = JSON.parse(localStorage.getItem('alea_config'));
  if (saved) {
    $lengthSlider.value = saved.length || 32;
    $countSlider.value = saved.count || 1;
    const $radio = document.querySelector(`input[name="system"][value="${saved.system}"]`);
    if ($radio) $radio.checked = true;
  }
  $lengthValue.textContent = $lengthSlider.value;
  $countValue.textContent = $countSlider.value;
  updateInfo();
});

$lengthSlider.addEventListener('input', () => $lengthValue.textContent = $lengthSlider.value);
$countSlider.addEventListener('input', () => $countValue.textContent = $countSlider.value);

document.querySelectorAll('input[name="system"]').forEach($el => {
  $el.addEventListener('change', updateInfo);
});

$generateBtn.addEventListener('click', () => {
  const $selected = document.querySelector('input[name="system"]:checked');
  if (!$selected) return;

  const system = $selected.value;
  const length = parseInt($lengthSlider.value);
  const count = parseInt($countSlider.value);

  localStorage.setItem('alea_config', JSON.stringify({ length, count, system }));
  $outputContainer.innerHTML = '';
  $outputContainer.style.display = 'flex';

  for (let i = 0; i < count; i++) {
    const val = (system === 'lotto') ? generateLotto() : generateSecureString(length, CHARSETS[system]);
    createResultRow(val);
  }
});

function createResultRow(text) {
  const $row = document.createElement('div');
  $row.className = 'result-row';
  $row.innerHTML = `<input type="text" value="${text}" readonly><button class="copy-btn-small"><span class="material-symbols-outlined">content_copy</span></button>`;

  const $btn = $row.querySelector('.copy-btn-small');
  $btn.addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      const $icon = $btn.querySelector('.material-symbols-outlined');
      $icon.textContent = 'check';
      $btn.classList.add('copied');
      setTimeout(() => { $icon.textContent = 'content_copy'; $btn.classList.remove('copied'); }, 2000);
    });
  });
  $outputContainer.appendChild($row);
}

$resetBtn.addEventListener('click', () => {
  $outputContainer.innerHTML = ''; $outputContainer.style.display = 'none';
});

$clearLcBtn.addEventListener('click', () => {
  localStorage.removeItem('alea_config');
  alert('ALEA Konfiguration gelöscht.');
});