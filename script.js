/* script.js */

const designSystems = [
    {
        id: "ds_retro",
        title: "Retro Modern Revival",
        fileName: "retro.html", // ★ここが飛び先のHTMLファイル名
        tags: ["Retro", "Geometric", "Bold"],
        theme: "theme-retro-modern",
        image: "Retro Modern Revival.png", 
        prompt: "High-end editorial fashion photography..." // コピー用
    },
    {
        id: "ds_dark",
        title: "DARK_SUGAR_CULT",
        fileName: "dark_sugar.html", // ★ここが飛び先のHTMLファイル名
        tags: ["Goth", "Glitch", "Chemical"],
        theme: "theme-dark-sugar",
        image: "DARK_SUGAR_CULT.png",
        prompt: "High-flash editorial photography..."
    }
    // 必要に応じて追加
];

// メインページ（index.html）向けの処理
if (document.getElementById('gallery-grid')) {
    const grid = document.getElementById('gallery-grid');
    const searchInput = document.getElementById('search-input');
    const tagFilter = document.getElementById('tag-filter');
    const sortSelect = document.getElementById('sort-select');

    renderGallery(designSystems);

    searchInput.addEventListener('input', updateGallery);
    tagFilter.addEventListener('change', updateGallery);
    sortSelect.addEventListener('change', updateGallery);

    function updateGallery() {
        let filtered = designSystems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchInput.value.toLowerCase()) || 
                                  item.tags.some(tag => tag.toLowerCase().includes(searchInput.value.toLowerCase()));
            const matchesTag = tagFilter.value === 'all' || item.tags.includes(tagFilter.value);
            return matchesSearch && matchesTag;
        });

        if (sortSelect.value === 'name') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }
        renderGallery(filtered);
    }

    function renderGallery(items) {
        grid.innerHTML = '';
        items.forEach(item => {
            const isFav = localStorage.getItem(`fav_${item.id}`) === 'true';
            
            const card = document.createElement('div');
            card.className = `card ${item.theme}`; // テーマクラスをカード自体にも付与して雰囲気出し
            
            // ★クリックしたら個別のHTMLへ遷移
            card.onclick = (e) => {
                window.location.href = item.fileName;
            };

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="card-img">
                </div>
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <div class="tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <button class="btn-copy" onclick="copyPrompt(event, '${item.prompt.replace(/'/g, "\\'")}')">COPY</button>
                        <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFav(event, '${item.id}', this)">♥</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// 共通ユーティリティ
function copyPrompt(e, text) {
    if(e) e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => alert('Prompt Copied!'));
}

function toggleFav(e, id, btn) {
    if(e) e.stopPropagation();
    const key = `fav_${id}`;
    const current = localStorage.getItem(key) === 'true';
    localStorage.setItem(key, !current);
    btn.classList.toggle('active');
}
