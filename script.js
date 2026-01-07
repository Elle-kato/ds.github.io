/* script.js */

// 1. デザインシステムのデータリスト（ここを編集して自分の作品を追加）
const designSystems = [
    {
        id: "ds_001",
        title: "Neon Cyberpunk UI",
        tags: ["Cyberpunk", "Dark", "Neon"],
        theme: "theme-cyberpunk", // style.cssで定義したクラス名
        image: "Retro Modern Revival.png", // 自分の画像パスに変更 (例: 'images/cyber.jpg')
        description: "未来的なネオンカラーとグリッチノイズを取り入れたUIデザインシステム。",
        prompt: "Futuristic UI design system, neon green and purple color palette, dark background, glitch effect, high detailed, 4k --v 6.0"
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

// 2. メインページ（index.html）向けの処理
if (document.getElementById('gallery-grid')) {
    const grid = document.getElementById('gallery-grid');
    const searchInput = document.getElementById('search-input');
    const tagFilter = document.getElementById('tag-filter');
    const sortSelect = document.getElementById('sort-select');

    // 初期表示
    renderGallery(designSystems);

    // 検索・フィルタリング・並び替えイベント
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

        // 並び替え（単純なID順や名前順の例）
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
            // カード全体をクリックしたら詳細へ（ボタン類はイベント伝播を止める）
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
                        <button class="btn-copy" onclick="copyPrompt(event, '${item.prompt.replace(/'/g, "\\'")}')">Prompt Copy</button>
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
        // テーマ（世界観）を適用
        document.body.classList.add(item.theme);

        const container = document.getElementById('detail-content');
        container.innerHTML = `
            <h1>${item.title}</h1>
            <img src="${item.image}" alt="${item.title}" class="detail-img">
            <p>${item.description}</p>
            
            <h3>Prompt</h3>
            <div class="prompt-box">
                <code>${item.prompt}</code>
                <button class="btn-copy" style="position:absolute; top:10px; right:10px;" onclick="copyPrompt(event, '${item.prompt.replace(/'/g, "\\'")}')">Copy</button>
            </div>
            
            <div class="tags" style="margin-top:2rem;">
                ${item.tags.map(tag => `<span class="tag" style="background:rgba(0,0,0,0.1);">${tag}</span>`).join('')}
            </div>
        `;
    } else {
        document.body.innerHTML = "<h1>Design System Not Found</h1><a href='index.html'>Back</a>";
    }
}

// 4. 共通ユーティリティ（コピー機能・お気に入り）
function copyPrompt(e, text) {
    e.stopPropagation(); // カード遷移を止める
    navigator.clipboard.writeText(text).then(() => {
        alert('プロンプトをコピーしました！');
    });
}

function toggleFav(e, id, btn) {
    e.stopPropagation(); // カード遷移を止める
    const current = localStorage.getItem(`fav_${id}`) === 'true';
    localStorage.setItem(`fav_${id}`, !current);
    btn.classList.toggle('active');
}
