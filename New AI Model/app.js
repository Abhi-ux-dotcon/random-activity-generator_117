// ==========================================================================
// Configuration and Constants
// ==========================================================================

// Theme configuration
const THEMES = {
    light: { icon: 'fa-moon', name: 'Light' },
    dark: { icon: 'fa-sun', name: 'Dark' },
    ocean: { icon: 'fa-water', name: 'Ocean' },
    forest: { icon: 'fa-tree', name: 'Forest' },
    sunset: { icon: 'fa-sun', name: 'Sunset' },
    midnight: { icon: 'fa-moon', name: 'Midnight' }
};

// Category icons mapping
const CATEGORY_ICONS = {
    education: 'fa-graduation-cap',
    recreation: 'fa-running',
    social: 'fa-users',
    DIY: 'fas fa-tools'
};

// Error message types and their configurations
const ERROR_TYPES = {
    error: {
        icon: 'fa-exclamation-circle',
        duration: 5000
    },
    warning: {
        icon: 'fa-exclamation-triangle',
        duration: 4000
    },
    success: {
        icon: 'fa-check-circle',
        duration: 3000
    },
    info: {
        icon: 'fa-info-circle',
        duration: 4000
    }
};

// ==========================================================================
// DOM Elements and State Management
// ==========================================================================

// Cache DOM elements for better performance
const DOM = {
    generateBtn: document.querySelector('.generate-btn'),
    categoriesSection: document.querySelector('.categories'),
    resultArea: document.querySelector('.result-area'),
    loadingElement: document.querySelector('.loading'),
    activityResult: document.querySelector('.activity-result'),
    activityCard: document.querySelector('.activity-card'),
    themeSwitch: document.querySelector('.theme-switch'),
    themeIcon: document.querySelector('.theme-switch i'),
    errorContainer: document.createElement('div'),
    historyContainer: document.createElement('div'),
    timerContainer: document.createElement('div')
};

// Application state management
const state = {
    selectedCategories: new Set(),
    activityHistory: [],
    favoriteActivities: new Set(),
    isGenerating: false,
    currentThemeIndex: 0,
    timer: null,
    timerDuration: 0
};

// ==========================================================================
// Input Validation
// ==========================================================================

const validators = {
    hasSelectedCategories: () => state.selectedCategories.size > 0,
    isValidCategory: (category) => Object.keys(activities).includes(category),
    isGenerating: () => state.isGenerating,
    hasActivities: (category) => activities[category] && activities[category].length > 0,
    isDuplicateActivity: (activity) => {
        if (state.activityHistory.length === 0) return false;
        return state.activityHistory[0].activity === activity;
    }
};

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format timestamp to relative time
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
}

/**
 * Get appropriate icon for error type
 * @param {string} type - Error type
 * @returns {string} Icon class name
 */
function getErrorIcon(type) {
    return ERROR_TYPES[type]?.icon || ERROR_TYPES.error.icon;
}

// ==========================================================================
// UI Update Functions
// ==========================================================================

/**
 * Update the generate button state based on current conditions
 */
function updateGenerateButtonState() {
    const hasCategories = validators.hasSelectedCategories();
    const isGenerating = state.isGenerating;
    
    DOM.generateBtn.disabled = !hasCategories || isGenerating;
    DOM.generateBtn.setAttribute('aria-disabled', !hasCategories || isGenerating);
    
    if (!hasCategories) {
        DOM.generateBtn.classList.add('disabled');
        DOM.generateBtn.setAttribute('aria-label', 'Please select at least one category');
    } else if (isGenerating) {
        DOM.generateBtn.classList.add('generating');
        DOM.generateBtn.setAttribute('aria-label', 'Generating activity...');
    } else {
        DOM.generateBtn.classList.remove('disabled', 'generating');
        DOM.generateBtn.setAttribute('aria-label', 'Generate random activity');
    }
}

/**
 * Update the theme icon based on current theme
 */
function updateThemeIcon() {
    const theme = Object.keys(THEMES)[state.currentThemeIndex];
    DOM.themeIcon.className = `fas ${THEMES[theme].icon}`;
}

/**
 * Update the activity history display
 */
function updateHistory() {
    const historyHTML = `
        <h4>Recent Activities</h4>
        <ul class="history-list">
            ${state.activityHistory.slice(0, 3).map(item => `
                <li class="history-item">
                    <span class="activity-text">${item.activity}</span>
                    <span class="activity-time">${formatTime(item.timestamp)}</span>
                </li>
            `).join('')}
        </ul>
    `;
    
    DOM.historyContainer.innerHTML = historyHTML;
    
    // Add animation to new history items
    const newItems = DOM.historyContainer.querySelectorAll('.history-item');
    newItems.forEach(item => {
        item.style.animation = 'none';
        item.offsetHeight; // Trigger reflow
        item.style.animation = null;
    });
}

