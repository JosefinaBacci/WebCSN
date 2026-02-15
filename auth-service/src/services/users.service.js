import axios from "axios";

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

if (!USERS_SERVICE_URL) {
    console.error("ERROR: USERS_SERVICE_URL no está configurada");
}

export async function getUserByEmail(email) {
    if (!USERS_SERVICE_URL) {
        throw new Error("USERS_SERVICE_URL no configurada");
    }
    
    try {
        const res = await axios.get(
            `${USERS_SERVICE_URL}/users/by-email/${email}`,
            { timeout: 10000 }
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
