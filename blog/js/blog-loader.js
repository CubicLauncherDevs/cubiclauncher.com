// ── Configuration ────────────────────────────────────────────────────────────
const POSTS_INDEX = 'post/index.json';
const POSTS_PATH  = 'post/';

// ── State ─────────────────────────────────────────────────────────────────────
let allPosts = [];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format ISO date string to localised Spanish date */
function formatDate(isoDate) {
    const d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Strip YAML frontmatter (--- ... ---) from markdown text */
function stripFrontmatter(md) {
    return md.replace(/^---[\s\S]*?---\s*\n?/, '');
}

/** Build a GitHub avatar URL from a username */
function avatarUrl(githubLogin) {
    if (!githubLogin) return 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
    return `https://github.com/${encodeURIComponent(githubLogin)}.png?size=72`;
}

/** Render badge HTML for an array of tag strings */
function renderTags(tags) {
    if (!tags || !tags.length) return '';
    return tags.map(t => `<span class="post-tag">${t}</span>`).join('');
}

// ── Load & boot ───────────────────────────────────────────────────────────────

async function loadIndex() {
    const res = await fetch(POSTS_INDEX);
    if (!res.ok) throw new Error('No se pudo cargar el índice de posts');
    const posts = await res.json();
    // Pinned first, then by date descending
    return posts.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Mobile menu
    const toggle   = document.getElementById('menuToggle');
    const sidebar  = document.getElementById('sidebar');
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('menu-open', sidebar.classList.contains('active'));
    });
    document.addEventListener('click', e => {
        if (window.innerWidth <= 960 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !toggle.contains(e.target)) {
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Configure marked
    marked.setOptions({
        highlight: (code, lang) => {
            if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
            return hljs.highlightAuto(code).value;
        },
        langPrefix: 'hljs language-',
        gfm: true,
        breaks: true
    });

    // Load post index
    try {
        allPosts = await loadIndex();
    } catch (e) {
        showError('No se pudo cargar la lista de posts.');
        return;
    }

    renderSidebar();
    initSearch();

    // Route based on URL hash
    window.addEventListener('popstate', route);
    route();
});

// ── Routing ───────────────────────────────────────────────────────────────────

function route() {
    const slug = window.location.hash.replace('#', '').trim();
    if (slug) {
        showPost(slug);
    } else {
        showList();
    }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function renderSidebar() {
    const nav = document.getElementById('sidebarPosts');
    if (!nav) return;

    let html = `<div class="sidebar-section-title">Artículos</div>`;
    allPosts.forEach(post => {
        const pinnedMark = post.pinned
            ? `<i class="fa-solid fa-thumbtack sidebar-pin-icon" title="Anclado"></i> `
            : '';
        html += `
            <a class="sidebar-post-link${post.pinned ? ' pinned' : ''}" href="#${post.slug}" data-slug="${post.slug}">
                ${pinnedMark}${post.title}
                <span class="sidebar-post-date">${formatDate(post.date)}</span>
            </a>`;
    });
    nav.innerHTML = html;

    // Click handlers — prevent double push
    nav.querySelectorAll('.sidebar-post-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const slug = link.getAttribute('data-slug');
            navigateTo(slug);
            if (window.innerWidth <= 960) {
                document.getElementById('sidebar').classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

function setActiveSidebarLink(slug) {
    document.querySelectorAll('.sidebar-post-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('data-slug') === slug);
    });
}

// ── List view ─────────────────────────────────────────────────────────────────

function showList(filteredPosts = null) {
    document.getElementById('blogListView').style.display = 'block';
    document.getElementById('blogPostView').style.display = 'none';
    document.querySelectorAll('.sidebar-post-link').forEach(l => l.classList.remove('active'));

    const posts = filteredPosts ?? allPosts;
    const grid  = document.getElementById('postsGrid');

    if (posts.length === 0) {
        grid.innerHTML = `
            <div class="loading-state" style="grid-column:1/-1">
                <i class="fa-solid fa-newspaper"></i>
                <p>No se encontraron artículos.</p>
            </div>`;
        return;
    }

    grid.innerHTML = posts.map(post => `
        <a class="post-card${post.pinned ? ' post-card--pinned' : ''}" href="#${post.slug}" data-slug="${post.slug}">
            <div class="post-card-top-row">
                <div class="post-card-tags">${renderTags(post.tags)}</div>
                ${post.pinned ? `<span class="post-pinned-badge"><i class="fa-solid fa-thumbtack"></i> Anclado</span>` : ''}
            </div>
            <div class="post-card-title">${post.title}</div>
            <div class="post-card-excerpt">${post.excerpt}</div>
            <div class="post-card-meta">
                <img src="${avatarUrl(post.authorGithub)}" alt="${post.author}" loading="lazy">
                <span>${post.author}</span>
                <span class="sep">·</span>
                <span>${formatDate(post.date)}</span>
            </div>
        </a>
    `).join('');

    // Card click handlers
    grid.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            navigateTo(card.getAttribute('data-slug'));
        });
    });
}

