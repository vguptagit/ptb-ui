import React from "react";
import Spinner from 'react-bootstrap/Spinner';
import "./Loader.css";

const Loader = () => (
    <div className="fallback-spinner">
        <div className="loading">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    </div>
);
export default Loader;