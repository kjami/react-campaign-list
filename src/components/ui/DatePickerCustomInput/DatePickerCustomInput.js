import React, { forwardRef } from 'react';

//This component is for custom input inside the react-datepicker component
const datePickerCustomInput = ({ value, onClick, placeholder }, _ref) => {
    return (
        <button className="btn btn-info btn-custom-input" onClick={onClick}>
            {value || placeholder}
        </button>
    );
};

export default forwardRef(datePickerCustomInput);