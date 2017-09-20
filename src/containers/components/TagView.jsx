import React from 'react';
import { Tag } from 'antd';

const aoi = '#51CBBB';
const sickYellow = '#F2C57A';
const orange = '#F1986C';
const grey = '#C0CFD5';
const blue = '#6DB5F1';
const red = '#E22001';
const green = '#74CF86';
// const darkGrey = '#496169';

const tagStyles = {
  noTop: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
  },
};

function empty() {
  return <span />;
}

function CaseTagView(props) {
  switch (props.code) {
    case 0:
      return <Tag color={orange}>草稿中</Tag>;
    case 10:
      return <Tag color={sickYellow}>待受理</Tag>;
    case 20:
      return <Tag color={aoi}>我已受理</Tag>;
    case 30:
      return <Tag color={green}>我已出产品</Tag>;
    case 40:
      return <Tag color={grey}>已驳回</Tag>;
    default:
      return empty();
  }
}

function ProductTagView(props) {
  switch (props.code) {
    case 0:
      return <Tag color={orange}>草稿中</Tag>;
    case 10:
      return <Tag color={blue}>招标中</Tag>;
    case 30:
      return <Tag color={grey}>已关闭</Tag>;
    case 40:
      return <Tag color={green}>已完成</Tag>;
    default:
      return empty();
  }
}

function BidTagView(props) {
  const style = props.tagStyle ? tagStyles[props.tagStyle] : null;
  switch (props.code) {
    case 0:
      return <Tag color={aoi} style={style}>接洽中</Tag>;
    case 10:
      return <Tag color={grey} style={style}>已放弃</Tag>;
    case 20:
      return <Tag color={grey} style={style}>已失败</Tag>;
    case 30:
      return <Tag color={red} style={style}>已中标</Tag>;
    default:
      return empty();
  }
}

export default function TagView(props) {
  switch (props.type) {
    case 'case':
      return CaseTagView(props);
    case 'bid':
      return BidTagView(props);
    case 'product':
      return ProductTagView(props);
    default:
      return empty();
  }
}

TagView.defaultProps = {
  type: 'case',
  code: 0,
};

/* eslint-disable react/no-unused-prop-types */
TagView.propTypes = {
  type: React.PropTypes.string,
  code: React.PropTypes.number,
};
