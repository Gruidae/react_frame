import React from 'react';
import { connect } from 'react-redux';

import MainContainer from '../components/MainContainer';
import Enhance from '../Enhance';
import {
  PAGE_TITLE_CASE_LIST,
  PAGE_TITLE_ACCEPTED_CASES,
  PAGE_TITLE_PUBLISHED_PRODUCTS,
  PAGE_TITLE_DRAFT_PRODUCTS,
  PAGE_TITLE_APPLY_BID_LIST,
  PAGE_TITLE_ACCEPTED_CASES_SHORT,
  PAGE_TITLE_PUBLISHED_PRODUCTS_SHORT,
  PAGE_TITLE_DRAFT_PRODUCTS_SHORT,
  PAGE_TITLE_APPLY_BID_LIST_SHORT,
} from '../constants';

function mapStateToProps(state) {
  return {
    currentUser: state.global.currentUser,
  };
}

function makeMenu() {
  const menu1 = {
    menuKey: '/cases',
    title: PAGE_TITLE_CASE_LIST,
    link: '/pm/cases',
    icon: 'laptop',
  };
  const menu2 = {
    menuKey: '/accepted-cases',
    title: PAGE_TITLE_ACCEPTED_CASES,
    titleShort: PAGE_TITLE_ACCEPTED_CASES_SHORT,
    link: '/pm/accepted-cases',
    icon: 'user',
  };
  const menu3 = {
    menuKey: '/published-products',
    title: PAGE_TITLE_PUBLISHED_PRODUCTS,
    titleShort: PAGE_TITLE_PUBLISHED_PRODUCTS_SHORT,
    link: '/pm/published-products',
    icon: 'smile-o',
  };
  const menu4 = {
    menuKey: '/draft-products',
    title: PAGE_TITLE_DRAFT_PRODUCTS,
    titleShort: PAGE_TITLE_DRAFT_PRODUCTS_SHORT,
    link: '/pm/draft-products',
    icon: 'edit',
  };
  const menu5 = {
    menuKey: '/apply-list',
    title: PAGE_TITLE_APPLY_BID_LIST,
    titleShort: PAGE_TITLE_APPLY_BID_LIST_SHORT,
    link: '/pm/apply-list',
    icon: 'team',
  };
  return [menu1, menu2, menu3, menu4, menu5];
}

class PmPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { menu: makeMenu() };
  }

  componentDidMount() {
    this.checkPm(this.props.currentUser);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser !== this.props.currentUser) {
      this.checkPm(nextProps.currentUser);
    }
  }

  checkPm(user) {
    if (user && this.props.enhance.isCompleted(user) && !this.props.enhance.isPm(user)) {
      this.props.router.replace('/');
    }
  }

  render() {
    return (
      <MainContainer router={this.props.router} menu={this.state.menu}>
        {this.props.children}
      </MainContainer>
    );
  }
}

export default connect(mapStateToProps)(Enhance(PmPage));
