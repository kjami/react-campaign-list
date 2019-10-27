import React, { Component } from 'react';
import Header from '../../components/ui/Header/Header';
import FilterBar from '../FilterBar/FilterBar';
import Campaigns from '../Campaigns/Campaigns';
import Footer from '../../components/ui/Footer/Footer';

class Layout extends Component {
    render() {
        return (
            <div className="display-flex flex-column flex-wrapper">
                <div className="flex-fixed">
                    <Header />
                </div>
                <div className="flex-fixed">
                    <FilterBar />
                </div>
                <div className="flex-dynamic">
                    <div className="flex-normaliser">
                        <Campaigns />
                    </div>
                </div>
                <div className="flex-fixed">
                    <Footer />
                </div>
            </div>
        );
    }
}

export default Layout;