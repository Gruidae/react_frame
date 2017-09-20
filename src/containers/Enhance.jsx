import React from 'react';
import _ from 'underscore';

import windowUtils from './windowUtils';
import Console from '../utils/Console';

export default Enhance => class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      setTitle: this.setTitle,
      logProps: this.logProps,
      isSelf: this.isSelf,
      isPm: this.isPm,
      isCompleted: this.isCompleted,
    };
  }

  logProps = () => {
    Console.log('props: ', this.props);
  };

  isSelf = (uid, currentUser) => {
    const me = currentUser || (this.props && this.props.currentUser) || {};
    return uid === me.uid;
  };

  isPm = (currentUser) => {
    const me = currentUser || (this.props && this.props.currentUser) || {};
    return me.is_pm === 1;
  };

  isCompleted = (currentUser) => {
    const me = currentUser || (this.props && this.props.currentUser) || {};
    return !_.isUndefined(me) && me.created_at;
  };

  setTitle = (title) => {
    windowUtils.setTitle(title);
    if (this.props.actions && this.props.actions.setDocumentTitle) {
      this.props.actions.setDocumentTitle(title);
    }
  };

  render() {
    return <Enhance enhance={this.state} {...this.props} />;
  }
};
