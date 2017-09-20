import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Card, Button, Modal, Spin, Input, Alert } from 'antd';
import { List } from 'immutable';

import BidAuthApplyFilter from './BidAuthApplyFilter';
import Pagination from '../components/Pagination';
import LabelSpan from '../../components/LabelSpan';
import BlankPage from '../components/BlankPage';
import s from './BidAuthApplyListPage.less';
import * as bidAuthActions from '../../reducers/bidAuth/bidAuthActions';
import * as navActions from '../../reducers/nav/navActions';
import { PAGE_TITLE_APPLY_BID_LIST } from '../constants';
import Enhance from '../Enhance';
import errorHandler from '../../utils/errorHandler';

function mapStateToProps(state) {
  return { bidAuth: state.bidAuth };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ ...bidAuthActions, ...navActions }, dispatch) };
}

class BidAuthApplyListPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      status: 1,
      modalVisible: false,
      currentApplyId: null,
      form: {
        error: false,
        message: '',
      },
      modalContent: null,
    };
  }

  componentDidMount() {
    this.props.enhance.setTitle(PAGE_TITLE_APPLY_BID_LIST);
    this.getApplyList(this.state.status, this.state.page);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bidAuth !== this.props.bidAuth) {
      errorHandler.handle(nextProps.bidAuth.exception);
    }
  }

  onFilterChange = (status) => {
    this.setState({
      status,
    }, () => this.getApplyList(this.state.status));
  };

  onPageNumberChange = (nextPageNumber) => {
    this.getApplyList(this.state.status, nextPageNumber);
    this.setState({
      page: nextPageNumber,
    });
  };

  onFormInputChange = (event) => {
    const { id, value } = event.target;
    const form = this.state.form;
    form[id] = value;

    if (form.error) {
      form.error = false;
      form.message = '';
    }

    this.setState({
      form,
    });
  };

  getApplyList = (status, page) => {
    this.props.actions.getApplyList(status, page);
  };

  showPassConfirm = (applyId) => {
    const actions = this.props.actions;
    Modal.confirm({
      title: '确定要通过申请吗？',
      content: '',
      onOk() {
        actions.passBidAuth(applyId);
      },
      onCancel() {
      },
    });
  };

  showRejectConfirm = (applyId) => {
    this.setState({
      modalVisible: true,
      currentApplyId: applyId,
      modalContent: (<Input
        id="reason"
        type="text"
        onPressEnter={this.handleOk}
        onChange={this.onFormInputChange}
        placeholder="请填写拒绝理由"
      />),
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      form: {
        error: false,
        message: '',
      },
      modalContent: null,
    });
  };

  handleOk = () => {
    const form = this.state.form;
    if (form.reason) {
      this.props.actions.rejectBidAuth(this.state.currentApplyId, form.reason);
      this.setState({
        modalVisible: false,
        form: {
          error: false,
          message: '',
        },
        modalContent: null,
      });
    } else {
      this.setState({
        form: {
          error: true,
          message: '理由不能为空',
        },
      });
    }
  };

  showButtonBox = (status, applyId, operator) => {
    switch (status) {
      case 1:
        return (<div>
          <Button type="primary" onClick={() => this.showPassConfirm(applyId)}>通过</Button>
          <Button type="default" onClick={() => this.showRejectConfirm(applyId)}>拒绝</Button>
        </div>);
      case 2:
        return <div className={s.passed}>已通过 by {operator}</div>;
      case 3:
        return <div className={s.denied}>已拒绝 by {operator}</div>;
      default:
        break;
    }
    return <Row />;
  };

  render() {
    let bidAuthList = this.props.bidAuth.list;
    if (List.isList(bidAuthList)) {
      bidAuthList = this.props.bidAuth.list.toJS();
    }
    return (
      <div className={s.container}>
        <BidAuthApplyFilter
          status={this.state.status}
          onFilterChange={this.onFilterChange}
        />
        <Spin spinning={this.props.bidAuth.isFetching}>
          <Row type="flex" justify="center">
            {
              bidAuthList.length > 0 ?
                bidAuthList.map((obj, index) =>
                  <Card
                    key={index} className={s.contentBox} title={obj.user_info.nickname} bordered
                  >
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <LabelSpan label="联系电话" value={obj.user_info.mobile} />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <LabelSpan label="联系邮箱" value={obj.user_info.email} />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <LabelSpan label="所属公司" value={obj.user_info.company_name} />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12}>
                      <LabelSpan label="申请时间" value={obj.created_at} />
                    </Col>
                    <Col span={24}>
                      <Row type="flex" className={s.buttonBox}>
                        {this.showButtonBox(obj.status, obj.id, obj.operator_nickname)}
                      </Row>
                    </Col>
                  </Card>,
                ) : (
                  <BlankPage />
                )
            }
            <Col>
              <Modal
                title="请填写拒绝理由"
                visible={this.state.modalVisible}
                onOk={this.handleOk}
                confirmLoading={this.props.bidAuth.isFetching}
                onCancel={this.handleCancel}
              >
                {this.state.form.error &&
                <Row>
                  <Alert message={this.state.form.message} type="error" showIcon />
                </Row>
                }
                {this.state.modalContent}
              </Modal>
            </Col>
          </Row>
        </Spin>
        <Pagination
          defaultCurrent={this.state.page}
          current={this.state.page}
          total={this.props.bidAuth.totalCount}
          pageSize={this.props.bidAuth.pageSize}
          onChange={this.onPageNumberChange}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(BidAuthApplyListPage));
