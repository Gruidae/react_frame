const hmbUserClient = {
  async login(data) {
    return await this._fetch({ url: 'auth/login', body: data });
  },
  async register(data) {
    return await this._fetch({ url: 'auth/register', body: data });
  },
  async resetPassword(data) {
    return await this._fetch({ url: 'auth/resetPassword', body: data });
  },
  async sendCode(data) {
    return await this._fetch({ url: 'auth/sendVcode', body: data });
  },
  async logout(data) {
    return await this._fetch({ url: 'auth/logout', body: data });
  },
  async sendActivateEmail() {
    return await this._fetch({ url: 'auth/sendActEmail' });
  },
  async perfect(data) {
    return await this._fetch({ url: 'user/perfect', body: data });
  },
  async changeNickname(data) {
    return await this._fetch({ url: 'user/changeNickname', body: data });
  },
  async changeMobile(data) {
    return await this._fetch({ url: 'user/changeMobile', body: data });
  },
  async changeCompany(data) {
    return await this._fetch({ url: 'user/changeCompany', body: data });
  },
  async changePassword(data) {
    return await this._fetch({ url: 'user/changePassword', body: data });
  },
  async changeSwitch(data) {
    return await this._fetch({ url: 'user/changeSwitch', body: data });
  },
  async nameCard(data) {
    return await this._fetch({ url: 'user/nameCard', body: data });
  },
  async getThirdLoginUrl(data) {
    return await this._fetch({ url: 'account3rd/login', body: data });
  },
  async redirectOAuth(data) {
    return await this._fetch({ url: 'account3rd/redirectOAuth', body: data });
  },
  async bindThirdAccount(data) {
    return await this._fetch({ url: 'account3rd/bindingAccountLite', body: data });
  },
  async getBindedThird(data) {
    return await this._fetch({ url: 'account3rd/hasBindedThird', body: data });
  },
};

export default hmbUserClient;
