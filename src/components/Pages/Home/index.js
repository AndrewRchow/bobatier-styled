import React from 'react';
import classes from './home.module.css';
import AddReviewModal from './addReviewModal';
import AddCommentModal from '../../Partials/AddCommentModel';
import { withAuthorization, AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import ReviewCard from '../../Partials/ReviewCard'
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
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
      reviews: [],
      modalIsOpen: false,
      loading: true,
      formValues: INITIAL_STATE,
      contextUid: "",
      contextUsername: "",
      commentModal: {
        bobaShop: "",
        uid: "",
        contextUid: "",
        contextUsername: "",
        isOpen: false
      }
    };
  }

  componentDidMount() {
    if (this.context.authUser != null) {
      this.setState({
        contextUid: this.context.authUser.uid,
        contextUsername: this.context.username
      });
    }

    this.getReviewList();
  }
  componentWillUnmount() {
    this.props.firebase.userReviews().off();

    this.setState({
      contextUid: '',
      contextUsername: ''
    });
  }

  toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  }

  toggleCommentModal = (bobaShop, uid, contextUid, contextUsername) => {
    const commentModal = { ...this.state.commentModal };
    commentModal.bobaShop = bobaShop;
    commentModal.uid = uid;
    commentModal.contextUid = contextUid;
    commentModal.contextUsername = contextUsername;
    commentModal.isOpen = !commentModal.isOpen;

    this.setState({
      commentModal: commentModal
    });
  }

  newReview = () => {
    this.setState({ formValues: INITIAL_STATE }
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
    .userReview(userId, bobaShopAndLocation)
    .once('value').then((snapshot) =>{
      if(!snapshot.val()){
        this.props.firebase
        .reviewDateTimes()
        .push({
          dateTime
        })
        .catch(error => { this.setState({ error }); });
      }
    })

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
      .bobaShopUserReview(bobaShopAndLocation, userId)
      .update({
        username,
        score1, score2, score3, score4,
        score5, score6, score7, score8,
        note, dateTime
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
    const userid = this.context.authUser.uid

    this.props.firebase.userReviews(userid).on('value', snapshot => {
      const myReviewsObject = snapshot.val();
      if (myReviewsObject) {
        const myReviewsList = Object.keys(myReviewsObject).map(key => ({
          bobaShop: key,
          userid,
          ...myReviewsObject[key],
        }))
        this.sortReviews(myReviewsList)
      } else {
        this.setState({ reviews: [] });
      }
      this.setState({ loading: false });
    });
  }

  sortReviews = (reviews) => {
    let sortedReviews = [];
    for (let shop in reviews) {
      let review = {
        ...reviews[shop],
      };
      if (review.comments) {
        review.comments = Object.keys(review.comments).map(key => ({
          ...review.comments[key]
        }));
        review.comments.sort(function (a, b) {
          return new Date(a.dateTime) - new Date(b.dateTime);
        });
      }
      sortedReviews.push(review);
    }
    sortedReviews.sort(function (a, b) {
      return new Date(b.dateTime) - new Date(a.dateTime);
    });
    this.setState({ reviews: sortedReviews });
  }

  notify = () => toast("Review added");

  render() {
    const { reviews, loading, contextUsername, contextUid } = this.state;
    console.log(reviews);
    const override = css`
    display: block;
    margin: 150px auto;`;

    return (
      <div className='container'>
        <div className={classes.inlineParent}>
          <h5 style={{ marginLeft: '15px' }}>
            My Reviews
          </h5>
          <button onClick={this.newReview}
            className={`btn btn-primary`} style={{ marginLeft: '20px' }}>
            <FontAwesomeIcon icon={faPlus}
              className={`${classes.addIcon}`} size="1x" />
          </button>
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
          {!loading && (reviews === undefined || reviews.length == 0) ?
            <div className={`${classes.noReviewsWell}`}>
              No Reviews Added.
            </div>
            : <ul>
              {reviews.map(review => (
                <li key={review.bobaShop} className={``}>
                  <ReviewCard isHomeCard="true" editReview={this.editReview} deleteReview={this.deleteReview}
                    toggleCommentModal={this.toggleCommentModal} authUsername={contextUsername} authUid={contextUid}
                    review={review} />
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
        <AddCommentModal show={this.state.commentModal.isOpen}
          toggleCommentModal={this.toggleCommentModal}
          commentModal={this.state.commentModal}>
          Add a comment
                </AddCommentModal>
      </div>
    )
  }
}


const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(HomePage));
