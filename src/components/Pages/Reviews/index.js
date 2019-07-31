import React from 'react';
import { withFirebase } from '../../Firebase';
import { withAuthorization, AuthUserContext } from '../../Session';
import classes from './review.module.css';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import StarRatings from 'react-star-ratings';
import Modal from './reviewModal';
import ReviewCommentsCard from '../../Partials/ReviewCommentsCard'

import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';

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
                shop: "",
                uid: ""
            },
            modalIsOpen: false,
            currentTime: new Date(),
            loading: true,
            contextUid: "",
            contextUsername: ""

        }
    }

    componentDidMount() {
        if (this.context.authUser != null) {
            this.setState({
                contextUid: this.context.authUser.uid,
                contextUsername: this.context.username
            });
        }
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
                this.setState({
                    reviews: reviewsObject,
                }, () => {
                    this.sortReviews();
                });
            }
            this.setState({
                loading: false
            });
        });
    }

    sortReviews = () => {
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
        const commentModal = { ...this.state.commentModal };
        commentModal.shop = shop;
        commentModal.uid = uid;

        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            commentModal: commentModal
        });
    }

    submitComment = (shop, uid, comment) => {
        const { contextUid, contextUsername } = this.state;

        let dateTime = new Date();
        // dateTime.setSeconds(dateTime.getSeconds() + 3);
        dateTime = dateTime.toLocaleString();

        this.props.firebase
            .bobaShopUserComment(shop, uid)
            .push({
                comment,
                username: contextUsername,
                uid: contextUid,
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
        const { sortedReviews, currentTime, loading, contextUsername } = this.state;
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
                    {!loading && (sortedReviews === undefined || sortedReviews.length == 0) ?
                        <div className={`${classes.reviewWell}`}>
                            No Recent Reviews.
            </div>
                        :
                        <div>
                            {sortedReviews.map((review, index) => (
                                <div key={index}>
                                    <div className={`${classes.reviewWell}`}>
                                        <ReviewCommentsCard toggleModal={this.toggleModal}
                                            currentTime={currentTime} dateTime={review.dateTime} authUser={contextUsername}
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
                    toggleModal={this.toggleModal}
                    commentModal={this.state.commentModal}
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
