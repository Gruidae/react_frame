import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Modal, Spin } from 'antd';
import _ from 'underscore';

import * as productActions from '../../reducers/product/productActions';
import * as globalActions from '../../reducers/global/globalActions';
import * as bidAuthActions from '../../reducers/bidAuth/bidAuthActions';
import * as navActions from '../../reducers/nav/navActions';
import LabelSpan from '../../components/LabelSpan';
import ContentBox from '../../components/ContentBox';
import TagView from '../components/TagView';
import s from './ProductDetailPage.less';
import FormatUtils from '../../utils/FormatUtils';
import errorHandler from '../../utils/errorHandler';
import Enhance from '../Enhance';
import {
  START_BID_PERMISSION_DENIED,
  START_BID_PERMISSION_REVIEW,
} from '../constants';

const mapStateToProps = state => ({
  product: state.product,
  global: state.global,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...productActions, ...globalActions, ...bidAuthActions, ...navActions }, dispatch),
});

function handleDetailException(nextProps) {
  const detailException = nextProps.product.pages.getIn([nextProps.params.productSn, 'exception']);
  if (detailException && !errorHandler.handle(detailException)) {
    nextProps.router.replace({
      pathname: '/',
    });
  }
}

class ProductDetailPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
    };
  }

  componentDidMount() {
    const product = this.props.product.products.get(this.props.params.productSn) || {};
    const allowViewBid = product.allow_view_bid;
    if (product && allowViewBid) {
      this.goToBidProductDetail(this.props);
    }
    this.props.actions.getProductDetail(this.props.params.productSn);
    this.props.enhance.setTitle('产品详情');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.props.product) {
      this.setState({
        loading: nextProps.product.pages.getIn([this.props.params.productSn, 'isFetching']),
      });
    }
    const product = nextProps.product.products.get(nextProps.params.productSn) || {};
    const allowViewBid = product.allow_view_bid || 0;
    if (nextProps.product.pages !== this.props.product.pages) {
      handleDetailException(nextProps);
      this.handleBidException(nextProps);
    }
    if (product && allowViewBid) {
      this.goToBidProductDetail(nextProps);
    }
  }

  handleBidException(nextProps) {
    const bidException = nextProps.product.pages.getIn(['startBid', 'exception']);
    const needsToHandleBidException = bidException !== this.props.product.pages.getIn(['startBid', 'exception']);
    if (needsToHandleBidException) {
      if (_.isUndefined(bidException) || _.isNull(bidException)) {
        // Modal.success(
        //   {
        //     title: '投标成功',
        //     content: '可以在”我投标的“中查看订单详情并与PM取得联系',
        //     onOk: this.goToBidProductDetail,
        //   },
        // );
      } else if (!bidException.handled) {
        bidException.handled = true;
        switch (bidException.code) {
          case START_BID_PERMISSION_REVIEW:
            Modal.warning({
              title: '您的投标资格还在审核中，请稍后',
              content: '我们将再站内信以及微信公众号中告知您审核结果',
            });
            break;
          case START_BID_PERMISSION_DENIED :
            Modal.confirm({
              title: '第一次投标需要审核权限',
              content: '我们将在站内信以及微信公众号中告知您审核结果',
              iconType: 'close-circle',
              okText: '立即申请',
              cancelText: '放弃投标',
              onOk() {
                nextProps.actions.applyBidAuth();
              },
              onCancel() {
              },
            });
            break;
          default:
            bidException.handled = false;
            errorHandler.handle(bidException);
            break;
        }
      }
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

  startBid = () => {
    this.props.actions.startBid(this.props.params.productSn).then(() =>
      this.setState({ visible: false }),
    );
  };

  modifyProduct = (product) => {
    this.props.router.push({
      pathname: `/pm/create-product/${product.case_sn}`,
      state: { isModify: 1, productSn: product.product_sn },
    });
  };

  goToBidProductDetail = (props) => {
    const ref = props.location.query.ref || '/home';
    this.props.router.replace({
      ...this.props.location,
      pathname: `${ref}/bid-product/${this.props.params.productSn}`,
    });
  };

  render() {
    const product = this.props.product.products.get(this.props.params.productSn) || {};
    const caseInfo = product.case_info || {};
    const productUserInfo = product.user_info || {};
    const currentUser = this.props.global.currentUser || {};
    return (
      <Spin spinning={this.state.loading}>
        <Row type="flex">
          <Col span={24} className={s.partContainer}>
            <Col span={24}>
              <h1 className={s.detailTitle}>
                {product.product_name}<TagView type="product" code={product.status} />
              </h1>
            </Col>
          </Col>
          <Col span={24}>
            <div className={s.contentBox}>
              <ContentBox header="客户信息">
                <Row type="flex" justify="space-between" className={s.contentItemBox}>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="公司名称" value={caseInfo.customer_company} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="产品名称" value={caseInfo.customer_product} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="城市" value={caseInfo.customer_city} />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <LabelSpan label="描述" value={caseInfo.customer_desc} />
                  </Col>
                </Row>
              </ContentBox>
            </div>
            <div className={s.contentBox}>
              <ContentBox header="保险需求分析">
                <Row type="flex" justify="space-between" className={s.contentItemBox}>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="产品名称" value={product.product_name} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="产品编号" value={product.product_sn} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan
                      label="客价单"
                      value={FormatUtils.formatMoney(product.per_price)}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan
                      label="上下浮动"
                      value={`± ${product.float_up_down}%`}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="订单量" value={product.order_amount_txt} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="返佣" value={`${product.rebate}%`} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan
                      label="过往赔付率"
                      value={`${product.loss_ratio}%`}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="初方案时间" value={product.first_plan_date} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="预计生效时间" value={product.effective_date} />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <LabelSpan label="重要紧急程度" value={product.urgency_level_txt} />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} className={s.contentItem}>
                    <LabelSpan
                      label="总保费"
                      value={FormatUtils.formatMoney(caseInfo.total_premium)}
                      className={s.totalPrice}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} className={s.contentItem}>
                    <LabelSpan label="条款描述" value={product.product_desc} span="16" />
                  </Col>
                </Row>
                {
                  this.isSelf(productUserInfo.uid) === 0
                  && !currentUser.is_pm && product.status === 10
                    ? <Row type="flex" justify="center" className={s.btnLayer}>
                      <Button
                        type="primary" size="large" className="btn-huge"
                        onClick={() => this.setState({
                          visible: true,
                        })}
                      >
                          我要投标
                    </Button>
                    </Row>
                    : false}
              </ContentBox>
            </div>
          </Col>
          <Modal
            visible={this.state.visible}
            title="确认接单"
            onOk={() => this.startBid()}
            onCancel={() => this.setState({
              visible: false,
            })}
          >
            <div>确认是否要接单</div>
          </Modal>
        </Row>
      </Spin>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ProductDetailPage));
