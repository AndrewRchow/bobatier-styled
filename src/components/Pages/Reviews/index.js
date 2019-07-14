import React from 'react';
import { withFirebase } from '../../Firebase';
import { withAuthorization, AuthUserContext } from '../../Session';
import classes from './review.module.css';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import StarRatings from 'react-star-ratings';
import Modal from './reviewModal';
import ReviewCard from '../../Partials/ReviewCard'

const dateOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'short', day: 'numeric' };

class Reviews extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            reviews: {},
            sortedReviews: [],
            sortedReviewsCopy: [],
            commentModal: {
                comment: "",
                shop: "",
                uid: ""
            },
            modalIsOpen: false,
            currentTime: new Date(),
        }

        this.submitComment = this.submitComment.bind(this);
        this.changeComment = this.changeComment.bind(this);
    }

    componentDidMount() {
        this.getAllReviewList();
        this.interval = setInterval(() => this.setState({ currentTime: new Date() }), 1000);
    }

    getAllReviewList() {
        this.props.firebase.bobaShopReviews().on('value', snapshot => {
            const reviewsObject = snapshot.val();
            if (reviewsObject) {
                this.setState({
                    reviews: reviewsObject,
                }, () => {
                    this.sortReviews();
                });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.bobaShopReviews().off();
        clearInterval(this.interval);
    }


    sortReviews() {
        let sortedReviews = [];
        for (let shop in this.state.reviews) {
            for (let uid in this.state.reviews[shop]) {
                let review = {
                    ...this.state.reviews[shop][uid],
                    shop: shop,
                    uid: uid,
                };
                if (review.comments) {

                    review.comments = Object.keys(review.comments).map(key => ({
                        ...review.comments[key],
                        uid: key,
                    }));
                    review.comments.sort(function (a, b) {
                        return new Date(a.dateTime) - new Date(b.dateTime);
                    });
                }
                sortedReviews.push(review);
            }
        }
        sortedReviews.sort(function (a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
        });
        console.log(sortedReviews);
        sortedReviews = sortedReviews.splice(0, 50); //show top 50 reviews
        this.setState({ sortedReviews: sortedReviews });
    }

    toggleModal = (shop, uid) => {
        const commentModal = { ...this.state.commentModal };
        commentModal.shop = shop;
        commentModal.uid = uid;

        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            commentModal: commentModal
        });
    }

    changeComment = event => {
        const commentModal = { ...this.state.commentModal };
        commentModal.comment = event.target.value;

        this.setState({
            commentModal: commentModal
        });
    };

    submitComment(shop, uid) {
        const comment = this.state.commentModal.comment;
        const username = this.context.username;
        let dateTime = new Date();
        dateTime.setSeconds(dateTime.getSeconds() + 3);
        dateTime = dateTime.toLocaleString();

        this.props.firebase
            .bobaShopUserComment(shop, uid)
            .push({
                comment,
                username,
                uid,
                dateTime
            })
            .then(() => {
                this.setState({
                    modalIsOpen: !this.state.modalIsOpen,
                    ommentModal: {
                        comment: "",
                        shop: "",
                        uid: ""
                    }
                });
            });
    }

    render() {
        const { sortedReviews, currentTime } = this.state;
        const authUser = this.context.username;
        console.log(sortedReviews);


        const inlineStyle = {
            fontSize: '0.9rem'
        };

        return (
            <div>
                <div className={`container ${classes.recentReviews}`}>
                    {sortedReviews === undefined || sortedReviews.length == 0 ?
                        <div className={`${classes.reviewWell}`}>
                            No Recent Reviews.
            </div>
                        :
                        <div>
                            {sortedReviews.map((review, index) => (
                                <div key={index}>
                                    <div className={`${classes.review} ${classes.reviewWell}`}>
                                        <ReviewCard isReviewsCard="true" dateTime={review.dateTime}
                                            userid={review.userid} username={review.username}
                                            shop={review.shop} note={review.note}
                                            score1={review.score1} score2={review.score2}
                                            score3={review.score3} score4={review.score4}
                                            score5={review.score5} score6={review.score6}
                                            score7={review.score7} score8={review.score8} />
                                    </div>
                                    {
                                        review.comments ?
                                            <div className={`${classes.commentsWell}`}>
                                                <div>
                                                    {review.comments.map((comment, index) => (
                                                        <div key={index} className={`${classes.commentWell}`}>
                                                            <div className={(comment.dateTime > currentTime.toLocaleString() ? classes.recentComment : "")}>
                                                                <p>{comment.username} <span className={`${classes.commentText}`}>{comment.comment}</span></p>
                                                                <p className={`${classes.dateTime}`}><i> {new Date(comment.dateTime).toLocaleDateString("en-US", dateOptions)}</i></p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    {
                                                        authUser ?
                                                            <button className={`btn btn-info ${classes.addCommentButton}`} onClick={() => this.toggleModal(review.shop, review.uid)}>
                                                                Comment
                                                            </button>
                                                            : <div></div>
                                                    }

                                                </div>
                                            </div>
                                            :
                                            authUser ?
                                                <div className={`${classes.commentsWell}`}>
                                                    <button className={`btn btn-info ${classes.addCommentButton}`} onClick={() => this.toggleModal(review.shop, review.uid)}>
                                                        Comment
                                                            </button>
                                                </div>
                                                :
                                                <div></div>
                                    }
                                </div>
                            ))}
                        </div>
                    }
                </div>
                <Modal show={this.state.modalIsOpen}
                    onClose={this.toggleModal}
                    commentModal={this.state.commentModal}
                    changeComment={this.changeComment}
                    submitComment={this.submitComment}>
                    Add a comment
                </Modal>
            </div>
        );
    }
}

// const condition = authUser => !!authUser;
// export default withFirebase(withAuthorization(condition)(Reviews));
export default withFirebase(Reviews);



// {
//     element.comments ?
//         <div>
//             <button onClick={() => this.viewComments(index)}>v</button>
//         </div>
//         :
//         <div>
//             <button onClick={() => this.addComment(index)}>a</button>
//         </div>
// }
// {
//     element.displayAddComment ?
//         <div>
//             <input name="comment" type="text" onChange={this.onChange} placeholder="Add comment" />
//             <button onClick={() => this.submitComment(element.shop, element.uid)}>a</button>
//         </div>
//         :
//         <div></div>
// }
// {
//     element.displayAllComments ?
//         <div>
//             <div>
//                 {element.comments.map((element, index) => (
//                     <div key={index}>
//                         {element.comment} - {element.username}
//                     </div>
//                 ))}
//             </div>
//             <div>
//                 <input name="comment" type="text" onChange={this.onChange} placeholder="Add comment" />
//                 <button onClick={() => this.submitComment(element.shop, element.uid)}>a</button>
//             </div>
//         </div>
//         :
//         <div></div>
// }