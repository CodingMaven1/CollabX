import React from "react";
import api from "../../api/api"
import Input from '../../components/input/input'
import './auth.scss';

class Auth extends React.Component{

    state={
        user: {
            data: '',
            errorLogin: '',
            errorSignup: ''
        },
        handler: 'login',
        login:{
            email: '',
            password: ''
        },
        signup:{
            email: '',
            password: '',
            confpassword: '',
            name: ''
        }

    }

    onChangeHandler = (event, type) => {
        let data = this.state.login;
        data[type] = event.target.value
        this.setState({data})
    }

    onChangeHandlerSignup = (event, type) => {
        let data = this.state.signup;
        data[type] = event.target.value
        this.setState({data})
    }

    onFormHandler = (event, type) => {
        event.preventDefault()
        let {handler} = this.state;
        handler = type
        this.setState({handler})
    }

    onSubmitHandler = async (event) => {
        event.preventDefault()
        let {handler, login, signup, user} = this.state;
        if(handler === "login"){
            let data = {
                email: login.email,
                password: login.password
            }
    
            try{
                const userinfo = await api.post('/users/login', data)
                user.data = userinfo
                this.setState({user})
            } catch(e){
                user.errorLogin = e.response.data.message
                this.setState({user})
            }
        }
        else{
            let data = {
                email: signup.email,
                password: signup.password,
                confpassword: signup.confpassword,
                name: signup.name
            }

            try{
                const userinfo = await api.post('/users/signup', data)
                user.data = userinfo
                this.setState({user})
            } catch(e){
                user.errorSignup = e.response.data.message
                this.setState({user})
            }
        }

    }

    render(){
        let {handler, login, signup, user} = this.state;
        let content;
        if(handler==="login"){
            content =   <div className="Auth--ContainerLogin">
                            <h1 className="Auth--Heading">Login</h1>
                            <h1 className="Auth--Title">New to Maven? <span className="Auth--Span" onClick={e => this.onFormHandler(e, "signup")}>SignUp</span> </h1>
                            <form className="Auth--Form">
                                <Input type="email" value={login.email} change={e => this.onChangeHandler(e,"email")} placeholder="Email" />
                                <Input type="password" value={login.password} change={e => this.onChangeHandler(e,"password")} placeholder="Password" />
                                <h1 className="Auth--Error">{user.errorLogin}</h1>
                                <input type="submit" onClick={event => this.onSubmitHandler(event)} />
                            </form>
                        </div>
        }
        else{
            content =   <div className="Auth--ContainerSignup">
                            <h1 className="Auth--Heading">SignUp</h1>
                            <h1 className="Auth--Title">Already have an account? <span className="Auth--Span" onClick={e => this.onFormHandler(e, "login")}>Login</span> </h1>
                            <form className="Auth--Form">
                                <Input type="text" value={signup.name} change={e => this.onChangeHandlerSignup(e,"name")} placeholder="Name" />
                                <Input type="email" value={signup.email} change={e => this.onChangeHandlerSignup(e,"email")} placeholder="Email" />
                                <Input type="password" value={signup.password} change={e => this.onChangeHandlerSignup(e,"password")} placeholder="Password" />
                                <Input type="password" value={signup.confpassword} change={e => this.onChangeHandlerSignup(e,"confpassword")} placeholder="Confirm Password" />
                                <h1 className="Auth--Error">{user.errorSignup}</h1>
                                <input type="submit" onClick={event => this.onSubmitHandler(event)} />
                            </form>
                        </div>
        }

        return(
            <div className="Auth">
                {content}
            </div>
        )
    }
}

export default Auth;