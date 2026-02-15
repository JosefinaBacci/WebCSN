import axios from "axios";

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

if (!USERS_SERVICE_URL) {
    console.error("ERROR: USERS_SERVICE_URL no está configurada");
}

async function retryWithBackoff(fn, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                const delay = Math.min(1000 * Math.pow(2, i), 5000);
                console.log(`Retry ${i + 1}/${maxRetries - 1}, espera ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    throw lastError;
}

export async function getUserByEmail(email) {
    if (!USERS_SERVICE_URL) {
        throw new Error("USERS_SERVICE_URL no configurada");
    }
    
    try {
        const res = await retryWithBackoff(() =>
            axios.get(
                `${USERS_SERVICE_URL}/users/by-email/${email}`,
                { timeout: 10000 }
            )
        );
        return res.data;
    } catch (error) {
        if (error.response?.status === 404) {
            console.log(`Usuario no encontrado: ${email}`);
            return null;
        }
        console.error(`Error conectando a ${USERS_SERVICE_URL}:`, error.message);
        throw error;
    }
}
