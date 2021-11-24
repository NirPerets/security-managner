import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";

class FreeMedics extends Component {
    constructor(props) {
        super(props)

        this.state = {
            series: [((this.props.freeCount / this.props.count) * 100).toFixed(0)],
            options: {
                chart: {
                    height: 200,
                    type: 'radialBar'
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            size: '70%',
                        }
                    }
                },
                labels: ['חובשים'],
            }
        }
    }


    render() {
        return(
            <>
                <div className="square freeBlock">
                    <div className="square-title">
                        <h1>חובשים פנויים</h1>
                    </div>

                    <ReactApexChart 
                        options = { this.state.options }
                        series = { this.state.series }
                        type = "radialBar"
                        height = { 200 }
                    />
                </div>
            </>
        )
    }
}

export default FreeMedics