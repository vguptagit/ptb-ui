import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './AddDisciplinepopup.css';
import Loader from "../common/loader/Loader";
import { getAllDisciplines } from "../../services/discipline.service";

const AddDisciplinepopup = ({ handleNext }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [allData, setAllData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState(() => {
        const storedItems = sessionStorage.getItem("selectedDiscipline");
        return storedItems ? JSON.parse(storedItems) : [];
      });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Choose Your Discipline";
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiData = await getAllDisciplines();
                setAllData(apiData);
                setSearchResults(apiData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filteredResults = allData.filter(item =>
            item.toLowerCase().includes(term.toLowerCase())
        );

        setSearchResults(filteredResults);
    };

    const handleSelectItem = (item) => {
        setSelectedItems(prevSelectedItems => {
            if (prevSelectedItems.includes(item)) {
                return prevSelectedItems.filter(selectedItem => selectedItem !== item);
            } else {
                return [...prevSelectedItems, item];
            }
        });
    };

    const handleNextStep = () => {
        if (selectedItems.length > 0) {
        
            sessionStorage.setItem("selectedDiscipline", JSON.stringify(selectedItems));
            handleNext();
        }
    };

    return (
        <div className="discipline-container">
            {loading ? (
                <Loader show={true} />
            ) : allData.length === 0 ? (
                <div className="no-data-message">No disciplines available</div>
            ) : (
                <>
                    <div className="top-container">
                        <h2 className="choose-your-books-or-topics">Add Discipline</h2>
                        <button className="discipline btn btn-primary" onClick={handleNextStep} disabled={selectedItems.length === 0}>Next</button>
                    </div>

                    <div className="discipline input-group rounded">
                        <input
                            type="search"
                            width="100%"
                            className="discipline form-control rounded search-input"
                            placeholder="Search Discipline"
                            aria-label="Search"
                            aria-describedby="search-addon"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div className="discipline input-group-append">
                            <span className="discipline input-group-text border-0" id="search-addon">
                                <i className="fas fa-search"></i>
                            </span>
                        </div>
                    </div>
                    {searchResults.length === 0 && (
                        <div className="no-matching-discipline-message">"No matching disciplines found"</div>
                    )}
                    <ul className="discipline result-list mt-3">
                        {searchResults.map((item, index) => (
                            <li
                                tabIndex="0"
                                key={index}
                                className={`result-item ${selectedItems.includes(item) ? "selected" : ""}`}
                                onClick={() => handleSelectItem(item)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                        handleSelectItem(item);
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>

                </>
            )}
        </div>
    );
};

export default AddDisciplinepopup;
