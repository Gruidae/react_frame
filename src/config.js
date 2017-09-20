module.exports = {
  app: {
    id: '3',
    version: '1.0.0',
  },
  SESSION_TOKEN_KEY: 'sessionToken',
  server: {
    production: {
      url: 'https://api.pai.bigins.cn/',
    },
    qa: {
      url: 'https://qa.api.pai.bigins.cn/',
    },
  },
  github: {
    production: {
      url: 'https://api.github.com/',
    },
    qa: {
      url: 'https://api.github.com/',
    },
  },
};
