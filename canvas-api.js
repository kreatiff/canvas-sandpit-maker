const axios = require('axios');

class CanvasAPI {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://canvas.instructure.com/api/v1';
  }

  async createSubAccount(name) {
    const url = `${this.baseUrl}/accounts`;
    const data = {
      account: {
        name,
        parent_account_id: 1, // Hardcoded root account ID
      },
    };
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
    return response.data;
  }

  async createCourse(name, accountId) {
    const url = `${this.baseUrl}/accounts/${accountId}/courses`;
    const data = {
      course: {
        name,
        course_code: name.toLowerCase().replace(/\s+/g, '-'),
        enrollment_term_id: 1, // Hardcoded default term ID
      },
    };
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
    return response.data;
  }

  async createUser(fullName, email, password) {
    const url = `${this.baseUrl}/accounts/self/users`;
    const data = {
      user: {
        name: fullName,
        short_name: fullName.split(' ')[0],
        sortable_name: fullName,
        login_id: email,
        password,
        skip_registration: true,
      },
    };
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
    return response.data;
  }

  async enrollUser(courseId, userId, type) {
    const url = `${this.baseUrl}/courses/${courseId}/enrollments`;
    const data = {
      enrollment: {
        user_id: userId,
        type,
      },
    };
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
    return response.data;
  }
}

module.exports = CanvasAPI;
