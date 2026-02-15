import axios from "axios";

const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL;

if (!CONTENT_SERVICE_URL) {
    console.error("ERROR: CONTENT_SERVICE_URL no está configurada");
}

export async function proxyToContentService(req, res) {
    try {
        if (!CONTENT_SERVICE_URL) {
            return res.status(503).json({ message: "Content service not configured" });
        }

        const response = await axios({
        method: req.method,
        url: `${CONTENT_SERVICE_URL}${req.originalUrl}`,
        data: req.body,
        headers: {
            authorization: req.headers.authorization,
            "x-user-id": req.user.sub,
            "x-user-role": req.user.role
        },
        timeout: 10000
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Proxy error:", {
            message: error.message,
            status: error.response?.status,
            code: error.code,
            url: error.config?.url
        });

        if (error.message === "CONTENT_SERVICE_URL no está configurada") {
            return res.status(503).json({ message: "Content service not configured" });
        }

        if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
            return res.status(503).json({ message: "Content service unavailable" });
        }

        if (error.response) {
        return res
            .status(error.response.status)
            .json(error.response.data);
        }

        res.status(500).json({ message: "API Gateway error" });
    }
}
