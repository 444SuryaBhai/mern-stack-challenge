import React from 'react';

import { ButtonProps } from '../../utils/types/types';

const ButtonField: React.FC<ButtonProps> = ({ label, handleClick, type, isDisabled }) => {

    return (
        <button
            onClick={handleClick}
            className="btn-add"
            type={type}
            disabled={isDisabled}
        >
            {label}
        </button>
    )
}

export default ButtonField;