import React from 'react';
import classes from './photos.module.css';
import AddImageModal from './addImageModal';
import ImageModal from './imageModal';
import { AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons'
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';
import { ReactComponent as Logo } from '../../../media/images/photo.svg';

import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';

class Photos extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            images: [],
            modalIsOpen: false,
            shop: "",

            contextUid: "",
            contextUsername: "",
            contextAvatar: "",

            imageInfo: {},
            imageIsOpen: false
        }
    }

    componentDidMount() {
        if (this.context.authUser != null) {
            this.setState({
                contextUid: this.context.authUser.uid,
                contextUsername: this.context.username,
                contextAvatar: this.context.avatar
            });
        }
        if (this.props.location.state) {
            const shop = this.props.location.state.shop;
            this.getShopImages(shop);
        } else {
            this.getAllImages().then((images) => {
                if (images) {
                    this.setState({
                        images: images,
                        loading:false
                    });
                }
            });


        }
    }

    componentWillUnmount() {
        this.props.firebase.bobaShopImages().off();
    }

    toggleModal = () => {
        this.setState({ modalIsOpen: !this.state.modalIsOpen });
    }

    toggleImage = (imageInfo) => {
        imageInfo = imageInfo || {};
        this.setState({
            imageIsOpen: !this.state.imageIsOpen,
            imageInfo: imageInfo
        });
    }

    getAutosuggestInput = (value) => {
    }
    getAutoSuggestSelected = (value) => {
        this.getShopImages(value);
    }

    getShopImages = (shop) => {
        this.setState({
            shop: shop,
            loading: true
        });

        this.props.firebase.bobaShopImages(shop).on('value', snapshot => {
            const shopImagesObject = snapshot.val();
            if (shopImagesObject) {
                const shopImagesList = Object.keys(shopImagesObject).map(key => ({
                    id: key,
                    ...shopImagesObject[key],
                }))

                this.setState({
                    images: shopImagesList,
                    loading: false
                });
            } else {
                this.setState({
                    images: [],
                    loading: false
                });
            }
        });
    }

    getAllImages = () => {
        return this.props.firebase.images().once('value').then(function (snapshot) {
            let shopImagesObject = snapshot.val();
            if (shopImagesObject) {
                const shopImagesList = Object.keys(shopImagesObject).map(key => ({
                    id: key,
                    ...shopImagesObject[key],
                }));
                return shopImagesList;
            } else {
                return null;
            }
        });
    }

    handleUploadSuccess = (filename, description) => {
        this.toggleModal();
        const { shop, contextUid, contextUsername, contextAvatar } = this.state;
        const dateTime = new Date().toLocaleString();
        this.props.firebase.storageBobaShopImages(shop)
            .child(filename)
            .getDownloadURL()
            .then(url => {
                const pushedRef = this.props.firebase
                    .images()
                    .push({
                        shop,
                        uid: contextUid,
                        username: contextUsername,
                        avatar: contextAvatar,
                        filename,
                        url,
                        description,
                        dateTime
                    });
                const imageId = pushedRef.key;

                this.props.firebase
                    .bobaShopImage(shop, imageId)
                    .update({
                        filename,
                        url,
                        uid: contextUid,
                        username: contextUsername,
                        avatar: contextAvatar,
                        description,
                        dateTime
                    });
                this.props.firebase
                    .userImage(contextUid, imageId)
                    .push({
                        shop,
                        filename,
                        url,
                        description,
                        dateTime
                    });
            });
    };

    deleteImage = (fileid, filename) => {
        var result = window.confirm("Are you sure you want to delete?");
        if (result) {
            const { shop, contextUid } = this.state;
            this.props.firebase.storageBobaShopImage(shop, filename)
                .delete().then(() => {
                    this.props.firebase.bobaShopImages(shop).child(fileid).remove();
                    this.props.firebase.userImages(contextUid).child(fileid).remove();
                    this.props.firebase.images().child(fileid).remove();
                    this.toggleImage();
                }).catch(function (error) {
                    alert(error);
                });
        }
    }

    render() {
        const { shop, contextUid, images } = this.state;
        const imagesGrid = [];
        for (const [index, value] of images.entries()) {
            imagesGrid.push(
                <div key={index} className={`col-4 col-sm-3 col-lg-2 ${classes.column}`}>
                    <img className={`${classes.image}`} src={value.url}
                        onClick={() => this.toggleImage(value)} />
                </div>
            )

        }

        const override = css`
        display: block;
        margin: 20px auto;
        `;

        return (
            <div className='container'>
                <div className={`row`}>
                    <div className={`col-lg-12 ${classes.header}`}>
                        <h4>Photos</h4>
                    </div>
                </div>
                <div className={`row`}>
                    <div className={`col-lg-12 ${classes.header}`}>
                        <AutoSuggestShops
                            getInputData={this.getAutosuggestInput}
                            getSelectedData={this.getAutoSuggestSelected}
                            bobaShop={shop}
                            placeholder="Select a shop to add photos" />
                    </div>
                </div>
                <div>
                    <div>
                        <div className={`${classes.info}`}>
                            <h5>
                                {shop}
                            </h5>
                            {contextUid && shop ?
                                <button className={`btn btn-primary ${classes.addCommentButton}`} >
                                    <FontAwesomeIcon icon={faCameraRetro} onClick={this.toggleModal} size="2x" />
                                </button>
                                : <div></div>}
                        </div>
                        <div>
                            {(!this.state.loading && (images === undefined || images.length == 0)) ?
                                <div className={`row ${classes.noPhotosWell}`}>No Photos Added</div>
                                : <div className={`row`}>{imagesGrid}</div>
                            }

                            <div className='sweet-loading'>
                                <ClipLoader
                                    sizeUnit={"px"}
                                    css={override}
                                    size={70}
                                    color={'#61aceb'}
                                    loading={this.state.loading}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <AddImageModal show={this.state.modalIsOpen}
                    toggleModal={this.toggleModal}
                    shop={shop}
                    handleUploadSuccess={this.handleUploadSuccess}>
                </AddImageModal>
                <ImageModal show={this.state.imageIsOpen}
                    imageInfo={this.state.imageInfo}
                    contextUid={contextUid}
                    toggleImage={this.toggleImage}
                    deleteImage={this.deleteImage}>
                </ImageModal>
            </div>
        )
    }
}

export default withFirebase(Photos);