import React from 'react';
import { Row, Col, Spin } from 'antd';
import { List } from 'immutable';

import CaseListCell from './CaseListCell';
import FeedFilter from '../product/FeedFilter';
import Pagination from '../components/Pagination';
import BlankPage from '../components/BlankPage';
import errorHandler from '../../utils/errorHandler';

class CaseListPage extends React.Component {

  componentDidMount() {
    this.props.actions.getCaseList({
      pageNumber: 1,
      listType: this.props.caseListType,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exception !== this.props.exception) {
      errorHandler.handle(nextProps.exception);
    }
  }

  onSortTypeChange = (nextSortType) => {
    this.props.actions.getCaseList({
      pageNumber: 1,
      keyword: this.props.keyword,
      sortType: nextSortType,
      listType: this.props.caseListType,
    });
  };

  onKeywordChange = (nextKeyword) => {
    this.props.actions.getCaseList({
      pageNumber: 1,
      keyword: nextKeyword,
      sortType: this.props.sortType,
      listType: this.props.caseListType,
    });
  };

  onPageNumberChange = (nextPageNumber) => {
    this.props.actions.getCaseList({
      pageNumber: nextPageNumber,
      keyword: this.props.keyword,
      sortType: this.props.sortType,
      listType: this.props.caseListType,
    });
  };

  render() {
    let caseList = this.props.caseList || [];
    if (List.isList(this.props.caseList)) {
      caseList = this.props.caseList.toJS();
    }
    return (
      <Spin spinning={this.props.isFetching}>
        {
          this.props.shouldShowFilter &&
          <FeedFilter
            filterItems={this.props.filterItems}
            selectedIndex={this.props.sortType}
            onSelectedIndexChange={this.onSortTypeChange}
            keyword={this.props.keyword}
            onKeywordChange={this.onKeywordChange}
          />
        }
        {
          caseList.length > 0 ? (
            <Row type="flex">
              <Col span={22} offset={1}>
                {caseList.map(kase =>
                  <CaseListCell key={kase.case_sn} kase={kase} router={this.props.router} />,
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

CaseListPage.defaultProps = {
  shouldShowFilter: true,
  keyword: '',
  sortType: 0,
};

export default CaseListPage;
