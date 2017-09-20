import React from 'react';
import { Row, Col, Timeline, Collapse } from 'antd';
import LabelSpan from '../../components/LabelSpan';
import AttachmentView from '../../components/AttachmentView';
import ContentBox from '../../components/ContentBox';
import FormatUtils from '../../utils/FormatUtils';
import { LEVEL_MAP_DETAIL, DATE_MAP_DETAIL } from '../constants';
import s from './KaseDetailPage.less';

const Panel = Collapse.Panel;

export default function KaseBaseInfo(props) {
  const { params, isWeChat } = props;
  const kaseUserInfo = params.user_info || {};
  const customerAttachs = params.customer_attachs || [];
  const requirementAttachs = params.requirement_attachs || [];
  const logList = params.log_list || [];
  return (
    <Col span={24}>
      <div className={s.contentBox}>
        <ContentBox header="提交人信息">
          <Row type="flex" justify="start" className={s.contentItemBox}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="提交人姓名" value={kaseUserInfo.nickname} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="联系电话" value={kaseUserInfo.mobile} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="所属公司" value={kaseUserInfo.company_name} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="提交时间" value={params.created_at} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="联系邮箱" value={kaseUserInfo.email} />
            </Col>
          </Row>
        </ContentBox>
      </div>
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
              <LabelSpan label="公司名称" value={params.customer_company} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="产品名称" value={params.customer_product} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="城市" value={params.customer_city} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="对接联系人" value={params.customer_contact} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="联系电话" value={params.customer_phone} />
            </Col>
            <Col span={24}>
              <LabelSpan label="公司／产品信息描述" value={params.customer_desc} />
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
        <ContentBox header="保险需求">
          <Row type="flex" justify="start" className={s.contentItemBox}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="初审方案时间" value={params.first_plan_date} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan
                label="预计生效时间" value={params.effective_date}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan
                label="重要紧急程度" value={LEVEL_MAP_DETAIL[params.urgency_level]}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan label="总保费" value={FormatUtils.formatMoney(params.total_premium)} />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <LabelSpan
                label="订单量"
                value={params.order_amount ? `${params.order_amount}\
                  单／${DATE_MAP_DETAIL[params.order_amount_unit]}` : '0单/年'}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} className={s.contentItem}>
              <LabelSpan label="保险需求描述" value={params.requirement_desc} span="16" />
            </Col>
            {requirementAttachs.length > 0 ?
              (<Col span={24}>
                <LabelSpan label="相关附件" className={s.attachLayer} />
                {requirementAttachs.map((obj, i) =>
                  <AttachmentView
                    key={i} type={obj.file_ext} name={obj.file_name}
                    link={obj.url} className={s.attachItem} isWeChat={!isWeChat}
                  />,
                )}
              </Col>) : false}
          </Row>
          {props.children}
        </ContentBox>
      </div>
    </Col>
  );
}
