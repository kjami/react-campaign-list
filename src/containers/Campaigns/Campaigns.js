import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import * as humanReader from 'human-number';
import campaignSchema from '../../schemas/campaign';
import { InputDateFormat, OutputDateFormat, DefaultSortBy } from '../../settings';
import * as actions from '../../store/actions';
import logger from '../../utils/logger';
import './Campaigns.css';

const filterCampaigns = ({ campaigns, startDate: startDateRange, endDate: endDateRange, searchTerm }) => {
    startDateRange = moment(startDateRange, InputDateFormat);
    endDateRange = moment(endDateRange, InputDateFormat);
    //filter items by the start and end date ranges as well as search term
    campaigns = campaigns.filter(({ name, startDate, endDate }) => {
        let filtered = false;

        //Check if search term is available. If available, check if search term is present inside the campaign name (in case insensitive way)
        if (searchTerm && !name.trim().toLowerCase().includes(searchTerm)) {
            filtered = true;
        }
        const startDateMoment = moment(startDate, InputDateFormat);
        const endDateMoment = moment(endDate, InputDateFormat);

        //Check if element is already filtered, if it is not, check if it is filtered by start date
        if (!filtered && startDateRange) {
            //If start date is before the start date range, filter it
            if (startDateMoment.isBefore(startDateRange) || endDateMoment.isBefore(startDateRange)) {
                filtered = true;
            }
        }

        //Check if element is already filtered, if it is not, check if it is filtered by end date
        if (!filtered && endDateRange) {
            //If end date is after the end date range, filter it
            if (startDateMoment.isAfter(endDateRange) || endDateMoment.isAfter(endDateRange)) {
                filtered = true;
            }
        }
        return !filtered;
    });
    return campaigns;
}

const isCampaignActive = (startDate, endDate) => {
    const date = moment();
    const startDateMoment = moment(startDate, InputDateFormat);
    const endDateMoment = moment(endDate, InputDateFormat);
    return (date.isBetween(startDateMoment, endDateMoment)) ? 'Active' : 'Inactive';
}

const sortCampaignsByActive = (campaigns, { sortByAsc }) => {
    let sortByMultiplier = sortByAsc ? 1 : -1;
    campaigns = campaigns.sort((a, b) => {
        let aActive = isCampaignActive(a.startDate, a.endDate);
        let bActive = isCampaignActive(b.startDate, b.endDate);
        let condition = aActive > bActive;
        return sortByMultiplier * (condition ? 1 : -1)
    });
    return campaigns;
}

const sortCampaigns = (campaigns, { sortBy, sortByAsc }) => {
    if (sortBy === 'active') {
        return sortCampaignsByActive(campaigns, { sortBy, sortByAsc });
    }
    let schemaObj = campaignSchema.find((c) => c.name === sortBy);

    if (!schemaObj) {
        schemaObj = campaignSchema.find((c) => c.name === DefaultSortBy);
    }

    if (!schemaObj) {
        logger.warn('SortBy settings are invalid.');
        return campaigns;
    }

    const dataType = schemaObj.type;
    const field = schemaObj.name;
    let sortByMultiplier = sortByAsc ? 1 : -1;
    campaigns = campaigns.sort((aObj, bObj) => {
        let a = aObj[field];
        let b = bObj[field];
        let condition;
        if (dataType === 'date') {
            condition = moment(a, InputDateFormat) > moment(b, InputDateFormat);
        } else {
            condition = a > b;
        }
        return sortByMultiplier * (condition ? 1 : -1)
    });
    return campaigns;
}

const getCampaignElems = (campaigns) => {
    const campaignElems = [];
    campaigns.forEach(({ id, name, startDate, endDate, Budget: budget }) => {
        const startDateMoment = moment(startDate, InputDateFormat);
        const endDateMoment = moment(endDate, InputDateFormat);
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
                {/* <td className="campaign-budget">{humanReader(budget, (n) => Number.parseFloat(n).toFixed(1))}</td> */}
            </tr>
        ));
    });
    return campaignElems;
}

class Campaigns extends Component {

    changeSortByHandler = (sortBy) => {
        this.props.changeSortBy({ sortBy });
    }

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
                <table className="table table-borderless table-striped">
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
                    <tbody>
                        {campaignElems}
                    </tbody>
                </table>
            </div>
        );
    }
}

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

const mapDispatchToProps = (dispatch) => {
    return {
        addCampaigns: (payload) => dispatch(actions.addCampaigns(payload)),
        changeSortBy: (payload) => dispatch(actions.changeSortBy(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);