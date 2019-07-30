import React, { Component } from 'react';
import classes from './reviewCommentsCard.module.css';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'

const dateOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'short', day: 'numeric' };

class ReviewCommentsCard extends Component {
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

        return (
            <div className={`${classes.reviewCard}`}>
                <h4>
                <Link className={`${classes.headerLink}`} to={{ pathname: ROUTES.SHOPS, state: { shop: this.props.shop } }}>
                    {this.props.shop}
                </Link>
                {this.props.shop != undefined && this.props.username != undefined ?
                    <div style={inlineStyle}>-</div>
                    : <div></div>}
                <Link className={`${classes.headerLink}`} to={{ pathname: ROUTES.MEMBERS, state: { userid: this.props.uid, username: this.props.username } }}>
                {this.props.username}
                </Link>
                </h4>
                <div className={`row ${classes.borderTop}`}>
                    <div className={`col-4 col-lg-3 ${classes.scoreLine}`}>
                        <p className={classes.scoreHeader}>Drink Quality</p>
                        <StarRatings
                            rating={this.props.score1}
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
                            rating={this.props.score2}
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
                            rating={this.props.score3}
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
                            rating={this.props.score4}
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
                            rating={this.props.score5}
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
                            rating={this.props.score6}
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
                            rating={this.props.score7}
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
                            rating={this.props.score8}
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
                        <p>{this.props.note}  <span style={{fontStyle:'italic'}}>{new Date(this.props.dateTime).toLocaleDateString("en-US", dateOptions)}</span></p>
                    </div>
                </div>
                <div className={`${classes.comments}`}>
                    {
                        this.props.comments ?
                            <div className={`${classes.commentsWell}`}>
                                <div>
                                    {this.props.comments.map((comment, index) => (
                                        <div key={index} className={`${classes.commentWell}`}>
                                            <div className={`${classes.commentText}`}>
                                                <p>{comment.username} <span style={normal}>{comment.comment}</span></p>
                                                <p className={`${classes.dateTime}`}><i> {new Date(comment.dateTime).toLocaleDateString("en-US", dateOptions)}</i></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    {
                                        this.props.authUser ?
                                            <button className={`btn btn-primary ${classes.addCommentButton}`} onClick={() => this.props.toggleModal(this.props.shop, this.props.uid)}>
                                                <FontAwesomeIcon icon={faCommentDots}
                                                    className={`${classes.addIcon}`} size="2x" />
                                            </button>
                                            : <div></div>
                                    }

                                </div>
                            </div>
                            :
                            this.props.authUser ?
                                <div className={`${classes.commentsWell}`}>
                                    <button className={`btn btn-primary ${classes.addCommentButton}`} onClick={() => this.props.toggleModal(this.props.shop, this.props.uid)}>
                                        <FontAwesomeIcon icon={faCommentDots}
                                            className={`${classes.addIcon}`} size="2x" />
                                    </button>
                                </div>
                                :
                                <div></div>
                    }
                </div>
            </div>
        );
    }
}


export default ReviewCommentsCard;

