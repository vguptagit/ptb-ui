import { useAppContext } from "../context/AppContext";

const Tests = () => {
    const { tests, selectedTest, selectTest } = useAppContext();

    const handleNodeSelect = (item) => {
        selectTest(item);
    };

    return (
        <>
            Tests
            <div>
                <h2>Test List</h2>
                <ul>
                    {tests.map((item, index) => (
                        <li key={index} onClick={()=>{handleNodeSelect(item)}}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}
export default Tests;