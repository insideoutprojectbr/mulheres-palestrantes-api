import config from "../config"
import sgMail from "@sendgrid/mail"


sgMail.setApiKey(config.SENDGRID_API_KEY)


class AccountConfirmationMailer {

    constructor(user){
        this.user = user
    }
    //TODO: Generate html from a view, inject url
    async send(){
        try {
            const msg = {
                to: this.user.email,
                from: config.SENDGRID_EMAIL_FROM,
                subject: "Mulheres Palestrantes - Confirme sua conta",
                html: `<p>Para confirmar sua conta, clique em: <a href="${this.user.account_confirmation_url}">${this.user.account_confirmation_url}</a></p>`}
            return sgMail.send(msg)
        } catch (error){
            new Error("Error sending confirmation link to user")
        }
    }
}

export {AccountConfirmationMailer}