// ── Post view ─────────────────────────────────────────────────────────────────

async function showPost(slug) {
    const post = allPosts.find(p => p.slug === slug);
    if (!post) { showError(`Post "${slug}" no encontrado.`); return; }

    document.getElementById('blogListView').style.display = 'none';
    const postView = document.getElementById('blogPostView');
    postView.style.display = 'block';
    postView.innerHTML = `<div class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Cargando artículo...</p></div>`;

    setActiveSidebarLink(slug);

    try {
        const res = await fetch(`${POSTS_PATH}${slug}.md`);
        if (!res.ok) throw new Error('Not found');
        const raw = await res.text();
        const md  = stripFrontmatter(raw);

        postView.innerHTML = `
            <button class="post-back-btn" id="backBtn">
                <i class="fa-solid fa-arrow-left"></i> Blog
            </button>
            <div class="post-header">
                <div class="post-header-top-row">
                    <div class="post-header-tags">${renderTags(post.tags)}</div>
                    ${post.pinned ? `<span class="post-pinned-badge"><i class="fa-solid fa-thumbtack"></i> Anclado</span>` : ''}
                </div>
                <h1>${post.title}</h1>
                <div class="post-header-meta">
                    <img src="${avatarUrl(post.authorGithub)}" alt="${post.author}" loading="lazy">
                    <a href="https://github.com/${post.authorGithub}" target="_blank" rel="noopener" class="author-name">${post.author}</a>
                    <span class="sep">·</span>
                    <span>${formatDate(post.date)}</span>
                </div>
            </div>
            <div class="markdown-body" id="postBody"></div>
            <div class="post-footer">
                <img src="${avatarUrl(post.authorGithub)}" alt="${post.author}" loading="lazy">
                <div>
                    <div class="author-name">${post.author}</div>
                    <div style="font-size:0.75rem">Publicado el ${formatDate(post.date)}</div>
                </div>
            </div>
        `;

        document.getElementById('postBody').innerHTML = marked.parse(md);

        // Syntax highlight
        document.querySelectorAll('#postBody pre code').forEach(b => hljs.highlightElement(b));

        // Anchor IDs for headings
        document.querySelectorAll('#postBody h1, #postBody h2, #postBody h3').forEach(h => {
            if (!h.id) {
                h.id = h.textContent.toLowerCase()
                    .replace(/[^\w\u00C0-\u017F\- ]/g, '')
                    .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            }
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            window.history.pushState({}, '', window.location.pathname);
            showList();
        });

        // Scroll to top of content
        document.getElementById('blogPostView').scrollIntoView({ block: 'start', behavior: 'smooth' });

    } catch (err) {
        postView.innerHTML = `
            <button class="post-back-btn" id="backBtn">
                <i class="fa-solid fa-arrow-left"></i> Blog
            </button>
            <div class="error-state">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Artículo no disponible</h2>
                <p>Este post no se pudo cargar. Intenta más tarde.</p>
            </div>`;
        document.getElementById('backBtn').addEventListener('click', () => {
            window.history.pushState({}, '', window.location.pathname);
            showList();
        });
    }
}

function navigateTo(slug) {
    window.history.pushState({}, '', `#${slug}`);
    showPost(slug);
}

// ── Search ────────────────────────────────────────────────────────────────────

function initSearch() {
    const input   = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        results.style.display = 'none';
        if (q.length < 2) return;

        const matches = allPosts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            (p.tags || []).some(t => t.toLowerCase().includes(q))
        );

        if (matches.length === 0) {
            results.innerHTML = `<div class="search-no-results">No se encontraron resultados</div>`;
        } else {
            results.innerHTML = matches.slice(0, 8).map(p => `
                <div class="search-result-item" data-slug="${p.slug}">
                    <div class="search-result-header">
                        <span class="search-result-title">${p.title}</span>
                        <span class="search-result-tag">${(p.tags || [])[0] || ''}</span>
                    </div>
                    <div class="search-result-snippet">${p.excerpt}</div>
                </div>
            `).join('');
            results.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    results.style.display = 'none';
                    input.value = '';
                    navigateTo(item.getAttribute('data-slug'));
                    if (window.innerWidth <= 960) {
                        document.getElementById('sidebar').classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                });
            });
        }
        results.style.display = 'block';
    });

    document.addEventListener('click', e => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.style.display = 'none';
        }
    });
}

// ── Error ─────────────────────────────────────────────────────────────────────

function showError(msg) {
    document.getElementById('blogListView').style.display = 'block';
    document.getElementById('blogPostView').style.display = 'none';
    document.getElementById('postsGrid').innerHTML = `
        <div class="error-state" style="grid-column:1/-1">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h2>Error</h2>
            <p>${msg}</p>
        </div>`;
}

// Expose for inline calls if needed
window.navigateTo = navigateTo;
