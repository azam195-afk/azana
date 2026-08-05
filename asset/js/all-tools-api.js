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

        // Tembak endpoint AIO (untuk video MP4) dan ytmp3 (untuk audio MP3) secara bersamaan
        const [resAio, resMp3] = await Promise.all([
            fetch(`https://api.nexray.eu.cc/downloader/aio?url=${encodeURIComponent(cleanUrl)}`).then(r => r.json()).catch(() => null),
            fetch(`https://api.nexray.eu.cc/downloader/ytmp3?url=${encodeURIComponent(cleanUrl)}`).then(r => r.json()).catch(() => null)
        ]);

        let videoUrl = "";
        let title = "YouTube Video";
        let thumbnail = "";

        // Ambil data video dari AIO
        if (resAio && resAio.status === true && resAio.result) {
            const item = Array.isArray(resAio.result) ? resAio.result[0] : resAio.result;
            videoUrl = item.url || item.download || "";
            title = item.title || title;
            thumbnail = item.thumbnail || "";
        }

        let audioUrl = "";
        // Ambil data audio dari ytmp3
        if (resMp3 && resMp3.status === true && resMp3.result) {
            audioUrl = resMp3.result.url || resMp3.result.download || "";
            if (title === "YouTube Video" && resMp3.result.title) {
                title = resMp3.result.title;
            }
            if (!thumbnail && resMp3.result.thumbnail) {
                thumbnail = resMp3.result.thumbnail;
            }
        }

        if (!videoUrl && !audioUrl) {
            throw new Error("Gagal mengambil data dari server Nexray.");
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


async function downloadSpotify(url) { return { url, status: "pending" }; }
function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
