import React from 'react';
import { Row } from 'antd';
import MainContainer from '../components/MainContainer';
import {
  PAGE_TITLE_CREATE_CASE,
  PAGE_TITLE_DRAFT_CASES,
} from '../constants';

class CasePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: [
        {
          menuKey: '/submit',
          title: PAGE_TITLE_CREATE_CASE,
          link: '/case/submit',
          icon: 'laptop',
        },
        {
          menuKey: '/draft',
          title: PAGE_TITLE_DRAFT_CASES,
          link: '/case/draft',
          icon: 'edit',
        },
      ],
    };
  }

  render() {
    return (
      <MainContainer router={this.props.router} menu={this.state.menu}>
        <Row>
          {this.props.children}
        </Row>
      </MainContainer>
    );
  }
}

export default CasePage;
