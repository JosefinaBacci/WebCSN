import { getUserByEmail } from "../services/users.service.js";
import { comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);

        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        if (user.status !== "approved")
            return res.status(403).json({ message: "User not approved" });

        const valid = await comparePassword(password, user.password);

        if (!valid)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = signToken({
            sub: user._id,
            role: user.role
        });

        res.json({ token, role: user.role });
    } catch (error) {
        console.error("Login error:", {
            message: error.message,
            status: error.response?.status,
            code: error.code,
            url: error.config?.url
        });

        if (error.message === "USERS_SERVICE_URL no configurada") {
            return res.status(503).json({ message: "Users service not configured" });
        }

        if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
            return res.status(503).json({ message: "Users service unavailable" });
        }

        if (error.code === "ECONNABORTED") {
            return res.status(504).json({ message: "Users service timeout" });
        }

        res.status(500).json({ message: "Login failed" });
    }
}
