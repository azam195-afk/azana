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
        console.log("Respon RapidAPI:", resJson); // Buat dipantau di console browser (F12)

        // Deteksi berbagai kemungkinan struktur JSON dari RapidAPI
        let mediaUrl = "";
        if (typeof resJson === "string") {
            mediaUrl = resJson;
        } else if (resJson.url) {
            mediaUrl = resJson.url;
        } else if (resJson.download_url) {
            mediaUrl = resJson.download_url;
        } else if (resJson.result) {
            mediaUrl = typeof resJson.result === "string" ? resJson.result : (resJson.result.url || resJson.result[0]?.url);
        } else if (resJson.data) {
            mediaUrl = typeof resJson.data === "string" ? resJson.data : (resJson.data.url || resJson.data[0]?.url || resJson.data[0]);
        } else if (Array.isArray(resJson) && resJson.length > 0) {
            mediaUrl = resJson[0].url || resJson[0];
        }

        if (mediaUrl) {
            const isVideo = !mediaUrl.includes(".jpg") && !mediaUrl.includes(".png") && !mediaUrl.includes(".jpeg");

            return {
                status: "success",
                platform: "instagram",
                url: cleanUrl,
                type: isVideo ? "video" : "image",
                url_media: mediaUrl,
                author: resJson.author || resJson.username || "instagram_user"
            };
        } else {
            throw new Error("Format respon API tidak dikenali.");
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
