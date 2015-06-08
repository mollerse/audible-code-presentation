var fs = require('fs');

var slides = fs.readFileSync('./slides.html');
var title = 'Making a web-powered MIDI-controled synthesizer';

document.querySelector('.slides').innerHTML = slides;
document.querySelector('title').text = title;
