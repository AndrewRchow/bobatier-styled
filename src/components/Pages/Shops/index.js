import React from 'react';
import { withFirebase } from '../../Firebase';
import classes from './shops.module.css'
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';
import StarRatings from 'react-star-ratings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'




class Shops extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shop: '',
            shopReviews: [],
            shopAverageScore: 1,
            numberOfReviews: 0
        }

        this.getAutosuggestInput = this.getAutosuggestInput.bind(this);
        this.getAutoSuggestSelected = this.getAutoSuggestSelected.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state) {
            const shop = this.props.location.state.shop;
            this.getShopReviews(shop);
        }
    }

    getAutosuggestInput(value) {
    }
    getAutoSuggestSelected(value) {
        this.getShopReviews(value);
    }

    getShopReviews(shop) {
        this.setState({ shop: shop });

        this.props.firebase.bobaShopUserReviews(shop).on('value', snapshot => {
            const shopReviewsObject = snapshot.val();
            console.log(shopReviewsObject);
            if (shopReviewsObject) {
                const shopReviewsList = Object.keys(shopReviewsObject).map(key => ({
                    userid: key,
                    ...shopReviewsObject[key],
                }))

                this.setState({
                    shopReviews: shopReviewsList,
                    numberOfReviews: shopReviewsList.length
                }, () =>{
                    this.gradeReviews();
                });


            } else {
                this.setState({
                    shopReviews: [],
                    numberOfReviews: 0
                })
            }
        })
    }

    gradeReviews() {
        let count = 0;
        let finalScore = 0;
        let score1Total = 0; let score2Total = 0; let score3Total = 0; let score4Total = 0;
        let score5Total = 0; let score6Total = 0; let score7Total = 0; let score8Total = 0;
        for (let review in this.state.shopReviews) {
            let userReview = this.state.shopReviews[review];
            score1Total += userReview.score1;
            score2Total += userReview.score2;
            score3Total += userReview.score3;
            score4Total += userReview.score4;
            score5Total += userReview.score5;
            score6Total += userReview.score6;
            score7Total += userReview.score7;
            score8Total += userReview.score8;
            count++;
        }

        finalScore = (parseFloat(score1Total) + parseFloat(score2Total) + parseFloat(score3Total) + parseFloat(score4Total) +
            parseFloat(score5Total) + parseFloat(score6Total) + parseFloat(score7Total) + parseFloat(score8Total)) / (count * 8);
        finalScore = Math.round(finalScore * 100) / 100
        this.setState({
            shopAverageScore: finalScore
        })
    }

    componentWillUnmount() {
        this.props.firebase.bobaShopUserReviews().off();
    }

    render() {
        const { shop, shopReviews, shopAverageScore, numberOfReviews } = this.state;
        return (
            <div>
                <h5>Shop</h5>
                <AutoSuggestShops
                    getInputData={this.getAutosuggestInput}
                    getSelectedData={this.getAutoSuggestSelected}
                    bobaShop={shop} />


                <div>

                    {shopReviews === undefined || shopReviews.length == 0 ?
                        <div>
                        </div>
                        :
                        <div>
                            <h5>
                                {shop} - {' '}
                            <FontAwesomeIcon icon={faUsers} size="1x" />{numberOfReviews} {' '}
                                <FontAwesomeIcon icon={faStar} size="1x" /> {shopAverageScore}

                            </h5>
                            <ul>
                                {shopReviews.map(review => (
                                    <li key={review.userid} className={`${classes.well}`}>
                                        <div>
                                            <Link to={{ pathname: ROUTES.USERS, state: { userid: review.userid, username: review.username } }}>
                                                {review.username}
                                            </Link>
                                            <div className={`row`}>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 1</p>
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
                                                <div className={`col-sm-3`}>
                                                    <p>Score 2</p>
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
                                                <div className={`col-sm-3`}>
                                                    <p>Score 3</p>
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
                                                <div className={`col-sm-3`}>
                                                    <p>Score 4</p>
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
                                            </div>
                                            <div className={`row`}>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 5</p>
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
                                                <div className={`col-sm-3`}>
                                                    <p>Score 6</p>
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
                                                <div className={`col-sm-3`}>
                                                    <p>Score 7</p>
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
                                                <div className={`col-sm-3`}>
                                                    <p>Score 8</p>
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
                                                <div className={`col-sm-12`}>
                                                    <p>{review.note}</p>
                                                </div>
                                            </div>
                                        </div>
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

export default withFirebase(Shops);