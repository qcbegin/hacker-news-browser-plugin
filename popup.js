// Popup script for settings

const defaults = {
  fontSize: 14,
  lineHeight: 1.6,
  commentSpacing: 12,
  translationEngine: 'mymemory',
  googleApiKey: '',
  deeplApiKey: '',
  youdaoAppId: '',
  youdaoAppSecret: ''
};

// Load saved settings
chrome.storage.sync.get([
  'enhanceEnabled',
  'translationEnabled',
  'fontSize',
  'lineHeight',
  'commentSpacing',
  'translationEngine',
  'googleApiKey',
  'deeplApiKey',
  'youdaoAppId',
  'youdaoAppSecret'
], (result) => {
  document.getElementById('enhanceEnabled').checked = result.enhanceEnabled !== false;
  document.getElementById('translationEnabled').checked = result.translationEnabled !== false;

  const fontSize = Number.isFinite(result.fontSize) ? result.fontSize : defaults.fontSize;
  const lineHeight = Number.isFinite(result.lineHeight) ? result.lineHeight : defaults.lineHeight;
  const commentSpacing = Number.isFinite(result.commentSpacing) ? result.commentSpacing : defaults.commentSpacing;
  const translationEngine = result.translationEngine || defaults.translationEngine;
  const googleApiKey = result.googleApiKey || defaults.googleApiKey;
  const deeplApiKey = result.deeplApiKey || defaults.deeplApiKey;
  const youdaoAppId = result.youdaoAppId || defaults.youdaoAppId;
  const youdaoAppSecret = result.youdaoAppSecret || defaults.youdaoAppSecret;

  setSliderValue('fontSize', 'fontSizeValue', `${fontSize}px`, fontSize);
  setSliderValue('lineHeight', 'lineHeightValue', `${lineHeight.toFixed(1)}`, lineHeight);
  setSliderValue('commentSpacing', 'commentSpacingValue', `${commentSpacing}px`, commentSpacing);
  document.getElementById('translationEngine').value = translationEngine;
  document.getElementById('googleApiKey').value = googleApiKey;
  document.getElementById('deeplApiKey').value = deeplApiKey;
  document.getElementById('youdaoAppId').value = youdaoAppId;
  document.getElementById('youdaoAppSecret').value = youdaoAppSecret;
  updateEngineFields(translationEngine);
});

// Save settings on change
document.getElementById('enhanceEnabled').addEventListener('change', (e) => {
  chrome.storage.sync.set({ enhanceEnabled: e.target.checked }, () => {
    showStatus();
  });
});

document.getElementById('translationEnabled').addEventListener('change', (e) => {
  chrome.storage.sync.set({ translationEnabled: e.target.checked }, () => {
    showStatus();
  });
});

document.getElementById('translationEngine').addEventListener('change', (e) => {
  const value = e.target.value;
  updateEngineFields(value);
  chrome.storage.sync.set({ translationEngine: value }, showStatus);
});

document.getElementById('googleApiKey').addEventListener('input', (e) => {
  chrome.storage.sync.set({ googleApiKey: e.target.value.trim() }, showStatus);
});

document.getElementById('deeplApiKey').addEventListener('input', (e) => {
  chrome.storage.sync.set({ deeplApiKey: e.target.value.trim() }, showStatus);
});

document.getElementById('youdaoAppId').addEventListener('input', (e) => {
  chrome.storage.sync.set({ youdaoAppId: e.target.value.trim() }, showStatus);
});

document.getElementById('youdaoAppSecret').addEventListener('input', (e) => {
  chrome.storage.sync.set({ youdaoAppSecret: e.target.value.trim() }, showStatus);
});

document.getElementById('fontSize').addEventListener('input', (e) => {
  const value = Number(e.target.value);
  setSliderValue('fontSize', 'fontSizeValue', `${value}px`, value);
  chrome.storage.sync.set({ fontSize: value }, showStatus);
});

document.getElementById('lineHeight').addEventListener('input', (e) => {
  const value = Number.parseFloat(e.target.value);
  setSliderValue('lineHeight', 'lineHeightValue', `${value.toFixed(1)}`, value);
  chrome.storage.sync.set({ lineHeight: value }, showStatus);
});

document.getElementById('commentSpacing').addEventListener('input', (e) => {
  const value = Number(e.target.value);
  setSliderValue('commentSpacing', 'commentSpacingValue', `${value}px`, value);
  chrome.storage.sync.set({ commentSpacing: value }, showStatus);
});

function setSliderValue(inputId, valueId, label, value) {
  document.getElementById(inputId).value = value;
  document.getElementById(valueId).textContent = label;
}

function updateEngineFields(engine) {
  const googleFields = document.querySelectorAll('#googleKeyField');
  const deeplFields = document.querySelectorAll('#deeplKeyField');
  const youdaoFields = document.querySelectorAll('#youdaoKeyField, #youdaoSecretField');

  googleFields.forEach((field) => {
    field.style.display = engine === 'google' ? 'block' : 'none';
  });
  deeplFields.forEach((field) => {
    field.style.display = engine === 'deepl' ? 'block' : 'none';
  });
  youdaoFields.forEach((field) => {
    field.style.display = engine === 'youdao' ? 'block' : 'none';
  });
}

// Show saved status
function showStatus() {
  const status = document.getElementById('status');
  status.classList.add('show');
  setTimeout(() => {
    status.classList.remove('show');
  }, 2000);
}
