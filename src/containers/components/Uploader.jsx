import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Upload, Icon, Modal } from 'antd';
import s from './Uploader.less';

import * as qiniuActions from '../../reducers/qiniu/qiniuActions';
import errorHandler from '../../utils/errorHandler';

const Dragger = Upload.Dragger;

function mapStateToProps(state) {
  return {
    isMobile: state.device.isMobile,
    qiniu: state.qiniu,
    currentUser: state.global.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(qiniuActions, dispatch) };
}

class Uploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {
        token: this.props.qiniu.token,
      },
    };
  }

  componentDidMount() {
    if (this.props.currentUser &&
      this.props.currentUser.sessionToken && !this.state.data.token) {
      this.requestToken();
    }
  }

  componentWillReceiveProps(nextProps) {
    errorHandler.handle(nextProps.qiniu.exception);
    if (nextProps.qiniu !== this.props.qiniu) {
      this.setState({
        loading: nextProps.qiniu.isFetching,
        data: {
          token: nextProps.qiniu.token,
        },
      });
    }
    if (nextProps.currentUser !== this.props.currentUser) {
      // 因为请求namecard会导致多次请求，先判断sessionToken是不是一样
      // 如果session相同，但是token不存在，需要再请求一次token
      if (nextProps.currentUser && this.props.currentUser &&
        (nextProps.currentUser.sessionToken !== this.props.currentUser.sessionToken)) {
        this.requestToken();
      } else if (!this.state.data.token) {
        this.requestToken();
      }
    }
  }

  handleChange = (info) => {
    const status = info.file.status;
    if (status === 'error') {
      Modal.error({
        title: `上传 ${info.file.name} 失败`,
        content: info.file.error.message,
      });
      // 如果是401 就重新请求一次
      if (info.file.error.status === 401) {
        this.requestToken();
      }
    }
    return this.props.onChange(info);
  };

  requestToken = () => {
    this.props.actions.requestQiniuToken(this.props.scene);
  };

  render() {
    if (this.props.simple || this.props.isMobile) {
      return (
        <Upload
          {...this.props}
          onChange={this.handleChange}
          data={this.state.data}
          className={this.props.className}
        >
          <Button type="ghost">
            <Icon type="paper-clip" /> 上传附件
          </Button>
        </Upload>
      );
    }
    return (
      <Dragger
        {...this.props}
        onChange={this.handleChange}
        data={this.state.data}
        className={this.props.className}
      >
        <div className={s.uploadBox}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或者拖拽文件到该区域上传</p>
          <p className="ant-upload-hint">支持单文件或者多文件上传</p>
        </div>
      </Dragger>
    );
  }
}

Uploader.defaultProps = {
  headers: {
    accept: 'application/json',
  },
  accept: '*;capture=camera',
  name: 'file',
  multiple: true,
  withCredentials: false,
  action: window.location.protocol === 'https:' ?
    'https://up.qbox.me/' : 'http://upload.qiniu.com',
  listType: 'text',
  scene: 'attach',
  simple: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
