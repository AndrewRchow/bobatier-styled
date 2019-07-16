import React from 'react';
import classes from './photos.module.css';
import { withAuthorization, AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import FileUploader from "react-firebase-file-uploader";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';



class Photos extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            shop: "",
            photoNames: [],
            photos: [],

            files: ""

        }

        this.getAutosuggestInput = this.getAutosuggestInput.bind(this);
        this.getAutoSuggestSelected = this.getAutoSuggestSelected.bind(this);
    }

    componentDidMount() {
        // this.props.firebase.bobaShopImage("Ding Tea (Rowland Heights)", "70f2696e-5343-4980-bc58-e4bca378749a.PNG")
        //     .getDownloadURL().then(url => { this.setState({ files: url }) });
    }

    componentWillUnmount() {
    }

    getAutosuggestInput(value) {
    }
    getAutoSuggestSelected(value) {
        this.setState({
            shop: value
        }, () => {
            this.getShopPhotoNames();
        });
    }

    getShopPhotoNames() {
        // items.forEach(function(item){
        //     copy.push(item);
        //   });
        // this.props.firebase.bobaShopImage("Ding Tea (Rowland Heights)", "70f2696e-5343-4980-bc58-e4bca378749a.PNG")
        //     .getDownloadURL().then(url => { this.setState({ files: url }) });
    }

    // handleChangeUsername = event =>
    //     this.setState({ username: event.target.value });
    // handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    // handleProgress = progress => this.setState({ progress });
    // handleUploadError = error => {
    //     this.setState({ isUploading: false });
    //     console.error(error);
    // };
    handleUploadSuccess = filename => {
        const {shop} = this.state;
        this.props.firebase.storageBobaShopImages(shop)
            .child(filename)
            .getDownloadURL()
            .then(url => {
                // this.props.firebase
                // .bobaShopImages(shop)
                // .push({
                //     comment,
                //     username,
                //     uid,
                //     dateTime
                // })
                // .then(() => {
                //     this.setState({
                //         modalIsOpen: !this.state.modalIsOpen,
                //         ommentModal: {
                //             comment: "",
                //             shop: "",
                //             uid: ""
                //         }
                //     });
                // });
            });
    };

    render() {
        const { shop } = this.state;
        return (
            <div className={`container`}>
                <div className={`row`}>
                    <div className={`col-lg-12 ${classes.header}`}>
                        <h5>Shops</h5>
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
                    {shop != "" ?
                        <div>
                            <div className={`${classes.info}`}>
                                <h5>
                                    {shop}
                                </h5>
                                <CustomUploadButton
                                    accept="image/*"
                                    randomizeFilename
                                    storageRef={this.props.firebase.storageBobaShopImages(shop)}
                                    // onUploadStart={this.handleUploadStart}
                                    // onProgress={this.handleProgress}
                                    // onUploadError={this.handleUploadError}
                                    onUploadSuccess={this.handleUploadSuccess}
                                    className={classes.uploadBtn}>
                                    Add Photo</CustomUploadButton>
                            </div>
                        </div>
                        :
                        <div></div>
                    }

                </div>
            </div>
        )
    }
}

export default withFirebase(Photos);