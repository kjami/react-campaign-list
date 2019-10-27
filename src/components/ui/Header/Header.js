import React from 'react';

import './Header.css';

//header component in the layout
const header = () => {
    return (
        <div className="Header">
            <div className="display-flex flex-wrapper">
                <div className="flex-fixed header-company-title">
                    Campaigns App
                </div>
                <div className="flex-dynamic">

                </div>
            </div>
        </div>
    );
}

export default header;