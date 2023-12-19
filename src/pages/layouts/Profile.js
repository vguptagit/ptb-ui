import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import "./profile.css";

const Profile = () => {
  return (
    <NavDropdown
      title={
        <span>
          <i className="bi bi-person-fill"></i> Suresh
        </span>
      }
      id="nav-dropdown"
      className="profile-dropdown"
    >
      
      <NavDropdown.Item className="profile-name">Suresh kiran Pearson</NavDropdown.Item>
      <NavDropdown.Item className="profile-email">sureshkiran12345@gmail.com</NavDropdown.Item>
      <NavDropdown.Divider />
      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="primary"
          href="#setting"
          className="button-setting"
        >
          <FormattedMessage id="profile.setting" />
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="primary"
          href="#signout"
          className="button-signout"
        >
          <FormattedMessage id="profile.signout" />
        </Button>
      </div>
    </NavDropdown>
  );
};

export default Profile;
