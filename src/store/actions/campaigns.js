import { ADD_CAMPAIGNS } from './actionTypes';

//Action to add new campaigns
//Payload accepts campaigns array as newCampaigns
export const addCampaigns = (payload) => ({
    type: ADD_CAMPAIGNS,
    payload: payload
});