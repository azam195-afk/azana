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

        const response = await fetch(`https://instagram-downloader38.p.rapidapi.com/dl?url=${encodeURIComponent(cleanUrl)}`, {
            method: "GET",
            headers: {
                "x-rapidapi-key": "9cbf8bd8d4msh68c9733fe4041d3p14ea1fjsnd5afc4aba406",
                "x-rapidapi-host": "instagram-downloader38.p.rapidapi.com"
            }
        });

        const json = await response.json();
        let mediaUrl = json.url || json.video_url || (json.data && (json.data.url || json.data[0]));

        if (mediaUrl) {
            return {
                status: "success",
                platform: "instagram",
                type: "video",
                url_media: mediaUrl,
                is_embed: false
            };
        } else {
            throw new Error("Gagal mengambil media dari RapidAPI.");
        }
    } catch (error) {
        console.error("API Error:", error);
        return { status: "error", message: "Gagal memproses link dengan RapidAPI." };
    }
}

window.downloadInstagram = downloadInstagram;



async function downloadYouTube(url) { return { url, status: "pending" }; }
async function downloadSpotify(url) { return { url, status: "pending" }; }
function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
