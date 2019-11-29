import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import sinon from 'sinon';

import { App, mapDispatchToProps } from './App';
import Layout from './containers/Layout/Layout';

configure({ adapter: new Adapter() });

describe('App component tests', () => {
    let wrapper = null;
    let addCampaignsStub = null;

    beforeEach(() => {
        let props = {
            addCampaigns: () => { }
        }
        addCampaignsStub = sinon.stub(props, 'addCampaigns');
        wrapper = shallow(<App
                            {...props}/>);
    });

    afterEach(() => {
        if (addCampaignsStub) {
            addCampaignsStub.reset();
        }
    });

    it('check componentDidMount', () => {
        expect(typeof window.AddCampaigns).toBe('function');
        expect(addCampaignsStub.calledOnce).toBe(true);
        addCampaignsStub.reset();
        window.AddCampaigns();
        expect(addCampaignsStub.calledOnce).toBe(true);
    });

    it('check whether Layout component is loaded or not', () => {
        expect(wrapper.find(Layout)).toHaveLength(1);
    });

    it('check mapDispatchToProps', () => {
        const obj = { fn: sinon.spy() };
        const res = mapDispatchToProps(obj.fn);
        expect(typeof res.addCampaigns).toBe('function');
        res.addCampaigns();
        expect(obj.fn.calledOnce).toBe(true);
    });
});