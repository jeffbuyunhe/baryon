import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createNotification } from '../../reducers/notificationReducer'

const toastSettings = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

const Notification = () => {
    const notification = useSelector(state => state.notification)
    const dispatch = useDispatch()

    useEffect(() => {
        if(notification) {
            if(notification.error) {
                toast.error(notification.message, {
                    ...toastSettings
                })
            } else {
                toast.success(notification.message, {
                    ...toastSettings
                })
            }
            dispatch(createNotification(null))
        }
    }, [dispatch, notification])

    return (
        <ToastContainer
            position={toastSettings.position}
            autoClose={toastSettings.autoClose}
            hideProgressBar={toastSettings.hideProgressBar}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    )
}

export default Notification