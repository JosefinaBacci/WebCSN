import { Router } from "express";
import { transporter } from "../mail/mailer.js";

const router = Router();

router.post("/contact-form", async (req, res) => {
    const { name, email, phone, level, message } = req.body;

    if (!name || !email || !message || !level) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    try {
        await transporter.sendMail({
            from: '"Colegio Nuevo Sol" <colegionuevosolzapala@gmail.com>',
            to: "colegionuevosolzapala@gmail.com",
            replyTo: email,
            subject: `Consulta web – ${level}`,
            html: `
                <h3>Nueva consulta desde la web</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone || "-"}</p>
                <p><strong>Nivel:</strong> ${level}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            `,
        });

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error enviando mail" });
    }
});

export default router;
