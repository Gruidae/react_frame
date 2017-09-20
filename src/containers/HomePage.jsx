import React from 'react';
import { connect } from 'react-redux';

import MainContainer from './components/MainContainer';
import Enhance from './Enhance';
import {
  PAGE_TITLE_PRODUCT_LIST,
  PAGE_TITLE_PUBLISHED_CASES,
  PAGE_TITLE_BIDDEN_PRODUCTS,
} from './constants';

function mapStateToProps(state) {
  return {
    currentUser: state.global.currentUser,
  };
}

function makeMenu(isPm) {
  const menu = [
    {
      menuKey: '/feed',
      title: PAGE_TITLE_PRODUCT_LIST,
      link: '/home/feed',
      icon: 'laptop',
    },
    {
      menuKey: '/published-cases',
      title: PAGE_TITLE_PUBLISHED_CASES,
      link: '/home/published-cases',
      icon: 'user',
    },
  ];
  if (!isPm) {
    menu.push({
      menuKey: '/bidden-products',
      title: PAGE_TITLE_BIDDEN_PRODUCTS,
      link: '/home/bidden-products',
      icon: 'notification',
    });
  }
  return menu;
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: makeMenu(this.props.enhance.isPm(this.props.currentUser)),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser !== this.props.currentUser) {
      this.setState({
        menu: makeMenu(this.props.enhance.isPm(nextProps.currentUser)),
      });
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

export default connect(mapStateToProps)(Enhance(HomePage));
