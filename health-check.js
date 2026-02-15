
import axios from "axios";

const SERVICES = [
    {
        name: "Auth Service",
        url: process.env.AUTH_SERVICE_URL || "https://webcsn-auth-service.onrender.com/health"
    },
    {
        name: "Users Service",
        url: process.env.USERS_SERVICE_URL ? `${process.env.USERS_SERVICE_URL}/health` : "https://webcsn-users-service.onrender.com/health"
    },
    {
        name: "Content Service",
        url: process.env.CONTENT_SERVICE_URL ? `${process.env.CONTENT_SERVICE_URL}/health` : "https://webcsn-content-service.onrender.com/health"
    },
    {
        name: "Storage Service",
        url: process.env.STORAGE_SERVICE_URL ? `${process.env.STORAGE_SERVICE_URL}/health` : "https://webcsn-storage-service.onrender.com/health"
    },
    {
        name: "Notification Service",
        url: process.env.NOTIFICATION_SERVICE_URL ? `${process.env.NOTIFICATION_SERVICE_URL}/health` : "https://webcsn-notification-service.onrender.com/health"
    }
];

async function healthCheck() {
    console.log(`\nHealth Check at ${new Date().toISOString()}\n`);
    
    for (const service of SERVICES) {
        try {
            const response = await axios.get(service.url, {
                timeout: 5000
            });
            console.log(`${service.name}: ${response.status} - ${response.data.status}`);
        } catch (error) {
            console.log(`${service.name}: ${error.message}`);
        }
    }
    
    console.log("\n");
}

const INTERVAL = 10 * 60 * 1000;

console.log(`Starting health check every ${INTERVAL / 1000 / 60} minutes...`);
healthCheck(); 

setInterval(healthCheck, INTERVAL);

process.on('SIGINT', () => {
    console.log('\nHealth check stopped');
    process.exit(0);
});
