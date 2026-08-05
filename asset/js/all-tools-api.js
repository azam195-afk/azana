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
        
        // Membersihkan query parameter yang tidak perlu agar bersih
        if (cleanUrl.includes('?')) {
            cleanUrl = cleanUrl.split('?')[0];
        }

        if (!cleanUrl.includes("instagram.com")) {
            throw new Error("Bukan link Instagram yang valid.");
        }

        // Membentuk URL embed publik resmi Instagram yang dijamin tembus tanpa blokir CORS
        const embedUrl = cleanUrl.endsWith('/') ? `${cleanUrl}embed/` : `${cleanUrl}/embed/`;

        return {
            status: "success",
            platform: "instagram",
            url: cleanUrl,
            type: "video",
            url_media: embedUrl,
            is_embed: true,
            author: "instagram_user"
        };
    } catch (error) {
        console.error("Error Instagram:", error);
        return { status: "error", message: "Gagal memproses link Instagram. Pastikan link publik." };
    }
}

// Mendaftarkan fungsi secara global agar terbaca sempurna oleh ig.html
window.downloadInstagram = downloadInstagram;

async function downloadYouTube(url) { return { url, status: "pending" }; }
async function downloadSpotify(url) { return { url, status: "pending" }; }
function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
