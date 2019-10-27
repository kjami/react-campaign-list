import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { FilterBar } from './FilterBar';

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
});

