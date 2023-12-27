import { useAppContext } from "../context/AppContext";

const Tests = () => {
    const { tests, dispatchEvent } = useAppContext();

    const handleNodeSelect = (item) => {
        dispatchEvent("SELECT_TEST", item);
    };

    return (
        <>
            <h2>Test List</h2>
            <div>

                <ul>
                    {tests.map((item, index) => (
                        <li key={index} onClick={() => { handleNodeSelect(item) }}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
export default Tests;