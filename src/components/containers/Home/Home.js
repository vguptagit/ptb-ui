import { Outlet } from "react-router-dom";
import "./Home.css";
import ResourceTab from "./ResourceTab";
import TestTabs from "./testTabs/TestTabs.js";

const Home = () => {
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
export default Home;