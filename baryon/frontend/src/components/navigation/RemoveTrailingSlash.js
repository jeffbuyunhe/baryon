import React from "react";
import {Navigate, useLocation} from "react-router-dom";

export const RemoveTrailingSlash = ({...rest}) => {
    const location = useLocation()

    //Regex to check if the url ends in slash
    if (location.pathname.match('/.*/$')) {
        // go to the same url without trailing slash
        return <Navigate replace {...rest} to={{
            pathname: location.pathname.replace(/\/+$/, ""),
            search: location.search
        }}/>
        
    } else return null
}
