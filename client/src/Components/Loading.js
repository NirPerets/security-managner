import { Component } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class Loading extends Component {
    render() {
        return(
            <>
                <Loader
                    type="Watch"
                    color="#00BFFF"
                    height={150}
                    width={150}
                    timeout={15000} //3 secs
                />
            </>
        )
    }
}

export default Loading