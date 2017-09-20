import React from 'react';
import { Card, Row, Col, Icon } from 'antd';

import s from './CaseListCell.less';
import TagView from '../components/TagView';

export default function CaseListCell(props) {
  const location = props.router.getCurrentLocation();
  let locationStr;
  if (location.pathname.lastIndexOf('/') === 0) {
    locationStr = location.pathname;
  } else {
    locationStr = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
  }
  const goToCase = (kaseSn) => {
    props.router.replace({
      ...props.location,
      pathname: `${locationStr}/case/${kaseSn}`,
      query: { ref: locationStr },
    });
  };
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      className={s.contentBox}
      onClick={() => goToCase(props.kase.case_sn)}
    >
      <Row style={{ borderBottom: '1px solid #ececec' }}>
        <Row type="flex" gutter={8} className={s.titleSection}>
          <Col className={s.title}>{props.kase.customer_company}</Col>
          <Col><TagView type="case" code={props.kase.status} /></Col>
        </Row>
        {
          props.shouldShowSN &&
          <Row className={s.no}>
            <Col>
              案例编号：{props.kase.case_sn}
            </Col>
          </Row>
        }
      </Row>
      <Row type="flex" gutter={8} className={s.content}>
        <Col>
          <Row type="flex" gutter={7}>
            <Col><a title="客户产品"><Icon type="tag-o" /></a></Col>
            <Col>{props.kase.customer_product}</Col>
          </Row>
        </Col>
        <Col>
          <Row type="flex" gutter={8}>
            <Col><a title="订单量"><Icon type="shopping-cart" /></a></Col>
            <Col>{props.kase.order_amount_txt}</Col>
          </Row>
        </Col>
        <Col>
          <Row type="flex" gutter={8}>
            <Col><a title="总保费"><Icon type="pay-circle-o" /></a></Col>
            <Col>{props.kase.total_premium}元</Col>
          </Row>
        </Col>
        <Col>
          <Row type="flex" gutter={8}>
            <Col><a title="初方案时间"><Icon type="clock-circle-o" /></a></Col>
            <Col>{props.kase.first_plan_date}</Col>
          </Row>
        </Col>
      </Row>
      <p className={s.contentLabel}>{props.kase.requirement_desc}</p>
    </Card>
  );
}

CaseListCell.defaultProps = {
  shouldShowSN: true,
};
