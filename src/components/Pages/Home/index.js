import React from 'react';
import classes from './home.module.css';
import AddReviewModal from './addReviewModal';
import { withAuthorization, AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import ReviewCard from '../../Partials/ReviewCard'

import StarRatings from 'react-star-ratings';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const INITIAL_STATE = {
  bobaShop: '', location: '',
  score1: 1, score2: 1, score3: 1, score4: 1,
  score5: 1, score6: 1, score7: 1, score8: 1,
  note: "", error: null,
};

class HomePage extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);

    this.state = {
      myReviews: [],
      modalIsOpen: false,
      loading: true,
      formValues: INITIAL_STATE
    };
  }

  componentDidMount() {
    this.getReviewList();
  }
  componentWillUnmount() {
    this.props.firebase.userReviews().off();
  }

  toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  }

  newReview = () => {
    this.setState({ formValues:INITIAL_STATE }
      , () => {
        this.toggleModal();
      });
  }

  editReview = (params) => {
    params.score1 = parseInt(params.score1);
    params.score2 = parseInt(params.score2);
    params.score3 = parseInt(params.score3);
    params.score4 = parseInt(params.score4);
    params.score5 = parseInt(params.score5);
    params.score6 = parseInt(params.score6);
    params.score7 = parseInt(params.score7);
    params.score8 = parseInt(params.score8);
    this.setState({ formValues: params });
    this.toggleModal();
  }

  deleteReview = (key) => {
    var result = window.confirm("Are you sure you want to delete?");
    if (result) {
      this.props.firebase.userReviews(this.context.authUser.uid).child(key).remove();
      this.props.firebase.bobaShopUserReviews(key).child(this.context.authUser.uid).remove();
    }
  }

  submitReview = formValues => {
    const { score1, score2, score3, score4, score5, score6, score7, score8, note } = formValues;
    const bobaShop = formValues.bobaShop.trim();
    const location = formValues.location.trim();
    const bobaShopAndLocation = bobaShop + ' (' + location + ')';

    const dateTime = new Date().toLocaleString();
    const userId = this.context.authUser.uid;
    const username = this.context.username;

    this.props.firebase
      .bobaShopUserReview(bobaShopAndLocation, userId)
      .update({
        username,
        score1, score2, score3, score4,
        score5, score6, score7, score8,
        note, dateTime
      })
      .catch(error => { this.setState({ error }); });

    this.props.firebase
      .userReview(userId, bobaShopAndLocation)
      .update({
        username,
        score1, score2, score3, score4,
        score5, score6, score7, score8,
        note, dateTime,
      })
      .catch(error => { this.setState({ error }); });

    this.props.firebase
      .bobaShop(bobaShopAndLocation)
      .update({ bobaShop: bobaShopAndLocation })
      .catch(error => { this.setState({ error }); });

    this.props.firebase
      .location(location)
      .update({ location })
      .then(() => {
        this.setState({ formValues: INITIAL_STATE });
        this.notify();
      })
      .catch(error => { this.setState({ error }); });

    this.toggleModal();
  };

  getReviewList() {
    const userId = this.context.authUser.uid

    this.props.firebase.userReviews(userId).on('value', snapshot => {
      const myReviewsObject = snapshot.val();
      if (myReviewsObject) {
        const myReviewsList = Object.keys(myReviewsObject).map(key => ({
          bobaShop: key,
          ...myReviewsObject[key],
        }))

        this.setState({ myReviews: myReviewsList });
      } else {
        this.setState({ myReviews: [] });
      }
      this.setState({ loading: false });
    });
  }

  notify = () => toast("Review added");

  render() {
    const { myReviews, loading } = this.state;
    const override = css`
    display: block;
    margin: 150px auto;`;

    return (
      <div>
        <div className={classes.inlineParent}>
          <h5 style={{marginLeft:'15px'}}>
            My Reviews
          </h5>
          <FontAwesomeIcon icon={faPlusCircle} onClick={this.newReview}
            className={`${classes.addIcon}`} size="2x" />
        </div>
        <ToastContainer />

        <div className='sweet-loading'>
          <ClipLoader
            sizeUnit={"px"}
            css={override}
            size={70}
            color={'#61aceb'}
            loading={this.state.loading}
          />
        </div>
        <div className={classes.reviewsList}>
          {!loading && (myReviews === undefined || myReviews.length == 0) ?
            <div className={`${classes.noReviewsWell}`}>
              No Reviews Added.
            </div>
            : <ul>
              {myReviews.map(review => (
                <li key={review.bobaShop} className={``}>
                  <ReviewCard isHomeCard="true" review={review} editReview={this.editReview} deleteReview={this.deleteReview}
                    shop={review.bobaShop} note={review.note}
                    score1={review.score1} score2={review.score2}
                    score3={review.score3} score4={review.score4}
                    score5={review.score5} score6={review.score6}
                    score7={review.score7} score8={review.score8} />
                </li>
              ))}
            </ul>
          }
        </div>

        <AddReviewModal show={this.state.modalIsOpen}
          formValues={this.state.formValues}
          toggleModal={this.toggleModal}
          submitReview={this.submitReview}>
        </AddReviewModal>
      </div>
    )
  }

  // render() {
  //   return (
  //     <div>

  //         <div className={`col-12 col-sm-6" ${classes.left}`}>
  //           <NewReview formValues={this.state.formValues} />
  //         </div>
  //         <div className={`col-12 col-sm-6" ${classes.right}`}>
  //           <MyReviews editReview={this.editFormValues} />
  //         </div>

  //     </div>
  //   );
  // }
}


const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(HomePage));
