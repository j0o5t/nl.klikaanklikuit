'use strict';

const Kaku = require('./kaku');
const Signal = require('../../../drivers/lib/signal');

module.exports = class Dimmer extends Kaku {
	constructor(config) {
		super(config);
		// Create non-dimming remote signal to catch the payload_send event from this signal
		this.alternativeSignal = new Signal(
			this.config.alternativeSignal,
			this.payloadToData.bind(this),
			this.config.debounceTimeout
		);

		this.alternativeSignal.on('payload_send', payload => {
			const frame = this.payloadToData(payload);
			this.emit('frame', frame);
			this.emit('frame_send', frame);
		});
	}

	payloadToData(payload) { // Convert received data to usable variables
		if (payload && payload.length === 32 && payload.indexOf(2) === -1) {
			return super.payloadToData(payload);
		} else if (
			payload &&
			payload.length === 36 &&
			payload.slice(0, 26).indexOf(2) === -1 &&
			payload.slice(28, 36).indexOf(2) === -1 &&
			payload[27] === 2
		) {
			const data = {
				address: this.bitArrayToString(payload.slice(0, 26)),
				group: payload[26],
				channel: this.bitArrayToString(payload.slice(28, 30)),
				unit: this.bitArrayToString(payload.slice(30, 32)),
				state: 1,
				dim: this.bitArrayToNumber(payload.slice(32, 36)) / 15,
			};

			data.id = `${data.address}:${data.channel}:${data.unit}`;
			return data;
		}
		return null;
	}

	dataToPayload(data) {
		if (
			data &&
			data.address && data.address.length === 26 &&
			data.channel && data.channel.length === 2 &&
			data.unit && data.unit.length === 2 &&
			typeof data.group !== 'undefined' &&
			(
				(typeof data.state !== 'undefined' && Number(data.state) !== 2) ||
				(typeof data.dim !== 'undefined' && Number(data.dim) >= 0 && Number(data.dim) <= 1)
			)
		) {
			const address = this.bitStringToBitArray(data.address);
			const channel = this.bitStringToBitArray(data.channel);
			const unit = this.bitStringToBitArray(data.unit);
			// Calculate dim value
			if (data.dim) {
				const dim = this.numberToBitArray(Math.round(Math.min(1, Math.max(0, data.dim)) * 15), 4).reverse();
				return address.concat(data.group ? 1 : 0, 2, channel, unit, dim);
			}
			return address.concat(Number(data.group), Number(data.state), channel, unit);
		}
		return null;
	}

	updateRealtime(device, state, oldState) {
		super.updateRealtime(device, state, oldState);
		if (state.dim === undefined || state.dim === null) {
			if (oldState.dim === undefined || oldState.dim === null && Number(state.state) !== Number(oldState.state)) {
				this.realtime(device, 'dim', Number(state.state));
			}
		} else if (state.dim !== oldState.dim) {
			this.realtime(device, 'dim', state.dim);
		}
	}

	getExports() {
		const exports = super.getExports();
		exports.capabilities = exports.capabilities || {};
		exports.capabilities.dim = {
			get: (device, callback) => {
				const state = this.getState(device);
				callback(null, typeof state.dim === 'number' ? state.dim : Number(state.state));
			},
			set: (device, state, callback) => this.send(device, { dim: state }, () => callback(null, state)),
		};
		return exports;
	}
};
