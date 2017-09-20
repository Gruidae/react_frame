import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'immutable';
import CaseListPage from './CaseListPage';
import * as caseActions from '../../reducers/kase/kaseActions';
import * as globalActions from '../../reducers/global/globalActions';
import * as navActions from '../../reducers/nav/navActions';
import Enhance from '../Enhance';
import { PAGE_TITLE_DRAFT_CASES } from '../constants';

function mapStateToProps(state) {
  const { selectedPage, pages, kases } = state.kase;
  const isFetching = pages.getIn([selectedPage, 'isFetching']);
  const exception = pages.getIn([selectedPage, 'exception']);
  const items = pages.getIn([selectedPage, 'items']) || List();
  const caseList = items.map(caseSN =>
    kases.get(caseSN),
  );
  const totalCount = pages.getIn([selectedPage, 'totalCount']) || 0;
  const pageSize = pages.getIn([selectedPage, 'pageSize']) || 20;
  const pageNumber = parseInt((selectedPage || '').split('_')[1], 10) || 1;

  return {
    isFetching,
    exception,
    caseList,
    totalCount,
    pageSize,
    pageNumber,
  };
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...caseActions, ...globalActions, ...navActions },
    dispatch,
  ),
});

class DraftCaseListPage extends React.Component {

  componentDidMount() {
    this.props.enhance.setTitle(PAGE_TITLE_DRAFT_CASES);
  }

  render() {
    return (
      <CaseListPage
        caseListType={caseActions.caseListType.DRAFT_CASES}
        shouldShowFilter={false}
        {...this.props}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DraftCaseListPage));
