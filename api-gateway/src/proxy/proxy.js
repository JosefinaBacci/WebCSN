import axios from "axios";

const CONTENT_SERVICE_URL = process.env.CONTENT_SERVICE_URL

export async function proxyToContentService(req, res) {
    try {
        const response = await axios({
        method: req.method,
        url: `${CONTENT_SERVICE_URL}${req.originalUrl}`,
        data: req.body,
        headers: {
            authorization: req.headers.authorization,
            "x-user-id": req.user.sub,
            "x-user-role": req.user.role
        }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
        return res
            .status(error.response.status)
            .json(error.response.data);
        }

        res.status(500).json({ message: "API Gateway error" });
    }
}
