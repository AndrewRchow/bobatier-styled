import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PasswordMask from 'react-password-mask';
import classes from './signIn.module.css';
import { withAuthorization, AuthUserContext } from '../../Session';
import { SignUpLink } from '../../Partials/SignUp';
import { PasswordForgetLink } from '../../Partials/PasswordForget';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/core';
import logo from '../../../media/images/shiba.jpg';

import Fab from '@material-ui/core/Fab';
import PersonAdd from '@material-ui/icons/PersonAdd';


const buttonStyle = {
  width: 80,
  height: 80,
marginTop:30,
  backgroundColor: 'rgb(25,118,210)',
  color: 'white'
};

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  loading: false
};

class SignInForm extends Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentWillMount() {
    // this.props.firebase.getRedirect();

    this.setState({ loading: true });
    this.listener = this.props.firebase.auth1.onAuthStateChanged((user) => {
      if (user) {
        this.props.firebase
              .user(user.uid)
              .update({
                username: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                role: 'user'
              })
              .then(() => {
                this.props.history.push(ROUTES.HOME);
              })
      } else {
        this.setState({ loading: false });
      }
    });
    // this.props.firebase.auth1.getRedirectResult().then((result) => {
    //   if (result.user) {
    //     console.log(1, result);
    //     this.setState({ loading: true });

    //     const user = result.user;
    //     this.props.firebase
    //       .user(user.uid)
    //       .update({
    //         username: user.displayName,
    //         email: user.email,
    //         avatar: user.photoURL,
    //         role: 'user'
    //       })
    //       .then(() => {
    //         this.setState({ loading: false });
    //         this.props.history.push(ROUTES.HOME);
    //       })

    //   }

    // }).catch(function (error) {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   var email = error.email;
    //   var credential = error.credential;
    // });

  }

  componentWillUnmount() {
    this.listener();

  }


  onSubmit = event => {
    this.props.firebase.googleLogin()
    // .then(() => {
    //   setTimeout(() => {
    //     this.props.history.push(ROUTES.HOME);
    //   }, 300)
    // });



    // const { email, password } = this.state;
    // this.setState({ loading: true }, () => {
    //   this.props.firebase
    //     .doSignInWithEmailAndPassword(email, password)
    //     .then(() => {
    //       setTimeout(() => {
    //         this.props.history.push(ROUTES.HOME); 
    //         }, 300);
    //       // this.setState({ ...INITIAL_STATE });
    //     })
    //     .catch(error => {
    //       this.setState({ error, loading: false });
    //     });
    // })
    // event.preventDefault();

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    // const isInvalid = password === '' || email === '';

    const signInButtonStyle = {
      marginTop: "8px",
    }

    const override = css`
    display: block;
    margin: 90px auto;`;

    return (
      <div className={`container`}>
        {/* <h5>Sign In</h5>
        <form onSubmit={this.onSubmit}>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
            className={classes.inputStyle}
          />
          <PasswordMask
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.onChange}
            buttonClassName={classes.maskButton}
            inputClassName={classes.inputStyle}
          />
          <button className={`btn btn-primary`} style={signInButtonStyle} type="submit"
          disabled={isInvalid} 
          >
            Sign In
        </button>
          <div style={{ marginTop: '10px' }}>
            <PasswordForgetLink />
            <SignUpLink />
          </div>
          {error && <p className={classes.error}>{error.message}</p>} */}

        {/* <div>
            {ROUTES.DEVELOP == false ?
              <img src={logo} className={classes.image} />
              : <div></div>}
          </div> */}

        {/* </form> */}


        {
          this.state.loading ?
            <div className='sweet-loading' style={{marginTop:60}}>
              <ClipLoader
                sizeUnit={"px"}
                css={override}
                size={30}
                color={'#61aceb'}
              // loading={this.state.loading}
              />
            </div>
            :
            <div className={classes.signInButton}>
              <Fab
                style={buttonStyle}
                onClick={() => this.onSubmit()}>
                <PersonAdd 
                style={{width:'40px', height:'40px'}}/>
              </Fab>
            </div>

        }

      </div>
    );
  }
}

export default withRouter(withFirebase(SignInForm));


