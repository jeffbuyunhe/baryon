import { useEffect } from "react"
import { useLocation } from "react-router"

// Wrapper so that the page always loads at top
// Router does not handle this :(
const ScrollToTop = (props) => {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    return <>{props.children}</>
}

export default ScrollToTop