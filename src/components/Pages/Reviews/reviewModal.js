import React from 'react';
import PropTypes from 'prop-types';
import { ClassNames } from '@emotion/core';
import classes from './review.module.css';

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
        this.props.toggleModal();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

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

        const shop = this.props.commentModal.shop;
        const uid = this.props.commentModal.uid;
        const { comment } = this.state;
        const isInvalid = comment === ''

        return (
            <div style={backdropStyle} onClick={this.handleContainerClick}>
                <div className={classes.commentModal} ref={node => this.node = node}>
                    <button type="button" className="close" onClick={this.props.toggleModal} aria-label="Close">
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
                                onClick={() => this.props.submitComment(shop, uid, comment)}>
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

export default Modal;