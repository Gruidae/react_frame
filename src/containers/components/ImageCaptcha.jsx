import React from 'react';
import { Col, Row, Modal, Form, Input } from 'antd';
import s from './ImageCaptcha.less';

const FormItem = Form.Item;

class ImageCaptcha extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      captcha: null,
    };
  }

  onClickOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmitImageCaptcha(values.code);
      }
    });
  };


  onClickCancel = () => {
    this.props.onCaptchaCancel();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        visible={this.props.visible}
        onOk={this.onClickOk}
        onCancel={this.onClickCancel}
      >
        <Form>
          <FormItem
            className={s.captchaForm}
            {...formItemLayout}
            label="图形验证码"
          >
            <Row gutter={8}>
              <Col xs={10} sm={12} md={12} lg={12}>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入图形验证码' }],
                })(
                  <Input size="large" />,
                )}
              </Col>
              <Col xs={14} sm={12} md={12} lg={12}>
                <img alt="" className={s.imageCaptcha} src={this.props.captchaUrl} />
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }

}
export default Form.create({})(ImageCaptcha);
