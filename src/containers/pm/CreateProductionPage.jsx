import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, DatePicker, Input, Select, Button, Breadcrumb, Form, Spin } from 'antd';

import Enhance from '../Enhance';
import AttachmentView from '../../components/AttachmentView';
import * as productActions from '../../reducers/product/productActions';
import * as navActions from '../../reducers/nav/navActions';
import errorHandler from '../../utils/errorHandler';
import s from './CreateProductPage.less';
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
  PRODUCT_ANNOUNCED,
  PAGE_TITLE_CREATE_PRODUCT,
  LEVEL_MAP_DETAIL,
} from '../constants';

const Option = Select.Option;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

function mapStateToProps(state) {
  return {
    create: state.product.create,
    products: state.product.products,
    kase: state.kase,
    device: state.device,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...productActions, ...navActions }, dispatch),
  };
}

function ProductFormItem(props) {
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
            rules: [{ type, required, message: alertMessage }],
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
          rules: [{ type, required, message: alertMessage }],
        })(
          children,
        )}
      </FormItem>
    </Col>
  );
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
class CreateProductionPage extends React.Component {

  constructor(props) {
    super(props);
    let isModify = false;
    let productSn = '';
    let draftBoxDisabled = false;
    if (this.props.location && this.props.location.state) {
      isModify = this.props.location.state.isModify || false;
      productSn = this.props.location.state.productSn || '';
      const product = this.props.products.get(productSn);
      draftBoxDisabled = isModify && product.status !== PRODUCT_ANNOUNCED;
    }

    this.state = {
      orderUnit: SELECT_ORDER_UNIT_YEAR,
      loading: false,
      kaseId: this.props.params.caseId,
      isModify,
      productSn,
      draftBoxDisabled,
    };
  }

