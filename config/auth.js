const bcrypt = require("bcrypt");

function encryptPassword(password) {
    return bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
}

function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}
  
module.exports = {
    encryptPassword,
    comparePassword,
};