import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as humanReader from 'human-number';
import { InputDateFormat, OutputDateFormat } from '../../settings';
import * as actions from '../../store/actions';
import { filterCampaigns, isCampaignActive, sortCampaigns } from '../../utils/campaigns';
import logger from '../../utils/logger';
import './Campaigns.css';

//Iterate through the campaign jSON objects and generate an array of campaign JSX elements
const getCampaignElems = (campaigns) => {
    const campaignElems = [];
    
    //Iterate over campaigns
    campaigns.forEach(({ id, name, startDate, endDate, Budget: budget }) => {
        const startDateMoment = moment(startDate, InputDateFormat);
        const endDateMoment = moment(endDate, InputDateFormat);

        //If end date is greater than start date, log error and continue next iteration
        if (endDateMoment < startDateMoment) {
            const message = `Campaign ${name} Error: start date (${startDateMoment.format(OutputDateFormat)}) > end date (${endDateMoment.format(OutputDateFormat)})`;
            logger.error(message);
            return;
        }
        const isActive = isCampaignActive(startDate, endDate);
        const activeClassName = 'status-bubble ' + (isActive);
        campaignElems.push((
            <tr className="campaign" key={id}>
                <td className="campaign-name">{name}</td>
                <td className="campaign-start-date">{startDateMoment.format(OutputDateFormat)}</td>
                <td className="campaign-end-date">{endDateMoment.format(OutputDateFormat)}</td>
                <td className="campaign-active"><div className={activeClassName}></div>&nbsp;&nbsp;<div className="campaign-status">{isActive}</div></td>
                <td className="campaign-budget">{humanReader(budget, (n) => Math.round(n * 10) / 10)}</td>
            </tr>
        ));
    });
    return campaignElems;
}

//Component that lists all campaigns
class Campaigns extends Component {

    //Event handler when headers are clicked
    changeSortByHandler = (sortBy) => {
        this.props.changeSortBy({ sortBy });
    }

    //Based on sorting order, class name will differ. To indicate user the sorted way.
    getSortClassName = (actualSortBy) => {
        let { sortBy, sortByAsc } = this.props;
        if (sortBy === actualSortBy) {
            return `fa ${sortByAsc ? 'fa-sort-asc' : 'fa-sort-desc'}`;
        }
        return 'fa';
    }

    render() {
        let campaigns = filterCampaigns(this.props);
        campaigns = sortCampaigns(campaigns, this.props);
        const campaignElems = getCampaignElems(campaigns);

        return (
            <div className="Campaigns table-responsive">
                {/*Campaigns Table*/}
                <table className="table table-borderless table-striped">
                    {/*Table header*/}
                    <thead className="thead-dark">
                        <tr>
                            <th onClick={() => this.changeSortByHandler('name')}>
                                Name <i className={this.getSortClassName('name')}></i>
                            </th>
                            <th onClick={() => this.changeSortByHandler('startDate')}>
                                Start Date <i className={this.getSortClassName('startDate')}></i>
                                <br /> 
                                <small>({OutputDateFormat.toLowerCase()})</small>
                            </th>
                            <th onClick={() => this.changeSortByHandler('endDate')}>
                                End Date <i className={this.getSortClassName('endDate')}></i>
                                <br /> 
                                <small>({OutputDateFormat.toLowerCase()})</small>
                            </th>
                            <th onClick={() => this.changeSortByHandler('active')}>
                                Active <i className={this.getSortClassName('active')}></i>
                            </th>
                            <th onClick={() => this.changeSortByHandler('Budget')}>
                                Budget <i className={this.getSortClassName('Budget')}></i>
                                <br /> 
                                <small>(USD)</small>
                            </th>
                        </tr>
                    </thead>
                    {/*Table body*/}
                    <tbody>
                        {campaignElems}
                    </tbody>
                </table>
            </div>
        );
    }
}

//Get props from the global redux state
const mapStateToProps = (state) => {
    return {
        startDate: state.filterBarNS.startDate,
        endDate: state.filterBarNS.endDate,
        searchTerm: state.filterBarNS.searchTerm,
        sortBy: state.filterBarNS.sortBy,
        sortByAsc: state.filterBarNS.sortByAsc,
        campaigns: state.campaignsNS.campaigns,
    }
}

//Get props to dispatch actions to update the global redux store
const mapDispatchToProps = (dispatch) => {
    return {
        addCampaigns: (payload) => dispatch(actions.addCampaigns(payload)),
        changeSortBy: (payload) => dispatch(actions.changeSortBy(payload))
    }
}

//connect the above two functions to the component to connect to the store
export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);