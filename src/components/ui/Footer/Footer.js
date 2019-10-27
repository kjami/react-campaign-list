import React from 'react';
import moment from 'moment';

import './Footer.css';

//footer component in the layout
const footer = () => {
    return (
        <div className="Footer">
            Copyright © {moment().year()}
        </div>
    );
}

export default footer;