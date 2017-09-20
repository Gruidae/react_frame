/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { Tabs } from 'antd-mobile';

import AuthWrapper from './AuthWrapper';
import Navigation from '../../components/Navigation';
import s from './MainContainer.less';

function mapStateToProps(state) {
  return { device: state.device };
}

class MainContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  onTabClick = (menuKey) => {
    this.props.menu.forEach((item) => {
      if (item.menuKey === menuKey) {
        this.props.router.push(item.link);
      }
    });
  };

  renderDesktop = selectedKey =>
    <Row className={s.sider}>
      <Navigation menu={this.props.menu} selectedKey={selectedKey} />
    </Row>
  ;

  renderMobile = selectedKey =>
    <Row className={s.navTabs}>
      <Tabs
        defaultActiveKey={selectedKey}
        onTabClick={this.onTabClick}
        activeKey={selectedKey}
      >
        {this.props.menu.map(item =>
          <Tabs.TabPane
            tab={this.props.device.isMobile && item.titleShort ? item.titleShort : item.title}
            key={item.menuKey}
          />,
        )}
      </Tabs>
    </Row>
  ;

  render() {
    const location = this.props.router.location.pathname;
    const selectedKey = location.substring(location.indexOf('/', 1));
    return (
      <AuthWrapper router={this.props.router}>
        <Row type="flex" className={s.mainContainer}>
          <Col xs={0} sm={4} md={4} lg={4}>
            {this.renderDesktop(selectedKey)}
          </Col>
          <Col xs={24} sm={0} md={0} lg={0}>
            {this.renderMobile(selectedKey)}
          </Col>
          <Col xs={24} sm={20} md={20} lg={20} className={s.main}>
            {this.props.children}
          </Col>
        </Row>
      </AuthWrapper>
    );
  }
}

export default connect(mapStateToProps)(MainContainer);
