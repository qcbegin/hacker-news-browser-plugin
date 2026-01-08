// Popup script for settings

// Load saved settings
chrome.storage.sync.get(['enhanceEnabled', 'translationEnabled'], (result) => {
  document.getElementById('enhanceEnabled').checked = result.enhanceEnabled !== false;
  document.getElementById('translationEnabled').checked = result.translationEnabled !== false;
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

// Show saved status
function showStatus() {
  const status = document.getElementById('status');
  status.classList.add('show');
  setTimeout(() => {
    status.classList.remove('show');
  }, 2000);
}
