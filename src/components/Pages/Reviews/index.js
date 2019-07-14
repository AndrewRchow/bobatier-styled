import React from 'react';
import { withFirebase } from '../../Firebase';
import { withAuthorization, AuthUserContext } from '../../Session';
import classes from './review.module.css';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import StarRatings from 'react-star-ratings';
import Modal from './reviewModal';
import ReviewCommentsCard from '../../Partials/ReviewCommentsCard'

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
        this.toggleModal = this.toggleModal.bind(this);

    }

    componentDidMount() {
        this.getAllReviewList();
        // this.interval = setInterval(() => this.setState({ currentTime: new Date() }), 1000);
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
        sortedReviews = sortedReviews.splice(0, 50); //show top 50 reviews
        this.setState({ sortedReviews: sortedReviews });
    }

    toggleModal = (shop, uid) => {
        console.log(shop, uid)
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
                                    <div className={`${classes.reviewWell}`}>
                                        <ReviewCommentsCard toggleModal={this.toggleModal} 
                                        currentTime={currentTime} dateTime={review.dateTime} authUser={authUser}
                                        uid={review.uid} username={review.username}
                                            shop={review.shop} note={review.note}
                                            score1={review.score1} score2={review.score2}
                                            score3={review.score3} score4={review.score4}
                                            score5={review.score5} score6={review.score6}
                                            score7={review.score7} score8={review.score8}
                                            comments={review.comments} />

                                    </div>


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