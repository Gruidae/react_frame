import React from 'react';
import { Menu } from 'antd';
import MenuItem from './MenuItem';

class Navigation extends React.Component {

  shouldComponentUpdate(nextProps) {
    const containedKeys = nextProps.menu.map(menu =>
      menu.menuKey,
    );
    return containedKeys.includes(nextProps.selectedKey);
  }

  render() {
    return (
      <aside>
        <Menu
          mode="inline"
          theme="light"
          defaultSelectedKeys={[this.props.menu[0].menuKey]}
          selectedKeys={[this.props.selectedKey]}
        >
          {this.props.menu.map(item => <MenuItem key={item.menuKey} {...item} />)}
        </Menu>
      </aside>
    );
  }
}

export default Navigation;
