import Resend from "@resend/node";

export const resend = new Resend(process.env.RESEND_API_KEY);