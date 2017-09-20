import React from 'react';
import { Row, Col } from 'antd';
import cx from 'classnames';
import s from './LabelPair.less';

// Words Left by Mark
// Please notice jsx-a11y/label-has-for next time
// https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
/* eslint-disable jsx-a11y/label-has-for */
export default function LabelPair(props) {
  return (
    <Row type="flex" justify="start">
      <label className={cx(s.label, props.className)}>{props.label}：</label>
      <Col span={props.span ? props.span : 14}>
        {props.children}
      </Col>
    </Row>
  );
}
