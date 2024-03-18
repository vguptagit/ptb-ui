// Modal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getUserProfilesettings } from "../../services/profile.service";
import { FormattedMessage } from "react-intl";


const SettingsModal = ({ show, handleClose }) => {

    const [userProfileSettings, setUserProfileSettings] = useState([]);




    useEffect(() => {
        getUserProfilesettings()
            .then((data) => {
                if (data) {
                    setUserProfileSettings(data);


                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);

            });
    }, []);

    console.log("api data", userProfileSettings)


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Title>
                <div className="settings-container">
                    <h2>MetaData</h2>
                    <button className=" btn btn-primary">
                        Save
                    </button>
                </div>


            </Modal.Title>
            <Modal.Body>
                <Form.Label  ><FormattedMessage id="settings metadata" /></Form.Label>
                <Form>
                    <Form.Group as={Row}>
                        <Col>


                            {userProfileSettings.map((setting, index) => (
                                <Form.Check

                                    type="checkbox"
                                    label={setting}

                                    id={`${index}`}
                                    checked={true}

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

            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;
