import hmbClient from './hmbClient';
import gitHubClient from './gitHubClient';

export default class Backend {

  static getInstance(token = null, client = 'hmb') {
    if (client === 'github') {
      gitHubClient.initialize(token);
      return gitHubClient;
    }
    hmbClient.initialize(token);
    return hmbClient;
  }
}
