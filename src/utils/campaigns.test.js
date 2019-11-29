import moment from 'moment';
import { InputDateFormat } from '../settings';
import { filterCampaigns, isCampaignActive, sortCampaigns, validateCampaign } from './campaigns';
import campaignSchema from '../schemas/campaign';
import sinon from 'sinon';
import logger from './logger';

describe('Campaign utilities', () => {
    let campaigns = null;
    let error = console.error;

    beforeEach(() => {
        console.error = error;
        campaigns = [
            { "id": 1, "name": "Campaign 1", "startDate": "9/19/2017", "endDate": "3/9/2018", "Budget": 88377 },
            { "id": 2, "name": "Campaign 2", "startDate": "11/21/2017", "endDate": "2/21/2018", "Budget": 608715 },
            { "id": 3, "name": "Campaign 3", "startDate": "11/1/2017", "endDate": "6/20/2020", "Budget": 239507 },
            { "id": 4, "name": "Campaign 4", "startDate": "8/25/2017", "endDate": "11/30/2017", "Budget": 179838 },
            { "id": 5, "name": "Campaign 5", "startDate": "11/28/2017", "endDate": "3/10/2020", "Budget": 10 },
            { "id": 6, "name": "Campaign 6", "startDate": "7/25/2017", "endDate": "6/23/2018", "Budget": 858131 },
            { "id": 7, "name": "Campaign 7", "startDate": "6/27/2017", "endDate": "1/15/2018", "Budget": 109078 },
            { "id": 8, "name": "Campaign 8", "startDate": "10/13/2017", "endDate": "1/25/2020", "Budget": 272552 },
            { "id": 9, "name": "Campaign 9", "startDate": "9/6/2017", "endDate": "11/10/2017", "Budget": 301919 },
            { "id": 10, "name": "Test Campaign", "startDate": "3/5/2018", "endDate": "10/2/2019", "Budget": 10000000 }
        ];
    });

    it('filterCampaigns to return all elements when no filtering criteria is passed.', () => {
        const length = campaigns.length;
        const newCampaigns = filterCampaigns({ campaigns });
        expect(newCampaigns).toHaveLength(length);
    });

    it('filterCampaigns to return elements within the date range.', () => {
        const startDate = '11/20/2017';
        const endDate = '10/3/2019';
        const newCampaigns = filterCampaigns({ campaigns, startDate, endDate });
        expect(newCampaigns).toHaveLength(2);
    });

    it('filterCampaigns to return zero elements within the date range.', () => {
        const startDate = '11/21/2021';
        const endDate = '10/2/2022';
        const newCampaigns = filterCampaigns({ campaigns, startDate, endDate });
        expect(newCampaigns).toHaveLength(0);
    });

    it('filterCampaigns to return zero elements within the date range when date range is wrong.', () => {
        const startDate = '11/20/2022';
        const endDate = '10/3/2021';
        const newCampaigns = filterCampaigns({ campaigns, startDate, endDate });
        expect(newCampaigns).toHaveLength(0);
    });

    it('filterCampaigns to return elements which has the search term in the names.', () => {
        const searchTerm = 'tESt';
        const newCampaigns = filterCampaigns({ campaigns, searchTerm });
        expect(newCampaigns).toHaveLength(1);
    });

    it('filterCampaigns to return zero elements which has the search term in the names.', () => {
        const searchTerm = 'Random';
        const newCampaigns = filterCampaigns({ campaigns, searchTerm });
        expect(newCampaigns).toHaveLength(0);
    });

    it('filterCampaigns to return zero elements when no campaigns are passed.', () => {
        const newCampaigns = filterCampaigns({});
        expect(newCampaigns).toHaveLength(0);
    });

    it('isCampaignActive to return Active when date is in between start and end dates', () => {
        const startDate = moment().subtract(1, 'days').format(InputDateFormat);
        const endDate = moment().add(1, 'days').format(InputDateFormat);
        const isActive = isCampaignActive(startDate, endDate);
        expect(isActive).toEqual('Active');
    });

    it('isCampaignActive to return Inactive when date is not in between start and end dates', () => {
        const startDate = moment().add(1, 'days').format(InputDateFormat);
        const endDate = moment().add(3, 'days').format(InputDateFormat);
        const isActive = isCampaignActive(startDate, endDate);
        expect(isActive).toEqual('Inactive');
    });

    it('isCampaignActive to return Inactive when date is not in between start and end dates when date is improper', () => {
        const startDate = moment().add(3, 'days').format(InputDateFormat);
        const endDate = moment().add(1, 'days').format(InputDateFormat);
        const isActive = isCampaignActive(startDate, endDate);
        expect(isActive).toEqual('Inactive');
    });

    it('sortCampaigns to return least start date element first.', () => {
        const sorted = sortCampaigns(campaigns, { sortBy: 'startDate', sortByAsc: true });
        const length = sorted.length - 1;
        const firstStartDate = sorted && sorted[0] && sorted[0].startDate;
        const lastStartDate = sorted && sorted[length] && sorted[length].startDate;
        expect(firstStartDate).toEqual('6/27/2017');
        expect(lastStartDate).toEqual('3/5/2018');
    });

    it('sortCampaigns to return least end date element first.', () => {
        const sorted = sortCampaigns(campaigns, { sortBy: 'endDate', sortByAsc: true });
        const length = sorted.length - 1;
        const firstEndDate = sorted && sorted[0] && sorted[0].endDate;
        const lastEndDate = sorted && sorted[length] && sorted[length].endDate;
        expect(firstEndDate).toEqual('11/10/2017');
        expect(lastEndDate).toEqual('6/20/2020');
    });

    it('sortCampaigns to return sorted names in descending order', () => {
        const sorted = sortCampaigns(campaigns, { sortBy: 'name', sortByAsc: false });
        const length = sorted.length - 1;
        const firstName = sorted && sorted[0] && sorted[0].name;
        const lastName = sorted && sorted[length] && sorted[length].name;
        expect(firstName).toEqual('Test Campaign');
        expect(lastName).toEqual('Campaign 1');
    });

    it('sortCampaigns to return sorted Budgets in descending order', () => {
        const sorted = sortCampaigns(campaigns, { sortBy: 'Budget', sortByAsc: false });
        const length = sorted.length - 1;
        const firstBudget = sorted && sorted[0] && sorted[0].Budget;
        const lastBudget = sorted && sorted[length] && sorted[length].Budget;
        expect(firstBudget).toEqual(10000000);
        expect(lastBudget).toEqual(10);
    });

    it('sortCampaigns to return sorted Active in ascending order', () => {
        const sorted = sortCampaigns(campaigns, { sortBy: 'active', sortByAsc: true });
        const item = sorted && sorted[0] && sorted[0].id;
        expect(item).toEqual(3);
    });

    it('sortCampaigns to return sorted Active in desc order', () => {
        const sorted = sortCampaigns(campaigns, { sortBy: 'active', sortByAsc: false });
        const item = sorted && sorted[0] && sorted[0].id;
        expect(item).toEqual(10);
    });

    it('sortCampaigns to return least start date element first when sort by is invalid.', () => {
        const sorted = sortCampaigns(campaigns, { sortBy: 'asfasfewt', sortByAsc: true });
        const length = sorted.length - 1;
        const firstStartDate = sorted && sorted[0] && sorted[0].startDate;
        const lastStartDate = sorted && sorted[length] && sorted[length].startDate;
        expect(firstStartDate).toEqual('6/27/2017');
        expect(lastStartDate).toEqual('3/5/2018');
    });

    it('sortCampaigns to warn when campaignSchema.find returns null.', () => {
        jest.spyOn(campaignSchema, 'find')
            .mockImplementation(() => null);
        const stub = sinon.stub(logger, 'warn');
        sortCampaigns(campaigns, { sortBy: 'name', sortByAsc: true });
        expect(stub.calledOnce).toBe(true);
    });

    it('validateCampaign to return true', () => {
        const isValid = validateCampaign(campaigns[0]);
        expect(isValid).toBeTruthy();
    });

    it('validateCampaign to return false when parameter is not object', () => {
        console.error = () => {};
        const isValid = validateCampaign('1234');
        expect(isValid).toBeFalsy();
    });

    it('validateCampaign to return false when name is not string', () => {
        console.error = () => { };
        const c = { ...campaigns[0] };
        c.name = 123;
        const isValid = validateCampaign(c);
        expect(isValid).toBeFalsy();
    });

    it('validateCampaign to return false when name is null', () => {
        console.error = () => { };
        const c = { ...campaigns[0] };
        c.name = null;
        const isValid = validateCampaign(c);
        expect(isValid).toBeFalsy();
    });

    it('validateCampaign to return false when start date and end date are null', () => {
        console.error = () => { };
        const c = { ...campaigns[0] };
        c.startDate = null;
        c.endDate = null;
        const stub = sinon.stub(logger, 'error');
        const isValid = validateCampaign(c);
        expect(isValid).toBeFalsy();
        expect(stub.calledOnce).toBe(true);
    });

    it('validateCampaign to return false when budget is null', () => {
        console.error = () => { };
        const c = { ...campaigns[0] };
        c.Budget = null;
        const isValid = validateCampaign(c);
        expect(isValid).toBeFalsy();
    });

    it('validateCampaign to return false when budget is null', () => {
        console.error = () => { };
        const c = { ...campaigns[0] };
        c.id = null;
        const newCampaign = validateCampaign(c);
        expect(newCampaign.id).toBeTruthy();
    });

    it('validateCampaign to return false when parameter is not object', () => {
        console.error = () => {};
        const isValid = validateCampaign({ "name": "Campaign 2", "startDate": "9/19/2018", "endDate": "3/9/2017", "Budget": 1 });
        expect(isValid).toBeFalsy();
    });
});

