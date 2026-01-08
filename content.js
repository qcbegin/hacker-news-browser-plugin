// Content script for Hacker News Readability Enhancer

// Configuration
let config = {
  enhanceEnabled: true,
  translationEnabled: true,
  fontSize: 14,
  lineHeight: 1.6,
  commentSpacing: 12,
  translationEngine: 'mymemory',
  googleApiKey: '',
  deeplApiKey: '',
  youdaoAppId: '',
  youdaoAppSecret: ''
};

// Load configuration from storage
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
  config.enhanceEnabled = result.enhanceEnabled !== false; // default true
  config.translationEnabled = result.translationEnabled !== false; // default true
  config.fontSize = Number.isFinite(result.fontSize) ? result.fontSize : 14;
  config.lineHeight = Number.isFinite(result.lineHeight) ? result.lineHeight : 1.6;
  config.commentSpacing = Number.isFinite(result.commentSpacing) ? result.commentSpacing : 12;
  config.translationEngine = result.translationEngine || 'mymemory';
  config.googleApiKey = result.googleApiKey || '';
  config.deeplApiKey = result.deeplApiKey || '';
  config.youdaoAppId = result.youdaoAppId || '';
  config.youdaoAppSecret = result.youdaoAppSecret || '';

  applyCustomization();
  
  if (config.enhanceEnabled) {
    enhanceReadability();
  }
  
  if (config.translationEnabled) {
    addTranslationButtons();
    setupCommentObserver();
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

    if (changes.fontSize || changes.lineHeight || changes.commentSpacing) {
      config.fontSize = Number.isFinite(changes.fontSize?.newValue) ? changes.fontSize.newValue : config.fontSize;
      config.lineHeight = Number.isFinite(changes.lineHeight?.newValue) ? changes.lineHeight.newValue : config.lineHeight;
      config.commentSpacing = Number.isFinite(changes.commentSpacing?.newValue) ? changes.commentSpacing.newValue : config.commentSpacing;
      applyCustomization();
    }

    if (changes.translationEngine) {
      config.translationEngine = changes.translationEngine.newValue || 'mymemory';
    }

    if (changes.googleApiKey) {
      config.googleApiKey = changes.googleApiKey.newValue || '';
    }

    if (changes.deeplApiKey) {
      config.deeplApiKey = changes.deeplApiKey.newValue || '';
    }

    if (changes.youdaoAppId) {
      config.youdaoAppId = changes.youdaoAppId.newValue || '';
    }

    if (changes.youdaoAppSecret) {
      config.youdaoAppSecret = changes.youdaoAppSecret.newValue || '';
    }
  }
});

// Enhance readability by adding CSS class
function enhanceReadability() {
  document.body.classList.add('hn-enhanced');
}

function applyCustomization() {
  document.documentElement.style.setProperty('--hn-base-font-size', `${config.fontSize}px`);
  document.documentElement.style.setProperty('--hn-line-height', `${config.lineHeight}`);
  document.documentElement.style.setProperty('--hn-comment-spacing', `${config.commentSpacing}px`);
}

