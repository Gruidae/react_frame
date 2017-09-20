import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Row, Popover, Spin } from 'antd';

import LabelSpan from './LabelSpan';
import * as profileActions from '../reducers/profile/profileActions';
import errorHandler from '../utils/errorHandler';
import s from './NameCardOver.less';

function mapStateToProps(state) {
  return {
    profiles: state.profile.profiles,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...profileActions }, dispatch),
  };
}


class NameCardOver extends React.Component {

  static propTypes = {
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const uid = this.props.uid;
    if (nextProps.profiles.get(uid) &&
      nextProps.profiles.get(uid).get('exception')) {
      errorHandler.handle(nextProps.profiles.get(uid).get('exception'));
    }

    if (nextProps.profiles.get(uid) !==
      this.props.profiles.get(uid)) {
      this.setState({
        loading: nextProps.profiles.get(uid).get('isFetching'),
        profile: nextProps.profiles.get(uid).get('profile'),
      });
    }
  }

  handleVisibleChange = (visible) => {
    if (visible && this.props.uid) {
      this.props.actions.getNameCard(this.props.uid);
    }
  };

  content = () => {
    const profile = this.state.profile || {};
    return (
      <div className={s.container}>
        <Spin spinning={this.state.loading}>
          <Col span={24}>
            <Row
              type="flex" justify="space-between"
              className={s.labelMargin}
            >
              <Col span={24}>
                <LabelSpan
                  label="姓名"
                  value={profile.nickname || ''}
                />
              </Col>
              <Col span={24}>
                <LabelSpan
                  label="联系电话"
                  value={profile.mobile || ''}
                />
              </Col>
              <Col span={24}>
                <LabelSpan
                  label="所属公司"
                  value={profile.company_name || ''}
                />
              </Col>
              <Col span={24}>
                <LabelSpan
                  label="邮箱"
                  value={profile.email || ''}
                />
              </Col>
            </Row>
          </Col>
        </Spin>
      </div>);
  };

  render() {
    return (
      <div>
        <Popover
          className={this.props.className}
          placement="right"
          title="个人名片"
          content={this.content()}
          trigger="click"
          onVisibleChange={this.handleVisibleChange}
        >
          {this.props.children}
        </Popover>
      </div>
    );
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(NameCardOver);
