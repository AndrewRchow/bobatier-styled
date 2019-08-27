import React from 'react';
import classes from './addCommentModal.module.css';
import { withFirebase } from '../../Firebase';


class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.node = React.createRef()

        this.state = {
            comment: ""
        }

    }

    handleContainerClick = (e) => {
        if (this.node.contains(e.target)) {
            return;
        }
        this.props.toggleCommentModal();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    submitComment = () => {
        const { bobaShop, uid, contextUid, contextUsername, contextAvatar } = this.props.commentModal;
        const { comment } = this.state;
        console.log( bobaShop, uid, contextUid, contextUsername, contextAvatar );
        let dateTime = new Date();
        // dateTime.setSeconds(dateTime.getSeconds() + 3);
        dateTime = dateTime.toLocaleString();

        this.props.firebase
            .bobaShopUserComment(bobaShop, uid)
            .push({
                comment,
                username: contextUsername,
                uid: contextUid,
                avatar:contextAvatar,
                dateTime
            });
        this.props.firebase
            .userReviewComment(uid, bobaShop)
            .push({
                comment,
                username: contextUsername,
                uid: contextUid,
                avatar:contextAvatar,
                dateTime
            })
            .then(() => {
                this.props.toggleCommentModal();
            });
    }

    render() {
        // Render nothing if the "show" prop is false
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
            padding: '40px 20px'
        };

        const parentContentStyle = {
            marginBottom: '10px'
        }

        const buttonsStyle = {
            paddingTop: '10px',
            float: 'right'
        }

        const { comment } = this.state;
        const isInvalid = comment === ''

        return (
            <div style={backdropStyle} onClick={this.handleContainerClick}>
                <div className={classes.commentModal} ref={node => this.node = node}>
                    <button type="button" className="close" onClick={this.props.toggleCommentModal} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div style={parentContentStyle}>
                        {this.props.children}
                    </div>
                    <div className="footer">
                        <textarea autoFocus={true} onChange={this.onChange} name="comment" className='form-control' rows='3'></textarea>
                        <div style={buttonsStyle}>
                            <button className='btn btn-success'
                                disabled={isInvalid}
                                onClick={this.submitComment}>
                                Submit
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

// Modal.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   show: PropTypes.bool,
//   children: PropTypes.node
// };

export default withFirebase(Modal);