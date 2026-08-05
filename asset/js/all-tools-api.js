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

Async function downloadInstagram(url) {
    If (!url) {
        Throw new Error("URL Instagram tidak boleh kosong!");
    }
    
    Try {
        Let cleanUrl = url.trim();
        
        If (cleanUrl.includes('?')) {
            CleanUrl = cleanUrl.split('?')[0];
        }

        If (!cleanUrl.includes("instagram.com")) {
            Throw new Error("Bukan link Instagram yang valid.");
        }

        Const embedUrl = cleanUrl.endsWith('/') ? `${cleanUrl}embed/` : `${cleanUrl}/embed/`;

        Return {
            Status: "success",
            Platform: "instagram",
            Url: cleanUrl,
            Type: "video",
            Url_media: embedUrl,
            Is_embed: true,
            Author: "instagram_user"
        };
    } catch (error) {
        Console.error("Error Instagram:", error);
        Return { status: "error", message: "Gagal memproses link Instagram. Pastikan link publik." };
    }
}

Window.downloadInstagram = downloadInstagram;


async function downloadYouTube(url) { return { url, status: "pending" }; }
async function downloadSpotify(url) { return { url, status: "pending" }; }
function generateSertifikatLucu(payload = {}) { return { payload, status: "pending" }; }
function generateBrat(payload = {}) { return { payload, status: "pending" }; }
function generateIqc(payload = {}) { return { payload, status: "pending" }; }
