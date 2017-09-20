import React from 'react';
import { Row, Icon } from 'antd';
import s from './BlankPage.less';

export default function BlankPage() {
  return (
    <Row type="flex" justify="center" className={s.container}>
      <Icon type="info-circle-o" />
      <p>没有符合条件的记录</p>
    </Row>
  );
}
