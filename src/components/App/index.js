import React from 'react';
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
import classes from './app.module.css';
import { AuthUserContext } from '../Session';
import Navigation from '../Navigation';
import LandingPage from '../Pages/Landing';
import SignUpPage from '../Partials/SignUp';
import SignInPage from '../Pages/SignIn';
import PasswordForgetPage from '../Partials/PasswordForget';
import HomePage from '../Pages/Home';
import ReviewsPage from '../Pages/Reviews';
import ShopsPage from '../Pages/Shops';
import UsersPage from '../Pages/Users';
import PhotosPage from '../Pages/Photos';
import AccountPage from '../Pages/Account';
import AdminPage from '../Pages/Admin';
import TestPage from '../Pages/Test';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

class App extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);

    this.state = {
      newReviewsCount: 0,
      reviewsLastVisit: ''
    }
  }

  // componentDidUpdate() {
  //   console.log('update');
  //   if (this.context.authUser != null) {
  //     this.props.firebase.userReviewLastVisit(this.context.authUser.uid).on('value', snapshot => {
  //       const reviewsLastVisit = snapshot.val();
  //       if (reviewsLastVisit) {
  //         this.setState({ reviewsLastVisit })
  //       }
  //     });

  //     this.props.firebase.reviewDateTimes().on('value', snapshot => {
  //       const reviewDateTimesObject = snapshot.val();
  //       if (reviewDateTimesObject) {
  //         const reviewDateTimesList = Object.keys(reviewDateTimesObject).map((key) => {
  //           if (reviewDateTimesObject[key].dateTime > this.state.reviewsLastVisit)
  //             return reviewDateTimesObject[key].dateTime;
  //         });
  //         reviewDateTimesList.sort(function (a, b) {
  //           return new Date(b) - new Date(a);
  //         });
  //         console.log(reviewDateTimesList);
  //       }
  //     });
  //   }
  // }

  // componentWillUnmount() {
  //   this.props.firebase.reviewDateTimes().off();
  //   this.props.firebase.userReviewLastVisit().off();
  // }
  updateNewReviews = (newCount) => {
    this.setState({ newReviewsCount: newCount });
  }

  render() {
    // const PropsReviewsPage = (props) => {
    //   return (
    //     <ReviewsPage
    //       newReviews={this.state.newReviewsCount}
    //       updateNewReviews={this.updateNewReviews}
    //     />
    //   );
    // }

    return (

      <HashRouter>
        <div>
          <div>
            <Navigation forwardRef={node => this.node = node} newReviewsCount={this.state.newReviewsCount} />
            <hr />
          </div>
          <div className={classes.main} onClick={this.handleContainerClick}>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.REVIEWS} render={ReviewsPage} />
            <Route exact path={ROUTES.SHOPS} component={ShopsPage} />
            <Route exact path={ROUTES.MEMBERS} component={UsersPage} />
            <Route exact path={ROUTES.PHOTOS} component={PhotosPage} />
            <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />
            <Route exact path={ROUTES.TEST} component={TestPage} />
            <Route
              exact
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
          </div>
        </div>
      </HashRouter>
    );
  }
}


export default withAuthentication(App);
