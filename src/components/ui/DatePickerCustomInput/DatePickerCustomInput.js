import React, { forwardRef } from 'react';

//This component is for custom input inside the react-datepicker component
export const datePickerCustomInput = ({ className='', value, onClick, placeholder }, _ref) => {
    const cls = `btn btn-info btn-custom-input ${className}`;
    return (
        <button className={cls} onClick={onClick}>
            {value || placeholder}
        </button>
    );
};

export default forwardRef(datePickerCustomInput);