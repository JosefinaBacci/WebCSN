import { getUserByEmail } from "../services/users.service.js";
import { comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export async function login(req, res) {
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
}
