class WindowUtils {

  initialize(isWechat, isIos) {
    this.isWechat = isWechat;
    this.isIos = isIos;
  }

  setTitle(title) {
    document.title = title;
    // 黑科技（iOS微信浏览器专用）
    // 原因：微信浏览器的title在页面加载完成后就定了，不再监听 window.title 的 onchange 事件。
    // 所以这里修改了title后，立即创建一个请求，加载一个空的iframe
    if (this.isWechat && this.isIos) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', '/favicon.ico');
      iframe.setAttribute('style', 'display: none; width:0; height:0;');
      const handler = () => {
        setTimeout(() => {
          iframe.removeEventListener('load', handler);
          document.body.removeChild(iframe);
        }, 10);
      };
      iframe.addEventListener('load', handler);
      document.body.appendChild(iframe);
    }
  }
}

export default new WindowUtils();
