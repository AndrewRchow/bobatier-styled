import React, { Component } from 'react';
import { withFirebase } from '../../Firebase';
import FileUploader from "react-firebase-file-uploader";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';


class Test extends Component {
    state = {
        username: "",
        avatar: "",
        isUploading: false,
        progress: 0,
        avatarURL: "",
        files: ""
    };

    componentDidMount() {
        // this.props.firebase.bobaShopImage("Ding Tea (Rowland Heights)", "70f2696e-5343-4980-bc58-e4bca378749a.PNG")
        //     .getDownloadURL().then(url => { this.setState({ files: url }) });
    };

    handleChangeUsername = event =>
        this.setState({ username: event.target.value });
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = filename => {
        // this.setState({ avatar: filename, progress: 100, isUploading: false });
        this.props.firebase.storageBobaShopImages("Ding Tea (Rowland Heights)")
            .child(filename)
            .getDownloadURL()
            .then(url => this.setState({ avatarURL: url }));
    };


    render() {
        return (
            <div>
                <form>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={this.state.username}
                        name="username"
                        onChange={this.handleChangeUsername}
                    />
                    <label>Avatar:</label>
                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                    {this.state.avatarURL && <img src={this.state.avatarURL} />}
                    <img src={this.state.files} />
                    <CustomUploadButton
                        accept="image/*"
                        name="avatar"
                        randomizeFilename
                        storageRef={this.props.firebase.storageBobaShopImages("Ding Tea (Rowland Heights)")}
                        // onUploadStart={this.handleUploadStart}
                        // onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        // onProgress={this.handleProgress}
                        style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4 }}
                    >
                        Select
                        </CustomUploadButton>
                    <button onClick={this.startUploadManually}>Upload all the things</button>
                </form>
            </div>
        );
    }
}
export default withFirebase(Test);