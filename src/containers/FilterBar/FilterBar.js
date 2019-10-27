import React, { Component } from 'react';
import moment from 'moment';
import $ from 'jquery';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import DatePickerCustomInput from '../../components/ui/DatePickerCustomInput/DatePickerCustomInput';
import { InputDateFormat } from '../../settings';

import * as actions from '../../store/actions';
import './FilterBar.css';

//Component that displays the start date, end date and campaign search filters
class FilterBar extends Component {

    //items that are not required to store in global store
    state = {
        isFiltersDisplayedInSmallScreen: false
    }

    //Update when start date filter is changed
    changeStartDateHandler = (startDate) => {
        this.props.changeStartDate({ startDate });
    }

    //Update when end date filter is changed
    changeEndDateHandler = (endDate) => {
        this.props.changeEndDate({ endDate });
    }

    //Update when campaign name search filter is changed
    changeSearchTermHandler = (ev) => {
        const searchTerm = $(ev.target).val();
        this.props.changeSearchTerm({ searchTerm });
    }

    //Toggle the filters
    //Feature only available in devices with less width
    toggleFilersHandler = () => {
        this.setState((prevState) => ({
            ...prevState,
            isFiltersDisplayedInSmallScreen: !prevState.isFiltersDisplayedInSmallScreen
        }));
    }

    render() {
        const startDate = this.props.startDate && moment(this.props.startDate, InputDateFormat)._d;
        const endDate = this.props.endDate && moment(this.props.endDate, InputDateFormat)._d;
        
        let showFiltersClassName = 'row show-filters text-align-right';
        let filtersClassName ='row filters-wrapper';

        if (this.state.isFiltersDisplayedInSmallScreen) filtersClassName += 'displayed';
        return (
            <div className="FilterBar">
                <div className={showFiltersClassName}>
                    <button 
                        className="btn btn-info btn-show-filters" 
                        onClick={this.toggleFilersHandler}>
                        Toggle Filters
                    </button>
                </div>
                <div className={filtersClassName}>
                    <label className="col col-12 col-sm-1 col-md-1">
                        Filters:
                    </label>
                    <div id="start-dates" className="col col-12 col-sm-6 col-md-4 field">
                        {/* Start date filter */}
                        <DatePicker 
                            placeholderText="Start date" 
                            selected={startDate} 
                            onChange={this.changeStartDateHandler} 
                            customInput={<DatePickerCustomInput />}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            popperModifiers={{
                                preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: "viewport"
                                }
                            }} />
                        {/* End date filter */}
                        <DatePicker 
                            placeholderText="End date" 
                            minDate={startDate}
                            selected={endDate} 
                            onChange={this.changeEndDateHandler} 
                            customInput={<DatePickerCustomInput />}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            popperModifiers={{
                                preventOverflow: {
                                    enabled: true,
                                    escapeWithReference: false,
                                    boundariesElement: "viewport"
                                }
                            }} />
                    </div>
                    {/* Campaign name search filter */}
                    <div id="search-term" className="col col-12 col-sm-3 col-md-5 field">
                        <div className="display-flex flex-wrapper">
                            <div className="flex-dynamic">
                                <input
                                    className="form-control input-name"
                                    placeholder="Search campaign name"
                                    type="text"
                                    value={this.props.searchTerm || ''}
                                    onChange={this.changeSearchTermHandler} />
                            </div>
                            <div className="flex-fixed search-icon">
                                <i className="fa fa-search"></i>
                            </div>
                        </div>                        
                    </div>
                    {/* Reset filters */}
                    <div className="col col-12 col-sm-2 col-md-2 field">
                        <button 
                            className="btn btn-info btn-reset" 
                            onClick={this.props.resetFilters}>
                            Reset
                        </button>
                    </div>
                </div>
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
        sortBy: state.filterBarNS.sortBy
    }
}

//Get props to dispatch actions to update the global redux store
const mapDispatchToProps = (dispatch) => {
    return {
        changeStartDate: (payload) => dispatch(actions.changeStartDate(payload)),
        changeEndDate: (payload) => dispatch(actions.changeEndDate(payload)),
        changeSearchTerm: (payload) => dispatch(actions.changeSearchTerm(payload)),
        resetFilters: () => dispatch(actions.resetFilters())
    }
}

//connect the above two functions to the component to connect to the store
export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);