// ==========================================================================
// Event Handlers
// ==========================================================================

/**
 * Handle category selection/deselection
 * @param {string} category - Category name
 * @param {HTMLElement} button - Category button element
 */
function toggleCategory(category, button) {
    console.log('Toggling category:', category); // Debug log
    
    if (!validators.isValidCategory(category)) {
        showError('Invalid category selected', 'error');
        return;
    }
    
    if (!validators.hasActivities(category)) {
        showError('No activities available in this category', 'warning');
        return;
    }
    
    const isSelected = state.selectedCategories.has(category);
    console.log('Is selected:', isSelected); // Debug log
    
    if (isSelected) {
        state.selectedCategories.delete(category);
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
        
        if (state.selectedCategories.size === 0) {
            showError('Please select at least one category', 'warning');
        }
    } else {
        state.selectedCategories.add(category);
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
    }
    
    console.log('Selected categories:', Array.from(state.selectedCategories)); // Debug log
    updateGenerateButtonState();
}

// ==========================================================================
// Activities Data
// ==========================================================================

const activities = {
    education: [
        "Learn a new programming language",
        "Read a technical book",
        "Take an online course",
        "Practice coding challenges",
        "Watch educational videos",
        "Join a study group",
        "Write a technical blog post",
        "Build a small project"
    ],
    recreation: [
        "Go for a walk in the park",
        "Play a sport",
        "Do some yoga",
        "Go swimming",
        "Ride a bike",
        "Play board games",
        "Go hiking",
        "Try a new workout"
    ],
    social: [
        "Call a friend",
        "Plan a meetup",
        "Join a club",
        "Attend a local event",
        "Host a dinner party",
        "Volunteer in your community",
        "Join a social group",
        "Organize a game night"
    ],
    DIY: [
        "Build something with wood",
        "Create a craft project",
        "Fix something around the house",
        "Start a garden",
        "Make homemade gifts",
        "Repurpose old items",
        "Learn basic carpentry",
        "Try a new DIY project"
    ]
};

/**
 * Handle activity generation
 */
