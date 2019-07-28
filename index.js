

import TypeIt from "typeit"



// The fun typewriter effect!
// It sucks that each element is <b> but that's the best way I found to do it for now.
// CSS would probably be better but oh well.
new TypeIt("#typeit", {
	strings: ["<b>teaching</b>.", 
	"<b>coding</b>.", 
	"<b>designing</b>.", 
	"<b>composing</b>.", 
	"<b>using the cowboy emoji unironically</b>.", 
	"<b>watching linustechtips</b>.", 
	"<b>yelling into the void</b>.", 
	"<b>twittereeting</b>."],
	speed: 200,
	cursorSpeed: 1000,
	nextStringDelay: 3000,
	html: true,
	cursor: true,
	breakLines: false,
	startDelay: 500,
	loopDelay: 10,
	loop: true,
	waitUntilVisible: true
}).go();

