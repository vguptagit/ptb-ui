import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "../containers/home-page/HomePage.js";
import StartPage from "../containers/start-page/StartPage.js";
import TestsPage from "../containers/TestsPage.js";
import QuestionsPage from "../containers/QuestionsPage.js";
import NoPage from "../containers/NoPage.js";
import FullLayout from '../containers/layouts/FullLayout.js';

const AppRoutes = (
    <Routes>
        <Route path="/" element={<FullLayout />} >
            <Route path="/home" element={<HomePage />} >
                <Route path="/home/tests" element={<TestsPage />} />
                <Route path="/home/questions" element={<QuestionsPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="*" element={<NoPage />} />
        </Route>
    </Routes>
);

export default AppRoutes;