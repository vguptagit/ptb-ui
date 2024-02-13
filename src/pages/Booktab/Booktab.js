import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Booktab.css';
import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { getDisciplineBooks } from "../../services/book.service";
import Loader from "../../components/common/loader/Loader";


const LeftContent = () => {
  return (
    <div className="left-content">
      <ul>
        <li><FormattedMessage id="booktab.steps.2" /></li>
        <li><FormattedMessage id="booktab.steps.3" /></li>
        <li><FormattedMessage id="booktab.steps.4" /></li>
      </ul>
    </div>
  );
};


const Booktab = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Choose Your Books or Topics";
  }, []);
  useEffect(() => {
    setLoading(true);
    getDisciplineBooks()
      .then(data => {
        setTreeData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching discipline books:', error);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (selectedItems.length > 0) {
      navigate("/home");
    }
  };

  const handleBack = () => {
    navigate("/discipline");
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const inputWidth = Math.max(200, e.target.scrollWidth);
    document.querySelector('.search-input').style.minWidth = inputWidth + 'px';
  };

  const handleSelectItem = (node) => {
    if (!node.droppable || node.droppable.length === 0) {
      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.includes(node.id)) {
          const newSelectedItems = prevSelectedItems.filter((selectedItem) => selectedItem !== node.id);
          console.log("Deselected:", node.id);
          console.log("Selected items:", newSelectedItems);
          return newSelectedItems;
        } else {
          const newSelectedItems = [...prevSelectedItems, node.id];
          console.log("Selected:", node.id);
          console.log("Selected items:", newSelectedItems);
          return newSelectedItems;
        }
      });
    }
  };

  return (
    <div className="booktab-container">
      {loading ? (
        <Loader show="true" />
      ) : (
        <>
          <div className="top-container">
            <h4><FormattedMessage id="booktab.steps.1" /></h4>
            <button className="booktab btn btn-secondary " onClick={handleBack}>Back</button>
            <button className="booktab btn btn-primary" onClick={handleNext} disabled={selectedItems.length === 0}>Next</button>
          </div>
          <div className="booktab d-flex justify-content-between">
            <LeftContent />
            <div className="booktab search-container">
              <div className="booktab input-group rounded">
                <input
                  type="search"
                  width="100%"
                  className="booktab form-control rounded search-input"
                  placeholder="Search Books"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="booktab input-group-append">
                  <span className="booktab input-group-text border-0" id="search-addon">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
              <div className="booktab result-list mt-3">
                {treeData.map((item, index) => (
                  <div key={index}>

                    <p>{item.discipline}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Booktab;
