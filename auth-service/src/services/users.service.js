import axios from "axios";

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

export async function getUserByEmail(email) {
    const res = await axios.get(
        `${USERS_SERVICE_URL}/users/by-email/${email}`
    );
    return res.data;
}
