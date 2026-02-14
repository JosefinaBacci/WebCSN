import bcrypt from "bcrypt";

export function comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
