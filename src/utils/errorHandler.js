/* eslint-disable no-param-reassign */

import { message } from 'antd';
import _ from 'underscore';
import Console from './Console';
import { deleteSessionToken, logoutSuccess } from '../reducers/auth/authActions';
import { handleException } from '../reducers/global/globalActions';

/**
 * -1  普通异常，详见 status_msg 字段描述
 * -1000  用户登录凭证不合法，请先登录或重新登录
 * -1001  请勿重复登录、注册（通常发生在带着有效 VUSER 访问 /auth/login 接口时返回）
 * -1009  请前往激活邮箱
 * -1010  请前往完善资料（例如：海绵保开放平台的用户初次登录暗拍系统，则需引导前往完善资料）
 * -1020  第三方账号登陆后，请前往绑定官方账号（详见文档）
 * -9990  APPID 不合法
 * -9991  APPID 对应的应用信息不存在，请联系管理员
 * -9992  APPVER 不合法
 * -9999  应用传输数据解密失败，请联系管理员
 * -999  未知的其他异常
 * -404  指定目标不存在或已删除
 * -2001  请输入正确的图形验证码
 */
class ErrorHandler {

  initStore(store) {
    this.store = store;
  }

  initRouter(router) {
    this.router = router;
  }

  /**
   * @param exception custom exception
   * @returns {boolean} whether it is handled
   */
  handle(exception) {
    if (!_.isNull(exception) && !_.isUndefined(exception) && exception.handled === false) {
      this.store.dispatch(handleException(exception));
      Console.log(`${exception.code}: ${exception.message}!`);

      exception.handled = true;

      switch (exception.code) {
        case -1000:
          this.kick();
          break;
        case -1001:
          ErrorHandler.showError(exception.code, exception.message);
          this.router.replace('/');
          break;
        case -1009:
          this.router.push({
            pathname: '/activate',
            query: { email: exception.data.email },
          });
          break;
        case -1010:
          this.router.push('/perfect');
          break;
        case -1020:
          this.router.replace({
            pathname: '/binding',
            query: { sess_id: exception.data.sess_id },
          });
          break;
        case -10000:
          ErrorHandler.showError(exception.code, '您的网络正在发呆，请稍候');
          break;
        default:
          ErrorHandler.showError(exception.code, exception.message);
          break;
      }
      return true;
    }
    return false;
  }

  kick() {
    Console.log('kicked');
    this.router.replace({
      pathname: '/login',
      state: { referer: this.router.getCurrentLocation() },
    });
    this.store.dispatch(deleteSessionToken());
    this.store.dispatch(logoutSuccess());
  }

  static showError(errorCode, errorMessage) {
    message.error(errorCode === -1 ? errorMessage : `${errorCode}: ${errorMessage}`);
  }
}

export default new ErrorHandler();
