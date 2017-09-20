import React from 'react';
import { Row, Col, Icon, Modal, message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import s from './AttachmentView.less';

const iconMap = {
  txt: 'file-text',
  pdf: 'file-pdf',
  xls: 'file-excel',
  jpg: 'file-jpg',
  jpeg: 'file-jpg',
  png: 'file-jpg',
  trf: 'file-jpg',
  bmp: 'file-jpg',
  ppt: 'file-ppt',
};

const copySuccess = () => message.success('复制成功');

const showModal = (link) => {
  Modal.info({
    title: '下载附件',
    content: <div>
      <div>请点击以下链接复制，通过浏览器打开</div>
      <CopyToClipboard
        onCopy={() => copySuccess()}
        text={link}
      >
        <div className={s.modalLink}>{link}</div>
      </CopyToClipboard>
    </div>,
    okText: '关闭',
  });
};


const AttachmentView = props => (
  <Row type="flex" className={props.className}>
    <Col className={s.iconWrap}>
      <Icon
        type={iconMap[props.type] ? iconMap[props.type] : 'file-unknown'}
        className={s.icon}
      />
    </Col>
    <Col className={s.fileName}>
      {props.canDownLoad ?
        <a href={props.link} target="_blank" rel="noopener noreferrer">
          {decodeURIComponent(props.name)}
        </a>
        :
        <a href="#werty" onClick={() => showModal(props.link)}>
          {decodeURIComponent(props.name)}
        </a>
      }
    </Col>
  </Row>
);


export default AttachmentView;
