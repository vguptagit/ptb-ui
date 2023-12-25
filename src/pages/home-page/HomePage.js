import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./HomePage.scss";
import ResourceTab from "../../components/ResourceTab";
import TestTabs from "../../components/testTabs/TestTabs";
import TestCreate from "../../components/TestCreate";

const HomePage = () => {
    console.log('HomePage on load');
     
    useEffect(() => {
    }, [])
    return (
        <>
            <div class="row scree-height">
                <div class="col border-right">
                    <ResourceTab />
                    <Outlet />
                </div>
                <div class="col">
                    <TestTabs />
                    <TestCreate />
                     
                </div>
            </div>
        </>
    );
}
export default HomePage;