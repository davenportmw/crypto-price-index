import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';
import _ from 'lodash';
import { Line, Chart } from 'react-chartjs-2';
import moment from 'moment';
import currencies from './supported-currencies.json';

console.log(currencies)

class App extends Component {
  constructor (props) {
    super(props)

    // chart.js defaults
    Chart.defaults.global.defaultFontColor = '#f0f0f0';
    Chart.defaults.global.defaultFontSize = 16;

    this.state = {EthereumData: null, LitecoinData: null, BitcoinData: null, currency: "USD"}
    this.onCurrencySelect = this.onCurrencySelect.bind(this)
  }

  componentDidMount () {
	this.getEthereumData();
	this.getLitecoinData();
	this.getBitcoinData();
  }

  getEthereumData () {
	  fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=${this.state.currency}&limit=30`)
	  .then(response => response.json())
	  .then(EthereumData => this.setState({EthereumData}))
	  .catch(e => e);
  }

  getLitecoinData () {
	  fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=LTC&tsym=${this.state.currency}&limit=30`)
	  .then(response => response.json())
	  .then(LitecoinData => this.setState({LitecoinData}))
	  .catch(e => e);
  }

  getBitcoinData () {
	  fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=${this.state.currency}&limit=30`)
	  .then(response => response.json())
	  .then(BitcoinData => this.setState({BitcoinData}))
	  .catch(e => e);
  }

  formatChartData () {

	let x, y, ethKeys, ethValues, btcKeys, btcValues, ltcKeys, ltcValues;
	let epi = this.state.EthereumData;
	let lpi = this.state.LitecoinData;
	let bpi = this.state.BitcoinData;

	ethKeys = [];
	ethValues = [];

	ltcKeys = [];
	ltcValues = [];

	btcKeys = [];
	btcValues = [];

	for (x in epi){
		if (x === 'Data'){
			for (y in epi[x]){
				let d = new Date(0);
				d.setUTCSeconds(epi[x][y].time);
				ethKeys.push(moment(d).format("ll"));
				ethValues.push(epi[x][y].close);
			}
		}
	}

	for (x in lpi){
		if (x === 'Data'){
			for (y in lpi[x]){
				let d = new Date(0);
				d.setUTCSeconds(lpi[x][y].time);
				ltcKeys.push(moment(d).format("ll"));
				ltcValues.push(lpi[x][y].close);
			}
		}
	}

	for (x in bpi){
		if (x === 'Data'){
			for (y in bpi[x]){
				let d = new Date(0);
				d.setUTCSeconds(bpi[x][y].time);
				btcKeys.push(moment(d).format("ll"));
				btcValues.push(bpi[x][y].close);
			}
		}
	}

	return {
      labels: _.map(ethKeys, date => moment(date).format("ll")),
      datasets: [
        {
          label: "Ethereum",
          fill: true,
          lineTension: 0.1,
		  backgroundColor: 'rgba(75,192,192,0.4)',
		  borderColor: 'rgba(75,192,192,1)',
		  borderCapStyle: 'butt',
		  borderDash: [],
		  borderDashOffset: 0.0,
		  borderJoinStyle: 'miter',
		  pointBorderColor: 'rgba(75,192,192,1)',
		  pointBackgroundColor: '#fff',
	  	  pointBorderWidth: 1,
		  pointHoverRadius: 5,
		  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
		  pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: ethValues
	    },
		{
			label: "Litecoin",
			fill: true,
			lineTension: 0.1,
			backgroundColor: 'rgba(154,205,50,0.4)',
			borderColor: 'rgba(154,205,50,1)',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgba(154,205,50,1)',
			pointBackgroundColor: '#fff',
			pointBorderWidth: 1,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgba(154,205,50,1)',
			pointHoverBorderColor: 'rgba(220,220,220,1)',
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			data: ltcValues
		},
		{
			label: "Bitcoin",
            fill: true,
            lineTension: 0.1,
			backgroundColor: 'rgba(240,128,128,0.4)',
			borderColor: 'rgba(240,128,128,1)',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgba(240,128,128,1)',
			pointBackgroundColor: '#fff',
			pointBorderWidth: 1,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgba(240,128,128,1)',
			pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: btcValues,
			hidden: true
		}
      ]
    }
  }

  setCurrency (currency) {
    this.setState({currency}, this.getEthereumData, this.getLitecoinData, this.getBitcoinData)
  }

  onCurrencySelect (e) {
    this.setCurrency(e.target.value)
  }

  render() {
    if (this.state.BitcoinData) {
      return (
        <div className="app">
          <Header title="Crypto Price Index" />

          <div className="select-container">
            <span style={{fontSize: 18}}> Select your currency: </span>
            <select value={this.state.currency} onChange={this.onCurrencySelect}>
              {currencies.map((obj, index) =>
                <option key={`${index}-${obj.country}`} value={obj.currency}> {obj.currency} </option>
              )}
            </select>
            {
              this.state.currency !== 'USD' && (<div>
                <button className="link" onClick={() => this.setCurrency('USD')} style={{fontSize: 16}}> [CLICK HERE TO RESET] </button>
              </div>)
            }
          </div>

          <div style={{marginTop: 10}}>
            <Line data={this.formatChartData()} height={200} />
          </div>
        </div>
      )
    }

    return null
  }
}

export default App;
