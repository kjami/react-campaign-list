import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { datePickerCustomInput as DatePickerCustomInput } from './DatePickerCustomInput';

configure({ adapter: new Adapter() });

describe('DatePickerCustomInput component tests', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<DatePickerCustomInput/>)
    });

    it('check if button is loaded', () => {
        expect(wrapper.find('button')).toHaveLength(1);
    });
});