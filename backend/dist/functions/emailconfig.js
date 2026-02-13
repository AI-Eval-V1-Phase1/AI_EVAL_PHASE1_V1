import nodemailer from "nodemailer";
const emailConfig = () => {
    const EMAIL_SERVICE = process.env["EMAIL_SERVICE"];
    let transporter;
    if (EMAIL_SERVICE === "gmail") {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env["SENDER__GMAIL_EMAIL"],
                pass: process.env["SENDER_GMAIL_PASSWORD"],
            },
        });
    }
    else if (EMAIL_SERVICE === "office365") {
        transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env["SENDER_EMAIL"],
                pass: process.env["SENDER_PASSWORD"],
            },
        });
    }
    else {
        throw new Error("Unsupported email service. Use 'gmail' or 'office365'.");
    }
    return transporter;
};
export default emailConfig;