function generateActivity() {
    console.log('Generating activity...'); // Debug log
    console.log('Selected categories:', Array.from(state.selectedCategories)); // Debug log
    
    if (!validators.hasSelectedCategories()) {
        showError('Please select at least one category', 'warning');
        highlightEmptyCategories();
        return;
    }
    
    if (state.isGenerating) {
        console.log('Already generating...'); // Debug log
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        try {
            const activity = getRandomActivity();
            console.log('Generated activity:', activity); // Debug log
            
            if (!activity) {
                throw new Error('No activity could be generated');
            }
            
            // Display the result
            DOM.activityResult.innerHTML = `
                <div class="activity-card">
                    <h3>${activity}</h3>
                    <div class="activity-actions">
                        <button class="favorite-btn" aria-label="Add to favorites">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="timer-btn" aria-label="Start timer">
                            <i class="fas fa-clock"></i>
                        </button>
                        <div class="share-buttons">
                            <button class="share-btn twitter" aria-label="Share on Twitter">
                                <i class="fab fa-twitter"></i>
                            </button>
                            <button class="share-btn facebook" aria-label="Share on Facebook">
                                <i class="fab fa-facebook"></i>
                            </button>
                            <button class="share-btn whatsapp" aria-label="Share on WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Show the result
            DOM.resultArea.classList.add('visible');
            DOM.activityResult.classList.add('visible');
            
            // Add to history
            addToHistory(activity);
            
            // Show success message
            showError('Activity generated successfully!', 'success', 3000);
            
            // Add event listeners to the new buttons
            const favoriteBtn = DOM.activityResult.querySelector('.favorite-btn');
            const timerBtn = DOM.activityResult.querySelector('.timer-btn');
            const shareButtons = DOM.activityResult.querySelectorAll('.share-btn');
            
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', () => toggleFavorite(activity, favoriteBtn));
            }
            if (timerBtn) {
                timerBtn.addEventListener('click', () => toggleTimer(activity, timerBtn));
            }
            shareButtons.forEach(btn => {
                btn.addEventListener('click', () => shareActivity(activity, btn.classList[1]));
            });
            
        } catch (error) {
            console.error('Activity generation error:', error);
            showError('Error generating activity. Please try again.', 'error');
        } finally {
            showLoading(false);
        }
    }, 1500);
}

/**
 * Get a random activity from selected categories
 * @returns {string} Random activity
 */
function getRandomActivity() {
    console.log('Getting random activity...'); // Debug log
    
    let possibleActivities = [];
    state.selectedCategories.forEach(category => {
        console.log('Checking category:', category); // Debug log
        if (activities[category] && activities[category].length > 0) {
            possibleActivities = possibleActivities.concat(activities[category]);
            console.log('Activities in category:', activities[category]); // Debug log
        }
    });
    
    console.log('Total possible activities:', possibleActivities.length); // Debug log
    
    if (possibleActivities.length === 0) {
        throw new Error('No activities available for selected categories');
    }
    
    let activity;
    let attempts = 0;
    const maxAttempts = 3;
    
    do {
        const randomIndex = Math.floor(Math.random() * possibleActivities.length);
        activity = possibleActivities[randomIndex];
        attempts++;
        console.log('Attempt', attempts, 'Activity:', activity); // Debug log
    } while (validators.isDuplicateActivity(activity) && attempts < maxAttempts);
    
    return activity;
}

/**
 * Add activity to history
 * @param {string} activity - Activity to add
 */
function addToHistory(activity) {
    console.log('Adding to history:', activity); // Debug log
    
    state.activityHistory.unshift({
        activity,
        timestamp: new Date().toISOString(),
        categories: Array.from(state.selectedCategories)
    });
    
    if (state.activityHistory.length > 10) {
        state.activityHistory.pop();
    }
    
    updateHistory();
}

// ==========================================================================
// Initialization
// ==========================================================================

/**
 * Initialize the application
 */
function initialize() {
    console.log('Initializing application...'); // Debug log
    
    // Set up containers
    setupContainers();
    
    // Initialize categories
    initializeCategories();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load saved state
    loadSavedState();
    
    // Update initial UI state
    updateGenerateButtonState();
    
    console.log('Application initialized'); // Debug log
}

/**
 * Set up DOM containers
 */
function setupContainers() {
    DOM.errorContainer.className = 'error-container';
    DOM.errorContainer.setAttribute('role', 'alert');
    DOM.errorContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(DOM.errorContainer);
    
    DOM.historyContainer.className = 'history-container';
    DOM.historyContainer.setAttribute('aria-label', 'Recent activities');
    document.querySelector('.container').appendChild(DOM.historyContainer);
    
    DOM.timerContainer.className = 'timer-container';
    DOM.timerContainer.setAttribute('aria-label', 'Activity timer');
    document.querySelector('.container').appendChild(DOM.timerContainer);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    DOM.generateBtn.addEventListener('click', generateActivity);
    DOM.themeSwitch.addEventListener('click', handleThemeSwitch);
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Make sure to call initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    initialize();
});

// ==========================================================================
// Helper Functions
// ==========================================================================

/**
 * Save favorites to local storage with error handling
 */
function saveFavorites() {
    try {
        const favoritesArray = Array.from(state.favoriteActivities);
        localStorage.setItem('favoriteActivities', JSON.stringify(favoritesArray));
        console.log('Favorites saved successfully');
    } catch (error) {
        console.error('Error saving favorites:', error);
        showError('Failed to save favorites. Please try again.', 'error');
    }
}

/**
 * Load favorites from local storage with error handling
 */
function loadFavorites() {
    try {
        const savedFavorites = localStorage.getItem('favoriteActivities');
        if (savedFavorites) {
            const favoritesArray = JSON.parse(savedFavorites);
            state.favoriteActivities = new Set(favoritesArray);
            console.log('Favorites loaded successfully');
            return true;
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        showError('Failed to load saved favorites', 'error');
    }
    return false;
}

/**
 * Show Loading State
 */
function showLoading(show) {
    console.log('Loading state:', show); // Debug log
    
    if (show) {
        state.isGenerating = true;
        DOM.loadingElement.style.display = 'flex';
        DOM.loadingElement.hidden = false;
        DOM.loadingElement.classList.add('visible');
        
        // Add loading text
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Generating your activity...';
        DOM.loadingElement.appendChild(loadingText);
        
        if (DOM.activityResult) {
            DOM.activityResult.classList.remove('visible');
        }
        DOM.generateBtn.setAttribute('aria-busy', 'true');
        DOM.generateBtn.disabled = true;
    } else {
        state.isGenerating = false;
        DOM.loadingElement.classList.remove('visible');
        // Remove loading text
        const loadingText = DOM.loadingElement.querySelector('.loading-text');
        if (loadingText) {
            loadingText.remove();
        }
        // Add a small delay before hiding to allow for fade out
        setTimeout(() => {
            DOM.loadingElement.style.display = 'none';
            DOM.loadingElement.hidden = true;
            DOM.generateBtn.setAttribute('aria-busy', 'false');
            DOM.generateBtn.disabled = false;
        }, 300);
    }
}

// Show Error Message with enhanced feedback
function showError(message, type = 'error', duration = 5000) {
    const errorHTML = `
        <div class="error-message ${type}" role="alert">
            <i class="fas ${getErrorIcon(type)}" aria-hidden="true"></i>
            <p>${message}</p>
            ${type === 'warning' ? '<button class="error-close" aria-label="Dismiss message">×</button>' : ''}
        </div>
    `;
    
    DOM.errorContainer.innerHTML = errorHTML;
    DOM.errorContainer.classList.add('visible');
    
    // Add click handler for close button
    const closeBtn = DOM.errorContainer.querySelector('.error-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            DOM.errorContainer.classList.remove('visible');
        });
    }
    
    // Auto-hide error with animation
    setTimeout(() => {
        DOM.errorContainer.classList.remove('visible');
    }, duration);
}

/**
 * Initialize Category Buttons
 */
function initializeCategories() {
    // Clear existing buttons
    DOM.categoriesSection.innerHTML = '';
    
    // Create buttons for each category
    Object.keys(activities).forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.setAttribute('data-category', category);
        button.setAttribute('aria-pressed', 'false');
        
        // Add icon based on category
        const icon = document.createElement('i');
        icon.className = `fas ${CATEGORY_ICONS[category] || 'fa-star'}`;
        button.appendChild(icon);
        
        // Add category name
        const text = document.createElement('span');
        text.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        button.appendChild(text);
        
        // Add click handler
        button.addEventListener('click', () => {
            console.log('Category clicked:', category); // Debug log
            toggleCategory(category, button);
        });
        
        DOM.categoriesSection.appendChild(button);
    });
}

// Get appropriate icon for category
function getCategoryIcon(category) {
    return CATEGORY_ICONS[category] || 'fas fa-star';
}

// Highlight empty categories
function highlightEmptyCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        const category = button.dataset.category;
        if (!validators.hasActivities(category)) {
            button.classList.add('empty');
            button.setAttribute('aria-invalid', 'true');
        }
    });
    
    // Remove highlight after animation
    setTimeout(() => {
        categoryButtons.forEach(button => {
            button.classList.remove('empty');
            button.removeAttribute('aria-invalid');
        });
    }, 2000);
}

// Enhanced keyboard navigation
function handleKeyboardNavigation(event) {
    const target = event.target;
    
    // Handle category buttons
    if (target.classList.contains('category-btn')) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                const category = target.dataset.category;
                toggleCategory(category, target);
                break;
            case 'ArrowRight':
                event.preventDefault();
                focusNextButton(target);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                focusPreviousButton(target);
                break;
        }
    }
    
    // Handle generate button
    if (target.classList.contains('generate-btn')) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            generateActivity();
        }
    }
}

// Focus management
function focusNextButton(currentButton) {
    const buttons = Array.from(document.querySelectorAll('.category-btn'));
    const currentIndex = buttons.indexOf(currentButton);
    const nextButton = buttons[(currentIndex + 1) % buttons.length];
    nextButton.focus();
}

function focusPreviousButton(currentButton) {
    const buttons = Array.from(document.querySelectorAll('.category-btn'));
    const currentIndex = buttons.indexOf(currentButton);
    const prevButton = buttons[(currentIndex - 1 + buttons.length) % buttons.length];
    prevButton.focus();
}

// Theme switch click handler
DOM.themeSwitch.addEventListener('click', () => {
    state.currentThemeIndex = (state.currentThemeIndex + 1) % Object.keys(THEMES).length;
    const newTheme = Object.keys(THEMES)[state.currentThemeIndex];
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// Toggle Favorite
function toggleFavorite(activity, button) {
    const icon = button.querySelector('i');
    
    if (state.favoriteActivities.has(activity)) {
        state.favoriteActivities.delete(activity);
        icon.className = 'far fa-heart';
        showError('Removed from favorites', 'info');
    } else {
        state.favoriteActivities.add(activity);
        icon.className = 'fas fa-heart';
        // Add success animation
        button.classList.add('success-animation');
        setTimeout(() => {
            button.classList.remove('success-animation');
        }, 500);
        showError('Added to favorites', 'success');
    }
    
    // Save to localStorage
    saveFavorites();
}

// Timer Functions
function toggleTimer(activity, button) {
    if (state.timer) {
        stopTimer();
        button.innerHTML = '<i class="fas fa-clock"></i>';
        button.setAttribute('aria-label', 'Start timer');
        showError('Timer stopped');
    } else {
        startTimer(activity, button);
        button.innerHTML = '<i class="fas fa-stop"></i>';
        button.setAttribute('aria-label', 'Stop timer');
        showError('Timer started');
    }
}

function startTimer(activity, button) {
    // Default duration: 30 minutes
    state.timerDuration = 30 * 60;
    updateTimerDisplay();
    
    state.timer = setInterval(() => {
        state.timerDuration--;
        updateTimerDisplay();
        
        if (state.timerDuration <= 0) {
            stopTimer();
            button.innerHTML = '<i class="fas fa-clock"></i>';
            button.setAttribute('aria-label', 'Start timer');
            showError('Time\'s up! How was your activity?');
        }
    }, 1000);
}

function stopTimer() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
        state.timerDuration = 0;
        updateTimerDisplay();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(state.timerDuration / 60);
    const seconds = state.timerDuration % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    DOM.timerContainer.innerHTML = state.timer ? `
        <div class="timer">
            <i class="fas fa-clock"></i>
            <span>${display}</span>
        </div>
    ` : '';
}

// Enhanced Share Activity
function shareActivity(activity, platform) {
    const text = `I'm going to: ${activity}`;
    const url = window.location.href;
    
    let shareUrl;
    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        default:
            if (navigator.share) {
                navigator.share({
                    title: 'Random Activity',
                    text: text,
                    url: url
                }).catch(error => {
                    console.error('Error sharing:', error);
                });
                return;
            }
            // Fallback to clipboard
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showError('Activity copied to clipboard!');
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Reset Generator
function resetGenerator() {
    state.selectedCategories.clear();
    document.querySelectorAll('.category-btn').forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
    });
    updateGenerateButtonState();
    DOM.resultArea.classList.remove('visible');
}

// Testing Guide
/*
To test the JavaScript implementation:

1. Unit Testing:
   - Test category selection/deselection
   - Test activity generation
   - Test error handling
   - Test state management
   - Test theme switching

2. Integration Testing:
   - Test keyboard navigation
   - Test touch interactions
   - Test theme persistence
   - Test favorites system
   - Test sharing functionality

3. Performance Testing:
   - Test debounced functions
   - Test animation performance
   - Test memory usage
   - Test DOM manipulation efficiency

4. Accessibility Testing:
   - Test screen reader compatibility
   - Test keyboard navigation
   - Test ARIA attributes
   - Test focus management
   - Test error announcements

5. Browser Testing:
   - Test in different browsers
   - Test on different devices
   - Test with different screen sizes
   - Test with different input methods

Common Debugging Techniques:
1. Console Logging:
   - Use console.log() for basic debugging
   - Use console.error() for errors
   - Use console.warn() for warnings
   - Use console.table() for structured data

2. Breakpoints:
   - Set breakpoints in DevTools
   - Use debugger statement
   - Use conditional breakpoints
   - Use logpoints

3. Performance Profiling:
   - Use Performance tab in DevTools
   - Monitor memory usage
   - Check for memory leaks
   - Analyze animation performance

4. Network Monitoring:
   - Check network requests
   - Monitor API calls
   - Check for failed requests
   - Analyze response times

5. Error Tracking:
   - Use try-catch blocks
   - Implement error boundaries
   - Log errors to console
   - Show user-friendly error messages
*/

// Add saveSelectedCategories function
function saveSelectedCategories() {
    try {
        const categories = Array.from(state.selectedCategories);
        localStorage.setItem('selectedCategories', JSON.stringify(categories));
    } catch (error) {
        console.error('Error saving selected categories:', error);
    }
}

// Update the loadSavedState function
function loadSavedState() {
    try {
        // Load favorites
        loadFavorites();
        
        // Load theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            state.currentThemeIndex = Object.keys(THEMES).indexOf(savedTheme);
            updateThemeIcon();
        }
        
        // Load last selected categories
        const savedCategories = localStorage.getItem('selectedCategories');
        if (savedCategories) {
            const categories = JSON.parse(savedCategories);
            categories.forEach(category => {
                if (validators.isValidCategory(category)) {
                    state.selectedCategories.add(category);
                    const button = document.querySelector(`[data-category="${category}"]`);
                    if (button) {
                        button.classList.add('active');
                        button.setAttribute('aria-pressed', 'true');
                    }
                }
            });
        }
        
        console.log('State loaded successfully');
    } catch (error) {
        console.error('Error loading saved state:', error);
        showError('Error loading saved preferences', 'error');
    }
} 