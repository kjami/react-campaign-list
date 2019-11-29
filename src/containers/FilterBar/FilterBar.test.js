import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import sinon from 'sinon';
import { FilterBar, mapStateToProps, mapDispatchToProps } from './FilterBar';

import DatePicker from "react-datepicker";

configure({ adapter: new Adapter() });

describe('Layout Component', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<FilterBar />);
    });

    it('should contain 2 date pickers, search term and rest button.', () => {
        expect(wrapper.find(DatePicker)).toHaveLength(2);
        expect(wrapper.find('#search-term')).toHaveLength(1);
        expect(wrapper.find('.btn-reset')).toHaveLength(1);
    });

    it('should contain search term with input value.', () => {
        const givenValue = 'ABCD';
        wrapper.setProps({
            searchTerm: givenValue
        });
        const value = wrapper.find('#search-term input').props().value;
        expect(value).toEqual(givenValue);
    });

    it('mapStateToProps test', () => {
        const res = mapStateToProps({
            filterBarNS: {
                startDate: 'startDate',
                endDate: 'endDate',
                searchTerm: 'searchTerm',
                sortBy: 'sortBy'
            }
        });

        expect(res.startDate).toBeTruthy();
        expect(res.endDate).toBeTruthy();
        expect(res.searchTerm).toBeTruthy();
        expect(res.sortBy).toBeTruthy();
    });

    it('mapDispatchToProps test', () => {
        const obj = { fn: () => { } };
        const stub = sinon.stub(obj, 'fn');
        const res = mapDispatchToProps(obj.fn);

        expect(res.changeStartDate).toBeTruthy();
        expect(res.changeEndDate).toBeTruthy();
        expect(res.changeSearchTerm).toBeTruthy();
        expect(res.resetFilters).toBeTruthy();
        res.changeStartDate();
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        res.changeEndDate();
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        res.changeSearchTerm();
        expect(stub.calledOnce).toBe(true);
        stub.reset();
        res.resetFilters();
        expect(stub.calledOnce).toBe(true);
        stub.reset();
    });
});

