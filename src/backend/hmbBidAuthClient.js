const hmbBidAuthClient = {
  async getApplyList(data) {
    return await this._fetch({ url: 'product/bidAuthApplyList', body: data });
  },
  async passBidAuth(data) {
    return await this._fetch({ url: 'product/passBidAuth', body: data });
  },
  async rejectBidAuth(data) {
    return await this._fetch({ url: 'product/rejectBidAuth', body: data });
  },
  async applyBidAuth(data) {
    return await this._fetch({ url: 'product/applyBidAuth', body: data });
  },
};
export default hmbBidAuthClient;
