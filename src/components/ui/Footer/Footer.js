import React from 'react';
import moment from 'moment';

import './Footer.css';

const footer = () => {
    return (
        <div className="Footer">
            Copyright © {moment().year()} Kishor
        </div>
    );
}

export default footer;