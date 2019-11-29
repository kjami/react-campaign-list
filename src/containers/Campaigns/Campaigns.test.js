import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import logger from '../../utils/logger';

import { Campaigns, mapStateToProps, mapDispatchToProps, getCampaignElems } from './Campaigns';

configure({ adapter: new Adapter() });

describe('Campaigns Component', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<Campaigns campaigns={[]}/>);
    });

    it('should contain 2 campaign elements.', () => {
        wrapper.setProps({
            sortBy: 'name',
            sortByAsc: true,
            campaigns: [
                { "id": 1, "name": "Campaign 1", "startDate": "9/19/2017", "endDate": "3/9/2018", "Budget": 88377 },
                { "id": 2, "name": "Campaign 2", "startDate": "11/21/2017", "endDate": "2/21/2018", "Budget": 608715 }
            ]
        });
        expect(wrapper.find('.campaign')).toHaveLength(2);
        expect(wrapper.find('thead tr')).toHaveLength(1);
        expect(wrapper.find('tbody tr')).toHaveLength(2);
        expect(wrapper.find('.fa-sort-asc')).toHaveLength(1);
    });

    it('should contain 1 campaign elements.', () => {
        wrapper.setProps({
            sortBy: 'name',
            sortByAsc: false,
            campaigns: [
                { "id": 1, "name": "Campaign 1", "startDate": "9/19/2017", "endDate": "3/9/2018", "Budget": 88377 }
            ]
        });
        expect(wrapper.find('.fa-sort-desc')).toHaveLength(1);
        expect(wrapper.find('.campaign')).toHaveLength(1);
        expect(wrapper.find('tbody tr')).toHaveLength(1);
    });

    it('getCampaignElems should call logger.error when start date is greater than end date.', () => {
        jest.spyOn(logger, 'error')
            .mockImplementation(() => null);
        const stub = sinon.stub(logger, 'error');
        getCampaignElems([
            { "id": 1, "name": "Campaign 1", "startDate": "3/9/2018", "endDate": "9/19/2017", "Budget": 88377 },
        ]);
        expect(stub.calledOnce).toBe(true);
    });

    it('should contain 2 campaign elements.', () => {
        const obj = { fn: () => '' };
        const stub = sinon.stub(obj, 'fn');
        wrapper.setProps({
            campaigns: [
                { "id": 1, "name": "Campaign 1", "startDate": "9/19/2017", "endDate": "3/9/2018", "Budget": 88377 },
                { "id": 2, "name": "Campaign 2", "startDate": "11/21/2017", "endDate": "2/21/2018", "Budget": 608715 }
            ],
            changeSortBy: obj.fn
        });
        wrapper.find('.td-head-name').simulate('click');
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        wrapper.find('.td-head-start-date').simulate('click');
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        wrapper.find('.td-head-end-date').simulate('click');
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        wrapper.find('.td-head-active').simulate('click');
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        wrapper.find('.td-head-budget').simulate('click');
        expect(stub.calledOnce).toBe(true);
    });

    it('mapStateToProps test', () => {
        const res = mapStateToProps({
            filterBarNS: {
                startDate: 'startDate',
                endDate: 'endDate',
                searchTerm: 'searchTerm',
                sortBy: 'sortBy',
                sortByAsc: 'sortByAsc'
            },
            campaignsNS: {
                campaigns: 'campaigns'
            }
        });

        expect(res.startDate).toBeTruthy();
        expect(res.endDate).toBeTruthy();
        expect(res.searchTerm).toBeTruthy();
        expect(res.sortBy).toBeTruthy();
        expect(res.sortByAsc).toBeTruthy();
        expect(res.campaigns).toBeTruthy();
    });

    it('mapDispatchToProps test', () => {
        const obj = { fn: () => {} };
        const stub = sinon.stub(obj, 'fn');
        const res = mapDispatchToProps(obj.fn);

        expect(res.addCampaigns).toBeTruthy();
        expect(res.changeSortBy).toBeTruthy();
        res.addCampaigns();
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        res.changeSortBy();
        expect(stub.calledOnce).toBe(true);
    });
});

