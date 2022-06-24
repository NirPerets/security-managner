import { Component } from "react";

class MiniTable extends Component {

    state = {
        workers: [],
    }

    async componentDidMount() {
        const workers = this.props.workers.filter((item, idx) => idx < 5)
        await this.setState({ workers: workers })

        console.log(this.state.workers)
    }

    render() {
        return(
            <>
                <div className="square mini">
                    <div className="square-title">
                        <h1>{ this.props.title }</h1>
                    </div>

                    <div className="miniTable">
                        {
                            this.state.workers.map(item => {
                                return(
                                    <div className="block">
                                        <h1>{ item.fullName }</h1>
                                        <p>{ item.phone }</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default MiniTable;