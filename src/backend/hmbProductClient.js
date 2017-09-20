const hmbProductClient = {
  async getProductDetail(data) {
    return await this._fetch({ url: 'product/detail', body: data });
  },
  async getAllProducts(data) {
    return await this._fetch({
      url: 'product/allList',
      body: data,
    });
  },

  async getMyPublishedProducts(data) {
    return await this._fetch({
      url: 'product/publishedList',
      body: data,
    });
  },

  async getMyBiddingProducts(data) {
    return await this._fetch({
      url: 'product/biddenList',
      body: data,
    });
  },

  async getDraftProducts(data) {
    return await this._fetch({
      url: 'product/draftList',
      body: data,
    });
  },

  async beforeCreate(data) {
    return await this._fetch({
      url: 'product/beforeCreate',
      body: data,
    });
  },
  async startBid(data) {
    return await this._fetch({ url: 'product/startBid', body: data });
  },
  async dropBid(data) {
    return await this._fetch({ url: 'product/dropBid', body: data });
  },
  async winBid(data) {
    return await this._fetch({ url: 'product/winBid', body: data });
  },
  async rejectBid(data) {
    return await this._fetch({ url: 'product/rejectBid', body: data });
  },
  async shareCustomerInfo(data) {
    return await this._fetch({ url: 'product/shareCustomerInfo', body: data });
  },
  async cancelProduct(data) {
    return await this._fetch({ url: 'product/cancel', body: data });
  },

};

export default hmbProductClient;
