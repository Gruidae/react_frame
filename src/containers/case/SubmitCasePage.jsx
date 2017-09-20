import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, DatePicker, Input, Select, Button, message, Form, Spin } from 'antd';

import Console from '../../utils/Console';
import s from './SubmitCasePage.less';
import * as navActions from '../../reducers/nav/navActions';
import * as kaseActions from '../../reducers/kase/kaseActions';
import Uploader from '../components/Uploader';
import errorHandler from '../../utils/errorHandler';
import Enhance from '../Enhance';
import {
  SELECT_ORDER_UNIT_YEAR,
  SELECT_ORDER_UNIT_MONTH,
  SELECT_ORDER_UNIT_DAY,
  LEVEL_UNIMPORTANT_URGENT,
  LEVEL_IMPORTANT_NON_URGENT,
  LEVEL_IMPORTANT_URGENT,
  IS_SAVE_TO_DRAFTBOX,
  IS_PUBLISH,
  LEVEL_MAP,
  DATE_MAP,
  CASE_DRAFTBOX,
  PAGE_TITLE_CREATE_CASE,
} from '../constants';

const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const phoneRegExp = new RegExp(/^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$|^(0(10|2[0-5789]|\d{3}))?-?(\d{7,8})+([-][0-9]{1,4})?$/);

function mapStateToProps(state) {
  return {
    create: state.kase.create,
    profile: state.global.currentUser,
    kase: state.kase,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ ...kaseActions, ...navActions }, dispatch) };
}

function CaseFormItem(props) {
  const { getFieldDecorator } = props.form;
  const name = props.name;
  const required = props.required;
  const alertMessage = props.message;
  const children = props.children;
  const type = props.type;
  const xs = props.xs ? props.xs : 24;
  const sm = props.sm ? props.sm : 24;
  const md = props.md ? props.md : 24;
  const lg = props.lg ? props.lg : 24;
  const itemClassName = props.className || s.formItem;
  const rules = [{ type, required, message: alertMessage }];
  if (props.pattern && props.patternMessage) {
    const patternRules = { pattern: props.pattern, message: props.patternMessage };
    rules.push(patternRules);
  }
  if (props.initialValue) {
    return (
      <Col xs={xs} sm={sm} md={md} lg={lg}>
        <FormItem
          {...props.layout}
          className={itemClassName}
          label={props.label}
        >
          {getFieldDecorator(name, {
            initialValue: props.initialValue,
            rules,
          })(
            children,
          )}
        </FormItem>
      </Col>
    );
  }
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg}>
      <FormItem
        {...props.layout}
        className={itemClassName}
        label={props.label}
      >
        {getFieldDecorator(name, {
          rules,
        })(
          children,
        )}
      </FormItem>
    </Col>
  );
}

function defaultAttachMap(attach) {
  return {
    uid: attach.id,
    name: decodeURIComponent(attach.file_name),
    status: 'done',
    url: attach.url,
    thumburl: attach.url,
  };
}

function DraftBoxButton(props) {
  if (props.disabled) {
    return (
      <Button
        disabled
        className={props.className}
        onClick={props.onClick}
        type={props.type}
      >保存至草稿</Button>
    );
  }
  return (
    <Button
      className={props.className}
      onClick={props.onClick}
      type={props.type}
    >保存至草稿</Button>
  );
}

class SubmitCasePage extends React.Component {

  constructor(props) {
    super(props);
    let kaseSn = '';
    let profile = {};
    let isModify = false;
    let draftBoxDisabled = false;
    if (this.props.location && this.props.location.state) {
      kaseSn = this.props.location.state.kaseSn || '';
      profile = this.props.location.state.profile || {};
      isModify = this.props.location.state.isModify;
      const kase = this.props.kase.kases.get(kaseSn) || {};
      draftBoxDisabled = isModify && kase.status !== CASE_DRAFTBOX;
    }
    const kase = this.props.kase.kases.get(kaseSn) || {};
    this.state = {
      customerFileList: null,
      insuranceFileList: null,
      orderUnit: SELECT_ORDER_UNIT_YEAR,
      loading: false,
      isModify,
      kaseSn,
      profile,
      draftBoxDisabled,
      effectDate: kase.effective_date ? moment(kase.effective_date, dateFormat) : '',
    };
  }

