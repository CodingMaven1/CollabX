import React from "react";
import axios from "../../axios/axios"
import './auth.scss';

class Auth extends React.Component{

    state={
        email: '',
        password: ''
    }

    onChangeHandler = (event, type) => {
        let data = this.state;
        data[type] = event.target.value
        this.setState({data})
    }

    onSubmitHandler = async (event) => {
        event.preventDefault()

        let data = {
            email: this.state.email,
            password: this.state.password
        }

        console.log(data)
        try{
            const user = await axios.post('/users/login', data)
            const recieved = await user.json()
            console.log(recieved)
        } catch(e){
            console.log(e.response.data.message)
        }

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