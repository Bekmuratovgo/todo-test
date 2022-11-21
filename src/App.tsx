import React, { FC, ReactElement } from 'react';
import './App.less';
import Main from './page/Main';

const  App: FC = (): ReactElement => {
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
