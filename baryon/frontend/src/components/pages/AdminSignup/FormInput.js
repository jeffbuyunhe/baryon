import { useState } from "react"

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { errorMessage, label, onChange, id, ...inputProps } = props;

  const handleFocus = (e) =>{
    setFocused(true);
  }

  return (
    <div className="form-input">
        <label className="admin-signup-label">{label}</label>
        <input type="file" name="file" className="admin-signup-input" {...inputProps}
               onChange={onChange} onBlur={handleFocus} 
               onFocus={()=>inputProps.name==="confirmPassword" && setFocused(true)}
               focused={focused.toString()}/>
        <span className="admin-signup-span">{errorMessage}</span>
    </div>
  )
}

export default FormInput