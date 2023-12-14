import { Outlet } from "react-router-dom";
import "./HomePage.css";
import ResourceTab from "../../components/ResourceTab";
import TestTabs from "../../components/testTabs/TestTabs";

const HomePage = () => {
    return (
        <>
            <div class="row scree-height">
                <div class="col border-right">
                    <ResourceTab />
                    <Outlet />
                </div>
                <div class="col">
                    <TestTabs />
                </div>
            </div>
        </>
    );
}
export default HomePage;