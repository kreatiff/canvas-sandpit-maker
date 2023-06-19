const axios = require('axios');

class DinoPassAPI {
  constructor() {
    this.baseUrl = 'https://www.dinopass.com/password';
  }

  async generatePassword() {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }
}

module.exports = DinoPassAPI;
