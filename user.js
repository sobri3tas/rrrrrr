const HashService = require("./hashService");

class User {
  constructor(username, password) {
    this.username = username;
    this.passwordHash = null;
  }

  async setPassword(password) {
    this.passwordHash = await HashService.hashPassword(password);
  }

  async checkPassword(password) {
    return await HashService.comparePassword(password, this.passwordHash);
  }
}

module.exports = User;