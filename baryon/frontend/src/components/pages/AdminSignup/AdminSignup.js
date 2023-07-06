import "./AdminSignup.css"
import FormInput from "./FormInput"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { PAGES } from '../../../routes'
import { createUser } from "../../../reducers/userReducer"

const AdminSignupBody = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)
  const error = useSelector(state => state.error)

  const handleSubmit = (e) =>{
    e.preventDefault()
    const orgName = values.organization
    const isAdmin = true
    const { confirmPassword, organization, ...payload } = values
    dispatch(createUser(isAdmin, orgName, payload))
  }

  const onChange = (e) =>{
    setValues({...values,[e.target.name]: e.target.value})
  }

  useEffect(() => {
    document.body.className = 'body-background';

    // cleanup
    return () => { document.body.className = ''; }
  }, []);

  useEffect(() => {
    if(user && user.signedUp) navigate(PAGES.signupsuccess.path)
  }, [navigate, user, error]);

  const [values, setValues] = useState({
    organization:"",
    email:"",
    firstname:"",
    lastname:"",
    password:"",
    confirmPassword:"",
  });

  const inputs = [
    {
      id: 1,
      name: "organization",
      type: "text",
      label: "Organization",
      pattern: "^[A-za-z0-9][A-za-z0-9 ]{1,30}",
      errorMessage: "Please enter a valid organization, between 2-30 characters and no special characters",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      label: "Email Address",
      errorMessage: "Please enter a valid email",
      required: true,
    },
    {
      id: 3,
      name: "firstname",
      type: "text",
      label: "First Name",
      errorMessage: "Please enter a valid first under 20 characters and with no special characters",
      pattern: "^[A-za-z]{1,20}",
      required: true,
    },
    {
      id: 4,
      name: "lastname",
      type: "text",
      label: "Last Name",
      errorMessage: "Please enter a valid first under 20 characters and with no special characters",
      pattern: "^[A-za-z]{1,20}",
      required: true,
    },
    {
      id: 5,
      name: "password",
      type: "password",
      label: "Password",
      pattern: "^(?=.*[0-9]).{10,32}$",
      errorMessage: "Please include between 10-32 characters and at least one number",
      required: true,
    },
    {
      id: 6,
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      errorMessage: "Passwords don't match",
      pattern: values.password,
      required: true,
    }
  ]

  return (
    <div>
      <div style={{paddingBottom: "3vh", paddingTop: "4vh"}}>
        <p className="header">WELCOME,</p>
        <p className="subheader">To the best collaborative education program</p>
        <hr style={{borderColor: '#7b80d9', width: "60%"}}/>
      </div>
      <form encType="multipart/form-data" className="admin-signup-form" onSubmit={handleSubmit}>
        {inputs.map((input) => (
          <FormInput key={input.id}{...input} value={values[input.name]} onChange={onChange}/>
        ))}
        <button className="admin-signup-button" type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AdminSignupBody