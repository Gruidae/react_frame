import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MainContainer from '../components/MainContainer';

import * as navActions from '../../reducers/nav/navActions';
import * as globalActions from '../../reducers/global/globalActions';
import * as inboxActions from '../../reducers/inbox/inboxActions';
import Enhance from '../Enhance';
import { PAGE_TITLE_INBOX } from '../constants';

function mapStateToProps(state) {
  return {
    currentUser: state.global.currentUser,
    inbox: state.inbox,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...inboxActions, ...globalActions, ...navActions }, dispatch),
  };
}

const msgTypes = {
  1: 'comment',
  2: 'sysNotice',
};

class InboxPage extends React.Component {

  static makeMenu(inboxProps) {
    const menu1 = {
      menuKey: '/msg-list/1',
      title: '留言',
      link: '/inbox/msg-list/1',
      icon: 'message',
      badge: inboxProps.comment.newMsgCount,
    };
    const menu2 = {
      menuKey: '/msg-list/2',
      title: '系统消息',
      link: '/inbox/msg-list/2',
      icon: 'setting',
      badge: inboxProps.sysNotice.newMsgCount,
    };
    return [menu1, menu2];
  }

  constructor(props) {
    super(props);
    this.state = {
      menu: InboxPage.makeMenu(this.props.inbox),
    };
  }

  componentDidMount() {
    this.props.enhance.setTitle(PAGE_TITLE_INBOX);
    this.props.actions.clearNewMsgCount(this.props.params.type);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser !== this.props.currentUser) {
      if (!nextProps.currentUser) {
        this.props.router.replace('/');
      }
    }

    Object.keys(msgTypes).forEach((i) => {
      if (this.props.inbox[msgTypes[i]].newMsgCount !== nextProps.inbox[msgTypes[i]].newMsgCount) {
        this.setState({
          menu: InboxPage.makeMenu(nextProps.inbox),
        });
      }
    });

    // 清理消息数
    if (this.props.params.type !== nextProps.params.type) {
      if (this.props.inbox[msgTypes[nextProps.params.type]].newMsgCount) {
        this.props.actions.clearNewMsgCount(nextProps.params.type);
      }
    }
  }

  render() {
    return (
      <MainContainer router={this.props.router} menu={this.state.menu}>
        { this.props.children }
      </MainContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(InboxPage));
