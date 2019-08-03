import React from 'react';
import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';
import classes from './review.module.css';

import ReviewCard from '../../Partials/ReviewCard'
import AddCommentModal from '../../Partials/AddCommentModel';


import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';

const dateOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'short', day: 'numeric' };

class Reviews extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            reviews: {},
            reviews: [],
            currentTime: new Date(),
            loading: true,

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

            this.props.firebase.user(this.context.authUser.uid)
                .update({
                    reviewsLastVisit: new Date().toLocaleString()
                });
        }
        // this.props.updateNewReviews(11);
        this.getAllReviewList();
        // this.interval = setInterval(() => this.setState({ currentTime: new Date() }), 1000);
    }

    componentWillUnmount() {
        this.props.firebase.bobaShopReviews().off();
        // clearInterval(this.interval);
    }

    getAllReviewList = () => {
        this.props.firebase.bobaShopReviews().on('value', snapshot => {
            const reviewsObject = snapshot.val();
            if (reviewsObject) {
                this.sortReviews(reviewsObject);
            }
            this.setState({
                loading: false
            });
        });
    }

    sortReviews = (reviewsObject) => {
        let sortedReviews = [];
        for (let shop in reviewsObject) {
            for (let uid in reviewsObject[shop]) {
                let review = {
                    ...reviewsObject[shop][uid],
                    bobaShop: shop,
                    userid: uid,
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
        sortedReviews = sortedReviews.splice(0, 25); //show top 50 reviews
        this.setState({ reviews: sortedReviews });
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

    render() {
        const { reviews, loading, contextUsername, contextUid } = this.state;
        const override = css`
            display: block;
            margin: 150px auto;
        `;

        return (
            <div className='container'>
                <div className={`row`}>
                    <div className={`col-lg-12`} style={{ marginLeft: '12px' }}>
                        <h4>Recent Reviews</h4>
                    </div>
                </div>
                <div className='sweet-loading'>
                    <ClipLoader
                        sizeUnit={"px"}
                        css={override}
                        size={70}
                        color={'#61aceb'}
                        loading={this.state.loading}
                    />
                </div>
                <div className={`${classes.recentReviews}`}>
                    {!loading && (reviews === undefined || reviews.length == 0) ?
                        <div className={`${classes.reviewWell}`}>
                            No Recent Reviews.
            </div>
                        :
                        <div>
                            {reviews.map((review, index) => (
                                <div key={index}>
                                    <div className={`${classes.reviewWell}`}>
                                        <ReviewCard
                                            toggleCommentModal={this.toggleCommentModal} authUsername={contextUsername} authUid={contextUid}
                                            review={review} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>

                <AddCommentModal show={this.state.commentModal.isOpen}
                    toggleCommentModal={this.toggleCommentModal}
                    commentModal={this.state.commentModal}>
                    Add a comment
                </AddCommentModal>
            </div>
        );
    }
}

// const condition = authUser => !!authUser;
// export default withFirebase(withAuthorization(condition)(Reviews));
export default withFirebase(Reviews);
