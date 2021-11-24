import { Component } from "react";

class Search extends Component {
    render() {
        return(
            <>
                <div className="search-container">
                    <div className="search-block">
                        <h1>מה אתה מחפש ?</h1>
                        <input type="text" placeholder="חפש שם, מאבטח, מיקום" />
                    </div>
                    <button className="btn">חפש</button>
                </div>
            </>
        )
    }
}

export default Search