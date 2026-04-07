// Tech Daily - Main Application

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderDate();
    renderHighlights();
    renderNewsCategories();
    renderArchive();
    initSearch();
    initCategoryFilter();
    initSubscribeForm();
}

// Render current date
function renderDate() {
    const dateEl = document.getElementById('currentDate');
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const dateStr = new Date(NEWS_DATA.date).toLocaleDateString('zh-CN', options);
    dateEl.textContent = dateStr;
}

// Render highlight cards
function renderHighlights() {
    const grid = document.getElementById('highlightGrid');
    grid.innerHTML = NEWS_DATA.highlights.map(item => `
        <article class="highlight-card" data-category="${item.category}">
            <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
            <p>${item.summary}</p>
            <div class="source">
                <span class="tag tag-${item.category}">${getCategoryName(item.category)}</span>
                <a href="${item.url}" target="_blank">${item.source}</a>
            </div>
        </article>
    `).join('');
}

// Render news categories
function renderNewsCategories() {
    const grid = document.getElementById('newsGrid');
    grid.innerHTML = Object.entries(NEWS_DATA.categories).map(([key, category]) => `
        <div class="news-category" data-category="${key}">
            <div class="category-header">
                <div class="category-icon ${key}">${category.icon}</div>
                <h3>${category.name}</h3>
            </div>
            <div class="news-list">
                ${category.items.map(item => `
                    <div class="news-item">
                        <h4><a href="${item.url}" target="_blank">${item.title}</a></h4>
                        <p class="summary">${item.summary}</p>
                        <div class="meta">
                            <a href="${item.url}" target="_blank">${item.source}</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Render archive links
function renderArchive() {
    const list = document.getElementById('archiveList');
    list.innerHTML = NEWS_DATA.archive.map(item => `
        <a href="${item.url}" class="archive-link">${item.date}</a>
    `).join('');
}

// Get category name from key
function getCategoryName(key) {
    const names = {
        ai: 'AI',
        auto: '汽车',
        chip: '半导体',
        embedded: '嵌入式',
        consumer: '消费电子'
    };
    return names[key] || key;
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            filterBySearch(query);
        }, 300);
    });
}

function filterBySearch(query) {
    // Filter highlights
    document.querySelectorAll('.highlight-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.classList.toggle('hidden', query && !text.includes(query));
    });

    // Filter news items
    document.querySelectorAll('.news-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.classList.toggle('hidden', query && !text.includes(query));
    });

    // Hide empty categories
    document.querySelectorAll('.news-category').forEach(category => {
        const visibleItems = category.querySelectorAll('.news-item:not(.hidden)');
        category.classList.toggle('hidden', visibleItems.length === 0);
    });
}

// Category filter functionality
function initCategoryFilter() {
    const navLinks = document.querySelectorAll('.nav-link[data-category]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Filter content
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const isAll = category === 'all';

    // Filter highlights
    document.querySelectorAll('.highlight-card').forEach(card => {
        const cardCategory = card.dataset.category;
        card.classList.toggle('hidden', !isAll && cardCategory !== category);
    });

    // Filter news categories
    document.querySelectorAll('.news-category').forEach(cat => {
        const catCategory = cat.dataset.category;
        cat.classList.toggle('hidden', !isAll && catCategory !== category);
    });
}

// Subscribe form
function initSubscribeForm() {
    const form = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (validateEmail(email)) {
            saveSubscriber(email);
            showToast('订阅成功！您将每天收到科技新闻推送');
            emailInput.value = '';
        } else {
            showToast('请输入有效的邮箱地址', 'error');
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function saveSubscriber(email) {
    // In production, send to backend API
    // For demo, save to localStorage
    const subscribers = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
    }

    // Log for demo purposes
    console.log('New subscriber:', email);
    console.log('All subscribers:', subscribers);
}

// Toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    if (type === 'error') {
        toast.style.background = 'var(--accent-red)';
    }

    document.body.appendChild(toast);

    // Show toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search on '/'
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput.value) {
            searchInput.value = '';
            filterBySearch('');
        }
        searchInput.blur();
    }
});
