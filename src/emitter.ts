export const Emitter = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	events: {} as any,

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	on(event: string, callback: any): void {
		Emitter.events[event] = Emitter.events[event] || [];
		Emitter.events[event].push(callback);
	},

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	emit(event: string, ...rest: any): void {
		if (event in Emitter.events === false) {
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Emitter.events[event].forEach((e: any) => {
			e(...rest);
		});
	}
};