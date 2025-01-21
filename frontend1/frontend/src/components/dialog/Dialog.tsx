import React from 'react';

const Dialog: React.FC<any> = ({ children, open, handleClose, header }) => {

    return (
        <div> {open && (
            <div className="custom-dialog-overlay" onClick={handleClose}>
                <div className="custom-dialog-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{header}</h2>
                    {children}
                    <div className="custom-dialog-actions">
                        <button onClick={handleClose} className="btn-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        )}</div>
    )
}

export default Dialog;