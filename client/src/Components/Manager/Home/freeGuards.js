import { Component } from "react";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";

class FreeGuards extends Component {
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
                            size: '70',
                        }
                    },

                },
                fill: {
                    type: 'gardient',
                    gardient: {
                        shade: 'dark',
                        type: 'horizontal',
                        shadeIntensity: 0.5,
                        gradientToColors: ['#ABE5A1'],
                        inverseColors: true,
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100]
                    }
                },
                labels: ['מאבטחים'],
            }
        }
    }


    render() {
        return(
            <>
                <div className="square freeBlock">
                    <div className="square-title">
                        <h1>מאבטחים פנויים</h1>
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

export default FreeGuards