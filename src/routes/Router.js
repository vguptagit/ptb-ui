import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "../components/containers/Home/Home.js";
import Start from "../components/containers/Start/Start.js";
import Tests from "../components/containers/Tests.js";
import Questions from "../components/containers/Questions.js";
import NoPage from "../components/containers/NoPage.js";
import FullLayout from '../components/layouts/FullLayout.js';

const AppRoutes = (
    <Routes>
        <Route path="/" element={<FullLayout />} >
            <Route path="/home" element={<Home />} >
                <Route path="/home/tests" element={<Tests />} />
                <Route path="/home/questions" element={<Questions />} />
            </Route>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/start" element={<Start />} />
            <Route path="*" element={<NoPage />} />
        </Route>
    </Routes>
);

export default AppRoutes;