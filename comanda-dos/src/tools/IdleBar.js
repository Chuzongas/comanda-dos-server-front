import React, { Component, Fragment } from 'react';

import IdleTimer from 'react-idle-timer'

var time = 60 * 10

class IdleBar extends Component {
	constructor() {
		super();
		this.state = {
			time: {},
			seconds: time,
			progressBar: 0,
			cancel: false,
			runing: false
		};
		this.timer = 0;
		this.idleTimer = null
	}

	secondsToTime(secs) {
		let hours = Math.floor(secs / (60 * 60));

		let divisor_for_minutes = secs % (60 * 60);
		let minutes = Math.floor(divisor_for_minutes / 60);

		let divisor_for_seconds = divisor_for_minutes % 60;
		let seconds = Math.ceil(divisor_for_seconds);

		let obj = {
			"h": hours,
			"m": minutes,
			"s": seconds
		};
		return obj;
	}

	componentDidMount = () => {
		let timeLeftVar = this.secondsToTime(this.state.seconds);
		this.setState({ time: timeLeftVar });
	}

	startTimer = () => {
		if (this.timer === 0 && this.state.seconds > 0) {
			this.setState({
				runing: true
			})
			this.timer = setInterval(this.countDown, 100);
		}
	}

	countDown = () => {
		// Remove one second, set state so a re-render happens.
		let seconds = this.state.seconds - 0.1;
		let varProgressBar = this.state.progressBar + 0.1;

		seconds = seconds.toFixed(1)

		this.setState({
			time: this.secondsToTime(seconds),
			seconds: seconds,
			progressBar: varProgressBar
		});


		
		// Check if we're at zero.
		if (this.state.cancel) {
			clearInterval(this.timer);
			this.timer = 0;
			this.setState({
				cancel: false,
				runing: false,
				seconds: time,
				progressBar: 0
			})
		} else if (parseInt(seconds) === 0) {

			
			clearInterval(this.timer);
			this.props.logout()

		}
	}

	handleOnAction = (e) => {
		if (this.state.runing) {
			this.setState({
				cancel: true
			})
		}
	}

	handleOnActive = (e) => {
	}

	handleOnIdle = (e) => {
		this.startTimer();
	}

	render() {
		return (
			<Fragment>
				<IdleTimer
					ref={ref => { this.idleTimer = ref }}
					timeout={1000 * 6 * 1}
					onActive={this.handleOnActive}
					onIdle={this.handleOnIdle}
					onAction={this.handleOnAction}
					debounce={250}
				/>
				<div className="progress" style={{ width: '200px' }}>
					<div className="bgc-gray-2" role="progressbar" style={{ width: `${(this.state.progressBar * 100) / time}%`, transition: 'all 0.1s linear' }} ></div>
				</div>
			</Fragment>
		);
	}
}

export default IdleBar;