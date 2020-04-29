import React from "react";
import axios from "axios"
import './auth.scss';

class Auth extends React.Component{

    state={
        email: '',
        password: ''
    }

    onChangeHandler = (event, type) => {
        event.preventDefault()
        let data = this.state;
        data[type] = event.target.value
        this.setState({data})
    }

    onSubmitHandler = (e) => {

        e.preventDefault()

        let data = {
            email: this.state.email,
            password: this.state.password
        }

        console.log(data)
        axios.post('http://localhost:5000/users/login', data).then(res => console.log(res));
    }

    render(){
        return(
            <div className="Auth">
                <form>
                    <input type="email" value={this.state.email} onChange={e => this.onChangeHandler(e,"email")} />
                    <input type="password" value={this.state.password} onChange={e => this.onChangeHandler(e,"password")} />
                    <input type="submit" onClick={event => this.onSubmitHandler(event)} />
                </form>
            </div>
        )
    }
}

export default Auth;