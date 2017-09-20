import React from 'react';
import Container from './components/Container';
import errorHandler from '../utils/errorHandler';
import g from './App.less';

const App = (props) => {
  errorHandler.initRouter(props.router);
  return <Container className={g.placeholder} router={props.router}>{props.children}</Container>;
};

export default App;
