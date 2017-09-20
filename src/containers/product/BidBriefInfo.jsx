import React from 'react';
import { Row, Col, Timeline, Collapse } from 'antd';

import s from './BidBriefInfo.less';
import ContentBox from '../../components/ContentBox';
import LabelSpan from '../../components/LabelSpan';
import AttachmentView from '../../components/AttachmentView';
import FormatUtils from '../../utils/FormatUtils';

const Panel = Collapse.Panel;

export default function BidBriefInfo(props) {
  const { params, isWeChat } = props;
  const logList = params.log_list || [];
  const caseInfo = params.case_info || {};
  const customerAttachs = caseInfo.customer_attachs || [];
  const requirementAttachs = caseInfo.requirement_attachs || [];

  return (
    <Row>
      <div className={s.contentBox}>
        { logList.length > 0 ?
          <Collapse className={s.timeLine}>
            <Panel header="操作日志" key="1">
              <Row type="flex" justify="center" align="middle">
                <Col xs={18} sm={18} md={18} lg={18} className={s.timeLinePosition}>
                  <Timeline>
                    {logList.map((obj, i) =>
                      <Timeline.Item key={i}>
                        <div>{obj.content}</div>
                        <div className={s.timeLineDetail}>
                          {`${obj.user_name} ${obj.created_at}`}
                        </div>
                      </Timeline.Item>,
                    )}

                  </Timeline>
                </Col>
              </Row>
            </Panel>
          </Collapse>
          : false
        }
      </div>
      <div className={s.contentBox}>
        <ContentBox header="客户信息">
          <Row type="flex" justify="start" className={s.contentItemBox}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="公司名称" value={caseInfo.customer_company} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="产品名称" value={caseInfo.customer_product} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="城市" value={caseInfo.customer_city} />
            </Col>
            <Col span={24}>
              <LabelSpan label="描述" value={caseInfo.customer_desc} />
            </Col>
            {customerAttachs.length > 0 ?
              (<Col span={24}>
                <LabelSpan label="相关附件" className={s.attachLayer} />
                {customerAttachs.map((obj, i) =>
                  <AttachmentView
                    key={i} type={obj.file_ext} name={obj.file_name}
                    link={obj.url} className={s.attachItem} canDownLoad={!isWeChat}
                  />,
                )}
              </Col>) : false}
          </Row>
        </ContentBox>
      </div>
      <div className={s.contentBox}>
        <ContentBox header="产品信息">
          <Row type="flex" justify="start" className={s.contentItemBox}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="产品名称" value={params.product_name} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="产品编号" value={params.product_sn} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="客单价" value={FormatUtils.formatMoney(params.per_price)} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="上下浮动" value={`${params.float_up_down}%`} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="订单量" value={params.order_amount} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="返佣" value={`${params.rebate}%`} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="过往赔付率" value={`${params.loss_ratio}%`} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="初审方案时间" value={params.first_plan_date} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="预计生效时间" value={params.effective_date} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="重要紧急程度" value={params.urgency_level_txt} />
            </Col>
            <Col span={24}>
              <LabelSpan label="总保费" value={FormatUtils.formatMoney(caseInfo.total_premium)} />
            </Col>
            <Col span={24}>
              <LabelSpan label="保险条款描述" value={params.product_desc} />
            </Col>
            {requirementAttachs.length > 0 ?
              (<Col span={24}>
                <LabelSpan label="相关附件" className={s.attachLayer} />
                {requirementAttachs.map((obj, i) =>
                  <AttachmentView
                    key={i} type={obj.file_ext} name={obj.file_name}
                    link={obj.url} className={s.attachItem} canDownLoad={!isWeChat}
                  />,
                )}
              </Col>) : false}
          </Row>
          {props.children}
        </ContentBox>
      </div>
    </Row>
  );
}

