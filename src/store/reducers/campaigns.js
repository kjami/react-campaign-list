import { ADD_CAMPAIGNS } from '../actions/actionTypes';
import { validateCampaign } from '../../utils/campaigns';
import logger from '../../utils/logger';

const initialState = {
    campaigns: []
}

//Method to add campaigns to the global store
const addCampaigns = (state, { payload: { newCampaigns } } = {}) => {
    //Check if newCampaings is array and has atleast one element
    if (newCampaigns && Array.isArray(newCampaigns) && newCampaigns.length) {
        const validCampaigns = [];
        //Validate each new campaign and push in to validCampaigns array
        newCampaigns.forEach((c) => {
            const campaign = validateCampaign(c);
            if (campaign) {
                validCampaigns.push(campaign);
            }
        });

        //If validCampaigns are available
        if (validCampaigns.length) {
            //If validCampaigns are lesser than newCampaigns, warn user that some campaigns are invalid
            if (validCampaigns.length !== newCampaigns.length) logger.warn('Some campaigns are invalid.');
            return {
                ...state,
                campaigns: state.campaigns.concat(validCampaigns)
            }
        }
    }
    // If no campaigns are available or valid, alert user
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