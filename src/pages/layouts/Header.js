import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Profile from './Profile';
import { FormattedMessage } from "react-intl";

const Header = () => {
    return (
      <Navbar bg="light" data-bs-theme="light" expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand className='brand'>
            {/* <img src='PSO_BIG.D.png' height='30' alt='' loading='lazy' /> */}
            <h1 className='pearson-heading'>
              <FormattedMessage id="pearsonheader.title" />
            </h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#start">Start</Nav.Link> */}
            </Nav>
            <Nav>
              <Profile />
                <Nav.Link id="help-icon" aria-label='help button to activate press enter'>
                  <FormattedMessage id="helpText" /> 
                   <i className="bi bi-question-circle"></i>
                </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}
export default Header;