import reducer from './campaigns';
import * as actionTypes from '../actions/actionTypes';

describe('campaigns reducer tests', () => {
    it('check initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            campaigns: []
        });
    });

    it('check add campaigns success', () => {
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            campaigns: []
        }, {
            type: actionTypes.ADD_CAMPAIGNS,
            payload: {
                newCampaigns: [{ "id": 123, "name": "Campaign 2", "startDate": "9/19/2018", "endDate": "3/9/2019", "Budget": 1 }]
            }
        });
        expect(result.campaigns.length).toEqual(1);
    });

    it('check add campaigns failure', () => {
        console.error = () => {};
        const result = reducer({
            startDate: null,
            endDate: null,
            searchTerm: null,
            campaigns: []
        }, {
            type: actionTypes.ADD_CAMPAIGNS,
            payload: {
                newCampaigns: [{ "id": 123, "name": "Campaign 2", "startDate": "9/19/2018", "endDate": "3/9/2017", "Budget": 1 }]
            }
        });
        expect(result.campaigns.length).toEqual(0);
    });
});