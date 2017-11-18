
export function calc(input) {
	return eval(input.map(function (a) { return a.value }).join("")).toFixed(4);
}