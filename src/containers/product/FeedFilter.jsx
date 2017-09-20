import React from 'react';
import { Row, Col, Button, Input, Select } from 'antd';
import s from './FeedFilter.less';

const Search = Input.Search;

export default function FeedFilter(props) {
  return (
    <Row type="flex" justify="space-between" className={s.filterSection}>
      <Col span={22} offset={1}>
        <Col xs={12} sm={0} md={0} lg={0}>
          <Select
            size="large"
            value={props.filterItems[props.selectedIndex]}
            style={{ width: '80%' }}
            onSelect={props.onSelectedIndexChange}
          >
            {props.filterItems.map((text, index) =>
              (<Select.Option key={index} value={`${index}`}>{text}</Select.Option>),
            )}
          </Select>
        </Col>
        <Col xs={0} sm={20} md={20} lg={20}>
          <Row type="flex" gutter={8} justify="start">
            {props.filterItems.map((text, index) =>
              <Col key={index}>
                {index === props.selectedIndex ? (
                  <Button type="primary">{text}</Button>
                ) : (
                  <Button onClick={() => props.onSelectedIndexChange(index)}>{text}</Button>
                )}
              </Col>,
            )}
          </Row>
        </Col>
        <Col xs={12} sm={4} md={4} lg={4} >
          <Search
            defaultValue={props.keyword}
            placeholder="请输入关键字"
            onSearch={value => props.onKeywordChange(value)}
          />
        </Col>
      </Col>
    </Row>
  );
}

FeedFilter.defaultProps = {
  filterItems: [],
  selectedIndex: 0,
  keyword: '',
};

/* eslint-disable react/no-unused-prop-types */
FeedFilter.propTypes = {
  filterItems: React.PropTypes.arrayOf(React.PropTypes.string),
  selectedIndex: React.PropTypes.number,
  onSelectedIndexChange: React.PropTypes.func,
  keyword: React.PropTypes.string,
  onKeywordChange: React.PropTypes.func,
};