// Add translation buttons to comments
function addTranslationButtons() {
  const comments = document.querySelectorAll('.commtext');
  
  comments.forEach((comment) => {
    // Skip if already has translation button
    const commentContainer = comment.closest('tr') || comment.closest('td') || comment.parentElement;
    if (commentContainer?.querySelector('.hn-translate-btn')) {
      return;
    }
    
    // Find the comment header
    const comhead = commentContainer?.querySelector('.comhead') || comment.closest('td')?.querySelector('.comhead');
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

// Observe DOM changes to handle dynamically loaded comments
function setupCommentObserver() {
  const observer = new MutationObserver((mutations) => {
    // Check if new comments were added
    let hasNewComments = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && (node.classList?.contains('athing') || node.querySelector?.('.commtext'))) {
            hasNewComments = true;
            break;
          }
        }
      }
      if (hasNewComments) break;
    }
    
    if (hasNewComments && config.translationEnabled) {
      addTranslationButtons();
    }
  });
  
  // Observe the main content area for changes
  const targetNode = document.querySelector('body');
  if (targetNode) {
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }
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
  button.classList.add('hn-translate-btn-disabled');
  const originalText = button.textContent;
  button.textContent = '...';
  button.style.pointerEvents = 'none';
  
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
    button.classList.remove('hn-translate-btn-disabled');
    button.textContent = originalText;
    button.style.pointerEvents = '';
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
  
  // Split by sentence-like boundaries, but be careful with abbreviations
  // This regex looks for sentence endings followed by space and capital letter
  const sentencePattern = /[.!?]+\s+(?=[A-Z])/g;
  const sentences = text.split(sentencePattern);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxLength) {
      currentChunk += sentence + ' ';
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      // If single sentence is too long, split by words
      if (sentence.length > maxLength) {
        const words = sentence.split(/\s+/);
        let wordChunk = '';
        for (const word of words) {
          if (wordChunk.length + word.length + 1 <= maxLength) {
            wordChunk += word + ' ';
          } else {
            if (wordChunk) {
              chunks.push(wordChunk.trim());
            }
            wordChunk = word + ' ';
          }
        }
        if (wordChunk) {
          currentChunk = wordChunk;
        }
      } else {
        currentChunk = sentence + ' ';
      }
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text];
}

// Translate a single chunk of text
async function translateChunk(text) {
  try {
    switch (config.translationEngine) {
      case 'google':
        return await translateWithGoogle(text);
      case 'deepl':
        return await translateWithDeepl(text);
      case 'youdao':
        return await translateWithYoudao(text);
      default:
        return await translateWithMyMemory(text);
    }
  } catch (error) {
    console.error('Translation chunk error:', error);
    // Fallback: return original text with a note
    return `[Translation unavailable: ${text.substring(0, 100)}...]`;
  }
}

async function translateWithMyMemory(text) {
  // Using MyMemory Translation API (free, no API key required, but has rate limits)
  const encodedText = encodeURIComponent(text);
  const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|zh-CN`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.responseStatus === 200 && data.responseData) {
    return data.responseData.translatedText;
  }

  throw new Error('MyMemory API error');
}

async function translateWithGoogle(text) {
  if (!config.googleApiKey) {
    throw new Error('Google API key missing');
  }

  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(config.googleApiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      target: 'zh-CN',
      source: 'en',
      format: 'text'
    })
  });

  const data = await response.json();
  const translatedText = data?.data?.translations?.[0]?.translatedText;
  if (!translatedText) {
    throw new Error('Google Translate API error');
  }

  return translatedText;
}

async function translateWithDeepl(text) {
  if (!config.deeplApiKey) {
    throw new Error('DeepL API key missing');
  }

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `DeepL-Auth-Key ${config.deeplApiKey}`
    },
    body: new URLSearchParams({
      text,
      target_lang: 'ZH',
      source_lang: 'EN'
    })
  });

  const data = await response.json();
  const translatedText = data?.translations?.[0]?.text;
  if (!translatedText) {
    throw new Error('DeepL API error');
  }

  return translatedText;
}

async function translateWithYoudao(text) {
  if (!config.youdaoAppId || !config.youdaoAppSecret) {
    throw new Error('Youdao credentials missing');
  }

  const salt = `${Date.now()}`;
  const curtime = Math.round(Date.now() / 1000).toString();
  const signStr = `${config.youdaoAppId}${text}${salt}${curtime}${config.youdaoAppSecret}`;
  const sign = await sha256(signStr);

  const response = await fetch('https://openapi.youdao.com/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      q: text,
      from: 'en',
      to: 'zh-CHS',
      appKey: config.youdaoAppId,
      salt,
      sign,
      signType: 'v3',
      curtime
    })
  });

  const data = await response.json();
  const translatedText = data?.translation?.[0];
  if (!translatedText) {
    throw new Error('Youdao API error');
  }

  return translatedText;
}

async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Content will be initialized via chrome.storage.sync.get callback
  });
}
