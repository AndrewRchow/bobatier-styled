import React from 'react';
import classes from './home.module.css';
import { withAuthorization, AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';
import ReviewCard from '../../Partials/ReviewCard'

import StarRatings from 'react-star-ratings';
import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const INITIAL_STATE = {
  bobaShop: '',
  score1: 1,
  score2: 1,
  score3: 1,
  score4: 1,
  score5: 1,
  score6: 1,
  score7: 1,
  score8: 1,
  note: "",
  error: null,
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formValues: INITIAL_STATE };
    this.editFormValues = this.editFormValues.bind(this);
  }

  editFormValues(params) {
    params.score1 = parseInt(params.score1);
    params.score2 = parseInt(params.score2);
    params.score3 = parseInt(params.score3);
    params.score4 = parseInt(params.score4);
    params.score5 = parseInt(params.score5);
    params.score6 = parseInt(params.score6);
    params.score7 = parseInt(params.score7);
    params.score8 = parseInt(params.score8);
    this.setState({ formValues: params });
    window.scrollTo(0, 0);
  }

  render() {

    // <div className={`col-sm-6" ${classes.scroll}`}></div>
    return (
      <div className={classes.Content}>
        <div className={`row" ${classes.Wrapper}`}>
          <div className={`col-12 col-sm-6" ${classes.left}`}>
            <NewReview formValues={this.state.formValues} />
          </div>
          <div className={`col-12 col-sm-6" ${classes.right}`}>
            <MyReviews editReview={this.editFormValues} />
          </div>
        </div>
      </div>
    );
  }

}


class NewReviewBase extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
    this.state = props.formValues;
    this.getAutosuggestInput = this.getAutosuggestInput.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState(props.formValues);
  }

  onSubmit = event => {
    event.preventDefault();

    const { bobaShop, score1, score2, score3, score4, score5, score6, score7, score8, note } = this.state;
    const dateTime = new Date().toLocaleString();
    const userId = this.context.authUser.uid;
    const username = this.context.username;
    const comment = "";

    this.props.firebase
      .bobaShopUserReview(bobaShop, userId)
      .update({
        username,
        score1,
        score2,
        score3,
        score4,
        score5,
        score6,
        score7,
        score8,
        note,
        dateTime,
        comment
      })
      .catch(error => {
        this.setState({ error });
      });

    this.props.firebase
      .userReview(userId, bobaShop)
      .update({
        username,
        score1,
        score2,
        score3,
        score4,
        score5,
        score6,
        score7,
        score8,
        note,
        dateTime,
      })
      .catch(error => {
        this.setState({ error });
      });

    this.props.firebase
      .bobaShop(bobaShop)
      .update({
        bobaShop,
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.notify();
      })
      .catch(error => {
        this.setState({ error });
      });

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeScore = (rating, name) => {
    this.setState({ [name]: rating });
  };

  getAutosuggestInput(value) {
    this.setState({ bobaShop: value })
  }
  getAutoSuggestSelected(value) {
  }

  notify = () => toast("Review added");

  render() {
    const {
      bobaShop,
      score1,
      score2,
      score3,
      score4,
      score5,
      score6,
      score7,
      score8,
      note,
      error,
    } = this.state;

    const scores = [score1, score2, score3, score4, score5, score6, score7, score8];
    const scoreNames = ["Drink Quality:", "Sweet Boba:", "Chewy Boba:", "Customize:", "Consistent:", "Variety:", "Price:", "Overall:"];

    const ratingInputs = []
    for (const [index, value] of scores.entries()) {
      ratingInputs.push(
        <div key={index} className={`row`}>
          <p className={`${classes.scoreReviewHeader}`}>
            {scoreNames[index]}
          </p>
          <div className={`${classes.starRating}`}>
            <StarRatings
              rating={value}
              starRatedColor="#0099ff"
              starHoverColor="#66ccff"
              changeRating={this.onChangeScore}
              numberOfStars={5}
              name={"score" + (index + 1)}
              starDimension="20px"
            /></div>
        </div>
      )
    }

    const isInvalid =
      bobaShop === '' ||
      score1 === '' ||
      score2 === '' ||
      score3 === '' ||
      score4 === '' ||
      score5 === '' ||
      score6 === '' ||
      score7 === '' ||
      score8 === '';

    return (
      <div className={`container ${classes.well}`}>
        <ToastContainer />
        <form onSubmit={this.onSubmit} className={classes.submitForm}>
          <div className={`row`}>
            <div className={`col-xs-12`}>
              <h5>New Review</h5>
              <AutoSuggestShops
                getInputData={this.getAutosuggestInput}
                getSelectedData={this.getAutoSuggestSelected}
                bobaShop={bobaShop} />
            </div>
          </div>

          {ratingInputs}

          <div className={`row`}>
            <textarea name="note"
              value={note}
              onChange={this.onChange}
              type="text"
              placeholder="Note"
              className={`${classes.textarea}`}
            />
          </div>
          <div className={`row`}>
            <button className={`btn btn-primary ${classes.submitButton}`} disabled={isInvalid} type="submit">
              Submit
            </button>
          </div>

          {error && <p>{error.message}</p>}
        </form>
      </div>

    )
  }
}

class MyReviewsBase extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);

    this.state = {
      myReviews: [],
    };
  }

  componentDidMount() {
    this.getReviewList();
  }

  deleteReview(key) {
    var result = window.confirm("Are you sure you want to delete?");
    if (result) {
      this.props.firebase.userReviews(this.context.authUser.uid).child(key).remove();
      this.props.firebase.bobaShopUserReviews(key).child(this.context.authUser.uid).remove();
      this.props.firebase.bobaShops().child(key).remove();
    }
  }

  getReviewList() {
    const userId = this.context.authUser.uid

    this.props.firebase.userReviews(userId).on('value', snapshot => {
      const myReviewsObject = snapshot.val();
      if (myReviewsObject) {
        const myReviewsList = Object.keys(myReviewsObject).map(key => ({
          bobaShop: key,
          ...myReviewsObject[key],
        }))

        this.setState({
          myReviews: myReviewsList,
        });
      } else {
        this.setState({
          myReviews: [],
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.userReviews().off();
  }

  render() {
    const { myReviews } = this.state;
    console.log(myReviews);

    return (
      <div>
        <h5 className={`${classes.rightHeader}`}>
          My Reviews
        </h5>
        {myReviews === undefined || myReviews.length == 0 ?
          <div className={`${classes.noReviewsWell}`}>
            No Reviews Added.
            </div>
          :
          <ul>
            {myReviews.map(review => (
              <li key={review.bobaShop} className={``}>
                <ReviewCard isHomeCard= "true" review={review} editReview={this.props.editReview}
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
    )
  }
}

const condition = authUser => !!authUser;

const NewReview = withFirebase(withAuthorization(condition)(NewReviewBase));
const MyReviews = withFirebase(withAuthorization(condition)(MyReviewsBase));

export default HomePage;
