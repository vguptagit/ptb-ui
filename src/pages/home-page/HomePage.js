import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./HomePage.css";
import ResourceTab from "../../components/ResourceTab";
import TestTabs from "../../components/testTabs/TestTabs";
import TestCreate from "../../components/TestCreate";

const HomePage = () => {
    console.log('HomePage on load');
     
    useEffect(() => {
    }, [])
    return (
        <>
            <div className="row scree-height">
                <div className="col panel panel-left">
                    <ResourceTab />
                    <Outlet />
                </div>
                <div className="col panel panel-right">
                    <TestTabs />
                    <TestCreate />
                     
                </div>
            </div>
        </>
    );
}
export default HomePage;