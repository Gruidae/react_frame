import React from 'react';
import { Row, Col, Pagination as AntdPagination } from 'antd';

export default function Pagination(props) {
  const isMoreThanOnePage = props.total > props.pageSize;
  return (
    isMoreThanOnePage &&
    <Row style={props.style}>
      <Col xs={0} sm={24} md={24} lg={24}>
        <Row type="flex" justify="center">
          <AntdPagination
            showQuickJumper
            {...props}
          />
        </Row>
      </Col>
      <Col xs={24} sm={0} md={0} lg={0}>
        <Row type="flex" justify="center">
          <AntdPagination
            showQuickJumper
            size="small"
            {...props}
          />
        </Row>
      </Col>
    </Row>
  );
}

Pagination.defaultProps = {
  defaultCurrent: 1,
  total: 0,
  pageSize: 20,
  style: {},
};
