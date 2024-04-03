import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './AddDisciplinepopup.css';
import Loader from "../common/loader/Loader";
import { getAllDisciplines, getUserDisciplines } from "../../services/discipline.service";

const AddDisciplinepopup = ({ handleNext }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [allData, setAllData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDisciplineData, setUserDisciplineData] = useState([]);

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

    useEffect(() => {
        getUserDisciplines()
            .then((data) => {
                if (data) {
                    setUserDisciplineData(data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (userDisciplineData.length > 0) {
            setSelectedItems(prevSelectedItems => {
                const selectedItems = allData.filter(item => userDisciplineData.includes(item));
                return [...prevSelectedItems, ...selectedItems];
            });
        }
    }, [userDisciplineData, allData]);

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
            // Store selected disciplines in sessionStorage
            sessionStorage.setItem('selectedDisciplinesAddpopup', JSON.stringify(selectedItems));
            handleNext();
        }
    };


    return (
        <div className="disciplineaddpopup-container">
            {loading ? (
                <Loader show={true} />
            ) : allData.length === 0 ? (
                <div className="no-data-message">
                    <FormattedMessage id="noDisciplinesAvailable" defaultMessage="No disciplines available" />
               </div>
            ) : (
                <>
                    <div className="disciplineaddpopup-top-container">
                        
                    <h4 className="choose-your-books-or-topics">
                        <FormattedMessage id="addDiscipline" defaultMessage="Add Discipline" />
                  </h4>
                        <button className="disciplinePopup btn btn-primary" onClick={handleNextStep} disabled={selectedItems.length === 0}>Next</button>
                    </div>
                    <div className="disciplinePopup input-group rounded">
                        <input
                            type="search"
                            width="100%"
                            className="disciplinePopup form-control rounded search-inputText"
                            placeholder="Search Discipline"
                            aria-label="Search"
                            aria-describedby="search-addon"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <div className="disciplinePopup input-group-append">
                            <span className="disciplinePopup input-group-text border-0" id="search-addon">
                                <i className="fas fa-search"></i>
                            </span>
                        </div>

                    </div>
                    
                    {searchResults.length === 0 && (
                        <div className="no-matching-discipline-message">
                        <FormattedMessage id="noMatchingDisciplines" defaultMessage="No matching disciplines found" />
                       </div>
                    )}
                  
                    <ul className="disciplinePopup result-list mt-3">
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
