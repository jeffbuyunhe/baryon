import './UserLoginPage.css';
import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LoginFormInput from "./LoginFormInput"
import { login, verified, activate } from '../../../reducers/userReducer'
import { PAGES } from '../../../routes'
import { createNotification } from '../../../reducers/notificationReducer'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.user)

    // since it is a dependency in useEffect(), wrap in useMemo
    const initialValues = useMemo(() => {
        return {
            email:"",
            password:"",
            confirmPassword:""
        }
    },[]);

    const [searchParams, setSearchParams] = useSearchParams()
    const [values, setValues] =useState(initialValues)
    const [initialLogin, setInitialLogin] = useState(false)
    const [userVerified, setUserVerified] = useState(false)

    const inputs = [
        {
            id:1,
            name: "email",
            label: "Email Adress:",
            type: "email",
            errorMessage: "Please enter a valid email",
            required: true,
        },
        {
            id: 2,
            name: "password",
            type: "password",
            label: "Password",
            pattern: "^(?=.*[0-9]).{4,32}$",
            errorMessage: "Please include between 4-32 characters and at least one number",
            required: true,
        },
        {
            id: 3,
            name: "confirmPassword",
            type: "password",
            label: "Confirm Password",
            errorMessage: "Passwords don't match",
            pattern: values.password,
            required: true,
        }
    ]
    
    const activateUser = (e) => {
        e.preventDefault()
        const id = searchParams.get('id')
        const token = searchParams.get('token')
        const payload = {
            token: token,
            password: values.password
        }
        dispatch(activate(id, payload))
    }
    
    const checkUserStatus = (e) => {
        e.preventDefault()
        values.email && dispatch(verified(values.email))
    }

    const handleLogin = (e) => {
        e.preventDefault()
        const { confirmPassword, ...payload } = values
        dispatch(login(payload))
        setUserVerified(false)
        setValues(initialValues)
    }

    const onChange = (e) =>{
        setValues({...values,[e.target.name]: e.target.value})
    }

    useEffect(() => {
        if(searchParams.get('id') && searchParams.get('token'))
            setInitialLogin(true)
        document.body.className = 'login-body-background';
        // cleanup
        return () => { document.body.className = ''; }
    }, [searchParams])

    useEffect(() => {
        if (user && user.loggedIn) {
            if (user.isAdmin) navigate(PAGES.adminHome.path)
            else navigate(PAGES.homePage.path)
        } 
        if (user && user.verified)
            setUserVerified(true)
        if (user && user.verified === false)
            dispatch(createNotification(
                "We have sent you a private link to set up your account, please check your email.", 
                true))
        if (user && user.activated) {
            setSearchParams({})
            setInitialLogin(false)
            setValues(initialValues)
            navigate(PAGES.login.path)
        }
    }, [searchParams, navigate, user, setSearchParams, initialValues, dispatch])

    return(
        <div className='LoginBody'>
        <h1 className='login-header'>WELCOME TO BARYON</h1>
        <div className='login-header-line'></div>
        {initialLogin?
            <form encType="multipart/form-data" className="login-form" onSubmit={activateUser}>
                {inputs.slice(1,3).map((input) => (
                    <LoginFormInput key={input.id}{...input} value={values[input.name]} onChange={onChange}/>
                ))}
                <button type="submit" className="Login_btn">Signup</button>
            </form> :
            <form encType="multipart/form-data" className="login-form" onSubmit={handleLogin}>
                {!userVerified && inputs.slice(0,1).map((input) => (
                    <LoginFormInput key={input.id}{...input} value={values[input.name]} onChange={onChange}/>
                ))}
                {userVerified && inputs.slice(0,2).map((input) => (
                    <LoginFormInput key={input.id}{...input} value={values[input.name]} onChange={onChange}/>
                ))}
                {!userVerified && <button onClick = {checkUserStatus} className="Login_btn">Next</button>}
                {userVerified && <button type="submit" className="Login_btn">Login</button>}
            </form>}
        </div>
    )
}
export default Login