  componentDidMount() {
    this.props.enhance.setTitle(PAGE_TITLE_CREATE_CASE);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.create !== nextProps.create) {
      this.setState({
        loading: nextProps.create.isFetching,
      });
      if (nextProps.create.exception) {
        errorHandler.handle(nextProps.create.exception);
      }
    }
  }

  // 保存到草稿箱
  onSaveToDraftBox = () => {
    if (this.state.isModify) {
      this.props.actions.modifyKase(
        this.getParamsFromFields(this.props.form.getFieldsValue(),
          IS_SAVE_TO_DRAFTBOX), true);
    } else {
      this.props.actions.createKase(
        this.getParamsFromFields(this.props.form.getFieldsValue(),
          IS_SAVE_TO_DRAFTBOX), true);
    }
  };


  onCustomerChange = (info) => {
    const status = info.file.status;
    if (status === 'uploading') {
      // Console.log('info', info);
    } else if (status === 'done') {
      message.success(`${info.file.name} 上传成功.`);
      // 七牛返回的 token 在此
    } else if (status === 'removed') {
      message.success(`${info.file.name} 删除成功.`);
    }
    // Console.log('info', info);
    this.setState({
      customerFileList: info.fileList.filter(value => value.status === 'done'),
    });
  };

  onInsuranceChange = (info) => {
    const status = info.file.status;
    if (status === 'uploading') {
      // Console.log('info', info);
    } else if (status === 'done') {
      message.success(`${info.file.name} 上传成功.`);
      // 七牛返回的 token 在此
    } else if (status === 'removed') {
      message.success(`${info.file.name} 删除成功.`);
    }
    // Console.log('info', info);
    this.setState({
      insuranceFileList: info.fileList.filter(value => value.status === 'done'),
    });
  };

  onOrderUnitChange = (value) => {
    this.setState({
      orderUnit: value,
    });
  };

  onFirstDateChanged = (date, dateString) => {
    if (!this.state.effectDate) {
      this.setState({
        effectDate: moment(dateString, dateFormat).add(1, 'days'),
      });
    } else if (this.state.effectDate < date) {
      this.setState({
        effectDate: moment(dateString, dateFormat).add(1, 'days'),
      });
    }
  };

  getParamsFromFields(values, publishMode) {
    let customerKeys = [];
    if (this.state.customerFileList) {
      this.state.customerFileList.forEach((file) => {
        if (file.response) {
          customerKeys.push(`${file.response.attach_id}`);
        }
      });
    }
    let insuranceKeys = [];
    if (this.state.insuranceFileList) {
      this.state.insuranceFileList.forEach((file) => {
        if (file.response) {
          insuranceKeys.push(`${file.response.attach_id}`);
        }
      });
    }
    const kase = this.props.kase.kases.get(this.state.kaseSn) || {};
    if (kase) {
      if (kase.customer_attach_ids) {
        customerKeys = customerKeys.concat(kase.customer_attach_ids);
      }

      if (kase.requirement_attach_ids) {
        insuranceKeys = insuranceKeys.concat(kase.requirement_attach_ids);
      }
    }
    const planData = values.firstPlanDate ?
      values.firstPlanDate.format(dateFormat) : '';
    const effectData = values.firstEffectDate ?
      values.firstEffectDate.format(dateFormat) : '';
    let publishModeParams = publishMode;
    // 后台逻辑 修改状态下不在草稿箱不能传1
    if (this.state.isModify) {
      if (kase.status !== CASE_DRAFTBOX) {
        publishModeParams = IS_SAVE_TO_DRAFTBOX;
      }
    }
    return {
      case_sn: this.state.kaseSn,
      is_publish: publishModeParams,
      intro_name: values.introduceName,
      intro_phone: values.introducePhone,
      customer_company: values.companyName,
      customer_product: values.productName,
      customer_city: values.customerCity,
      customer_contact: values.jointPerson,
      customer_phone: values.customerPhone,
      customer_desc: values.customerDescription,
      customer_attach_ids: customerKeys,
      first_plan_date: planData,
      effective_date: effectData,
      total_premium: values.insuranceAmount,
      order_amount: values.orderCount,
      requirement_attach_ids: insuranceKeys,
      requirement_desc: values.insuranceDescription,
      order_amount_unit: this.state.orderUnit,
      urgency_level: values.importantLevel,
    };
  }

  // 发布产品
  handleSubmit = (event) => {
    event.preventDefault();
    Console.log(this.props.form.getFieldsValue());
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.isModify) {
          this.props.actions.modifyKase(this.getParamsFromFields(values,
            IS_PUBLISH), false);
        } else {
          this.props.actions.createKase(this.getParamsFromFields(values,
            IS_PUBLISH), false);
        }
      }
    });
  };

  renderForm = () => {
    const kase = this.props.kase.kases.get(this.state.kaseSn) || {};
    let submitProfile = {};
    let defaultOrderUnit = SELECT_ORDER_UNIT_YEAR;
    const defaultCustomerFileList = [];
    const defaultInsuranceFileList = [];
    if (kase) {
      if (kase.customer_attachs && kase.customer_attachs.length > 0) {
        kase.customer_attachs.forEach(attach =>
          defaultCustomerFileList.push(defaultAttachMap(attach)));
      }
      if (kase.requirement_attachs && kase.requirement_attachs.length > 0) {
        kase.requirement_attachs.forEach(attach =>
          defaultInsuranceFileList.push(defaultAttachMap(attach)));
      }
    }
    if (!this.state.isModify) {
      submitProfile = this.props.profile || {};
    } else {
      submitProfile = this.state.profile;
      defaultOrderUnit = kase.order_amount_unit ?
        kase.order_amount_unit.toString() : SELECT_ORDER_UNIT_YEAR;
    }
    const formLabelLayout = {
      labelCol: { xs: 1, sm: 1, md: 1, lg: 1 },
      wrapperCol: { xs: 15, sm: 13, md: 13, lg: 13 },
    };

    const formItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { xs: 24, sm: 13, md: 13, lg: 13 },
    };

    const formTextAreaItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { xs: 24, sm: 13, md: 13, lg: 13 },
    };

    const orderCountSelect = (
      <Select
        defaultValue={defaultOrderUnit}
        onChange={this.onOrderUnitChange}
        className={s.detailInputSelect}
      >
        <Option
          value={SELECT_ORDER_UNIT_YEAR}
        >
          {DATE_MAP.SELECT_ORDER_UNIT_YEAR}
        </Option>
        <Option
          value={SELECT_ORDER_UNIT_MONTH}
        >
          {DATE_MAP.SELECT_ORDER_UNIT_MONTH}
        </Option>
        <Option
          value={SELECT_ORDER_UNIT_DAY}
        >
          {DATE_MAP.SELECT_ORDER_UNIT_DAY}
        </Option>
      </Select>
    );

    return (
      <div>
        <Row type="flex" className={s.container}>
          <Col span={24}>
            <h1 className={s.productTitle}>{PAGE_TITLE_CREATE_CASE}</h1>
          </Col>

          <Col span={24}>
            <h2 className={s.sectionTitleMargin}>提交人信息</h2>
            <Form className={s.form}>
              <CaseFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'提交人姓名'} name={'submiterName'}
                initialValue={submitProfile.nickname || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />

              </CaseFormItem>
              <CaseFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'联系电话'} name={'submiterMobile'}
                initialValue={submitProfile.mobile || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />

              </CaseFormItem>
              <CaseFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'所属公司'} name={'submiterCompanyName'}
                initialValue={submitProfile.company_name || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />

              </CaseFormItem>
              <CaseFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'联系邮箱'} name={'submiterEmail'}
                initialValue={submitProfile.email || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />

              </CaseFormItem>
            </Form>
            <h2 className={s.sectionTitleMargin}>介绍信息</h2>
            <Row type="flex" justify="space-between">
              <Form onSubmit={this.handleSubmit} className={s.form}>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'介绍人'} name={'introduceName'}
                  initialValue={kase.intro_name || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'联系方式'} name={'introducePhone'}
                  initialValue={kase.intro_phone || ''}
                  pattern={phoneRegExp}
                  patternMessage={'电话格式不正确'}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </CaseFormItem>
              </Form>
            </Row>
            <h2 className={s.sectionTitleMargin}>客户信息</h2>
            <Row
              type="flex" justify="space-between"
              className={s.labelMargin}
            >
              <Form onSubmit={this.handleSubmit} className={s.form}>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'公司名称'} name={'companyName'}
                  required message={'请输入公司名称！'}
                  initialValue={kase.customer_company || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'产品名称'} name={'productName'}
                  required message={'请输入产品名称！'}
                  initialValue={kase.customer_product || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'城市'} name={'customerCity'}
                  required message={'请输入城市名称！'}
                  initialValue={kase.customer_city || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'对接联系人'} name={'jointPerson'}
                  required message={'请输入对接联系人！'}
                  initialValue={kase.customer_contact || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'联系电话'} name={'customerPhone'}
                  required message={'请输入联系电话！'}
                  pattern={phoneRegExp}
                  patternMessage={'电话格式不正确'}
                  initialValue={kase.customer_phone || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </CaseFormItem>
                {/* <CaseFormItem form={this.props.form} */}
                {/* layout={formItemLayout} */}
                {/* label={'客户评级'} name={'customerLevel'} */}
                {/* required={true} message={'请输入城市名称！'}> */}
                {/* <Input className={s.detailInput} */}
                {/* placeholder="请输入"/> */}
                {/* </CaseFormItem> */}
                <CaseFormItem
                  form={this.props.form}
                  layout={formTextAreaItemLayout}
                  className={s.formTextAreaItem}
                  label={'公司/产品信息描述'} name={'customerDescription'}
                  required message={'请输入公司/产品信息描述！'}
                  initialValue={kase.customer_desc || ''}
                >
                  <Input
                    type="textarea" rows={4}
                    placeholder="请输入相关描述"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formTextAreaItemLayout}
                  type={'object'}
                  label={'相关附件'} name={'customerAttachment'}
                >
                  <Uploader
                    defaultFileList={defaultCustomerFileList}
                    onChange={this.onCustomerChange}
                  />

                </CaseFormItem>
              </Form>
            </Row>
            <h2 className={s.sectionTitleMargin}>保险需求</h2>
            <Row
              type="flex" justify="space-between"
              className={s.labelMargin}
            >
              <Form onSubmit={this.handleSubmit} className={s.form}>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'初方案时间'} name={'firstPlanDate'}
                  type={'object'}
                  required message={'请选择初方案时间！'}
                  initialValue={kase.first_plan_date ? moment(kase.first_plan_date, dateFormat) : ''}
                >
                  <DatePicker onChange={this.onFirstDateChanged} />
                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'预生效时间'} name={'firstEffectDate'}
                  type={'object'}
                  required message={'请选择预生效时间！'}
                  initialValue={this.state.effectDate}
                >
                  <DatePicker />
                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'紧急程度'} name={'importantLevel'}
                  required message={'请选择紧急程度！'}
                  initialValue={kase.urgency_level ?
                    kase.urgency_level.toString() : LEVEL_IMPORTANT_NON_URGENT}
                >
                  <Select
                    size="large"
                    placeholder="请选择紧急程度"
                    className={s.detailSelect}
                  >
                    <Option value={LEVEL_IMPORTANT_NON_URGENT}>
                      {LEVEL_MAP.LEVEL_IMPORTANT_NON_URGENT}
                    </Option>
                    <Option value={LEVEL_IMPORTANT_URGENT}>
                      {LEVEL_MAP.LEVEL_IMPORTANT_URGENT}
                    </Option>
                    <Option value={LEVEL_UNIMPORTANT_URGENT}>
                      {LEVEL_MAP.LEVEL_UNIMPORTANT_URGENT}
                    </Option>
                  </Select>
                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'总保费'} name={'insuranceAmount'}
                  required message={'请输入总保费！'}
                  initialValue={kase.total_premium || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                    addonAfter="元"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formItemLayout}
                  label={'订单量'}
                  name={'orderCount'}
                  required message={'请输入订单量！'}
                  initialValue={kase.order_amount ?
                    kase.order_amount.toString() : ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入" addonBefore={orderCountSelect}
                    addonAfter="单"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formTextAreaItemLayout}
                  className={s.formTextAreaItem}
                  label={'保险需求描述'} name={'insuranceDescription'}
                  required message={'请输入保险需求描述！'}
                  initialValue={kase.requirement_desc || ''}
                >
                  <Input
                    type="textarea" rows={4}
                    placeholder="请输入相关描述"
                  />

                </CaseFormItem>
                <CaseFormItem
                  form={this.props.form}
                  layout={formTextAreaItemLayout}
                  type={'object'}
                  label={'相关附件'} name={'insuranceAttachment'}
                >
                  <Uploader
                    defaultFileList={defaultInsuranceFileList}
                    onChange={this.onInsuranceChange}
                  />

                </CaseFormItem>
                <Col span={24}>
                  <Row
                    type="flex" justify="center" align="middle"
                    className={s.submitMargin}
                  >
                    <Col
                      xs={15} sm={12} md={12} lg={12}
                      className={s.colButton}
                    >
                      <FormItem>
                        <DraftBoxButton
                          disabled={this.state.draftBoxDisabled}
                          className={s.createButton}
                          onClick={this.onSaveToDraftBox}
                          type="primary"
                        />
                      </FormItem>
                    </Col>
                    <Col
                      xs={15} sm={12} md={12} lg={12}
                      className={s.colButton}
                    >
                      <FormItem>
                        <Button
                          className={s.createButton}
                          htmlType="submit"
                          type="primary"
                        >发布Case</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Form>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading}>{this.renderForm()}</Spin>
      </div>
    );
  }
}

export default connect(mapStateToProps,
  mapDispatchToProps)(Form.create({})(Enhance(SubmitCasePage)));
