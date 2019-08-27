import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase/index';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        role: null,
        username: null,
        avatar: null
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth1.onAuthStateChanged(
        authUser => {
          console.log('bbbb', authUser);
          if (authUser){
            this.setState({ authUser })
            this.props.firebase.user(authUser.uid).on('value', snapshot => {
              this.setState({ 
                role: snapshot.val().role, 
                username: snapshot.val().username, 
                avatar: snapshot.val().avatar, 
                
              }) 
            });
          } else{
            this.setState({ authUser: null, role:null });  
          }  
        },
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;