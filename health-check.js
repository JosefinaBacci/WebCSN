import axios from "axios";
const SERVICES = [
    {
        name: "Auth Service",
        url: "https://webcsn-auth-service.onrender.com/health"
    },
    {
        name: "Users Service",
        url: "https://webcsn-users-service.onrender.com/health"
    },
    {
        name: "Content Service",
        url: "https://webcsn-content-service.onrender.com/health"
    },
    {
        name: "Storage Service",
        url: "https://webcsn-storage-service.onrender.com/health"
    },
    {
        name: "Notification Service",
        url: "https://webcsn-notification-service.onrender.com/health"
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

// Health check periódico deshabilitado
// console.log(`Starting health check every ${INTERVAL / 1000 / 60} minutes...`);
// healthCheck(); 
// setInterval(healthCheck, INTERVAL);

process.on('SIGINT', () => {
    console.log('\nHealth check stopped');
    process.exit(0);
});
