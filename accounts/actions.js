import config from "../config"
import db from "../models"
import sgMail from "@sendgrid/mail"
import mailConfirm from "mail-confirm"

sgMail.setApiKey(config.SENDGRID_API_KEY)


class Notification {
    constructor(user){
        this.user = user
    }
    get url(){
        return `${config.EMAIL_CONFIRMATION_URL}/accounts/${this.user.id}/confirmation?key=${this.user.confirmation_key}`
    }
    //TODO: Generate html from a view, inject url
    send(){
        const msg = {
            to: this.user.email,
            from: config.SENDGRID_EMAIL_FROM,
            subject: "Mulheres Palestrantes - Confirme sua conta",
            html: `<p>Para confirmar sua conta, clique em: <a href="${this.url}">${this.url}</a></p>`,
        }
        return sgMail.send(msg).catch(() => Promise.reject(new Error("Error sending confirmation link to user")))
    }
}


class Signup {

    constructor(data){
        this.data = data
    }

    sendNotification(user){
        const notification = new Notification(user)
        return notification.send()
    }

    checkIfEmailIsValid(){
        const confirmation = new mailConfirm({
            emailAddress: this.data.email,
            timeout: config.EMAIL_VERIFICATION_TIMEOUT,
            mailFrom: config.SENDGRID_EMAIL_FROM,
            invalidMailboxKeywords: ["noreply", "noemail"]
        })
        return confirmation.check().catch(() => Promise.reject(new Error("Invalid email address")))
    }

    async process(){
        const transaction = await db.sequelize.transaction()
        try{
            await this.checkIfEmailIsValid()
            const user = await db.User.create(this.data, {transaction})
            await this.sendNotification(user)
            transaction.commit()
            return user
        } catch(error){
            transaction.rollback()
            throw error
        }
    }
}

export {Notification, Signup}
