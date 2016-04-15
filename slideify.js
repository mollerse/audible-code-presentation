var fs = require('fs');

var slides = fs.readFileSync('./slides.html');
var title = 'Audible Code';

document.querySelector('.slides').innerHTML = slides;
document.querySelector('title').text = title;
