import React, { Component } from 'react';
import { NavBar } from '..';

export default class Container extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app-container'>
                {/* navbar content , common for entire application */}
                <NavBar />
                <div id='container-body'>
                    {this.props.children}
                </div>
                <footer className="footer w-full m-t">
                    <div className="container-fluid">
                        <div className='footer-inner text-xs-right'>
                            <span className='m-r'>
                                Made with <span style={{ "color": '#e25555', 'fontSize': '19px', 'margin': '0px 3px' }}>&hearts;</span> by <a href="https://github.com/kiranbandi">kiranbandi</a></span>
                            <a className="footer-link right" href="http://hci.usask.ca/"> <img src="assets/img/interaction_lab.gif" height="30" /></a>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}  