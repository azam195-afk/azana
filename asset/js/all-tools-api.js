const TIKTOK_API_KEY = ""; 
const IG_API_KEY = "";     
const YT_API_KEY = "";     
const SPOTIFY_API_KEY = ""; 

async function downloadTikTok(url) {
    if (!url) {
        throw new Error("URL TikTok tidak boleh kosong!");
    }
    
    try {
        // Membersihkan dan memastikan URL terpampang valid untuk di-fetch
        const cleanUrl = url.trim();
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`;
        
        const response = await fetch(apiUrl);
        const resJson = await response.json();

        if (resJson.code === 0 && resJson.data) {
            const data = resJson.data;
            return {
                status: "success",
                platform: "tiktok",
                url: cleanUrl,
                title: data.title || "Video TikTok Tanpa Watermark",
                author: data.author?.nickname || "Creator",
                video_hd: data.hdplay || data.play, 
                audio_mp3: data.music
            };
        } else {
            throw new Error(resJson.msg || "Gagal mengambil data dari server TikTok.");
        }
    } catch (error) {
        console.error("Error TikTok API:", error);
        return { status: "error", message: error.message };
    }
}

async function downloadInstagram(url) {
    if (!url) {
        throw new Error("URL Instagram tidak boleh kosong!");
    }
    
    try {
        let cleanUrl = url.trim();
        if (cleanUrl.includes('?')) {
            cleanUrl = cleanUrl.split('?')[0];
        }

        if (!cleanUrl.includes("instagram.com")) {
            throw new Error("Bukan link Instagram yang valid.");
        }

        const response = await fetch(`https://api.nexray.eu.cc/downloader/instagram?url=${encodeURIComponent(cleanUrl)}`);
        const json = await response.json();

        // Mengambil dari json.result[0] karena result berupa array
        if (json && json.status === true && json.result && json.result.length > 0) {
            const mediaItem = json.result[0];
            const mediaUrl = mediaItem.url;
            const thumbnail = mediaItem.thumbnail || "";

            if (!mediaUrl) {
                throw new Error("Link video tidak ditemukan di dalam respon API.");
            }

            return {
                status: "success",
                platform: "instagram",
                type: "video",
                url: cleanUrl,
                url_media: mediaUrl,
                thumbnail: thumbnail,
                is_embed: false
            };
        } else {
            throw new Error("Gagal mengambil data dari Nexray API.");
        }
    } catch (error) {
        console.error("Error Nexray Instagram:", error);
        return { status: "error", message: error.message || "Gagal memproses link Instagram." };
    }
}

window.downloadInstagram = downloadInstagram;

async function downloadYouTube(url) {
    if (!url) {
        throw new Error("URL YouTube tidak boleh kosong!");
    }
    
    try {
        let cleanUrl = url.trim();

        // Tembak endpoint v1 ytmp4 dan ytmp3 secara bersamaan
        const [resMp4, resMp3] = await Promise.all([
            fetch(`https://api.nexray.eu.cc/downloader/v1/ytmp4?url=${encodeURIComponent(cleanUrl)}&resolusi=1080`).then(r => r.json()).catch(() => null),
            fetch(`https://api.nexray.eu.cc/downloader/v1/ytmp3?url=${encodeURIComponent(cleanUrl)}`).then(r => r.json()).catch(() => null)
        ]);

        let videoUrl = "";
        let audioUrl = "";
        let title = "YouTube Video";
        let thumbnail = "";

        if (resMp4 && resMp4.status === true && resMp4.result) {
            videoUrl = resMp4.result.url || "";
            title = resMp4.result.title || title;
            thumbnail = resMp4.result.thumbnail || "";
        }

        if (resMp3 && resMp3.status === true && resMp3.result) {
            audioUrl = resMp3.result.url || "";
            if (title === "YouTube Video" && resMp3.result.title) {
                title = resMp3.result.title;
            }
            if (!thumbnail && resMp3.result.thumbnail) {
                thumbnail = resMp3.result.thumbnail;
            }
        }

        if (!videoUrl && !audioUrl) {
            throw new Error("Gagal mengambil link unduhan dari server.");
        }

        return {
            status: "success",
            title: title,
            thumbnail: thumbnail,
            video_url: videoUrl,
            audio_url: audioUrl
        };
    } catch (error) {
        console.error("Error YouTube API:", error);
        return { status: "error", message: error.message || "Gagal memproses link YouTube." };
    }
}

window.downloadYouTube = downloadYouTube;


async function processFacebookDownload() {
    const urlInput = document.getElementById('fb-url').value.trim();
    const loadingBox = document.getElementById('loading-box');
    const previewContainer = document.getElementById('preview-container');
    const viewArea = document.getElementById('media-view-area');

    if (!urlInput) {
        alert('Masukkan link Facebook terlebih dahulu, bro!');
        return;
    }

    loadingBox.classList.remove('hidden');
    previewContainer.classList.add('hidden');

    // 1. Coba cara langsung (Scraping/Parsing simpel)
    try {
        console.log("Mencoba mengambil data langsung...");
        // Catatan: Ini butuh backend/proxy kalau kena CORS policy, 
        // tapi kita coba fetch dulu ke endpoint scraper internal
        const response = await fetch(`https://api.scraper.com/fb?url=${encodeURIComponent(urlInput)}`);
        const result = await response.json();
        
        if (result.status === "success") {
            tampilkanMedia(result);
            return;
        }
    } catch (err) {
        console.warn("Gagal ambil langsung, beralih ke Nexray API...");
    }

    // 2. Fallback ke Nexray API jika cara 1 gagal
    try {
        const response = await fetch(`https://api.nexray.eu.cc/downloader/facebook?url=${encodeURIComponent(urlInput)}`);
        const result = await response.json();
        
        if (result && (result.status === true || result.url)) {
            tampilkanMedia({
                url_media: result.url || result.data?.url,
                thumbnail: result.thumbnail || ''
            });
        } else {
            throw new Error("Gagal mengambil data dari kedua sumber.");
        }
    } catch (err) {
        loadingBox.classList.add('hidden');
        alert("Yah, gagal mengambil video. Mungkin link-nya privat atau lagi gangguan server: " + err.message);
    }
}

// Fungsi pembantu biar kodenya rapi
function tampilkanMedia(data) {
    const loadingBox = document.getElementById('loading-box');
    const previewContainer = document.getElementById('preview-container');
    const viewArea = document.getElementById('media-view-area');
    
    currentMediaUrl = data.url_media;
    viewArea.innerHTML = `
        <div class="p-4 text-center space-y-3">
            <div class="rounded-xl overflow-hidden bg-black aspect-[16/9] max-h-[350px] mx-auto flex items-center justify-center">
                <video src="${currentMediaUrl}" controls class="w-full h-full object-contain" poster="${data.thumbnail || ''}"></video>
            </div>
            <p class="text-xs text-slate-600 font-medium">Facebook Video / Reels</p>
        </div>
    `;
    loadingBox.classList.add('hidden');
    previewContainer.classList.remove('hidden');
}

function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
