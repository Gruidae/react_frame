class FormatUtils {
  static formatMoney = num =>
    `¥ ${(num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}`;
  static parsePre = (value) => {
    if (typeof value === 'string') {
      return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    return value;
  }
}

module.exports = FormatUtils;
