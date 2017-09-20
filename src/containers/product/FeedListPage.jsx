import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';
import ProductListPage from './ProductListPage';
import * as productActions from '../../reducers/product/productActions';
import * as globalActions from '../../reducers/global/globalActions';
import * as navActions from '../../reducers/nav/navActions';
import Enhance from '../Enhance';
import { PAGE_TITLE_PRODUCT_LIST } from '../constants';

function mapStateToProps(state) {
  const { selectedPage, pages, products } = state.product;
  const isFetching = pages.getIn([selectedPage, 'isFetching']);
  const exception = pages.getIn([selectedPage, 'exception']);
  const items = pages.getIn([selectedPage, 'items']) || List();
  const productList = items.map(productSN =>
    products.get(productSN),
  );
  const totalCount = pages.getIn([selectedPage, 'totalCount']) || 0;
  const pageSize = pages.getIn([selectedPage, 'pageSize']) || 20;

  const pageNumber = parseInt((selectedPage || '').split('_')[1], 10) || 1;
  const keyword = (selectedPage || '').split('_')[2] || '';
  const urgencyLevel = parseInt((selectedPage || '').split('_')[3], 10) || 0;

  return {
    isFetching,
    exception,
    productList,
    totalCount,
    pageSize,
    pageNumber,
    keyword,
    urgencyLevel,
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...productActions, ...globalActions, ...navActions },
    dispatch,
  ),
});

class FeedListPage extends React.Component {

  componentDidMount() {
    this.props.enhance.setTitle(PAGE_TITLE_PRODUCT_LIST);
  }

  render() {
    return (
      <ProductListPage
        productListType={productActions.productListType.ALL_PRODUCTS}
        selectedIndex={this.props.urgencyLevel}
        filterItems={['全部', '重要不紧急', '紧急不重要', '重要紧急']}
        shouldShowSN
        {...this.props}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(FeedListPage));
