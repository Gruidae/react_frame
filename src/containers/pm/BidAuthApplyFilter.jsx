import React from 'react';
import { Row, Col, Button, Select } from 'antd';
import s from './BidAuthApplyFilter.less';

class BidAuthApplyFilter extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      bidAuthStatus: ['全部', '待处理', '已通过', '已拒绝'],
      selectedIndex: 1,
    };
  }

  onFilterChange = (index) => {
    this.props.onFilterChange(index);
    this.setState({
      selectedIndex: index,
    });
  }

  render() {
    return (
      <Row type="flex" justify="space-between" className={s.filterSection}>
        <Col xs={12} sm={0} md={0} lg={0}>
          <Select
            size="large"
            value={this.state.bidAuthStatus[this.state.selectedIndex]}
            style={{ width: '80%' }}
            onSelect={this.onFilterChange}
          >
            {this.state.bidAuthStatus.map((text, index) =>
              (<Select.Option key={index} value={`${index}`}>{text}</Select.Option>),
            )}
          </Select>
        </Col>
        <Col xs={0} sm={20} md={20} lg={20}>
          <Row type="flex" gutter={8} justify="start">
            {this.state.bidAuthStatus.map((text, index) =>
              <Col key={index}>
                { index === this.props.status ? (
                  <Button type="primary">{text}</Button>
                ) : (
                  <Button onClick={() => this.onFilterChange(index)}>{text}</Button>
                )}
              </Col>,
            )}
          </Row>
        </Col>
      </Row>
    );
  }
}

export default BidAuthApplyFilter;
