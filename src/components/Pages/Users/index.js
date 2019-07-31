import React from 'react';
import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';
import classes from './users.module.css'
import * as ROUTES from '../../../constants/routes';
import AutoSuggestUsers from '../../ThirdParty/AutoSuggestUsers/index';
import ReviewCard from '../../Partials/ReviewCard'
import AddCommentModal from '../../Partials/AddCommentModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as Logo } from '../../../media/images/people.svg';

class Users extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            user: '',
            reviews: [],
            numberOfReviews: 0,

            contextUid: "",
            contextUsername: "",
            commentModal: {
                bobaShop: "",
                uid: "",
                contextUid: "",
                contextUsername: "",
                isOpen: false
            }
        }
    }

    componentDidMount() {
        if (this.context.authUser != null) {
            this.setState({
                contextUid: this.context.authUser.uid,
                contextUsername: this.context.username
            });
        }
        if (this.props.location.state) {
            const userid = this.props.location.state.userid;
            const username = this.props.location.state.username;
            this.getUserReviews(userid, username);
        }
    }
    componentWillUnmount() {
        this.props.firebase.userReviews().off();
        this.setState({
            contextUid: '',
            contextUsername: ''
        });
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

    getAutosuggestInput = (value) => {
    }
    getAutoSuggestSelected = (value) => {
        this.getUserReviews(value.userid, value.username);
    }

    getUserReviews = (userid, username) => {
        this.props.firebase.userReviews(userid).on('value', snapshot => {
            const userReviewsObject = snapshot.val();
            if (userReviewsObject) {
                const userReviewsList = Object.keys(userReviewsObject).map(key => ({
                    bobaShop: key,
                    userid: userid,
                    ...userReviewsObject[key],
                }))
                this.setState({
                    numberOfReviews: userReviewsList.length,
                    user: username
                }, () => {
                    this.sortReviews(userReviewsList);
                });
            } else {
                this.setState({
                    numberOfReviews: 0,
                    user: username,
                    reviews: [],
                })
            }
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

    render() {
        const { user, reviews, numberOfReviews, contextUid, contextUsername } = this.state;
        console.log(reviews);

        return (
            <div className='container'>
                <div className={`row`}>
                    <div className={`col-lg-12 ${classes.header}`}>
                        <h4>Members</h4>
                    </div>
                </div>
                <div className={`row`}>
                    <div className={`col-lg-12 ${classes.header}`}>
                        <AutoSuggestUsers
                            getInputData={this.getAutosuggestInput}
                            getSelectedData={this.getAutoSuggestSelected}
                            user={user} />
                    </div>
                </div>

                <div>

                    {reviews === undefined || reviews.length == 0 ?

                        <div>
                            {ROUTES.DEVELOP == false ?
                                <Logo className={classes.svg} />
                                : <div></div>}
                        </div>
                        :
                        <div>
                            <h4 className={`${classes.info}`}>
                                {user}  <FontAwesomeIcon icon={faCoffee} size="1x" /> {numberOfReviews}
                            </h4>
                            <ul>
                                {reviews.map(review => (
                                    <li key={review.bobaShop} className={`${classes.well}`}>
                                        <ReviewCard
                                            toggleCommentModal={this.toggleCommentModal} authUsername={contextUsername} authUid={contextUid}
                                            review={review} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>

                <AddCommentModal show={this.state.commentModal.isOpen}
                    toggleCommentModal={this.toggleCommentModal}
                    commentModal={this.state.commentModal}>
                    Add a comment
                </AddCommentModal>
            </div>
        )
    }
}

export default withFirebase(Users);