/*global $*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './components';
import configureStore from './redux/store/configureStore';
import { Provider } from 'react-redux';
//Root sass file for webpack to compile
import './sass/main.scss';
//Initial Default settings 
const store = configureStore();

// load toolkit and boostrap
import './utils/toolkit';
import './utils/bootstrapSelect';

class App extends Component {

  render() {

    const { inputSource } = this.props,
      { gffFile, collinearityFile, trackFile } = inputSource;

    return (
      <Provider store={store}>
        <Dashboard
          gffFile={gffFile}
          collinearityFile={collinearityFile}
          trackFile={trackFile} />
      </Provider>
    )
  }
}

window.synvisio = function (contentId, gffFile, collinearityFile, trackFile) {
  ReactDOM.render(<App inputSource={{ gffFile, collinearityFile, trackFile }} />, document.getElementById(contentId));
}

