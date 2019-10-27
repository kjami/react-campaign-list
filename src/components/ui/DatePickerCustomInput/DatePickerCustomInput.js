import React, { forwardRef } from 'react';

const datePickerCustomInput = ({ value, onClick, placeholder }, ref) => {
    return (
        <button className="btn btn-info btn-custom-input" onClick={onClick}>
            {value || placeholder}
        </button>
    );
};

export default forwardRef(datePickerCustomInput);