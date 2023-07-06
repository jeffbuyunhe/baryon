import './CourseAssignmentListItem.css';

const AssignmentFormInput = (props) => {
  const { errorMessage, label, onChange, id, ...inputProps } = props;

  return (
    <div className="assignment-form-input">
        <label className="assignment-signup-label">{label}</label>
        <input type="file" name="file" className="assignment-signup-input" {...inputProps}
               onChange={onChange}/>
        <span className="assignment-signup-span">{errorMessage}</span>
    </div>
  )
}

export default AssignmentFormInput