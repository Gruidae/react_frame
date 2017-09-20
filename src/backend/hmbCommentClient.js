const hmbCommentClient = {
  async getCommentList(data) {
    return await this._fetch({ url: 'comment/list', body: data });
  },
  async saveComment(data) {
    return await this._fetch({ url: 'comment/save', body: data });
  },
  async deleteComment(data) {
    return await this._fetch({ url: 'comment/delete', body: data });
  },
};
export default hmbCommentClient;
