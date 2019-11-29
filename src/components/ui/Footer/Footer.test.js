import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Footer from './Footer';

configure({ adapter: new Adapter() });

describe('Footer component tests', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<Footer />)
    });

    it('check if button is loaded', () => {
        expect(wrapper.find('.Footer')).toHaveLength(1);
    });
});