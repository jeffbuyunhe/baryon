import {useSelector, useDispatch} from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import './CourseHomeDropdown.css'
import { Dropdown } from '../../Dropdown/Dropdown'
import { FaCaretUp } from "react-icons/fa"
import { HiCheck, HiOutlineX } from "react-icons/hi"
import { saveCourseMaterial } from '../../../../reducers/courseMaterialReducer'
import { ENDPOINTS } from '../../../../services/endpoints'

export const CourseHomeDropdown = ({borderColor, title, isInstructor, classCode, courseId, userId}) => {

    const dispatch = useDispatch();

    const courseMaterial = useSelector(state => state.courseMaterial)

    const notification = useSelector(state => state.notification)

    const [files, setFiles] = useState([]) 

    const [filesToAdd, setFilesToAdd] = useState([])

    const [fileDataToAdd, setFileDataToAdd] = useState([])

    const [addFile, setAddFile] = useState(false)

    const hiddenFileInput = useRef(null)

    const openFile = async (fileId)=> {
        var url = new URL(`${ENDPOINTS.BASE_COURSEFILE_URL}download/${fileId}/`)
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
        
    }

    useEffect(() => {
        if(courseMaterial) {
           getLabel().then(label => {
            if(label && label.length > 0) {
                var linksToConvert = JSON.parse(JSON.stringify(label))
                let aTags = linksToConvert.map(x => <a href onClick={() => openFile(x.courseFileId)}>{x.title}</a>)
                setFiles(aTags)
            }
           })
        }
    },[courseMaterial])

    //if successfully updates material then we add the new file
    useEffect(() => {
        if(notification && !notification.error) {

            const links = courseMaterial.filter(x => x.label === title).map(y => y.title)

            setFiles([...links].map(x   => <a href onClick={openFile}>{x}</a>))
        }   
        setFilesToAdd([])
        setFileDataToAdd([])
    },[courseMaterial, dispatch])

    const handleClick = event => {
      hiddenFileInput.current.click();
    };


    const handleChange = event => {
        // For now we get file name, will change when we know how to store files
        (async () => {

        let uploadFile = event.target.files[0]

        const fileName = event.target.files[0].name

        let fileUploaded;

        // handle files that already have file name in label
            if(await containsFile(fileName)) {

                let fileTitle = fileName.substring(0, fileName.lastIndexOf('.'))
                let fileExtension = fileName.split('.').pop()
    
                let copyNo = 1
    
                var newFileName = (fileExtension) ? `${fileTitle}-${copyNo}.${fileExtension}` :  `${fileTitle}-${copyNo}`
                        
                    while(await containsFile(newFileName)){
                        copyNo++
                        newFileName = (fileExtension) ? `${fileTitle}-${copyNo}.${fileExtension}` :  `${fileTitle}-${copyNo}`
                    }
    
                fileUploaded = newFileName
                var blob = uploadFile.slice(0, uploadFile.size, uploadFile.contentType); 
                uploadFile = new File([blob], newFileName, {type: uploadFile.contentType});
    
            }else {
                fileUploaded = fileName
            }
    
            let newFilesToAdd = [...filesToAdd]
            let newFileDataToAdd = [...fileDataToAdd]
            newFileDataToAdd.push(uploadFile)
            newFilesToAdd.push(fileUploaded)
            setFileDataToAdd(newFileDataToAdd)
            setFilesToAdd(newFilesToAdd)
        })();
      };

    const containsFile = (fileName) => {

        return getLabel().then(function(label){
            return (label && label.some(x => x.title ===  fileName)) || filesToAdd.some(x => x === fileName)
        })  
    }

    async function getLabel(){
        return courseMaterial.filter(x => x.label === title)
    }

    const removeFile = file => {
        let newFiles = filesToAdd.filter(x => x !== file)
        let newFileData = fileDataToAdd.filter(x => x.filename !== file)
        setFileDataToAdd(newFileData)
        setFilesToAdd(newFiles)
    }

    const cancel = () => {
        setFilesToAdd([])
        setFileDataToAdd([])
        setAddFile(!addFile)
    }

    const addFilesChange = () => {
        setAddFile(!addFile)
    }

    // add new file to label
    const updateFiles = () => {
        if (filesToAdd.length > 0) {
            dispatch(saveCourseMaterial(courseId, userId, fileDataToAdd, title))
            setAddFile(!addFile)
        }
    }

    return (
        <Dropdown 
            dropdownClass="course-dropdown"
            menu="course-home-menu"
            buttonId="course-home-button"
            borderColor={borderColor}
            title={title}
            data={[
                ...files,
                <div style={{display: (addFile) ? "grid" : "none"}} className="upload-container" onClick={() => {}}>
                    <div id="upload-button-container" >
                        <div id="upload-button-container-title">
                            <span id="upload-title">Add Attachment</span>
                            <FaCaretUp id="upload-up-icon" onClick={() => cancel()}/>
                        </div>
                        <div id="main-upload-button-container">
                            <button id="upload-attachment" onClick={event => handleClick(event)}>
                                Upload File
                            </button>
                            <form enctype="multipart/form-data">
                            <input type="file" style={{display: "none"}} name="file" onChange={event => handleChange(event)} ref={hiddenFileInput}/>
                            </form>
                        </div>
                    </div>
                        <div className="check-container">
                            <div className="files-container">
                            {
                                filesToAdd.map(file => (
                                    <div  id="file-to-upload">
                                    <a href="/#">
                                        {file}
                                    </a>
                                    <HiOutlineX id="cancel-icon" onClick={() => removeFile(file)}/>
                                    </div>
                                ))
                            }
                            </div>
                            <HiCheck id="upload-check-icon" onClick={() => updateFiles()}/>
                        </div>
                </div>,
                <button id='upload-button' onClick={() => {addFilesChange()}} style={{display: (isInstructor && !addFile) ? "" : "none", }}> Upload Attachment </button>
            ]}
        />
    )
}   