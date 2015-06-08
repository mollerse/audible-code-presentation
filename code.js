var keyboard;
var context = new AudioContext();

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2,(note-69)/12);
}

function connect() {
  navigator.requestMIDIAccess()
    .then(function (midi) {
      for(var input of midi.inputs.values()) {
        keyboard = input;
      }
    }, function() {
      console.error('Something failed when connecting to MIDI controller');
    });
}

function onMsg(on, off, msg) {
  var code = msg.data[0];
  var note = msg.data[1];

  code === 144 ? on(note) : off(note);
}

function BasicSynth(note, type, gain) {
  var oscillator = context.createOscillator();
  oscillator.type = type || 'sine';
  oscillator.frequency.value = note ? frequencyFromNoteNumber(note) : 440;
  oscillator.start();

  var amp = context.createGain();
  amp.gain.value = 0;

  oscillator.connect(amp);
  amp.connect(context.destination);


  function start() {
    amp.gain.value = gain || 1;
  }

  function stop() {
    amp.gain.value = 0;
  }

  return {start, stop};
}

function Supersaw(note, sawNumber, detune) {
  var frequency = frequencyFromNoteNumber(note);
  var amp = context.createGain();
  var maxGain = 1 / sawNumber;

  for (var i = 0; i < sawNumber; i++) {
    var saw = context.createOscillator();
    saw.type = 'sawtooth';
    saw.frequency.value = frequency;
    saw.detune.value = -detune + i * 2 * (detune / (sawNumber - 1));
    saw.start();
    saw.connect(amp);
  }

  amp.connect(context.destination);

  function start() {
    amp.gain.value = maxGain;
  }

  function stop() {
    amp.gain.value = 0;
  }

  return {start, stop};
}

connect();


Reveal.addEventListener('hello', function() {
  var notes = [];

  function on() {
    var n = BasicSynth();
    notes.push(n);
    n.start();
  }

  function off() {
    notes.forEach(function(n) {
      n.stop();
    });
  }

  keyboard.onmidimessage = onMsg.bind(this, on, off);

});

Reveal.addEventListener('hello2', function() {
  var notes = [];

  function on(note) {
    var n = BasicSynth(note);
    notes.push(n);
    n.start();
  }

  function off() {
    notes.forEach(function(n) {
      n.stop();
    });
  }

  keyboard.onmidimessage = onMsg.bind(this, on, off);

});

Reveal.addEventListener('hello3', function() {
  var notes = [];

  function on(note) {
    var n = BasicSynth(note, 'sawtooth');
    notes.push(n);
    n.start();
  }

  function off() {
    notes.forEach(function(n) {
      n.stop();
    });
  }

  keyboard.onmidimessage = onMsg.bind(this, on, off);

});

Reveal.addEventListener('basicsynth', function() {
  var notes = {};

  function on(note) {
    var n = BasicSynth(note, 'sawtooth', 0.3);
    notes[note] = n;
    n.start();
  }

  function off(note) {
    notes[note].stop();
    delete notes[note];
  }

  keyboard.onmidimessage = onMsg.bind(this, on, off);

});

Reveal.addEventListener('supersaw', function() {
  var saws = 3;
  var detune = 36;
  var notes = {};

  function on(note) {
    var n = new Supersaw(note, saws, detune);
    notes[note] = n;
    n.start();
  }

  function off(note) {
    notes[note].stop();
    delete notes[note];
  }

  keyboard.onmidimessage = onMsg.bind(this, on, off);
});
