import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button, Modal, Alert, Form, Input, message, Tabs } from 'antd';
import moment from 'moment';

import * as commentActions from '../../reducers/comment/commentActions';
import FormatUtils from '../../utils/FormatUtils';
import s from './CommentList.less';
import AttachmentView from '../../components/AttachmentView';
import Pagination from './Pagination';
import Uploader from './Uploader';
import NameCard from '../../components/NameCardOver';

moment.locale('zh-cn');

const FormItem = Form.Item;

const mapStateToProps = state => ({
  comment: state.comment,
  device: state.device,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(commentActions, dispatch),
});

class CommentList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      submitLoading: false,
      modal: {
        visible: false,
        title: '',
        replyCmtId: 0,
        uploadElement: <Uploader onChange={this.onFileChange} simple />,
      },
      alertMsg: '',
      attachList: [],
      filterAttach: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.comment !== this.props.comment) {
      const comments = nextProps.comment.comments || {};
      const exception = comments.getIn([nextProps.targetId], 'exception');
      if (exception) {
        this.setState({
          alertMsg: exception.message,
        });
      } else {
        this.props.form.setFieldsValue({ content: '' });
        this.setState({
          submitLoading: false,
        });
      }
    }
  }

  onPageNumberChange = (nextCurrentPage) => {
    this.getCommentList(nextCurrentPage);
  };

  onFileChange = (info) => {
    const status = info.file.status;
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功.`);
    } else if (status === 'removed') {
      message.success(`${info.file.name} 删除成功.`);
    }
    this.setState({
      attachList: info.fileList.filter(value => value.status === 'done') || [],
    });
  };

  onChangeTab = (tabKey) => {
    const filterAttach = tabKey === 'has_attach' ? 1 : 0;
    this.setState({
      filterAttach,
    }, () => this.getCommentList(1));
  };

  getCommentList = (page = 1) => {
    this.props.actions.getCommentList(
      this.props.targetType,
      this.props.targetId,
      page,
      this.state.filterAttach,
    );
  };

  handleCancel = () => {
    this.setState({
      submitLoading: false,
      modal: {
        visible: false,
        title: '',
        replyCmtId: 0,
        uploadElement: '',
      },
      alertMsg: '',
      attachList: [],
    });
    this.props.form.setFieldsValue({ content: '' });
  };

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.actions.saveComment(
          this.props.targetType,
          this.props.targetId,
          values.content,
          this.state.attachList.map(comment => comment.response.attach_id),
          this.state.modal.replyCmtId,
        );
        this.setState({
          modal: {
            visible: true,
            title: '沟通记录 - 我要留言',
            replyCmtId: 0,
            uploadElement: <Uploader key={Math.random()} onChange={this.onFileChange} simple />,
          },
          alertMsg: '',
          attachList: [],
        });
        this.props.form.setFieldsValue({ content: '' });
      }
    });
  };

  // 按 Ctrl + Enter 提交
  handlerKeyUp = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      this.handleSubmit();
    }
  };

  handleReply = (comment) => {
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        title: `沟通记录 - 回复 @${comment.user_info.nickname}`,
        replyCmtId: comment.id,
      },
    }));
  };

  showModal = () => {
    this.setState({
      modal: {
        visible: true,
        title: '沟通记录',
        replyCmtId: 0,
        uploadElement: <Uploader key={Math.random()} onChange={this.onFileChange} simple />,
      },
      alertMsg: '',
      attachList: [],
    });
    this.getCommentList(1);
  };

  renderList = () => {
    const comments = this.props.comment.comments || {};
    const commentList = comments.getIn([this.props.targetType, this.props.targetId, 'items']) || [];
    return (
      <div className={s.messageList}>
        {
          commentList.length > 0 ? (
            <div>
              {
                commentList.map((comment) => {
                  const msgUserInfo = comment.user_info || {};
                  const commentAttachs = comment.attachs || [];
                  return (
                    <Row key={comment.id} className={s.messageBox}>
                      <Col className={s.avatar}>
                        <NameCard uid={msgUserInfo.uid}>
                          <img src={msgUserInfo.headimgurl} alt="" />
                        </NameCard>
                      </Col>
                      <Col className={s.container}>
                        <Row type="flex" justify="space-between" className={s.header}>
                          <Col span={16} className={s.user_info}>
                            <NameCard uid={msgUserInfo.uid}>
                              <a>{msgUserInfo.nickname}</a>
                            </NameCard>
                          </Col>
                          <Col
                            className={s.handler_btns}
                            onClick={() => this.handleReply(comment)}
                          >
                            回复
                          </Col>
                          <Col span={4} className={s.timestamp} title={comment.created_at}>
                            {moment(comment.created_at).startOf('second').fromNow()}
                          </Col>
                        </Row>
                        <Row
                          className={s.content}
                          dangerouslySetInnerHTML={{
                            __html: FormatUtils.parsePre(comment.content),
                          }}
                        />
                        {commentAttachs.length > 0 &&
                        <Row className={s.attachs}>
                          <Col>
                            {commentAttachs.map((o, i) =>
                              <AttachmentView
                                key={i} type={o.file_ext} name={o.file_name}
                                link={o.url} className={s.attachItem}
                                canDownLoad={!this.props.device.isWechat}
                              />,
                            )}
                          </Col>
                        </Row>
                        }
                      </Col>
                    </Row>
                  );
                })
              }
              <Pagination
                simple
                style={{ marginTop: 20 }}
                current={comments.getIn([this.props.targetType, this.props.targetId, 'currentPage'])}
                total={comments.getIn([this.props.targetType, this.props.targetId, 'totalCount'])}
                pageSize={comments.getIn([this.props.targetType, this.props.targetId, 'pageSize'])}
                onChange={this.onPageNumberChange}
              />
            </div>
          ) : (
            <div className={s.formNoMsg}>
              没有符合条件的留言
            </div>
          )
        }
      </div>
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <span>
        <span className={s.btnNoMsg}>
          <Button
            type={this.props.buttonType} size={this.props.btnSize} className={s[this.props.btnSize]}
            onClick={() => this.showModal()}
          >
            {this.props.buttonText} {this.props.totalCount ? `(${this.props.totalCount})` : ''}
          </Button>
        </span>
        <Modal
          wrapClassName={s.messageModal}
          style={{ top: 20, width: 600 }}
          width={600}
          title={this.state.modal.title}
          visible={this.state.modal.visible}
          onCancel={this.handleCancel}
        >
          <div className={s.textArea}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('content', {
                  rules: [{
                    required: true,
                    message: '请输入留言内容',
                  }],
                })(
                  <Input
                    rows="3"
                    type="textarea"
                    placeholder="按 Ctrl + Enter 快速提交"
                    style={{ resize: 'none' }}
                    onKeyUp={this.handlerKeyUp}
                  />,
                )}
              </FormItem>
              <FormItem>
                <Row type="flex" justify="space-between">
                  <Col>
                    {this.state.modal.uploadElement}
                  </Col>
                  <Col>
                    <span className={s.submitTips} />
                    <Button
                      type="primary"
                      loading={this.state.submitLoading}
                      onClick={this.handleSubmit}
                    >
                      提交
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
          {this.state.alertMsg &&
          <Row>
            <Alert message={this.state.alertMsg} type="error" showIcon />
          </Row>
          }
          <Tabs size="small" onChange={this.onChangeTab}>
            <Tabs.TabPane tab="所有留言" key="all" />
            <Tabs.TabPane tab="仅含附件" key="has_attach" />
          </Tabs>
          {this.renderList()}
        </Modal>
      </span>
    );
  }
}

CommentList.defaultProps = {
  buttonText: '留言',
  buttonType: 'primary',
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({})(CommentList));
