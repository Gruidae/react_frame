const hmbInboxClient = {
  async getMsgList(data) {
    return await this._fetch({ url: 'message/inbox', body: data });
  },
  async getNewMsgCount(data) {
    return await this._fetch({ url: 'message/showNewCount', body: data });
  },
  async clearNewMsgCount(data) {
    return await this._fetch({ url: 'message/clearNewCount', body: data });
  },
};
export default hmbInboxClient;
