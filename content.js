// Content script for Hacker News Readability Enhancer

// Configuration
let config = {
  enhanceEnabled: true,
  translationEnabled: true
};

// Load configuration from storage
chrome.storage.sync.get(['enhanceEnabled', 'translationEnabled'], (result) => {
  config.enhanceEnabled = result.enhanceEnabled !== false; // default true
  config.translationEnabled = result.translationEnabled !== false; // default true
  
  if (config.enhanceEnabled) {
    enhanceReadability();
  }
  
  if (config.translationEnabled) {
    addTranslationButtons();
  }
});

// Listen for configuration changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.enhanceEnabled) {
      config.enhanceEnabled = changes.enhanceEnabled.newValue;
      if (config.enhanceEnabled) {
        enhanceReadability();
      } else {
        document.body.classList.remove('hn-enhanced');
      }
    }
    
    if (changes.translationEnabled) {
      config.translationEnabled = changes.translationEnabled.newValue;
      if (config.translationEnabled) {
        addTranslationButtons();
      } else {
        removeTranslationButtons();
      }
    }
  }
});

// Enhance readability by adding CSS class
function enhanceReadability() {
  document.body.classList.add('hn-enhanced');
}

// Add translation buttons to comments
function addTranslationButtons() {
  const comments = document.querySelectorAll('.commtext');
  
  comments.forEach((comment) => {
    // Skip if already has translation button
    if (comment.parentElement.querySelector('.hn-translate-btn')) {
      return;
    }
    
    // Find the comment header
    const comhead = comment.parentElement.querySelector('.comhead');
    if (comhead) {
      // Create translate button
      const translateBtn = document.createElement('span');
      translateBtn.className = 'hn-translate-btn';
      translateBtn.textContent = '译';
      translateBtn.title = 'Translate to Chinese';
      translateBtn.onclick = () => translateComment(comment, translateBtn);
      
      // Add button to comment header
      comhead.appendChild(translateBtn);
    }
  });
}

// Remove all translation buttons
function removeTranslationButtons() {
  const buttons = document.querySelectorAll('.hn-translate-btn');
  buttons.forEach(btn => btn.remove());
  
  const translations = document.querySelectorAll('.hn-translation');
  translations.forEach(trans => trans.remove());
}

// Translate a comment to Chinese
async function translateComment(commentElement, button) {
  // Check if already translated
  const existingTranslation = commentElement.parentElement.querySelector('.hn-translation');
  if (existingTranslation) {
    existingTranslation.remove();
    return;
  }
  
  // Get comment text
  const commentText = commentElement.innerText.trim();
  if (!commentText) {
    return;
  }
  
  // Create translation container
  const translationDiv = document.createElement('div');
  translationDiv.className = 'hn-translation';
  
  // Add header
  const headerDiv = document.createElement('div');
  headerDiv.className = 'hn-translation-header';
  headerDiv.textContent = '中文翻译:';
  translationDiv.appendChild(headerDiv);
  
  // Add loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'hn-translation-loading';
  loadingDiv.textContent = 'Translating...';
  translationDiv.appendChild(loadingDiv);
  
  // Insert after comment
  commentElement.parentElement.insertBefore(translationDiv, commentElement.nextSibling);
  
  // Disable button while translating
  button.disabled = true;
  button.style.opacity = '0.5';
  
  try {
    // Use Google Translate API (via MyMemory public API as a fallback)
    // Note: For production, you'd want to use a proper translation API with an API key
    const translatedText = await translateText(commentText);
    
    // Update translation div
    loadingDiv.remove();
    const textDiv = document.createElement('div');
    textDiv.textContent = translatedText;
    translationDiv.appendChild(textDiv);
    
  } catch (error) {
    console.error('Translation error:', error);
    loadingDiv.className = 'hn-translation-error';
    loadingDiv.textContent = 'Translation failed. Please try again.';
  } finally {
    // Re-enable button
    button.disabled = false;
    button.style.opacity = '1';
  }
}

// Translate text using a free translation API
async function translateText(text) {
  // Split long text into chunks (API limitation)
  const maxLength = 500;
  
  if (text.length > maxLength) {
    // Translate in chunks
    const chunks = splitTextIntoChunks(text, maxLength);
    const translations = await Promise.all(chunks.map(chunk => translateChunk(chunk)));
    return translations.join(' ');
  } else {
    return await translateChunk(text);
  }
}

// Split text into chunks
function splitTextIntoChunks(text, maxLength) {
  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Translate a single chunk of text
async function translateChunk(text) {
  try {
    // Using MyMemory Translation API (free, no API key required, but has rate limits)
    const encodedText = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|zh-CN`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    } else {
      throw new Error('Translation API error');
    }
  } catch (error) {
    console.error('Translation chunk error:', error);
    // Fallback: return original text with a note
    return `[Translation unavailable: ${text.substring(0, 100)}...]`;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Content will be initialized via chrome.storage.sync.get callback
  });
}
