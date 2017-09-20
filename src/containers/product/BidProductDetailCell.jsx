import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Modal, Input, message, Form, Alert, notification } from 'antd';
import _ from 'underscore';

import LabelSpan from '../../components/LabelSpan';
import CommentList from '../components/CommentList';
import TagView from '../components/TagView';
import * as productActions from '../../reducers/product/productActions';
import * as globalActions from '../../reducers/global/globalActions';
import * as commentActions from '../../reducers/comment/commentActions';
import Uploader from '../components/Uploader';
import NameCard from '../../components/NameCardOver';
import errorHandler from '../../utils/errorHandler';
import s from './BidProductDetailCell.less';

import bidLogo from '../../img/bid.png';

const FormItem = Form.Item;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...productActions, ...globalActions, ...commentActions }, dispatch),
});

const mapStateToProps = state => ({
  comment: state.comment,
  product: state.product,
  global: state.global,
});

class BidProdctDetailCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bidModal: {
        visible: false,
        title: '',
        mode: 0,
        currentItemId: null,
        reason: '',
        uploadElement: null,
      },
      alertForm: {
        visible: false,
        message: '',
        description: '',
        type: '',
      },
      customerFileList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.props.product) {
      const value = nextProps.product.pages || {};
      const exception = value.getIn(['bid', 'exception']) || null;
      if (exception !== this.props.product.pages.getIn(['bid', 'exception'])) {
        errorHandler.handle(exception);
      }
    }
  }

  onCustomerChange = (info) => {
    const status = info.file.status;
    if (status === 'uploading') {
      // Console.log('info', info);
    } else if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      // 七牛返回的 token 在此
    } else if (status === 'removed') {
      message.success(`${info.file.name} file removed.`);
    }
    // Console.log('info', info);
    this.setState({
      customerFileList: info.fileList.filter(value => value.status === 'done'),
    });
  };

  handleOk = () => {
    switch (this.state.bidModal.type) {
      case 'shareInfo':
        this.props.actions
          .shareCustomerInfo(this.state.bidModal.currentItemId, this.props.productSn);
        break;
      case 'win':
        this.props.actions.winBid(this.state.bidModal.currentItemId, this.props.productSn);
        break;
      case 'drop':
        this.props.actions.dropBid(this.state.bidModal.currentItemId, this.props.productSn);
        break;
      case 'reject':
        this.handleSubmit(this.state.bidModal.type);
        break;
      case 'contact':
        this.handleSubmit(this.state.bidModal.type);
        break;
      default:
        break;
    }
    this.handleCancel();
  };
  handleCancel = () => {
    this.setState({
      bidModal: {
        visible: false,
        title: '',
        mode: 0,
        currentItemId: null,
        alertForm: {
          message: '',
          description: '',
          type: '',
          error: false,
        },
        reason: '',
        uploadElement: <Uploader onChange={this.onCustomerChange} />,
      },
      customerFileList: [],
    });
  };

  handleSubmit = (type) => {
    switch (type) {
      case 'reject':
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.actions
              .rejectBid(this.state.bidModal.currentItemId, values.reason, this.props.productSn);
          }
        });
        break;
      default:
        break;
    }
  };

  showModal(mode, bidId) {
    switch (mode) {
      case 'shareInfo':
        this.setState({
          bidModal: {
            visible: true,
            title: '分享客户信息',
            type: mode,
            content: '确认要分享客户信息吗？',
            currentItemId: bidId,
            alertForm: {
              message: '',
              description: '',
              type: '',
            },
            reason: '',
            uploadElement: null,

          },
          customerFileList: [],
          alertForm: {
            visible: false,
            message: '',
            description: '',
            type: '',
          },
        });
        break;
      case 'win':
        this.setState({
          bidModal: {
            visible: true,
            title: '确认选择中标',
            type: mode,
            content: '确认要选择该业务员中标吗？',
            currentItemId: bidId,
            alertForm: {
              message: '',
              description: '',
              type: '',
            },
            reason: '',
            uploadElement: null,
          },
          customerFileList: [],
          alertForm: {
            visible: false,
            message: '',
            description: '',
            type: '',
          },
        });
        break;
      case 'drop':
        this.setState({
          bidModal: {
            visible: true,
            title: '确认放弃中标',
            type: mode,
            content: '确认要放弃中标吗',
            currentItemId: bidId,
            alertForm: {
              message: '',
              description: '',
              type: '',
            },
            reason: '',
            uploadElement: null,
          },
          customerFileList: [],
          alertForm: {
            visible: false,
            message: '',
            description: '',
            type: '',
          },
        });
        break;
      case 'reject':
        this.setState({
          bidModal: {
            visible: true,
            title: '确认拉黑',
            type: mode,
            content: '确认要拉黑该业务员吗？',
            currentItemId: bidId,
            alertForm: {
              message: '',
              description: '',
              type: '',
            },
            reason: '',
            uploadElement: null,
          },
          customerFileList: [],
          alertForm: {
            visible: false,
            message: '',
            description: '',
            type: '',
          },
        });
        break;
      default:
        break;
    }
  }

  openNotificationWithIcon = (type, msg, desc) => {
    const value = this.props.product.pages || {};
    const msgTemp = value.getIn(['bid', 'exception']);
    if (!_.isUndefined(msgTemp)) {
      notification[type]({
        message: msg,
        description: desc,
      });
    }
  };

  isSelf(obj) {
    let self = 0;
    const currentUser = this.props.global.currentUser || {};
    if (obj === currentUser.uid) {
      self = 1;
    }
    return self;
  }

  renderButton(bid, userInfo, productUserInfo) {
    const currentUserInfo = this.props.global.currentUser || {};
    let shareBtn = '';
    let winBidBtn = '';
    let dropBidBtn = '';
    let defriendBtn = '';
    if (currentUserInfo.is_pm === 1 && this.isSelf(productUserInfo.uid)) {
      winBidBtn =
        (<Col xs={12} sm={24} md={24} lg={24}>
          <Button
            type="primary" size="small" disabled={bid.status !== 0 ? 1 : 0}
            onClick={() => this.showModal('win', bid.id)}
          >选他中标
           </Button>
        </Col>
        );

      shareBtn =
        (<Col xs={12} sm={24} md={24} lg={24}>
          <Button
            type="ghost" size="small" disabled={bid.is_shared_info ? 1 : 0}
            onClick={() => this.showModal('shareInfo', bid.id)}
          >{bid.is_shared_info ? '已分享信息' : '分享客户信息'}
          </Button>
        </Col>);
      if (bid.status === 0) {
        defriendBtn =
          (<Col xs={12} sm={24} md={24} lg={24}>
            <Button type="ghost" size="small" onClick={() => this.showModal('reject', bid.id)}>拒绝
            </Button>
          </Col>);
      } else if (bid.status === 20) {
        defriendBtn =
          (<Col xs={12} sm={24} md={24} lg={24}>
            <Button type="ghost" size="small" disabled onClick={() => this.showModal('reject', bid.id)}>已拒绝
            </Button>
          </Col>);
      } else {
        defriendBtn =
          (<Col xs={12} sm={24} md={24} lg={24}>
            <Button type="ghost" size="small" disabled onClick={() => this.showModal('reject', bid.id)}>拒绝
            </Button>
          </Col>);
      }
    }

    if (currentUserInfo.allow_bid === 1 && this.isSelf(userInfo.uid)) {
      if (bid.status === 0) {
        dropBidBtn =
          (<Col xs={12} sm={24} md={24} lg={24}>
            <Button
              type="ghost" size="small" onClick={() => this.showModal('drop', bid.id)}
            >
              放弃投标
            </Button>
          </Col>);
      } else if (bid.status === 10) {
        dropBidBtn =
          (<Col xs={12} sm={24} md={24} lg={24}>
            <Button
              type="ghost" size="small" disabled onClick={() => this.showModal('drop', bid.id)}
            >
              已放弃
            </Button>
          </Col>);
      } else {
        dropBidBtn =
          (<Col xs={12} sm={24} md={24} lg={24}>
            <Button
              type="ghost" size="small" disabled onClick={() => this.showModal('drop', bid.id)}
            >
              放弃投标
            </Button>
          </Col>);
      }
    }
    return (
      <Col className={s.bidLayer}>
        <Row type="flex" justify="spacing-between">
          {shareBtn}{winBidBtn}{dropBidBtn}{defriendBtn}
          <Col xs={12} sm={24} md={24} lg={24}>
            <CommentList
              targetId={bid.id}
              targetType="2"
              btnSize="small"
              totalCount={bid.comment_count}
            />
          </Col>
        </Row>
      </Col>
    );
  }

  render() {
    const list = this.props.params || {};
    const productUserInfo = this.props.productUserInfo;
    const { getFieldDecorator } = this.props.form;
    const bidList = list.map((obj) => {
      const userInfo = obj.user_info || {};
      return (
        <div className={s.cellBox} key={obj.id}>
          <Row>
            <Col>
              <TagView type="bid" tagStyle="noTop" code={obj.status} />
            </Col>
          </Row>
          { obj.status === 30 ? <img src={bidLogo} alt="" className={s.bidImg} /> : false}
          <Row type="flex" align="middle" justify="start">
            <Col xs={24} sm={3} md={3} lg={3} style={{ marginBottom: '24px' }}>
              <Row type="flex" justify="center">
                <Col span={24} className={s.headImgUrlLayer}>
                  <NameCard uid={userInfo.uid}>
                    <img src={userInfo.headimgurl} alt="" className={s.headImgUrl} />
                  </NameCard>
                </Col>
                <Col span={24}>
                  <NameCard uid={userInfo.uid}>
                    <div className={s.nickName}>{userInfo.nickname}</div>
                  </NameCard>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={17} md={17} lg={17} className={s.content}>
              <Row type="flex" justify="start">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <LabelSpan label="所属公司" value={userInfo.company_name} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <LabelSpan label="接单时间" value={obj.created_at} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <LabelSpan label="联系电话" value={userInfo.mobile} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <LabelSpan label="最近联系" value={obj.last_contacted_at || '--'} />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <LabelSpan label="联系邮箱" value={userInfo.email} />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={2} md={2} lg={2}>
              {this.renderButton(obj, userInfo, productUserInfo)}
            </Col>
          </Row>
        </div>
      );
    });

    return (
      <Row>
        {bidList}
        <Modal
          title={this.state.bidModal.title}
          visible={this.state.bidModal.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.loading}
          onCancel={this.handleCancel}
        >
          {this.state.alertForm.message ?
            <Row>
              <Alert message={this.state.alertForm.message} type="error" showIcon />
            </Row>
            : false
          }
          {this.state.bidModal.content}
          {this.state.bidModal.type === 'reject' || 'contact' ?
            <Col className={s.textArea}>
              {this.state.bidModal.type === 'reject' ?
                <Form onSubmit={this.handleSubmit}>
                  <FormItem>
                    {getFieldDecorator('reason', {
                      rules: [{ required: true, message: '请输入理由!' }],
                    })(
                      <Input
                        type="textarea" rows={6} placeholder="请输入理由" style={{ resize: 'none' }}
                      />,
                    )}
                  </FormItem>
                </Form>
                : false}
              {this.state.bidModal.type === 'contact' ?
                <Form onSubmit={this.handleSubmit}>
                  <FormItem>
                    {getFieldDecorator('content', {
                      rules: [{ required: true, message: '请输入理由!' }],
                    })(
                      <Input
                        type="textarea" rows={6} placeholder="请输入理由" style={{ resize: 'none' }}
                      />,
                    )}
                  </FormItem>
                  <FormItem>
                    {this.state.bidModal.uploadElement}
                  </FormItem>
                </Form>
                : false}
            </Col>
            : false}
        </Modal>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({})(BidProdctDetailCell));
