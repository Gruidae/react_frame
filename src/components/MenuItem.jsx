import React from 'react';
import { Link } from 'react-router';
import { Badge, Menu, Icon } from 'antd';
import { Popover } from 'antd-mobile';
import _ from 'underscore';
import s from '../containers/components/MainContainer.less';

export default function MenuItem(props) {
  const showBadge = (!_.isUndefined(props.badge) && props.badge > 0);
  if (props.mobile) {
    return (
      <Popover.Item key={props.menuKey} value="scan">
        <Link to={props.link}>{props.title}</Link>
      </Popover.Item>
    );
  }
  return (
    <Menu.Item {...props}>
      <Link to={props.link}>
        {props.icon ? <Icon type={props.icon} /> : false}
        <Badge dot={showBadge}>
          <span className={s.navText}> {props.title}</span>
        </Badge>
      </Link>
    </Menu.Item>
  );
}

MenuItem.defaultProps = {
  title: '坚哥坑我',
};
