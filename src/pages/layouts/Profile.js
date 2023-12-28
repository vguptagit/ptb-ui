import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import "./profile.scss";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <NavDropdown
      title={
        <span>
          <i className="bi bi-person-fill"></i> {user.name}
        </span>
      }
      id="nav-dropdown"
      className="profile-dropdown"
    >

      <NavDropdown.Item className="profile-name">{user.name}</NavDropdown.Item>
      <NavDropdown.Item className="profile-email">{user.email}</NavDropdown.Item>
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
          className="button-signout"
          onClick={logout}
        >
          <FormattedMessage id="profile.signout" />
        </Button>
      </div>
    </NavDropdown>
  );
};

export default Profile;
