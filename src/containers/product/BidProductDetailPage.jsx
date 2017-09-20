import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Spin, Button, Modal } from 'antd';

import * as productActions from '../../reducers/product/productActions';
import * as globalActions from '../../reducers/global/globalActions';
import * as navActions from '../../reducers/nav/navActions';

import BidBriefInfo from './BidBriefInfo';
import BidProductDetailCell from './BidProductDetailCell';
import ContentBox from '../../components/ContentBox';
import TagView from '../components/TagView';
import s from './ProductDetailPage.less';
import errorHandler from '../../utils/errorHandler';
import Enhance from '../Enhance';

const mapStateToProps = state => ({
  product: state.product,
  global: state.global,
  device: state.device,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...productActions, ...globalActions, ...navActions }, dispatch),
});

class BidProductDetailPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      kaseId: this.props.params.caseId,
      loading: false,
    };
  }

  componentDidMount() {
    const product = this.props.product.products.get(this.props.params.productSn) || {};
    const allowViewBid = product.allow_view_bid;
    const ref = this.props.location.query.ref || '/home';
    // console.log(locationStr);
    if (product && !allowViewBid) {
      this.props.router.replace({
        pathname: `${ref}/product/${this.props.params.productSn}`,
        query: { ref: this.props.location.query.ref },
      });
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
    const exception = nextProps.product.pages.getIn([nextProps.params.productSn, 'exception']);
    if (exception && !errorHandler.handle(exception)) {
      nextProps.router.replace({
        pathname: '/',
      });
    }
    const product = nextProps.product.products.get(nextProps.params.productSn) || {};
    const allowViewBid = product.allow_view_bid;
    const ref = nextProps.location.query.ref || '/home';
    if (product && !allowViewBid) {
      nextProps.router.replace({
        pathname: `${ref}/product/${nextProps.params.productSn}`,
        query: { from: this.props.location.query.from, ref: this.props.location.query.ref },
      });
    }
    if (nextProps.global.currentUser !== this.props.global.currentUser) {
      if (!nextProps.global.currentUser || nextProps.global.currentUser.allow_bid === 1) {
        nextProps.router.replace({
          pathname: `${ref}/product/${nextProps.params.productSn}`,
          query: { ref: this.props.location.query.ref },
        });
      }
    }
    const optException = nextProps.product.pages.getIn(['optProduct', 'exception']);
    if (optException && optException !== this.props.product.pages.getIn(['optProduct', 'exception'])) {
      errorHandler.handle(optException);
    }
  }


  modifyProduct = (product) => {
    this.props.router.push({
      pathname: `/pm/create-product/${product.case_sn}`,
      state: { isModify: 1, productSn: product.product_sn },
    });
  };

  showModal = (productSn) => {
    const actions = this.props.actions;
    Modal.confirm({
      title: '下架产品',
      content: '确定需要下架产品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        actions.cancelProduct(productSn);
      },
      onCancel() {
      },
    });
  };

  render() {
    const product = this.props.product.products.get(this.props.params.productSn) || {};
    const bidlist = product.bid_list || [];
    const productUserInfo = product.user_info || {};
    const currentUser = this.props.global.currentUser || {};
    return (
      <Spin spinning={this.state.loading}>
        <Row type="flex">
          <Col span={24} className={s.partContainer}>
            <Col span={24}>
              <h1 className={s.detailTitle}>{product.product_name}<TagView type="product" code={product.status} /></h1>
            </Col>
          </Col>
          <Col span={24}>
            <BidBriefInfo params={product} isWeChat={this.props.device.isWechat}>
              <Row type="flex" justify="start" size="large" className={s.btnLayer}>
                { (product.status === 0 || product.status === 10)
                && this.props.enhance.isSelf(productUserInfo.uid, currentUser)
                  ?
                    <Col>
                      <Button type="primary" onClick={() => this.modifyProduct(product)}>编辑产品</Button>
                    </Col>
                    : false
                }
                {
                  this.props.enhance.isSelf(productUserInfo.uid, currentUser)
                  && (product.status === 10 || product.status === 30)
                    ?
                      <Col>
                        <Button type="primary" onClick={() => this.showModal(product.product_sn)} disabled={product.status === 30 ? 1 : 0}>
                          {product.status === 30 ? '已下架' : '下架产品'}
                        </Button>
                      </Col>
                      : false
                }
              </Row>
            </BidBriefInfo>
            <div className={s.contetxBox}>
              { bidlist.length > 0 ?
                <ContentBox header="投标详情">
                  <BidProductDetailCell
                    params={bidlist} location={this.props.location}
                    productUserInfo={productUserInfo} productSn={product.product_sn}
                  />
                </ContentBox> : false
              }
            </div>
          </Col>
        </Row>
      </Spin>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(BidProductDetailPage));
