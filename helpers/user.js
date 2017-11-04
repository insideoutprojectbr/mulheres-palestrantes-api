import bcrypt from "bcryptjs"
import uid from "uid-safe"

const generateSalt = () => bcrypt.genSaltSync(10)
const generatePassword = (rawPassword, salt)  => bcrypt.hashSync(rawPassword, salt)
const verifyPassword = (string, hash) => bcrypt.compareSync(string, hash)
const generateConfirmationKey = () => uid.sync(10)

export {generateSalt, generatePassword, verifyPassword, generateConfirmationKey}
