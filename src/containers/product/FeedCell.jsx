import React from 'react';
import { Card, Row, Col, Tag, Icon } from 'antd';

import s from './FeedCell.less';
import TagView from '../components/TagView';

export default function FeedCell(props) {
  const location = props.router.getCurrentLocation();
  let locationStr;
  if (location.pathname.lastIndexOf('/') === 0) {
    locationStr = location.pathname;
  } else {
    locationStr = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
  }

  const goToProduct = (productSn) => {
    props.router.push({
      ...props.location,
      pathname: `${locationStr}/product/${productSn}`,
      query: { ref: locationStr },
    });
  };
  return (
    <Card
      bodyStyle={{ padding: 0 }}
      className={s.productBox}
      onClick={() => goToProduct(props.product.product_sn)}
    >
      <Row className={s.header}>
        <Row type="flex" justify="space-between">
          <Col span={20} className={s.titleSection}>
            <Row type="flex" gutter={8}>
              <Col className={s.title}>{props.product.product_name}</Col>
              <Col>
                <TagView type="product" code={props.product.status} />
                {props.shouldShowBidStatus && props.product.bid_status !== null &&
                  <TagView type="bid" code={props.product.bid_status} />
                }
              </Col>
            </Row>
          </Col>
          <Col span={4} className={s.topRight}>
            <Icon type="eye-o" />
            {props.product.view_count}
          </Col>
        </Row>
        {
          props.shouldShowSN &&
          <Row className={s.no}>
            <Col>
              产品编号：{props.product.product_sn}
            </Col>
          </Row>
        }
      </Row>
      <Row type="flex" gutter={8} className={s.content}>
        <Col>
          <Row type="flex" gutter={8}>
            <Col><a title="客户公司"><Icon type="tag-o" /></a></Col>
            <Col>{props.product.customer_company}</Col>
          </Row>
        </Col>
        <Col>
          <Row type="flex" gutter={8}>
            <Col><a title="订单量"><Icon type="shopping-cart" /></a></Col>
            <Col>{props.product.order_amount_txt}</Col>
          </Row>
        </Col>
        <Col>
          <Row type="flex" gutter={8}>
            <Col><a title="客单价"><Icon type="pay-circle-o" /></a></Col>
            <Col>{props.product.per_price}元/单</Col>
          </Row>
        </Col>
        <Col>
          <Row type="flex" gutter={8}>
            <Col><a title="初方案时间"><Icon type="clock-circle-o" /></a></Col>
            <Col>{props.product.first_plan_date}</Col>
          </Row>
        </Col>
      </Row>
      <p className={s.contentLabel}>{props.product.product_desc}</p>
      <Row type="flex" gutter={8}>
        <Col>
          {(props.product.product_tags || []).map(tag =>
            <Tag key={tag} color="#C0CFD5" className={s.tag}>{tag}</Tag>,
          )}
        </Col>
      </Row>
    </Card>
  );
}

FeedCell.defaultProps = {
  shouldShowSN: true,
  shouldShowBidStatus: true,
};
