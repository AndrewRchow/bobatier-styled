import React, { Component } from 'react';
import classes from './reviewCard.module.css';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

const dateOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'short', day: 'numeric' };

class ReviewCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const inlineStyle={
            display:"inline",
            paddingLeft:"4px",
            paddingRight:"4px"
        }

        return (
            <div className={`${classes.reviewCard}`}>
                <Link className={`${classes.headerLink}`} to={{ pathname: ROUTES.SHOPS, state: { shop: this.props.shop } }}>
                    {this.props.shop}
                </Link>
                {this.props.shop != undefined && this.props.username != undefined ?
                    <div style={inlineStyle}>-</div>
                    : <div></div>}
                <Link className={`${classes.headerLink}`} to={{ pathname: ROUTES.USERS, state: { userid: this.props.userid, username: this.props.username } }}>
                    {this.props.username}
                </Link>
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
                        <p>{this.props.note}</p>
                    </div>
                </div>

                {this.props.isHomeCard ?
                    <div>
                        <button className={`btn btn-info ${classes.updateButton}`} onClick={() => this.props.editReview(this.props.review)}>Edit</button>
                        <button className={`btn btn-danger ${classes.updateButton}`} onClick={() => this.deleteReview(this.props.bobaShop)}>Delete</button>
                    </div>
                    : <div></div>}

                {this.props.isReviewsCard ?
                    <div className={`${classes.dateTime}`}>
                        <i> {new Date(this.props.dateTime).toLocaleDateString("en-US", dateOptions)}</i>
                    </div>
                    : <div></div>}
            </div>
        );
    }
}


export default ReviewCard;

