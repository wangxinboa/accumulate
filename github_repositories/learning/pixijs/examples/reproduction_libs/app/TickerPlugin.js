import { UPDATE_PRIORITY } from "../ticker/const.js";
import { Ticker } from "../ticker/Ticker.js";

("use strict");
export class TickerPlugin {
	static init(options) {
		options = Object.assign(
			{
				autoStart: true,
				sharedTicker: false,
			},
			options,
		);
		Object.defineProperty(this, "ticker", {
			set(ticker) {
				if (this._ticker) {
					this._ticker.remove(this.render, this);
				}
				this._ticker = ticker;
				if (ticker) {
					ticker.add(this.render, this, UPDATE_PRIORITY.LOW);
				}
			},
			get() {
				return this._ticker;
			},
		});
		this.stop = () => {
			this._ticker.stop();
		};
		this.start = () => {
			this._ticker.start();
		};
		this._ticker = null;
		this.ticker = options.sharedTicker ? Ticker.shared : new Ticker();
		if (options.autoStart) {
			this.start();
		}
	}
	static destroy() {
		if (this._ticker) {
			const oldTicker = this._ticker;
			this.ticker = null;
			oldTicker.destroy();
		}
	}
}
