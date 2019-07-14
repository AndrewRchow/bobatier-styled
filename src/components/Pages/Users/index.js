import React from 'react';
import { withFirebase } from '../../Firebase';
import classes from './users.module.css'
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import AutoSuggestUsers from '../../ThirdParty/AutoSuggestUsers/index';
import ReviewCard from '../../Partials/ReviewCard'
import StarRatings from 'react-star-ratings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            userReviews: [],
            numberOfReviews: 0
        }

        this.getAutosuggestInput = this.getAutosuggestInput.bind(this);
        this.getAutoSuggestSelected = this.getAutoSuggestSelected.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state) {
            console.log(userid, username);
            const userid = this.props.location.state.userid;
            const username = this.props.location.state.username;
            this.getUserReviews(userid, username);
        }
    }

    getAutosuggestInput(value) {
    }
    getAutoSuggestSelected(value) {
        this.getUserReviews(value.userid, value.username);
    }

    getUserReviews(userid, username) {
        this.setState({ user: username });

        this.props.firebase.userReviews(userid).on('value', snapshot => {
            const userReviewsObject = snapshot.val();
            if (userReviewsObject) {
                const userReviewsList = Object.keys(userReviewsObject).map(key => ({
                    shop: key,
                    ...userReviewsObject[key],
                }))
                this.setState({
                    userReviews: userReviewsList,
                    numberOfReviews: userReviewsList.length
                });
            } else {
                this.setState({
                    userReviews: [],
                    numberOfReviews: 0
                })
            }
        });
    }

    render() {
        const { user, userReviews, numberOfReviews } = this.state;
        console.log(user);

        return (
            <div className={`container`}>
                <div className={`row`}>
                    <div className={`col-lg-12`}>
                        <h5>Members</h5>
                    </div>
                </div>
                <div className={`row`}>
                    <div className={`col-lg-12`}>
                        <AutoSuggestUsers
                            getInputData={this.getAutosuggestInput}
                            getSelectedData={this.getAutoSuggestSelected}
                            user={user} />
                    </div>
                </div>

                <div>

                    {userReviews === undefined || userReviews.length == 0 ?
                        <div>
                        </div>
                        :
                        <div>
                            <h5 className={`${classes.info}`}>
                                {user} -  <FontAwesomeIcon icon={faCoffee} size="1x" />{numberOfReviews}
                            </h5>
                            <ul>
                                {userReviews.map(review => (
                                    <li key={review.shop} className={`${classes.well}`}>
                                        <ReviewCard shop={review.shop} note={review.note}
                                            score1={review.score1} score2={review.score2}
                                            score3={review.score3} score4={review.score4}
                                            score5={review.score5} score6={review.score6}
                                            score7={review.score7} score8={review.score8} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default withFirebase(Users);