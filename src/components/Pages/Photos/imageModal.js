import React from 'react';
import classes from './photos.module.css';
import { withFirebase } from '../../Firebase';


class ImageModal extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef()

        this.state = {
            backdropDiv: ''
        }
    }

    handleContainerClick = (e) => {
        if (this.node.contains(e.target)) {
            return;
        }
        this.props.toggleImage();
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
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 50,
            zIndex: 1
        };

        // The modal "window"
        const modalStyle = {
            // backgroundColor: 'white',
            // borderRadius: 5,
            // maxWidth: 500,
            // minHeight: 300,
            margin: '10% auto',
            padding: 30,
            zIndex: 100
        };
        return (
            <div style={backdropStyle} onClick={this.handleContainerClick}>
                <div style={modalStyle} ref={node => this.node = node}>
                    <div className={`${classes.outer}`}>
                        <div className={`${classes.inner}`}>
                            <img src={this.props.imageInfo.url} className={`${classes.largeImage}`} />
                            <div className={`${classes.imageDescriptionArea}`}>
                                <p>{this.props.imageInfo.description}</p>
                                <br/>
                                <p>{this.props.imageInfo.username} {this.props.imageInfo.dateTime}</p>
                                {this.props.imageInfo.uid == this.props.contextUid ?
                                    <div>
                                        <br />
                                        <button className={`btn btn-danger`} 
                                        onClick={() => this.props.deleteImage(this.props.imageInfo.id, this.props.imageInfo.filename)}
                                        >Delete</button>
                                    </div>
                                    : <div></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withFirebase(ImageModal);