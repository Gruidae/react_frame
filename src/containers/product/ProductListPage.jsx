import React from 'react';
import { Row, Col, Spin } from 'antd';
import { List } from 'immutable';

import FeedCell from './FeedCell';
import FeedFilter from './FeedFilter';
import Pagination from '../components/Pagination';
import BlankPage from '../components/BlankPage';
import errorHandler from '../../utils/errorHandler';

class ProductListPage extends React.Component {

  componentDidMount() {
    this.props.actions.getProductList({
      pageNumber: 1,
      listType: this.props.productListType,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exception !== this.props.exception) {
      errorHandler.handle(nextProps.exception);
    }
  }

  onSelectedIndexChange = (nextSelectedIndex) => {
    this.props.actions.getProductList({
      pageNumber: 1,
      keyword: this.props.keyword,
      urgencyLevel: nextSelectedIndex,
      sortType: nextSelectedIndex,
      listType: this.props.productListType,
    });
  };

  onKeywordChange = (nextKeyword) => {
    this.props.actions.getProductList({
      pageNumber: 1,
      keyword: nextKeyword,
      urgencyLevel: this.props.urgencyLevel,
      sortType: this.props.sortType,
      listType: this.props.productListType,
    });
  };

  onPageNumberChange = (nextPageNumber) => {
    this.props.actions.getProductList({
      pageNumber: nextPageNumber,
      keyword: this.props.keyword,
      urgencyLevel: this.props.urgencyLevel,
      sortType: this.props.sortType,
      listType: this.props.productListType,
    });
  };

  render() {
    let productList = this.props.productList || [];
    if (List.isList(this.props.productList)) {
      productList = this.props.productList.toJS();
    }
    return (
      <Spin spinning={this.props.isFetching}>
        {
          this.props.shouldShowFilter &&
          <FeedFilter
            filterItems={this.props.filterItems}
            selectedIndex={this.props.selectedIndex}
            onSelectedIndexChange={this.onSelectedIndexChange}
            keyword={this.props.keyword}
            onKeywordChange={this.onKeywordChange}
          />
        }
        {
          productList.length > 0 ? (
            <Row>
              <Col span={22} offset={1}>
                {productList.map(product =>
                  <FeedCell
                    key={product.product_sn}
                    product={product}
                    shouldShowSN={this.props.shouldShowSN}
                    shouldShowBidStatus={this.props.shouldShowBidStatus}
                    router={this.props.router}
                  />,
                )}
              </Col>
            </Row>
          ) : (
            <BlankPage />
          )
        }
        <Pagination
          current={this.props.pageNumber}
          total={this.props.totalCount}
          pageSize={this.props.pageSize}
          onChange={this.onPageNumberChange}
        />
      </Spin>
    );
  }
}

ProductListPage.defaultProps = {
  shouldShowFilter: true,
  keyword: '',
  urgencyLevel: 0,
  sortType: 0,
};

export default ProductListPage;
