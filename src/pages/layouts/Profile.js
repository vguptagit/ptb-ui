import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import './profile.css';
import { useAuth } from '../../context/AuthContext';
import SettingsModal from './SettingsModal';
import { useState } from 'react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsModalLoaded, setSettingsModalLoaded] = useState(false); // Flag to indicate if modal content has been loaded

  const handleSettingsModalOpen = () => {
    setShowSettingsModal(true);
  };

  const handleSettingsModalClose = () => {
    setShowSettingsModal(false);
  };

  // Function to load modal content and set flag
  const loadSettingsModalContent = () => {
    setSettingsModalLoaded(true);
  };

  return (
    <>
      <NavDropdown
        title={
          <span>
            <i className="bi bi-person-fill"></i> {user.firstname} {user.lastname}
          </span>
        }
        id="nav-dropdown"
        className="profile-dropdown"
      >
        <NavDropdown.Item className="profile-name">
          {user.firstname} {user.lastname}
        </NavDropdown.Item>
        <NavDropdown.Item className="profile-email">{user.email}</NavDropdown.Item>
        <NavDropdown.Divider />
        <div className="settings-and-sign-out">
          <div className="d-flex justify-content-center align-items-center">
            <Button
              variant="primary"
              className="button-setting"
              onClick={() => {
                handleSettingsModalOpen();
                loadSettingsModalContent();
              }}
            >
              <FormattedMessage id="profile.setting" />
            </Button>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Button variant="primary" className="button-signout" onClick={logout}>
              <FormattedMessage id="profile.signout" />
            </Button>
          </div>
        </div>
      </NavDropdown>
      {showSettingsModal && settingsModalLoaded && (
        <SettingsModal show={showSettingsModal} handleClose={handleSettingsModalClose} />
      )}
    </>
  );
};

export default Profile;
