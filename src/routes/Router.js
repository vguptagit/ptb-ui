import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "../pages/home-page/HomePage.js";
import StartPage from "../pages/start-page/StartPage.js";
import TestsPage from "../pages/TestsPage.js";
import QuestionsPage from "../pages/QuestionsPage.js";
import NoPage from "../pages/NoPage.js";
import FullLayout from '../pages/layouts/FullLayout.js';
import CustomQuestionsPage from '../pages/CustomQuestionsPage.js';
import QuestionTemplatesPage from '../pages/question-templates-page/QuestionTemplatesPage.js';
import QuestionBanks from '../pages/QuestionBanks.js';
import LoginPage from '../pages/LoginPage.js';

const AppRoutes = (
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<FullLayout />} >
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} >
                <Route path="/home" element={<Navigate to="/home/tests" />} />
                <Route path="/home/tests" element={<TestsPage />} />
                <Route path="/home/questions" element={<QuestionsPage />} />
                <Route path="/home/questionbanks" element={<QuestionBanks />} />
                <Route path="/home/customquestions" element={<CustomQuestionsPage />} />
            </Route>
            <Route path="/start" element={<StartPage />} />
            <Route path="*" element={<NoPage />} />
        </Route>
    </Routes>
);

export default AppRoutes;