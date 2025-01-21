import React from 'react';

import './Loader.css';

type LoaderType = {
    isLoading: boolean
}

const Loader: React.FC<LoaderType> = ({ isLoading }) => {

    return (
        <>
            {isLoading
                ? <div className='loader-container'>
                    < div className='loader' ></div >
                </div>
                : ""}
        </>
    )
}

export default Loader;