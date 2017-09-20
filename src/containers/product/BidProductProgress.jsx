import React from 'react';
import { Row, Col, Steps } from 'antd';
import s from './ProductDetailPage.less';

import { PRODUCT_STEP_MAP, BID_STEP_MAP } from '../constants';

const Step = Steps.Step;

const renderProductProgress = (props) => {
  const currentStatus = props.currentStatus;
  let vDom;
  if (props.type === 'product') {
    vDom =
      (<Row type="flex" justify="center">
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col xs={0} sm={20} md={20} lg={20} className={s.stepBox}>
              <Steps current={PRODUCT_STEP_MAP[currentStatus]}>
                <Step title="待发布（草稿）" />
                <Step title="已发布" />
                <Step title="已接单" />
                <Step title="已取消" />
                <Step title="已结束" />
              </Steps>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col xs={10} sm={0} md={0} lg={0} className={s.stepBox}>
              <Steps direction="vertical" size="small" current={PRODUCT_STEP_MAP[currentStatus]}>
                <Step title="待发布（草稿）" />
                <Step title="已发布" />
                <Step title="已接单" />
                <Step title="已取消" />
                <Step title="已结束" />
              </Steps>
            </Col>
          </Row>
        </Col>
      </Row>)
    ;
  } else if (props.type === 'bid') {
    vDom =
      (<Row type="flex" justify="center">
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col xs={0} sm={20} md={20} lg={20} className={s.stepBox}>
              <Steps current={BID_STEP_MAP[currentStatus]}>
                <Step title="已投标" />
                <Step title="已取消" />
                <Step title="已拒绝" />
                <Step title="已中标" />
              </Steps>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row type="flex" justify="center">
            <Col xs={10} sm={0} md={0} lg={0} className={s.stepBox}>
              <Steps direction="vertical" size="small" current={BID_STEP_MAP[currentStatus]}>
                <Step title="已投标" />
                <Step title="已取消" />
                <Step title="已拒绝" />
                <Step title="已中标" />
              </Steps>
            </Col>
          </Row>
        </Col>
      </Row>);
  } else {
    vDom = null;
  }
  return vDom;
};


export default renderProductProgress;
