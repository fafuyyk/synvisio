import React, { Component } from 'react';
//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { background: 'url(assets/img/synvisio.jpg)' };
class Home extends Component {
  render() {
    return (
      <div>

        <div className="home-header" style={backgroundStyle}>
          <div className="container-fluid">
            <div className='col-lg-12 text-lg-left text-md-center text-sm-center text-xs-center'><h1>SynVisio - Linkage Group</h1>
              <p>An Interactive Multiscale Synteny Visualization Tool combined with Linkage Group Mapping.</p>
            </div>
          </div>
        </div>
      </div>

    )
  }
};

export default Home;
