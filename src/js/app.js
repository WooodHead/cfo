import * as panes from "panes.js";
import * as commands from "commands.js";

window.FIXME = (...args) => console.error(...args);
window.sleep = (delay = 1000) => new Promise(r => setTimeout(r, delay));

String.prototype.fileLocaleCompare = function(other) {
	for (var i=0;i<Math.max(this.length, other.length);i++) {
		if (i >= this.length) { return -1; } /* this shorter */
		if (i >= other.length) { return  1; } /* other shorter */
		
		let ch1 = this.charAt(i);
		let ch2 = other.charAt(i);
		let c1 = ch1.charCodeAt(0);
		let c2 = ch2.charCodeAt(0);
		
		let special1 = (c1 < 128 && !ch1.match(/a-z/i)); /* non-letter char in this */
		let special2 = (c2 < 128 && !ch2.match(/a-z/i)); /* non-letter char in other */
		
		if (special1 != special2) { return (special1 ? -1 : 1); } /* one has special, second does not */
		
		let r = ch1.localeCompare(ch2); /* locale compare these two normal letters */
		if (r) { return r; }
	}

	return 0; /* same length, same normal/special positions, same localeCompared normal chars */
}

if (!("".padStart)) { 
	String.prototype.padStart = function(len, what = " ") {
		let result = this;
		while (result.length < len) { result = `${what}${result}`; }
		return result;
	}
}

panes.init();

/*

reload: 
  - zadana: chceme focusnout zadanou (created), pokud neni, chceme ??? => prvni.
  - nezadana: chceme focusnout aktualni (refresh), pokud neni, chceme stejny index.

setPath: chceme focusnout predchozi. pokud neni, chceme prvni.

*/