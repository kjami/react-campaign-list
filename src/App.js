import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Layout from './containers/Layout/Layout';
import * as actions from './store/actions';

import initialCampaigns from './data/initial-campaigns.json';

//The App component. It just renders the layout
//It also adds the AddCampaigns method on component mounting
class App extends Component {

    componentDidMount() {
        //On mounting, initialise the campaigns
        this.props.addCampaigns({ newCampaigns: initialCampaigns });

        //On mounting, add AddCampaigns global method
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

//Get props to dispatch actions to update the global redux store
const mapDispatchToProps = (dispatch) => {
    return {
        addCampaigns: (payload) => dispatch(actions.addCampaigns(payload))
    }
}

//connect the above function to the component to connect to the store
export default connect(null, mapDispatchToProps)(App);