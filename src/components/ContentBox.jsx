import React from 'react';
import cx from 'classnames';
import s from './ContentBox.less';

export default function ContentBox(props) {
  return (
    <div className={cx('ant-collapse', s.contentHeader, props.className)}>
      <div className="ant-collapse-item ant-collapse-item-active">
        <div className={cx('ant-collapse-header', s.contentTitle)}>
          {props.header}
        </div>
        <div className="ant-collapse-content ant-collapse-content-active">
          {props.children}
        </div>
      </div>
    </div>
  );
}
