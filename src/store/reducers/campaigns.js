import moment from 'moment';
import $ from 'jquery';
import { ADD_CAMPAIGNS } from '../actions/actionTypes';
import logger from '../../utils/logger';
import campaignSchema from '../../schemas/campaign';
import { InputDateFormat } from '../../settings';

const initialState = {
    startDate: null,
    endDate: null,
    searchTerm: null,
    campaigns: []
}

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

const validateCampaign = (c) => {
    if (!$.isPlainObject(c)) {
        logger.error('Campaign value is improper. Please provide JSON objects.');
        return null;
    }

    let errorMessage = '';

    campaignSchema.forEach((field) => {
        const result = validateProperty(c, field);
        errorMessage += `${errorMessage && result ? ', ' : ''}${result}`;
    });

    if (errorMessage) {
        const fieldName = c.name ? ` for campaign ${c.name}` : '';
        logger.error(`Improper field values${fieldName}: ${errorMessage}`);
        return null;
    } else {
        if (!c.id) c.id = Math.round(Math.random() * 100000);
    }

    return c;
}

const addCampaigns = (state, { payload: { newCampaigns } } = {}) => {
    if (newCampaigns && Array.isArray(newCampaigns) && newCampaigns.length) {
        const validCampaigns = [];
        newCampaigns.forEach((c) => {
            const campaign = validateCampaign(c);
            if (campaign) {
                validCampaigns.push(campaign);
            }
        });

        if (validCampaigns.length) {
            if (validCampaigns.length !== newCampaigns.length) logger.warn('Some campaigns are invalid.');
            return {
                ...state,
                campaigns: state.campaigns.concat(validCampaigns)
            }
        }
    }
    logger.error('Please provide valid campaigns.');
    return state;
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CAMPAIGNS:
            return addCampaigns(state, action);
        default:
            return state;
    }
}

export default reducer;