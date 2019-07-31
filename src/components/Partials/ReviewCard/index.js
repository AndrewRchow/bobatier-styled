import React, { Component } from 'react';
import classes from './reviewCard.module.css';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'

// const dateOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'short', day: 'numeric' };

class ReviewCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const normal = {
            fontWeight: "normal"
        }

        const inlineStyle = {
            display: "inline",
            paddingLeft: "4px",
            paddingRight: "4px"
        }

        let review = this.props.review;

        return (
            <div className={`${classes.reviewCard}`}>
                <h4>
                    <Link className={`${classes.headerLink}`} to={{ pathname: ROUTES.SHOPS, state: { shop: review.bobaShop } }}>
                        {review.bobaShop}
                    </Link>
                    {' '} - {' '}
                <Link className={`${classes.headerLink}`} to={{ pathname: ROUTES.MEMBERS, state: { userid: review.userid, username: review.username } }}>
                        {review.username}
                    </Link>
                </h4>
                <div className={`row ${classes.borderTop}`}>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Drink Quality</p>
                        <StarRatings
                            rating={review.score1}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Sweet Boba</p>
                        <StarRatings
                            rating={review.score2}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Chewy Boba</p>
                        <StarRatings
                            rating={review.score3}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Customize</p>
                        <StarRatings
                            rating={review.score4}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Consistent</p>
                        <StarRatings
                            rating={review.score5}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Variety</p>
                        <StarRatings
                            rating={review.score6}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Price</p>
                        <StarRatings
                            rating={review.score7}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Overall</p>
                        <StarRatings
                            rating={review.score8}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            numberOfStars={5}
                            name="score1"
                            starDimension="12px"
                            starSpacing="2px"
                            isSelectable="false"
                        />
                    </div>
                </div>
                <div className={`row`}>
                    <div className={`col-sm-12 ${classes.note}`}>
                        <p>{review.note}</p>
                    </div>
                </div>

                {this.props.isHomeCard ?
                    <div>
                        <button className={`btn btn-info ${classes.updateButton}`} onClick={() => this.props.editReview(review)}>Edit</button>
                        <button className={`btn btn-danger ${classes.updateButton}`} onClick={() => this.props.deleteReview(review.bobaShop)}>Delete</button>
                    </div>
                    : <div></div>}

                <div className={`${classes.comments}`}>
                    {
                        review.comments ?
                            <div className={`${classes.commentsWell}`}>
                                {review.comments.map((comment, index) => (
                                    <div key={index} className={`${classes.commentWell}`}>
                                        <div className={`${classes.commentText}`}>
                                            <p>{comment.username} <span style={normal}>{comment.comment}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            : <div></div>
                    }
                    {
                        this.props.authUsername ?
                            <button className={`btn btn-primary ${classes.addCommentButton}`}
                                onClick={() => this.props.toggleCommentModal(review.bobaShop, this.props.authUid, this.props.authUsername)}>
                                <FontAwesomeIcon icon={faCommentDots}
                                    className={`${classes.addIcon}`} size="2x" />
                            </button>
                            : <div></div>
                    }
                </div>
            </div>
        );
    }
}


export default ReviewCard;

