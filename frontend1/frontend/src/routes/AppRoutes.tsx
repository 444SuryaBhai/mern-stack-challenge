import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/home/Home';

const AppRoutes: React.FC = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' Component={Home} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;