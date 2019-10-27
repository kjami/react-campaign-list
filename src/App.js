import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Layout from './containers/Layout/Layout';
import * as actions from './store/actions';

import initialCampaigns from './data/initial-campaigns.json';

class App extends Component {

    componentDidMount() {
        this.props.addCampaigns({ newCampaigns: initialCampaigns });

        window.AddCampaigns = (newCampaigns) => {
            this.props.addCampaigns({ newCampaigns });
        };
    }

    render() {
        return (
            <div className="App">
                <Layout />
            </div>
        )
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCampaigns: (payload) => dispatch(actions.addCampaigns(payload))
    }
}

export default connect(null, mapDispatchToProps)(App);