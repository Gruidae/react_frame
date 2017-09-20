import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { Row, Col, Collapse, Button, Spin, Modal } from 'antd';

import * as navActions from '../../reducers/nav/navActions';
import * as kaseActions from '../../reducers/kase/kaseActions';
import * as globalActions from '../../reducers/global/globalActions';
import KaseBaseInfo from './KaseBaseInfo';
import LabelSpan from '../../components/LabelSpan';
import ContentBox from '../../components/ContentBox';
import TagView from '../components/TagView';
import CommentList from '../components/CommentList';
import FormatUtils from '../../utils/FormatUtils';
import errorHandler from '../../utils/errorHandler';
import { LEVEL_MAP_DETAIL, DATE_MAP_DETAIL } from '../constants';
import s from './KaseDetailPage.less';
import Enhance from '../Enhance';

const Panel = Collapse.Panel;

const mapStateToProps = state => ({
  kase: state.kase,
  global: state.global,
  device: state.device,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...kaseActions, ...globalActions, ...navActions }, dispatch),
});

class KaseDetailPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      kaseId: this.props.params.caseId,
      loading: false,
      kaseFileList: null,
    };
  }

  componentDidMount() {
    const currentUser = this.props.global.currentUser || {};
    const kase = this.props.kase.kases.get(this.props.params.caseId) || {};
    const userInfo = kase.user_info;
    if (kase && userInfo
      && currentUser.is_pm === 0
      && this.isSelf(userInfo.uid) === 0) {
      this.props.router.replace({
        pathname: '/',
      });
    }
    this.props.actions.getKaseDetail(this.props.params.caseId);
    this.props.enhance.setTitle('案例详情');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.kase !== this.props.kase) {
      this.setState({
        loading: nextProps.kase.pages.getIn([this.props.params.caseId, 'isFetching']),
      });
    }
    const exception = nextProps.kase.pages.getIn([this.props.params.caseId, 'exception']);
    if (exception && !errorHandler.handle(exception)) {
      nextProps.router.replace({
        pathname: '/',
      });
    }
    const kase = nextProps.kase.kases.get(this.props.params.caseId) || {};
    const userInfo = kase.user_info || {};
    if (nextProps.global.currentUser !== this.props.global.currentUser) {
      if (!nextProps.global.currentUser ||
        (nextProps.global.currentUser.is_pm === 0
        && this.isSelf(userInfo.uid) === 0)) {
        nextProps.router.replace({
          pathname: '/',
        });
      }
    }
    const optException = nextProps.kase.pages.getIn(['optKase', 'exception']);
    if (optException && optException !== this.props.kase.pages.getIn(['optKase', 'exception'])) {
      errorHandler.handle(optException);
    }
  }

  isSelf(obj) {
    let self = 0;
    const currentUser = this.props.global.currentUser || {};
    if (obj === currentUser.uid) {
      self = 1;
    }
    return self;
  }

  modifyCase = (kase, currentUser, userInfo) => {
    const submitUserInfo = userInfo || {};
    const kaseSn = kase ? kase.case_sn : '';
    this.props.router.push({
      pathname: '/case/submit',
      state: { isModify: 1, kaseSn, profile: submitUserInfo },
    });
  };

  showConfirmModal = (kaseSN) => {
    const actions = this.props.actions;
    Modal.confirm({
      title: '驳回案例',
      content: '确认要驳回案例吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        actions.rejectKase(kaseSN);
      },
      onCancel() {
      },
    });
  };
  renderButton = (kase, currentUser, userInfo) => {
    const modifyBtn = (
      <Button
        type="primary" onClick={() => this.modifyCase(kase, currentUser, userInfo)}
      >编辑案例
      </Button>
    );
    const unModifyBtn = (
      <Button type="primary" disabled>PM已发布产品不可修改</Button>
    );
    const acceptBtn = (
      <Button type="primary">
        <Link to={`/pm/create-product/${kase.case_sn}`}>{kase.is_mine_accepted ? '创建产品（我已受理)' : '受理并创建产品'}</Link>
      </Button>
    );
    const rejectBtn = (
      <Button
        type="primary" onClick={() => this.showConfirmModal(kase.case_sn)}
        disabled={kase.status === 10 || kase.status === 20 ? 0 : 1}
      >
        {kase.status === 10 || kase.status === 20 ? '驳回案例' : '已驳回'}
      </Button>
    );
    const otherAcceptedBtn = kase.accepted_count > 0
      ? <Button type="primary">{`已有(${kase.accepted_count})受理`}</Button> : false;
    let btn;
    if (currentUser.is_pm) {
      // PM权限
      if (this.props.enhance.isSelf(userInfo.uid, currentUser)) {
        // PM本人
        if (kase.status === 0) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{modifyBtn}</Row>);
        } else if (kase.status === 10 || kase.status === 20) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>
            {acceptBtn}{otherAcceptedBtn}{modifyBtn}{rejectBtn}
          </Row>);
        } else if (kase.status === 30) {
          btn = (
            <Row type="flex" justify="start" className={s.btnLayer}>{acceptBtn}{otherAcceptedBtn}{unModifyBtn}</Row>);
        } else if (kase.status === 40) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{rejectBtn}{otherAcceptedBtn}</Row>);
        }
      } else if (!this.props.enhance.isSelf(userInfo.uid, currentUser)) {
        // PM 非本人
        if (kase.status === 0) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer} />);
        } else if (kase.status === 10 || kase.status === 20) {
          btn = (
            <Row type="flex" justify="start" className={s.btnLayer}>{acceptBtn}{rejectBtn}{otherAcceptedBtn}</Row>);
        } else if (kase.status === 30) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{acceptBtn}{otherAcceptedBtn}</Row>);
        } else if (kase.status === 40) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{rejectBtn}{otherAcceptedBtn}</Row>);
        }
      }
    } else if (currentUser.allow_bid) {
      // 业务员权限
      if (this.props.enhance.isSelf(userInfo.uid, currentUser)) {
        // 业务员本人
        if (kase.status === 0) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{modifyBtn}</Row>);
        } else if (kase.status === 10 || kase.status === 20) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{modifyBtn}{otherAcceptedBtn}</Row>);
        } else if (kase.status === 30) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{unModifyBtn}{otherAcceptedBtn}</Row>);
        } else if (kase.status === 40) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{rejectBtn}{otherAcceptedBtn}</Row>);
        }
      } else if (!this.props.enhance.isSelf(userInfo.uid, currentUser)) {
        // 业务员非本人
        if (kase.status === 40) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{rejectBtn}{otherAcceptedBtn}</Row>);
        } else {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{otherAcceptedBtn}</Row>);
        }
      }
    } else if (!currentUser.is_pm && !currentUser.allow_bid) {
      // BD权限
      if (this.props.enhance.isSelf(userInfo.uid, currentUser)) {
        // BD本人
        if (kase.status === 0) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{modifyBtn}</Row>);
        } else if (kase.status === 10 || kase.status === 20) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{modifyBtn}{otherAcceptedBtn}</Row>);
        } else if (kase.status === 30) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{unModifyBtn}{otherAcceptedBtn}</Row>);
        } else if (kase.status === 40) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{rejectBtn}{otherAcceptedBtn}</Row>);
        }
      } else if (!this.props.enhance.isSelf(userInfo.uid, currentUser)) {
        // BD非本人
        if (kase.status === 40) {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{rejectBtn}</Row>);
        } else {
          btn = (<Row type="flex" justify="start" className={s.btnLayer}>{otherAcceptedBtn}</Row>);
        }
      }
    }
    return btn;
  };

  renderNullProduct = () => (
    <ContentBox header="相关产品">
      <div className={s.productBox}>
        无相关任何产品
      </div>
    </ContentBox>
  );

  renderProduct = productList => (
    <Collapse defaultActiveKey={['1']} className={s.timeLine}>
      <Panel header="相关产品" key="1">
        {productList.map((obj, i) =>
          <div key={i} className={s.productBox}>
            <h2>{productList.product_sn}</h2>
            <Row type="flex" justify="start" className={s.contentItemBox}>
              <Col span={24}>
                <LabelSpan label="产品名称" value={obj.product_name} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan label="客单价" value={FormatUtils.formatMoney(obj.per_price)} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan label="上下浮动" value={`± ${obj.float_up_down}%`} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan
                  label="订单量" value={obj.order_amount
                  ? `${obj.order_amount}单／${DATE_MAP_DETAIL[obj.order_amount_unit]}` : '0单/年'}
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan label="返佣" value={`${obj.rebate}%`} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan label="过往赔付率" value={`${obj.loss_ratio}%`} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan label="初方案时间" value={obj.first_plan_date} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan label="预计生效时间" value={obj.effective_date} />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <LabelSpan
                  label="重要紧急程度" value={LEVEL_MAP_DETAIL[obj.urgency_level]}
                />
              </Col>
              <Col span={24}>
                <LabelSpan label="总保费" value={FormatUtils.formatMoney(obj.total_premium)} />
              </Col>
              <Col span={24}>
                <LabelSpan label="条款描述" value={obj.product_desc} />
              </Col>
            </Row>
          </div>,
        )}
      </Panel>
    </Collapse>
  );

  render() {
    const kase = this.props.kase.kases.get(this.props.params.caseId) || {};
    const currentUser = this.props.global.currentUser || {};
    const userInfo = kase.user_info || {};
    const productList = kase.product_list || [];
    return (
      <Spin spinning={this.state.loading}>
        <Row type="flex">
          <Col span={24} className={s.partContainer}>
            <Col span={24}>
              <h1 className={s.detailTitle}>
                案例编号: {kase.case_sn}<TagView type="case" code={kase.status} />
              </h1>
            </Col>
          </Col>
          <KaseBaseInfo params={kase} isWeChat={this.props.device.isWechat}>
            {this.renderButton(kase, currentUser, userInfo)}
          </KaseBaseInfo>
          <Col span={24}>
            { (this.isSelf(userInfo.uid) === 1 || currentUser.is_pm === 1) && kase.status !== 0 &&
            <Col span={24}>
              <div className={s.contentBox}>
                {productList.length !== 0 ?
                  this.renderProduct(productList) :
                  this.renderNullProduct()}
                <Row type="flex" justify="start" className={s.btnMessage}>
                  <CommentList targetId={kase.case_sn} targetType="1" totalCount={kase.comment_count} />
                </Row>
              </div>
            </Col>
            }
          </Col>
        </Row>
      </Spin>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Enhance(KaseDetailPage));
