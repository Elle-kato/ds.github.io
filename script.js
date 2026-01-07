/* script.js */

// 1. デザインシステムのデータリスト
const designSystems = [
    {
        id: "ds_retro_01",
        title: "Retro Modern Revival",
        tags: ["Retro", "Geometric", "Bold"],
        theme: "theme-retro-modern", // style.cssで定義したクラス名
        // 画像はプレースホルダーにしていますが、'images/filename.png' に書き換えてください
        image: "Retro Modern Revival.png", 
        description: "アナログの温かみとデジタルな幾何学を融合させた「洗練された反逆者」。焦がし橙（Burnt Orange）の大胆なアクセントと、数学的に純粋な形状が特徴。",
        prompt: "High-end editorial fashion photography, 16:9 aspect ratio, mid-century modern aesthetic, a model with sharp features and geometric bob hair, wearing structured velvet tailoring in burnt orange and deep teal, standing in a minimalist concrete architectural space with a single vintage wooden chair, harsh sunlight casting deep cinematic shadows, film grain texture, cream-toned highlights, nostalgic yet sophisticated vibe, shot on 35mm lens --ar 16:9 --v 6.0 --style raw"
    },
    {
        id: "ds_002",
        title: "Organic Pastel Life",
        tags: ["Nature", "Pastel", "Soft"],
        theme: "theme-pastel",
        image: "https://placehold.co/600x400/fff0f5/ff69b4?text=Pastel",
        description: "自然由来の柔らかい曲線とパステルカラーを使用した、優しい印象のデザイン。",
        prompt: "Organic shape UI elements, pastel pink and beige, soft lighting, minimalism, natural vibes, web design --v 6.0"
    },
    {
        id: "ds_003",
        title: "Swiss Minimalist",
        tags: ["Minimal", "Typography", "Clean"],
        theme: "theme-minimal",
        image: "https://placehold.co/600x400/ffffff/000000?text=Minimal",
        description: "スイススタイルに影響を受けた、タイポグラフィ中心の厳格なグリッドシステム。",
        prompt: "Swiss style graphic design, bold typography, grid system, black and white, minimalist aesthetic, clean lines --ar 16:9"
    }
];

// --- 以下、ロジック部分は変更ありません ---

// 2. メインページ（index.html）向けの処理
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
            card.className = 'card';
            card.onclick = (e) => {
                window.location.href = `detail.html?id=${item.id}`;
            };

            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="card-img">
                <div class="card-body">
                    <h3>${item.title}</h3>
                    <div class="tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <button class="btn-copy" onclick="copyPrompt(event, '${item.prompt.replace(/'/g, "\\'")}')">Copy Prompt</button>
                        <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFav(event, '${item.id}', this)">
                            ♥
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// 3. 詳細ページ（detail.html）向けの処理
if (document.getElementById('detail-content')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const item = designSystems.find(ds => ds.id === id);

    if (item) {
        document.body.classList.add(item.theme);

        const container = document.getElementById('detail-content');
        container.innerHTML = `
            <span style="font-size:0.8rem; text-transform:uppercase; letter-spacing:2px; display:block; margin-bottom:10px; opacity:0.7;">Design System</span>
            <h1 style="font-size:2.5rem; margin-top:0;">${item.title}</h1>
            
            <img src="${item.image}" alt="${item.title}" class="detail-img">
            
            <div style="margin: 2rem 0;">
                <h3 style="margin-bottom:0.5rem;">Concept</h3>
                <p style="line-height:1.8;">${item.description}</p>
            </div>
            
            <h3 style="margin-top:2rem;">Generation Prompt</h3>
            <div class="prompt-box">
                <code>${item.prompt}</code>
                <button class="btn-copy" style="position:absolute; top:10px; right:10px;" onclick="copyPrompt(event, '${item.prompt.replace(/'/g, "\\'")}')">Copy</button>
            </div>
            
            <div class="tags" style="margin-top:2rem;">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    } else {
        document.body.innerHTML = "<div style='padding:2rem;'><h1>Not Found</h1><a href='index.html'>Back</a></div>";
    }
}

function copyPrompt(e, text) {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
        alert('Prompt copied to clipboard!');
    });
}

function toggleFav(e, id, btn) {
    e.stopPropagation();
    const current = localStorage.getItem(`fav_${id}`) === 'true';
    localStorage.setItem(`fav_${id}`, !current);
    btn.classList.toggle('active');
}
