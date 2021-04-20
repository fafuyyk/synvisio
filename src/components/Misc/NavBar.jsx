/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleTheme } from '../../redux/actions/actions';

class NavBar extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //fix for mobile browsers , navbar doesnt automatically collapse and needs to be toggled manually
        $('.navbar-collapse').on('click', function (e) {
            var toggle = $(".navbar-toggle").is(":visible");
            if ($(e.target).is('a') && toggle) {
                $(this).collapse('hide');
            }
        });

    }

    render() {

        const { isDark } = this.props;
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a data-toggle="collapse" data-target="#navbar" className="navbar-brand navbar-brand-emphasized">
                            SynVisio </a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse ">
                        <ul className='nav navbar-nav pull-right' onClick={this.props.toggleTheme}>
                            <li>
                                <span className={"icon icon-light-" + (isDark ? "down" : "up")}></span> Switch Chart Background to {isDark ? 'Light' : 'Dark'} Theme
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    return {
        sourceID: state.oracle.sourceID,
        isDark: state.oracle.isDark
    };
}

function mapDispatchToProps(dispatch) {
    return { toggleTheme: bindActionCreators(toggleTheme, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
