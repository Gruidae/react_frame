import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Card, Button, Spin } from 'antd';
import moment from 'moment';
import CommentList from '../components/CommentList';

import Pagination from '../components/Pagination';
import s from './MessageListPage.less';
import BlankPage from '../components/BlankPage';
import * as inboxActions from '../../reducers/inbox/inboxActions';

moment.locale('zh-cn');

function mapStateToProps(state) {
  return {
    inbox: state.inbox,
    comment: state.inbox.comment,
    sysNotice: state.inbox.sysNotice,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(inboxActions, dispatch) };
}

const msgTypes = {
  1: 'comment',
  2: 'sysNotice',
};

class MessageListPage extends React.Component {

  componentDidMount() {
    this.getMsgList(this.props.params.type,
      this.props[msgTypes[this.props.params.type]].currentPage,
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.type !== this.props.params.type) {
      this.getMsgList(nextProps.params.type,
        this.props[msgTypes[nextProps.params.type]].currentPage,
      );
    }
  }

  onPageNumberChange = (nextPageNumber) => {
    this.getMsgList(this.props.params.type, nextPageNumber);
  };

  getMsgList = (type, page) => {
    this.props.actions.getMsgList(type, page);
  };

  boxTitle = title =>
    <Col xs={16} sm={16} md={16} lg={20}>
      <h4 className={s.boxTitle}>{title}</h4>
    </Col>;

  render() {
    return (
      <div className={s.container}>
        <Spin spinning={this.props.inbox.isFetching}>
          <Row type="flex" justify="center">
            {this.props[msgTypes[this.props.params.type]].list
              ?
              this.props[msgTypes[this.props.params.type]].list.map((msgInfo, index) =>
                <Card
                  key={index}
                  className={s.contentBox}
                  title={this.boxTitle(msgInfo.title)}
                  extra={moment(msgInfo.created_at).startOf('second').fromNow()}
                >
                  <Row type="flex" justify="left" className={s.msgContent}>
                    {msgInfo.content}
                  </Row>
                  <Col span={24}>
                    <Row type="flex" className={s.buttonBox}>
                      <Col xs={12} sm={6} md={4} lg={2}>
                        <Button type="Ghost">
                          <Link to={msgInfo.target_info.target_url}>查看</Link>
                        </Button>
                      </Col>
                      <Col xs={12} sm={6} md={4} lg={2}>
                        {
                          msgInfo.type === 1
                          ?
                            <CommentList
                              targetId={msgInfo.target_info.target_id}
                              targetType={msgInfo.target_info.target_type}
                              buttonText="回复"
                            />
                          :
                          false
                        }
                      </Col>
                    </Row>
                  </Col>
                </Card>)
              : (
                <BlankPage />
              )}
          </Row>
        </Spin>
        <Pagination
          defaultCurrent={this.props[msgTypes[this.props.params.type]].currentPage}
          current={this.props[msgTypes[this.props.params.type]].currentPage}
          total={this.props[msgTypes[this.props.params.type]].totalCount}
          pageSize={this.props[msgTypes[this.props.params.type]].pageSize}
          onChange={this.onPageNumberChange}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageListPage);
