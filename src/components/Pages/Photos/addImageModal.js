import React from 'react';
import classes from './photos.module.css';
import PropTypes from 'prop-types';
import { withFirebase } from '../../Firebase';
import FileUploader from "react-firebase-file-uploader";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';


class AddImageModal extends React.Component {
    constructor(props) {
        super(props);

        this.node = React.createRef()

        this.state = {
            description: "",
            isUploading: false,
            error: ""
        }
    }

    handleContainerClick = (e) => {
        if (this.node.contains(e.target)) {
            return;
        }
        this.props.toggleModal();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleUploadStart = () => this.setState({ isUploading: true });
    handleUploadError = error => {
        this.setState({ isUploading: false, error: error });
    };
    onUploadSuccess = (filename, description) => {
        this.setState({ isUploading: false, description:'' });
        this.props.handleUploadSuccess(filename, description);
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: 50
        };

        // The modal "window"
        const modalStyle = {
            backgroundColor: 'white',
            borderRadius: 5,
            maxWidth: 540,
            minHeight: 300,
            margin: '10% auto',
            padding: 30,
        };

        const { description, isUploading, error } = this.state;
        const isInvalid = description === ''

        return (
            <div style={backdropStyle} onClick={this.handleContainerClick}>
                <div style={modalStyle} ref={node => this.node = node}>
                    <button type="button" className="close" onClick={this.props.toggleModal} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div style={{ marginTop: "40px" }}>
                        <input autoFocus={true} onChange={this.onChange} name="description" className='form-control'
                            placeholder="Enter description"></input>
                        <div className={`${classes.uploadBtns}`}>
                            <CustomUploadButton
                                accept="image/*"
                                randomizeFilename
                                storageRef={this.props.firebase.storageBobaShopImages(this.props.shop)}
                                onUploadSuccess={(event) => this.onUploadSuccess(event, description)}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                className={`btn btn-info ${classes.uploadBtn}`}
                                disabled={isInvalid}>
                                Select &amp; Submit</CustomUploadButton>
                        </div>
                    </div>
                    <div style={{ display: "block" }}>
                        {isUploading ?
                            <div>Uploading...</div>
                            : <div></div>}
                    </div>
                    <div style={{ display: "block" }}>
                        {error ?
                            <div>{error}</div>
                            : <div></div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default withFirebase(AddImageModal);