import React from 'react';
import { withFirebase } from '../../Firebase';
import { AuthUserContext } from '../../Session';
import classes from './shops.module.css'
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';
import ReviewCard from '../../Partials/ReviewCard'
import AddCommentModal from '../../Partials/AddCommentModel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faImage } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as Logo } from '../../../media/images/coffee.svg';

class Shops extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            shop: '',
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
            const shop = this.props.location.state.shop;
            this.getShopReviews(shop);
        }
    }
    componentWillUnmount() {
        this.props.firebase.bobaShopUserReviews().off();
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
        this.getShopReviews(value);
    }

    getShopReviews = (shop) => {
        this.props.firebase.bobaShopUserReviews(shop).on('value', snapshot => {
            const shopReviewsObject = snapshot.val();
            if (shopReviewsObject) {
                const shopReviewsList = Object.keys(shopReviewsObject).map(key => ({
                    userid: key,
                    ...shopReviewsObject[key],
                }))

                this.setState({
                    numberOfReviews: shopReviewsList.length,
                    shop: shop
                }, () => {
                    this.sortReviews(shopReviewsList);
                });
            } else {
                this.setState({
                    numberOfReviews: 0,
                    shop: shop,
                    reviews: []
                })
            }
        })
    }

    sortReviews = (reviews) => {
        let sortedReviews = [];
        for (let user in reviews) {
            let review = {
                ...reviews[user],
                bobaShop: this.state.shop
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

    // gradeReviews = () => {
    //     let count = 0;
    //     let finalScore = 0;
    //     let score1Total = 0; let score2Total = 0; let score3Total = 0; let score4Total = 0;
    //     let score5Total = 0; let score6Total = 0; let score7Total = 0; let score8Total = 0;
    //     for (let review in this.state.shopReviews) {
    //         let userReview = this.state.shopReviews[review];
    //         score1Total += userReview.score1;
    //         score2Total += userReview.score2;
    //         score3Total += userReview.score3;
    //         score4Total += userReview.score4;
    //         score5Total += userReview.score5;
    //         score6Total += userReview.score6;
    //         score7Total += userReview.score7;
    //         score8Total += userReview.score8;
    //         count++;
    //     }

    //     finalScore = (parseFloat(score1Total) + parseFloat(score2Total) + parseFloat(score3Total) + parseFloat(score4Total) +
    //         parseFloat(score5Total) + parseFloat(score6Total) + parseFloat(score7Total) + parseFloat(score8Total)) / (count * 8);
    //     finalScore = Math.round(finalScore * 100) / 100
    //     this.setState({
    //         shopAverageScore: finalScore
    //     })
    // }

    render() {
        const { shop, reviews, numberOfReviews, contextUsername, contextUid } = this.state;

        return (
            <div className='container'>
                <div className={`row`}>
                    <div className={`col-lg-12 ${classes.header}`}>
                        <h4>Shops</h4>
                    </div>
                </div>
                <div className={`row`}>
                    <div className={`col-lg-12 ${classes.header}`}>
                        <AutoSuggestShops
                            getInputData={this.getAutosuggestInput}
                            getSelectedData={this.getAutoSuggestSelected}
                            bobaShop={shop} />
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
                        <div style={{ marginTop: '10px' }}>
                            <h4 className={`${classes.info}`} style={{ display: 'inline' }}>
                                {shop}
                            </h4>
                            <h4 className={`${classes.info}`} style={{ display: 'inline-block' }}>
                                <FontAwesomeIcon icon={faUsers} size="1x" style={{ verticalAlign: 'middle' }} />{numberOfReviews} {' '}
                                <Link to={{ pathname: ROUTES.PHOTOS, state: { shop: shop } }} style={{ paddingLeft: '20px' }}>
                                    <button className={`btn btn-primary ${classes.imageIcon}`}>
                                        <FontAwesomeIcon icon={faImage} size="2x" />
                                    </button>
                                </Link>
                            </h4>
                            <ul>
                                {reviews.map(review => (
                                    <li key={review.userid} className={`${classes.well}`}>
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

export default withFirebase(Shops);