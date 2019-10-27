import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as humanReader from 'human-number';

import * as actions from '../../store/actions';
import logger from '../../utils/logger';
import './Campaigns.css';

const InputDateFormat = 'M/D/YYYY';
const OutputDateFormat = 'MM/DD/YYYY';

const filterCampaigns = ({ campaigns, startDate: startDateRange, endDate: endDateRange, searchTerm }) => {
    // console.log(startDateRange, endDateRange, searchTerm);
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

const getCampaignElems = (campaigns) => {
    const dateMoment = moment();
    const campaignElems = [];
    campaigns.forEach(({ id, name, startDate, endDate, Budget: budget }) => {
        const startDateMoment = moment(startDate, InputDateFormat);
        const endDateMoment = moment(endDate, InputDateFormat);
        if (endDateMoment < startDateMoment) {
            const message = `Campaign ${name} Error: start date (${startDateMoment.format(OutputDateFormat)}) > end date (${endDateMoment.format(OutputDateFormat)})`;
            logger.error(message);
            return;
        }
        const isActive = dateMoment.isBetween(startDateMoment, endDateMoment);
        const activeClassName = 'status-bubble ' + (isActive ? 'active' : 'inactive');
        campaignElems.push((
            <tr className="campaign" key={id}>
                <td className="campaign-name">{name}</td>
                <td className="campaign-start-date">{startDateMoment.format(OutputDateFormat)}</td>
                <td className="campaign-end-date">{endDateMoment.format(OutputDateFormat)}</td>
                <td className="campaign-active"><div className={activeClassName}></div>&nbsp;&nbsp;<div className="campaign-status">{isActive ? 'Active' : 'Inactive'}</div></td>
                <td className="campaign-budget">{humanReader(budget, (n) => Math.round(n * 10) / 10)}</td>
                {/* <td className="campaign-budget">{humanReader(budget, (n) => Number.parseFloat(n).toFixed(1))}</td> */}
            </tr>
        ));
    });
    return campaignElems;
}

class Campaigns extends Component {
    render() {
        const campaigns = filterCampaigns(this.props);
        const campaignElems = getCampaignElems(campaigns);

        return (
            <div className="Campaigns table-responsive">
                <table className="table table-borderless table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Active</th>
                            <th>Budget (USD)</th>
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
        startDate: state.campaignsNS.startDate,
        endDate: state.campaignsNS.endDate,
        searchTerm: state.campaignsNS.searchTerm,
        campaigns: state.campaignsNS.campaigns,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCampaigns: (payload) => dispatch(actions.addCampaigns(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);