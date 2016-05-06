import {globalState} from "./globalstate";
import {objectAssign, deprecated, once, Lambda} from "../utils/utils";

export function isSpyEnabled() {
	return globalState.spyListeners.length > 0;
}

export function spyReport(event) {
	const listeners = globalState.spyListeners;
	for (let i = 0, l = listeners.length; i < l; i++)
		listeners[i](event);
}

export function spyReportStart(event) {
	const change = objectAssign({}, event, { spyReportStart: true });
	spyReport(change);
}

const END_EVENT = { spyReportEnd: true };

export function spyReportEnd() {
	spyReport(END_EVENT);
}

export function spy(listener:(change: any) => void): Lambda {
	globalState.spyListeners.push(listener);
	return once(() => {
		const idx = globalState.spyListeners.indexOf(listener);
		if (idx !== -1)
			globalState.spyListeners.splice(idx, 1);
	});
}

export function trackTransitions(onReport?: (c) => void): Lambda {
	deprecated("trackTransitions is deprecated. Use mobx.spy instead");
	if (typeof onReport === "boolean") {
		deprecated("trackTransitions only takes a single callback function. If you are using the mobx-react-devtools, please update them first");
		onReport = arguments[1];
	}
	if (!onReport) {
		deprecated("trackTransitions without callback has been deprecated and is a no-op now. If you are using the mobx-react-devtools, please update them first");
		return () => {};
	}
	return spy(onReport);
}