import { useAppContext } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faDownload } from "@fortawesome/free-solid-svg-icons";

const Tests = () => {
    const { tests, dispatchEvent } = useAppContext();

    const handleNodeSelect = (item) => {
        dispatchEvent("SELECT_TEST", item);
    };

    return (
        <div className="p-1">
            <div className="button-container">
                <button className="button-style"><FontAwesomeIcon icon={faPlus} />  Add Folder</button>
                <button className="button-style"><FontAwesomeIcon icon={faDownload} /> Import</button>
            </div>
            <h3>Test List</h3>
            <div>

                <ul>
                    {tests.map((item, index) => (
                        <li key={index} onClick={() => { handleNodeSelect(item) }}>
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default Tests;