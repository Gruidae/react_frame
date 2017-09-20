import _ from 'underscore';

class Exception {

  constructor(code, message, data) {
    this.handled = false;
    this.code = _.isUndefined(code) || _.isNull(code) ? -10000 : code;
    this.message = _.isUndefined(message) || _.isNull(message) ? 'Internal Error' : message;
    this.data = data;
  }
}

export default Exception;
