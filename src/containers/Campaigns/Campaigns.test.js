import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Campaigns } from './Campaigns';

configure({ adapter: new Adapter() });

describe('Campaigns Component', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<Campaigns campaigns={[]}/>);
    });

    it('should contain 2 campaign elements.', () => {
        wrapper.setProps({ 
            campaigns: [
                { "id": 1, "name": "Campaign 1", "startDate": "9/19/2017", "endDate": "3/9/2018", "Budget": 88377 },
                { "id": 2, "name": "Campaign 2", "startDate": "11/21/2017", "endDate": "2/21/2018", "Budget": 608715 }                
            ]
        });
        expect(wrapper.find('.campaign')).toHaveLength(2);
        expect(wrapper.find('thead tr')).toHaveLength(1);
        expect(wrapper.find('tbody tr')).toHaveLength(2);
    });
});

