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

        // Menggunakan endpoint resmi Nexray yang baru lu dapatkan
        const response = await fetch(`https://api.nexray.eu.cc/downloader/instagram?url=${encodeURIComponent(cleanUrl)}`);
        const json = await response.json();

        // Menyesuaikan struktur JSON dari Nexray API
        if (json && (json.status === true || json.code === 200 || json.success === true) && json.data) {
            // Menangani berbagai kemungkinan struktur array/object data dari Nexray
            const mediaData = Array.isArray(json.data) ? json.data[0] : json.data;
            const mediaUrl = mediaData.url || mediaData.download || mediaData.dl;
            const thumbnail = mediaData.thumbnail || mediaData.thumb || "";

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
            throw new Error(json.message || "Gagal mengambil data dari Nexray API.");
        }
    } catch (error) {
        console.error("Error Nexray Instagram:", error);
        return { status: "error", message: error.message || "Gagal memproses link Instagram." };
    }
}

window.downloadInstagram = downloadInstagram;


async function downloadYouTube(url) { return { url, status: "pending" }; }
async function downloadSpotify(url) { return { url, status: "pending" }; }
function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
