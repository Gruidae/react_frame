import CONFIG from '../config';
import storage from '../utils/storage';

class AppAuthToken {

  constructor() {
    this.SESSION_TOKEN_KEY = CONFIG.SESSION_TOKEN_KEY;
  }

  async storeSessionToken(sessionToken) {
    return await storage.save(this.SESSION_TOKEN_KEY, {
      sessionToken,
    });
  }

  async getSessionToken(sessionToken) {
    if (sessionToken) {
      storage.save(this.SESSION_TOKEN_KEY, {
        sessionToken,
      });
    }
    return await storage.get(this.SESSION_TOKEN_KEY);
  }

  async deleteSessionToken() {
    return await storage.remove(this.SESSION_TOKEN_KEY);
  }
}

// The singleton variable
const appAuthToken = new AppAuthToken();

export default appAuthToken;
