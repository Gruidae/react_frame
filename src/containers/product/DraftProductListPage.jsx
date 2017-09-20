import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';
import ProductListPage from './ProductListPage';
import * as productActions from '../../reducers/product/productActions';
import * as globalActions from '../../reducers/global/globalActions';
import * as navActions from '../../reducers/nav/navActions';
import Enhance from '../Enhance';
import { PAGE_TITLE_DRAFT_PRODUCTS } from '../constants';

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

  return {
    isFetching,
    exception,
    productList,
    totalCount,
    pageSize,
    pageNumber,
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...productActions, ...globalActions, ...navActions },
    dispatch,
  ),
});

class DraftProductListPage extends React.Component {

  componentDidMount() {
    this.props.enhance.setTitle(PAGE_TITLE_DRAFT_PRODUCTS);
  }

  render() {
    return (
      <ProductListPage
        productListType={productActions.productListType.DRAFT_PRODUCTS}
        shouldShowFilter={false}
        {...this.props}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DraftProductListPage));
