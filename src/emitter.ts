export const Emitter = {

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	events: {} as any,

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	on(event: string, callback: any): void {
		if(!this.events[event]) {
			this.events[event] = [];
			this.events[event].push(callback);
		}
	},

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	emit(event: string, ...rest: any): void {
		if (event in this.events === false) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.events[event].forEach((e: any) => {
			e(...rest);
		});
	},
};