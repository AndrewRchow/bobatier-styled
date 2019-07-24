import React from 'react';
import classes from './navigation.module.css';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Nav, Button } from 'react-bootstrap';

const authAdminMenuItems = [
  // ['Tier List', ROUTES.LANDING],
  ['Shops', ROUTES.SHOPS],
  ['Members', ROUTES.MEMBERS],
  ['Photos', ROUTES.PHOTOS],
  ['Recent Reviews', ROUTES.REVIEWS],
  ['My Reviews', ROUTES.HOME],
  ['Account', ROUTES.ACCOUNT],
  ['Admin', ROUTES.ADMIN],
  ['Test', ROUTES.TEST],
];

const authMenuItems = [
  // ['Tier List', ROUTES.LANDING],
  ['Shops', ROUTES.SHOPS],
  ['Members', ROUTES.MEMBERS],
  ['Photos', ROUTES.PHOTOS],
  ['Recent Reviews', ROUTES.REVIEWS],
  ['My Reviews', ROUTES.HOME],
  ['Account', ROUTES.ACCOUNT],
];

const nonAuthMenuItems = [
  // ['Tier List', ROUTES.LANDING],
  ['Shops', ROUTES.SHOPS],
  ['Members', ROUTES.MEMBERS],
  ['Photos', ROUTES.PHOTOS],
  ['Recent Reviews', ROUTES.REVIEWS],
  ['Sign In', ROUTES.SIGN_IN],
];


const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {login =>
        login.role === 'admin' ? <NavigationAuth menuItems={authAdminMenuItems} signedIn={true} /> :
          (login.authUser ? <NavigationAuth menuItems={authMenuItems} signedIn={true} /> :
            <NavigationAuth menuItems={nonAuthMenuItems} signedIn={false} />)
      }
    </AuthUserContext.Consumer>
  </div>
);

class NavigationAuthBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navExpanded:false
    }

    this.setNavExpanded = this.setNavExpanded.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  setNavExpanded(expanded) {
    this.setState({ navExpanded: expanded });
    document.addEventListener('click', this.handleDocumentClick, true);
  };

  closeNav() {
    this.setState({ navExpanded: false });
    document.removeEventListener('click', this.handleDocumentClick, true);
  };

  handleDocumentClick(e) {
    const container = this._element;
    if (e.target !== container && !container.contains(e.target)) {
      this.closeNav();
    }
  }

  signOut(){
    this.props.firebase.doSignOut();
    this.closeNav();
  }

  render() {
    // const relPath = window.location.href.split('#')[1];

    let signoutButton = null;
    if (this.props.signedIn) {
      signoutButton = <Button variant="outline-info" onClick={this.signOut}>Sign Out</Button>
    }

    return (
      <div ref={(c) =>(this._element = c)} className={classes.navBar}>
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" fixed="top"
              onToggle={this.setNavExpanded} expanded={this.state.navExpanded}>
          <Navbar.Brand onClick={this.closeNav} href="#/">aaaaa</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {this.props.menuItems.map(([menuItem, route]) =>
                <Nav.Link href={"#" + route} key={menuItem}>{menuItem}</Nav.Link>
              )}
            </Nav>
            {signoutButton}
          </Navbar.Collapse>
        </Navbar>
      </div>


      // <div className={`${(barsOpen ? classes.responsive : "")} ${classes.navbar}`}>
      //   {this.props.menuItems.map(([menuItem, route]) =>
      //     <Link key={menuItem} to={route} onClick={this.linkClick}
      //       className={relPath===  route ? classes.active : ""}>
      //       {menuItem}
      //     </Link>
      //   )}
      //   <div className={`${(barsOpen ? classes.responsiveSignout : "")}`} onClick={this.barsClick}>
      //     {signoutButton}
      //   </div>


      //   <a className={`${classes.icon}`} onClick={this.barsClick}>
      //     <FontAwesomeIcon icon={faBars} size="lg" />
      //   </a>
      // </div>
    );
  }
}

const NavigationAuth = withFirebase(NavigationAuthBase);

export default Navigation;
