import _ from 'underscore';
import CONFIG from '../config';

class GitHubClient {

  initialize(token) {
    if (!_.isNull(token) && _.isUndefined(token.sessionToken)) {
      throw new Error('TokenMissing');
    }
    this._sessionToken = _.isNull(token) ? null : token.sessionToken.sessionToken;

    this.API_BASE_URL = CONFIG.backend.production
      ? CONFIG.github.production.url
      : CONFIG.github.qa.url;
  }

  async getProfile(uid) {
    return await this._fetch({
      method: 'GET',
      url: `users/${uid}`,
    })
      .then((res) => {
        if ((res.status === 200 || res.status === 201)) {
          return res.json;
        }
        throw (res.json);
      })
      .catch((error) => {
        throw (error);
      });
  }

  /* eslint-disable no-param-reassign */
  async _fetch(opts) {
    opts = _.extend({
      method: 'GET',
      url: null,
      body: null,
      callback: null,
    }, opts);

    const reqOpts = {
      method: opts.method,
      headers: {},
    };

    if (opts.method === 'POST' || opts.method === 'PUT') {
      reqOpts.headers.Accept = 'application/json';
      reqOpts.headers['Content-Type'] = 'application/json';
    }

    if (opts.body) {
      reqOpts.body = JSON.stringify(opts.body);
    }

    const url = this.API_BASE_URL + opts.url;
    const res = {};

    const response = await fetch(url, reqOpts);
    res.status = response.status;
    res.code = response.code;

    return response.json()
      .then((json) => {
        res.json = json;
        return res;
      });
  }
}

export default new GitHubClient();
