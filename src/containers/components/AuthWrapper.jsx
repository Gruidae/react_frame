import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, notification } from 'antd';

import errorHandler from '../../utils/errorHandler';
import * as profileActions from '../../reducers/profile/profileActions';
import * as inboxActions from '../../reducers/inbox/inboxActions';
import Enhance from '../Enhance';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    profile: state.profile,
    inbox: state.inbox,
    currentUser: state.global.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...profileActions, ...inboxActions }, dispatch),
  };
}

class AuthWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timerId: 0,
    };

    if (this.props.currentUser) {
      this.state = {
        timerId: setInterval(() => {
          this.getNewMessageCount();
        }, 1000 * 60),
      };
      this.getNewMessageCount();

      if (!this.props.enhance.isCompleted(this.props.currentUser)) {
        this.getUserProfile();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser !== this.props.currentUser) {
      if (!this.props.enhance.isCompleted(nextProps.currentUser)) {
        this.getUserProfile();
        this.getNewMessageCount();
      }
    }
    if (nextProps.inbox !== this.props.inbox) {
      errorHandler.handle(nextProps.inbox.exception);
      const newComment = nextProps.inbox.comment.newMsgCount;
      if (newComment > 0 && newComment !== this.props.inbox.comment.newMsgCount) {
        notification.info({
          btn: <Button type="primary" size="small" onClick={this.onNewCommentClick}>查看</Button>,
          key: 'newComment',
          message: '新的消息',
          description: `您有 ${newComment} 条新的留言`,
        });
      }
      const newSysNotice = nextProps.inbox.sysNotice.newMsgCount;
      if (newSysNotice > 0 && newSysNotice !== this.props.inbox.sysNotice.newMsgCount) {
        notification.info({
          btn: <Button type="primary" size="small" onClick={this.onNewSysNoticeClick}>查看</Button>,
          key: 'newSysNotice',
          message: '新的消息',
          description: `您有 ${newSysNotice} 条新的系统消息`,
        });
      }
    }
    errorHandler.handle(nextProps.profile.exception);
    errorHandler.handle(nextProps.auth.exception);
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  onNewCommentClick = () => this.props.router.push('/inbox/msg-list/1');

  onNewSysNoticeClick = () => this.props.router.push('/inbox/msg-list/2');

  getNewMessageCount() {
    this.props.actions.getNewMsgCount();
  }

  getUserProfile() {
    this.props.actions.getProfile();
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>{this.props.children}</div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(AuthWrapper));
