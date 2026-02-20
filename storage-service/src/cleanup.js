import Announcement from "./models/Announcement.js";

const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; 

export async function startAnnouncementCleanup() {
    console.log("Starting announcement cleanup service...");
    await cleanupExpiredAnnouncements();
    
    setInterval(cleanupExpiredAnnouncements, CLEANUP_INTERVAL);
}

async function cleanupExpiredAnnouncements() {
    try {
        const now = new Date();
        const result = await Announcement.deleteMany({ expiresAt: { $lte: now } });
        
        if (result.deletedCount > 0) {
            console.log(`[${new Date().toISOString()}] Cleanup: ${result.deletedCount} anuncios expirados eliminados`);
        }
    } catch (err) {
        console.error("Error durante limpieza de anuncios:", err.message);
    }
}
