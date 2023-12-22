import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./HomePage.scss";
import ResourceTab from "../../components/ResourceTab";
import TestTabs from "../../components/testTabs/TestTabs";
import { useAppContext } from "../../context/AppContext";
import Test from "../../entities/Test.Entity";

const HomePage = () => {
    const { addTest } = useAppContext();
    const [newTest, setNewTest] = useState(new Test());
 

    // Step 1: Initialize State
    const [formData, setFormData] = useState(new Test());
    // Step 2: Handle Form Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Step 4: Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can now use the formData state or send it to a server
        console.log('Form data submitted:', formData);
        if (formData.title) {
            addTest(formData);
            setNewTest(new Test());
        }
    };

    return (
        <>
            <div class="row scree-height">
                <div class="col border-right">
                    <ResourceTab />
                    <Outlet />
                </div>
                <div class="col">
                    <TestTabs />
                      
                    <form onSubmit={handleSubmit}>
                        <label>
                            First Name:
                            <input type="text" name="title" value={newTest.title} onChange={handleInputChange} />
                        </label>
                        <br />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default HomePage;