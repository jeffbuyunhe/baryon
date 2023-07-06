import { useState } from "react"
import "./UserLoginPage.css"

const LoginFormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { errorMessage, label, onChange, id, ...inputProps } = props;

  const handleFocus = (e) =>{
    setFocused(true);
  }
  return (
    <div>
        <label className="login-label">{label}</label>
        <input type="file" name="file" className="login-input" {...inputProps} 
               onChange={onChange} onBlur={handleFocus} 
               onFocus={()=>inputProps.name==="confirmPassword" && setFocused(true)}
               focused={focused.toString()}/>
        <span className="login-span">{errorMessage}</span>
    </div>
  )
}

export default LoginFormInput