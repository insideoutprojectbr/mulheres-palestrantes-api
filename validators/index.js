import config from "../config"
import mailConfirm from "mail-confirm"

const validateEmailExistence = async email => {
    try {
        const confirmation = new mailConfirm({
            emailAddress: email,
            timeout: config.EMAIL_VERIFICATION_TIMEOUT,
            mailFrom: config.SENDGRID_EMAIL_FROM,
            invalidMailboxKeywords: ["noreply", "noemail"]
        })
        return confirmation.check()
    }catch(error){
        throw new Error("Invalid email address")
    }
}

export {validateEmailExistence}
