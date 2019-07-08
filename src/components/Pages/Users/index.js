import React from 'react';
import { withFirebase } from '../../Firebase';
import classes from './users.module.css'

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        return(
            <div>Hi</div>
        )
    }
}

export default withFirebase(Users);