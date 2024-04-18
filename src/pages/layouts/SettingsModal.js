import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getUserProfilesettings, userProfilesettings } from '../../services/profile.service';
import { FormattedMessage } from 'react-intl';
import './profile.css';
import Toastify from '../../components/common/Toastify';
import Loader from '../../components/common/loader/Loader';

const hardcodedSettings = ['Difficulty', 'Topic', 'Objective', 'PageReference', 'Question ID', 'Skill'];

const SettingsModal = ({ show, handleClose }) => {
  const [userProfileSettings, setUserProfileSettings] = useState([]);
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [initialSettings, setInitialSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSave = () => {
    userProfilesettings(selectedSettings)
      .then(response => {
        console.log('Successfully updated settings');
        Toastify({ message: 'Settings have been saved successfully!', type: 'success' });
      })
      .catch(error => {
        console.log(`Error updating settings: ${error}`);
        Toastify({ message: 'Error saving settings!', type: 'error' });
      });
    handleClose();
  };

  useEffect(() => {
    setLoading(true);
    getUserProfilesettings()
      .then(data => {
        if (data) {
          // Merge the API response with the hardcoded settings
          const mergedSettings = [...new Set([...data, ...hardcodedSettings])];
          // Filter out settings that are not in the merged array
          const filteredSettings = mergedSettings.filter(setting => hardcodedSettings.includes(setting));
          // Set selectedSettings to only include settings that are both in filteredSettings and data
          const defaultSelectedSettings = data.filter(setting => filteredSettings.includes(setting));
          setUserProfileSettings(filteredSettings);
          setSelectedSettings(defaultSelectedSettings);
          setInitialSettings(defaultSelectedSettings);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = (settingName, isChecked) => {
    setSelectedSettings(prevState => {
      if (isChecked) {
        return [...prevState, settingName];
      } else {
        return prevState.filter(setting => setting !== settingName);
      }
    });
  };

  const handleCloseWithoutSave = () => {
    setSelectedSettings(initialSettings);
    handleClose();
  };
  return (
    <div style={{ position: 'relative' }}>
      <Modal
        show={show}
        onHide={handleCloseWithoutSave}
        backdrop="static"
        keyboard={false}
        centered
        className="settings-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage id="metadataTitle" />
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loading ? (
            <Loader />
          ) : (
            <>
              <Form.Label>
                <FormattedMessage id="settings metadata" />
              </Form.Label>
              <Form>
                <Form.Group as={Row}>
                  <Col>
                    {hardcodedSettings.map((setting, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={setting}
                        id={`${index}`}
                        checked={selectedSettings.includes(setting)}
                        onChange={e => handleCheckboxChange(setting, e.target.checked)}
                      />
                    ))}
                  </Col>
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseWithoutSave}>
            <FormattedMessage id="closeButtonSettingsModalText" />
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <FormattedMessage id="saveButtonSettingsModalText" />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsModal;
