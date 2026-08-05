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
        const cleanUrl = url.trim();
        const apiHost = "instagram-downloader38.p.rapidapi.com";
        const apiKey = "9cbf8bd8d4msh68c9733fe4041d3p14ea1fjsnd5afc4aba406";
        
        const targetUrl = `https://${apiHost}/download?url=${encodeURIComponent(cleanUrl)}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': apiHost,
                'x-rapidapi-key': apiKey
            }
        });
        
        const resJson = await response.json();

        if (resJson && (resJson.url || resJson.download_url || resJson.result || resJson.media)) {
            const mediaUrl = resJson.url || resJson.download_url || resJson.result || (resJson.media && resJson.media[0]?.url);
            const isVideo = !mediaUrl.includes(".jpg") && !mediaUrl.includes(".png");

            return {
                status: "success",
                platform: "instagram",
                url: cleanUrl,
                type: isVideo ? "video" : "image",
                url_media: mediaUrl,
                author: resJson.author || "instagram_user"
            };
        } else {
            throw new Error("Gagal mengambil data dari RapidAPI.");
        }
    } catch (error) {
        console.error("Error Instagram API:", error);
        return { status: "error", message: "Gagal mengambil data Instagram. Periksa link publiknya." };
    }
}


async function downloadYouTube(url) { return { url, status: "pending" }; }
async function downloadSpotify(url) { return { url, status: "pending" }; }
function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