  componentDidMount() {
    this.props.actions.beforeCreateProduct(this.state.kaseId);
    this.props.enhance.setTitle(PAGE_TITLE_CREATE_PRODUCT);
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

  onOrderUnitChange = (value) => {
    this.setState({
      orderUnit: value,
    });
  };

  // 保存到草稿箱
  onSaveToDraftBox = () => {
    if (this.state.isModify) {
      this.props.actions.modifyProduct(
        this.getParamsFromFields(this.props.form.getFieldsValue(),
          IS_SAVE_TO_DRAFTBOX), true);
    } else {
      this.props.actions.createProduct(
        this.getParamsFromFields(this.props.form.getFieldsValue(),
          IS_SAVE_TO_DRAFTBOX), true);
    }
  };

  getParamsFromFields(values, publishMode) {
    const planData = values.firstPlanDate.format(dateFormat);
    const effectData = values.firstEffectDate.format(dateFormat);
    let tags;
    if (values.productTag) {
      tags = values.productTag.split(' ');
    }
    const product = this.props.products.get(this.state.productSn) || {};
    let publishModeParams = publishMode;
    // 后台逻辑 修改状态下不在草稿箱不能传1
    if (this.state.isModify) {
      if (product.status !== PRODUCT_ANNOUNCED) {
        publishModeParams = IS_SAVE_TO_DRAFTBOX;
      }
    }
    return {
      case_sn: this.state.kaseId,
      product_sn: this.state.productSn,
      is_publish: publishModeParams,
      customer_company: values.customerCompanyName,
      customer_product: values.customerProduct,
      product_name: values.customerProductName,
      product_desc: values.productDescription,
      per_price: values.unitPrice,
      order_amount: values.orderCount,
      order_amount_unit: this.state.orderUnit,
      float_up_down: values.priceFloat,
      rebate: values.commissionDiscount,
      loss_ratio: values.compensateProbability,
      first_plan_date: planData,
      effective_date: effectData,
      urgency_level: values.importantLevel,
      pay_organization: values.paymentOrganization,
      pay_account: values.paymentAccount,
      pay_currency: values.paymentCurrency,
      pay_amount: values.paymentAmount,
      recv_organization: values.receiptOrganization,
      recv_account: values.receiptAccount,
      pay_content: values.paymentDescription,
      product_tags: tags,
    };
  }


  // 发布产品
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.isModify) {
          this.props.actions.modifyProduct(this.getParamsFromFields(values, IS_PUBLISH), false);
        } else {
          this.props.actions.createProduct(this.getParamsFromFields(values, IS_PUBLISH), false);
        }
      }
    });
  };

  renderAttchmentView = (attchUrls) => {
    const attchmentChilds = [];
    if (attchUrls && attchUrls.length > 0) {
      Object.values(attchUrls)
        .forEach(urls =>
          attchmentChilds.push(
            <AttachmentView
              key={urls.id}
              name={urls.file_name}
              type={urls.file_ext}
              link={urls.url}
              canDownLoad={!this.props.device.isWechat}
            />));
    }
    return attchmentChilds;
  };

  renderForm = () => {
    let kase = this.props.kase.kases.get(this.props.params.caseId);
    if (!kase) {
      kase = {};
    }
    let product = this.props.products.get(this.state.productSn);
    let defaultOrderUnit = SELECT_ORDER_UNIT_YEAR;
    if (!this.state.isModify || !product) {
      product = {};
    } else {
      defaultOrderUnit = kase.order_amount_unit ?
        kase.order_amount_unit.toString() : SELECT_ORDER_UNIT_YEAR;
    }

    const formLabelLayout = {
      labelCol: { xs: 5, sm: 1, md: 1, lg: 1 },
      wrapperCol: { xs: 15, sm: 13, md: 13, lg: 13 },
    };

    const formNecessaryItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { xs: 24, sm: 13, md: 13, lg: 13 },
    };
    const formUnnecessaryItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { xs: 24, sm: 13, md: 13, lg: 13 },
    };
    const formTextAreaItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { xs: 24, sm: 13, md: 13, lg: 13 },
    };
    // 如果产品时间没有，可以用kase的时间做placeholder
    const kaseLevelValue = kase.urgency_level ?
      kase.urgency_level.toString() : LEVEL_IMPORTANT_NON_URGENT;
    const initLevelValue = product.urgency_level ?
      product.urgency_level.toString() : kaseLevelValue;
    const kaseFirstDate = moment(kase.first_plan_date, dateFormat);
    const initFirstDate = product.first_plan_date ?
      moment(product.first_plan_date, dateFormat) : kaseFirstDate;
    const kaseEffectiveDate = moment(kase.effective_date, dateFormat);
    const initEffectiveDate = product.effective_date ?
      moment(product.first_plan_date, dateFormat) : kaseEffectiveDate;
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
      <Row type="flex">
        <Col span={24} className={s.breadcrumb}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>Case列表</Breadcrumb.Item>
            <Breadcrumb.Item href="">No.{kase.case_sn}
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">提交产品</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Row type="flex" className={s.container}>
          <Col span={24}>
            <h1 className={s.productTitle}>{PAGE_TITLE_CREATE_PRODUCT}</h1>
          </Col>
          <Col span={24}>
            <h3 className={s.sectionTitleMargin}>客户信息</h3>
            <Form className={s.form}>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'公司名称'} name={'kaseCustomerCompany'}
                initialValue={kase.customer_company || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'产品名称'} name={'kaseCustomerProduct'}
                initialValue={kase.customer_product || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>

              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'城市'} name={'kaseCustomerCity'}
                initialValue={kase.customer_city || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'对接联系人'} name={'kaseCustomerContact'}
                initialValue={kase.customer_contact || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'联系电话'} name={'kaseCustomerPhone'}
                initialValue={kase.customer_phone || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLongLabel}
                label={'公司/产品信息描述'} name={'kaseCustomerDesc'}
                initialValue={kase.customer_desc || ''}
              >
                <Input
                  disabled
                  autosize
                  className={s.longLabelInput}
                  type="textarea"
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'相关附件'} name={'kaseCustomerAttchs'}
              >
                <Col>
                  { this.renderAttchmentView(kase.customer_attachs) }
                </Col>
              </ProductFormItem>
            </Form>
            <h3 className={s.sectionTitleMargin}>保险需求</h3>
            <Form className={s.form}>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'初方案时间'} name={'kaseFirstPlanDate'}
                initialValue={kase.first_plan_date || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'预计生效时间'} name={'kaseEffectiveDate'}
                initialValue={kase.effective_date || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>

              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'紧急程度'} name={'kaseUrgencyLevel'}
                initialValue={kase.urgency_level > 0 ? LEVEL_MAP_DETAIL[kase.urgency_level] : ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'总保费'} name={'kaseTotalPremium'}
                initialValue={kase.total_premium || ''}
              >
                <Input
                  className={s.labelInput}
                  disabled
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLongLabel}
                label={'保险需求描述'} name={'kaseRequirementDesc'}
                initialValue={kase.requirement_desc || ''}
              >
                <Input
                  disabled
                  autosize
                  className={s.longLabelInput}
                  type="textarea"
                />
              </ProductFormItem>
              <ProductFormItem
                form={this.props.form}
                layout={formLabelLayout}
                className={s.formLabel}
                label={'相关附件'} name={'kaseRequirementAttchs'}
              >
                <Col>
                  { this.renderAttchmentView(kase.requirement_attachs) }
                </Col>
              </ProductFormItem>
            </Form>
            <h3 className={s.sectionTitleMargin}>填写产品详情(必填)</h3>
            <Row
              type="flex" justify="space-between"
              className={s.labelMargin}
            >
              <Form onSubmit={this.handleSubmit} className={s.form}>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'客户公司昵称'} name={'customerCompanyName'}
                  required message={'请输入客户公司昵称！'}
                  initialValue={product.customer_company || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="未接单时可见"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'客户产品形态'} name={'customerProduct'}
                  required message={'请输入客户产品形态！'}
                  initialValue={product.customer_product || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="未接单时可见"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'保险产品名称'} name={'customerProductName'}
                  required message={'请输入保险产品名称！'}
                  initialValue={product.product_name || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'保险客单价'} name={'unitPrice'}
                  required message={'请输入保险客单价！'}
                  initialValue={product.per_price || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'上下浮动'} name={'priceFloat'}
                  required message={'请输入上下浮动价！'}
                  initialValue={product.float_up_down || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                    addonAfter="%"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'订单量'} name={'orderCount'}
                  required message={'请输入订单量！'}
                  initialValue={product.order_amount ?
                    product.order_amount.toString() : ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入" addonBefore={orderCountSelect}
                    addonAfter="单"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'过往赔付率'}
                  name={'compensateProbability'}
                  required message={'过往赔付率！'}
                  initialValue={product.loss_ratio || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                    addonAfter="%"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'返佣'} name={'commissionDiscount'}
                  required message={'请输入返佣！'}
                  initialValue={product.rebate || ''}
                >
                  <Input
                    className={s.detailInput}
                    placeholder="请输入"
                    addonAfter="%"
                  />

                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'初方案时间'} name={'firstPlanDate'}
                  type={'object'}
                  required message={'请选择初方案时间！'}
                  initialValue={initFirstDate}
                >
                  <DatePicker />
                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'预生效时间'} name={'firstEffectDate'}
                  type={'object'}
                  required message={'请选择预生效时间！'}
                  initialValue={initEffectiveDate}
                >
                  <DatePicker />
                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  label={'紧急程度'} name={'importantLevel'}
                  required message={'请选择紧急程度！'}
                  initialValue={initLevelValue}
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
                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formTextAreaItemLayout}
                  className={s.formItem}
                  xs={24} sm={24} md={24} lg={24}
                  label={'产品概述'}
                  required message={'请输入产品概述！'}
                  name={'productDescription'}
                  initialValue={product.product_desc || ''}
                >
                  <Input
                    type="textarea" rows={4}
                    placeholder="请输入保险产品概述，这段概述将展示在产品列表中，供投标业务员阅读参考。"
                  />
                </ProductFormItem>
                <ProductFormItem
                  form={this.props.form}
                  layout={formNecessaryItemLayout}
                  className={s.formItem}
                  label={'产品标签'}
                  required message={'至少输入一个产品标签'}
                  name={'productTag'}
                  initialValue={product.product_tags ? product.product_tags.join(' ') : ''}
                >
                  <Input placeholder="请输入标签，最多设置3个标签，标签之间用空格隔开" />
                </ProductFormItem>
                <Col span={24}>
                  <h3 className={s.sectionTitleMargin}>付款帐户信息(选填)</h3>
                </Col>
                <Col span={24}>
                  <Row type="flex" justify="space-between">
                    <ProductFormItem
                      form={this.props.form}
                      layout={formUnnecessaryItemLayout}
                      label={'付款财务机构'}
                      name={'paymentOrganization'}
                      initialValue={product.pay_organization || ''}
                    >
                      <Input
                        className={s.detailInput}
                        placeholder="请输入"
                      />
                    </ProductFormItem>
                    <ProductFormItem
                      form={this.props.form}
                      layout={formUnnecessaryItemLayout}
                      label={'付款内部账号'} name={'paymentAccount'}
                      initialValue={product.pay_account || ''}
                    >
                      <Input
                        className={s.detailInput}
                        placeholder="请输入"
                      />
                    </ProductFormItem>
                  </Row>
                  <Row type="flex" justify="space-between">
                    <ProductFormItem
                      form={this.props.form}
                      layout={formUnnecessaryItemLayout}
                      label={'收款财务机构'}
                      name={'receiptOrganization'}
                      initialValue={product.recv_organization || ''}
                    >
                      <Input
                        className={s.detailInput}
                        placeholder="请输入"
                      />
                    </ProductFormItem>
                    <ProductFormItem
                      form={this.props.form}
                      layout={formUnnecessaryItemLayout}
                      label={'收款内部账号'} name={'receiptAccount'}
                      initialValue={product.recv_account || ''}
                    >
                      <Input
                        className={s.detailInput}
                        placeholder="请输入"
                      />
                    </ProductFormItem>
                  </Row>


                  <Row type="flex" justify="space-between">
                    <ProductFormItem
                      form={this.props.form}
                      layout={formNecessaryItemLayout}
                      label={'付款币种'} name={'paymentCurrency'}
                      initialValue={product.pay_currency || ''}
                    >
                      <Input
                        className={s.detailInput}
                        placeholder="请输入付款币种"
                      />
                    </ProductFormItem>
                    <ProductFormItem
                      form={this.props.form}
                      layout={formUnnecessaryItemLayout}
                      label={'付款金额'} name={'paymentAmount'}
                      initialValue={product.pay_amount || ''}
                    >
                      <Input
                        className={s.detailInput}
                        placeholder="请输入"
                        addonAfter="元"
                      />
                    </ProductFormItem>
                  </Row>
                  <Row type="flex">
                    <ProductFormItem
                      form={this.props.form}
                      layout={formTextAreaItemLayout}
                      className={s.formItem}
                      xs={24} sm={24} md={24} lg={24}
                      label={'付款说明'}
                      name={'paymentDescription'}
                      initialValue={product.pay_content || ''}
                    >
                      <Input
                        type="textarea" rows={4}
                        placeholder="请输入"
                      />
                    </ProductFormItem>
                  </Row>
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
                        >发布产品</Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Form>
            </Row>
          </Col>
        </Row>
      </Row>
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
  mapDispatchToProps)(Form.create({})(Enhance(CreateProductionPage)));
