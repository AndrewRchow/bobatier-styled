import React from 'react';
import { withFirebase } from '../../Firebase';
import classes from './shops.module.css'
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';
import StarRatings from 'react-star-ratings';
import ReviewCard from '../../Partials/ReviewCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faImage } from '@fortawesome/free-solid-svg-icons'
import { faImages } from '@fortawesome/free-solid-svg-icons'

import { ReactComponent as Logo } from '../../../media/images/coffee.svg';

class Shops extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shop: '',
            shopReviews: [],
            shopAverageScore: 1,
            numberOfReviews: 0
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            const shop = this.props.location.state.shop;
            this.getShopReviews(shop);
        }
    }
    componentWillUnmount() {
        this.props.firebase.bobaShopUserReviews().off();
    }

    getAutosuggestInput = (value) => {
    }
    getAutoSuggestSelected = (value) => {
        this.getShopReviews(value);
    }

    getShopReviews = (shop) => {
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
                }, () => {
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

    gradeReviews = () => {
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

    render() {
        const { shop, shopReviews, shopAverageScore, numberOfReviews } = this.state;
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

                    {shopReviews === undefined || shopReviews.length == 0 ?
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
                                {shopReviews.map(review => (
                                    <li key={review.userid} className={`${classes.well}`}>
                                        <ReviewCard userid={review.userid} username={review.username} note={review.note}
                                            score1={review.score1} score2={review.score2}
                                            score3={review.score3} score4={review.score4}
                                            score5={review.score5} score6={review.score6}
                                            score7={review.score7} score8={review.score8} />
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