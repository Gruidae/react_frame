import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import * as navActions from '../../reducers/nav/navActions';

import Enhance from '../Enhance';
import s from './ErrorPage.css';

function mapStateToProps(state) {
  return state;
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(navActions, dispatch),
});

class ErrorPage extends React.Component {

  componentDidMount() {
    this.props.enhance.setTitle((this.props.location.state && this.props.location.state.code) ?
      'Error' : 'Page Not Found');
  }

  goBack = (event) => {
    event.preventDefault();
    this.props.router.goBack();
  };

  render() {
    const [code, title] = (this.props.location.state && this.props.location.state.code) ?
    ['Error', this.props.location.state.message ?
      this.props.location.state.message : 'Something went wrong']
      : ['404', 'Page not found'];

    return (
      <div className={s.container}>
        <main className={s.content}>
          <h1 className={s.code}>{code}</h1>
          <p className={s.title}>{title}</p>
          {code === '404' &&
          <p className={s.text}>您访问的页面并不存在，或者发生了其他错误。</p>
          }
          <p className={s.text}>
            <a href="/" onClick={this.goBack}>返回</a>，或前往&nbsp;
            <Link to="/">首页</Link> 选择其他方向。
          </p>
        </main>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ErrorPage));
