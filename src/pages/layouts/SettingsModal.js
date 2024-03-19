import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getUserProfilesettings, userProfilesettings } from "../../services/profile.service";
import { FormattedMessage } from "react-intl";
import Toastify from "../../components/common/Toastify";

const SettingsModal = ({ show, handleClose }) => {
    const [userProfileSettings, setUserProfileSettings] = useState([]);
    const [selectedSettings, setSelectedSettings] = useState([]);

    const handleSave = () => {
        userProfilesettings(selectedSettings)
            .then((response) => {
                console.log("Successfully updated settings");
                Toastify({ message: "Settings been saved successfully!", type: "success" });
            })
            .catch((error) => {
                console.log(`Error updating settings: ${error}`);
                Toastify({ message: "Error saving settings!", type: "error" });
            });
        handleClose();
    };


    useEffect(() => {
        // Fetch user profile settings from API
        getUserProfilesettings()
            .then((data) => {
                if (data) {
                    setUserProfileSettings(data);
                    setSelectedSettings(data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Handle checkbox change
    const handleCheckboxChange = (settingName, isChecked) => {
        setSelectedSettings(prevState => {
            if (isChecked) {
                return [...prevState, settingName];
            } else {
                return prevState.filter(setting => setting !== settingName);
            }
        });
    };

    useEffect(() => {
        console.log("Selected settings:", selectedSettings);
    }, [selectedSettings]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Metadata
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Label><FormattedMessage id="settings metadata" /></Form.Label>
                <Form>
                    <Form.Group as={Row}>
                        <Col>
                            {userProfileSettings.map((setting, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={setting}
                                    id={`${index}`}
                                    checked={selectedSettings.includes(setting)}
                                    onChange={(e) => handleCheckboxChange(setting, e.target.checked)}
                                />
                            ))}
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <button className=" btn btn-primary" onClick={handleSave}>
                    Save
                </button>

            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;
