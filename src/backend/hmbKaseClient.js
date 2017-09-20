const hmbKaseClient = {
  async getKaseDetail(data) {
    return await this._fetch({ url: 'case/detail', body: data });
  },
  async createKase(data) {
    return await this._fetch({ url: 'case/create', body: data });
  },
  async modifyKase(data) {
    return await this._fetch({ url: 'case/modify', body: data });
  },
  async createProduct(data) {
    return await this._fetch({ url: 'product/create', body: data });
  },
  async modifyProduct(data) {
    return await this._fetch({ url: 'product/modify', body: data });
  },
  async getAllCases(data) {
    return await this._fetch({ url: 'case/allList', body: data });
  },
  async getMyPublishedCases(data) {
    return await this._fetch({ url: 'case/myPubList', body: data });
  },
  async getMyAcceptedCases(data) {
    return await this._fetch({ url: 'case/acceptedList', body: data });
  },
  async getDraftCases(data) {
    return await this._fetch({ url: 'case/draftBox', body: data });
  },
  async rejectKase(data) {
    return await this._fetch({ url: 'case/reject', body: data });
  },
};
export default hmbKaseClient;
