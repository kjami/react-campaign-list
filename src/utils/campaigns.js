import moment from 'moment';
import $ from 'jquery';
import logger from './logger';
import campaignSchema from '../schemas/campaign';
import { InputDateFormat, DefaultSortBy } from '../settings';

//Filter the given campaigns by the startDate, endDate and searchTerm filters
export const filterCampaigns = ({ campaigns = [], startDate: startDateRange, endDate: endDateRange, searchTerm }) => {
    startDateRange = moment(startDateRange, InputDateFormat);
    endDateRange = moment(endDateRange, InputDateFormat);
    //filter items by the start and end date ranges as well as search term
    campaigns = campaigns.filter(({ name, startDate, endDate }) => {
        let filtered = false;

        //Check if search term is available. If available, check if search term is present inside the campaign name (in case insensitive way)
        if (searchTerm && !name.trim().toLowerCase().includes(searchTerm.toLowerCase())) {
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

//Check if campaign active
//This should be calculated on-the-fly, as it is dependant on the current date
export const isCampaignActive = (startDate, endDate) => {
    const date = moment();
    const startDateMoment = moment(startDate, InputDateFormat);
    const endDateMoment = moment(endDate, InputDateFormat);
    return (date.isBetween(startDateMoment, endDateMoment)) ? 'Active' : 'Inactive';
}

//Sort given campaigns by the campaigns' active status
const sortCampaignsByActive = (campaigns, { sortByAsc }) => {
    let sortByMultiplier = sortByAsc ? 1 : -1;
    //Comparator checks the active statuses and then compares them
    campaigns = campaigns.sort((a, b) => {
        let aActive = isCampaignActive(a.startDate, a.endDate);
        let bActive = isCampaignActive(b.startDate, b.endDate);
        let condition = aActive > bActive;
        return sortByMultiplier * (condition ? 1 : -1)
    });
    return campaigns;
}

//sort campaigns
//They are sorted based on the schema (except for 'active' sortBy case - check above method)
export const sortCampaigns = (campaigns, { sortBy, sortByAsc }) => {
    //Since active is not in the campaign schema, use a different method
    if (sortBy === 'active') {
        return sortCampaignsByActive(campaigns, { sortBy, sortByAsc });
    }
    let schemaObj = campaignSchema.find((c) => c.name === sortBy);

    if (!schemaObj) {
        schemaObj = campaignSchema.find((c) => c.name === DefaultSortBy);
    }

    //If sortBy option is not availalbe in schema, do not sort and update user
    if (!schemaObj) {
        logger.warn('SortBy settings are invalid.');
        return campaigns;
    }

    const dataType = schemaObj.type;
    const field = schemaObj.name;
    //To reverse, in case of descending order
    let sortByMultiplier = sortByAsc ? 1 : -1;
    //comparator checks for the data type and sorts it accordingly
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

//This is to validate one property of the camapaign property based on schema
//Returns empty string if it is valid
//Returns the name of the property if it is error
const validateProperty = (campaign, { name, type, validation = null }) => {
    const val = campaign[name];
    let isError = false;

    if (type === 'string' && (!val || typeof val !== 'string')) {
        isError = true;
    } else if (type === 'date' && (!val || !moment(val, InputDateFormat).isValid())) {
        isError = true;
    } else if (type === 'number' && (typeof val === 'undefined' || val === null || val === false || isNaN(val))) {
        logger.log(typeof val === 'undefined', val === null, val === false, isNaN(val));
        isError = true;
    }

    if (!isError && validation) {
        return validation(campaign);
    }

    return isError ? name : '';
}

//Validate each campaign based on the schema
//Returns campaign if it is valid
//Returns null if it is invalid
export const validateCampaign = (c) => {
    //Check is it is a json object. if not, alert user
    if (!$.isPlainObject(c)) {
        logger.error('Campaign value is improper. Please provide JSON objects.');
        return null;
    }

    let errorMessage = '';

    //Iterate and validate each property
    campaignSchema.forEach((field) => {
        const result = validateProperty(c, field);
        errorMessage += `${errorMessage && result ? ', ' : ''}${result}`;
    });

    //If campaign is invalid, alert user and return null
    if (errorMessage) {
        const fieldName = c.name ? ` for campaign ${c.name}` : '';
        logger.error(`Improper field values${fieldName}: ${errorMessage}`);
        return null;
    } else {
        //If id is not provide, assign a random id
        if (!c.id) c.id = Math.round(Math.random() * 100000);
    }

    return c;
}