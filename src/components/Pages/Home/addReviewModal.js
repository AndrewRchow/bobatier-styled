import React from 'react';
import classes from './home.module.css';
import { withFirebase } from '../../Firebase';

import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';
import AutoSuggestLocations from '../../ThirdParty/AutoSuggestLocations/index';
import StarRatings from 'react-star-ratings';

class AddReviewModal extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef()

        this.state = props.formValues;
    }

    handleContainerClick = (e) => {
        if (this.node.contains(e.target)) {
            return;
        }
        this.props.toggleModal();
    }

    componentWillReceiveProps(props) {
        this.setState(props.formValues);

        const bobaShopAndLocation = props.formValues.bobaShop;
        const shop = bobaShopAndLocation.substr(0, bobaShopAndLocation.indexOf('(') - 1);
        const location = bobaShopAndLocation.substring(
            bobaShopAndLocation.lastIndexOf("(") + 1,
            bobaShopAndLocation.lastIndexOf(")")
        );

        this.setState({
            bobaShop: shop,
            location: location
        });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeScore = (rating, name) => {
        this.setState({ [name]: rating });
    };

    getAutosuggestShopInput = (value) => {
        this.setState({ bobaShop: value })
    }
    getAutoSuggestShopSelected= (value) => {
        const shop = value.substr(0, value.indexOf('(') - 1);
        const location = value.substring(
            value.lastIndexOf("(") + 1,
            value.lastIndexOf(")")
        );
        this.setState({
            bobaShop: shop,
            location: location
        });
    }
    getAutosuggestLocationInput= (value) => {
        this.setState({ location: value })
    }
    getAutoSuggestLocationSelected= (value) => {
        this.setState({ location: value });
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        // The gray background
        const backdropStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight:'100vh',
            overflowY:'auto',
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: '40px 20px'
        };

        const {
            bobaShop, location,
            score1, score2, score3, score4,
            score5, score6, score7, score8,
            note, error,
        } = this.state;
        const scores = [score1, score2, score3, score4, score5, score6, score7, score8];
        const scoreNames = ["Drink Quality:", "Sweet Boba:", "Chewy Boba:", "Customize:", "Consistent:", "Variety:", "Price:", "Overall:"];

        const ratingInputs = []
        for (const [index, value] of scores.entries()) {
            ratingInputs.push(
                <div key={index} className={classes.scoreRow}>
                    <p className={`${classes.scoreReviewHeader}`}>
                        {scoreNames[index]}
                    </p>
                    <div className={`${classes.starRating}`}>
                        <StarRatings
                            rating={value}
                            starRatedColor="#0099ff"
                            starHoverColor="#66ccff"
                            changeRating={this.onChangeScore}
                            numberOfStars={5}
                            name={"score" + (index + 1)}
                            starDimension="20px"
                            style={{padding:0}}
                        /></div>
                </div>
            )
        }

        const isInvalid =
            bobaShop === '' || location === '' ||
            // bobaShop.indexOf('(') > -1 ||
            // bobaShop.indexOf(')') > -1 ||
            score1 === '' || score2 === '' || score3 === '' || score4 === '' ||
            score5 === '' || score6 === '' || score7 === '' || score8 === '';

        return (
            <div style={backdropStyle} onClick={this.handleContainerClick}>
                <div ref={node => this.node = node} className={`${classes.addReview}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Review</h5>
                            <button type="button" className="close" onClick={this.props.toggleModal} aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className={`modal-body ${classes.addReviewBody}`}>
                            <AutoSuggestShops
                                getInputData={this.getAutosuggestShopInput}
                                getSelectedData={this.getAutoSuggestShopSelected}
                                bobaShop={bobaShop} />
                            <AutoSuggestLocations
                                getInputData={this.getAutosuggestLocationInput}
                                getSelectedData={this.getAutoSuggestLocationSelected}
                                location={location} />

                            {ratingInputs}

                            <textarea name="note"
                                value={note}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Note"
                                className={`form-control ${classes.textarea}`}
                            />
                        </div>
                        <div className="modal-footer">
                            <button className={`btn btn-primary ${classes.submitButton}`} disabled={isInvalid}
                                onClick={() => this.props.submitReview(this.state)} >
                                Add review
                                     </button>
                            {error && <p>{error.message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withFirebase(AddReviewModal);



{/* <input name="location"
                  value={location}
                  onChange={this.onChange}
                  type="text"
                  className={`${classes.locationInput}`}
                  placeholder="Enter location" /> */}