import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Layout from './Layout';
import Header from '../../components/ui/Header/Header';
import FilterBar from '../FilterBar/FilterBar';
import Campaigns from '../Campaigns/Campaigns';
import Footer from '../../components/ui/Footer/Footer';

configure({ adapter: new Adapter() });

describe('Layout Component', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<Layout />);
    });

    it('should contain header, filter bar, campaigns and footer components.', () => {
        expect(wrapper.find(Header)).toHaveLength(1);
        expect(wrapper.find(FilterBar)).toHaveLength(1);
        expect(wrapper.find(Campaigns)).toHaveLength(1);
        expect(wrapper.find(Footer)).toHaveLength(1);
    });
});

