import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './Header';

configure({ adapter: new Adapter() });

describe('Header component tests', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<Header />)
    });

    it('check if button is loaded', () => {
        expect(wrapper.find('.Header')).toHaveLength(1);
    });
});