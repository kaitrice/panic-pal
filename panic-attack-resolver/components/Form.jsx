import React from 'react';

function Form({ variant, children, ...rest }) {
    let className = 'form';

    switch (variant) {
        case 'registration':
            className += ' form-registration';
            break;
        case 'login':
            className += ' form-login';
            break;
        default:
            break;
    }

    return (
        <button className={className} {...rest}>
        {children}
        </button>
    );
}

export default Form;
