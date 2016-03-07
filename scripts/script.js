window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
		realAudioInput = null,
		inputPoint = null,
		audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;

// Elements
var recorder_body = document.querySelector('.recorder-body');
var recorder_footer = document.querySelector('.recorder-footer');
var btn_record = document.querySelector('.btn-record');
var button_type_play = document.getElementsByClassName('button_type_play')[0];
var button_type_stop = document.getElementsByClassName('button_type_stop')[0];
var btn_repeat = document.querySelector('.btn-repeat');
var timeStart = 0;

function saveAudio() {
		audioRecorder.exportWAV( doneEncoding );
		// could get mono instead by saying
		// audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {
		var canvas = document.querySelector('.wavedisplay');

		drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

		// the ONLY time gotBuffers is called is right after a new recording is completed -
		// so here's where we should set up the download.
		audioRecorder.exportWAV( doneEncoding );
}

function getBufferCallback( buffers ) {
	var newSource = audioContext.createBufferSource();
	var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
	newBuffer.getChannelData(0).set(buffers[0]);
	newBuffer.getChannelData(1).set(buffers[1]);
	newSource.buffer = newBuffer;

	newSource.connect( audioContext.destination );
	newSource.start(0);
}

function doneEncoding( blob ) {
	Recorder.setupDownload( blob, 'myRecording' + ((recIndex < 10) ? '0' : '') + recIndex + '.wav' );
	recIndex++;
}

function startRecording() {
	if (!audioRecorder) {
		return;
	}

	timeStart = new Date();
	btn_record.classList.add('recording');
	btn_record.style.display = 'none';
	button_type_play.style.display = 'none';
	button_type_stop.style.display = 'block';
	recorder_body.style.display = 'block';
	recorder_footer.style.display = 'block';
	audioRecorder.clear();
	audioRecorder.record();
}

function stopRecording() {
	audioRecorder.stop();
	btn_record.classList.remove('recording');
	button_type_stop.style.display = 'none';
	button_type_play.style.display = 'block';
	audioRecorder.getBuffers(gotBuffers);
}

function playSound() {
	audioRecorder.getBuffers(getBufferCallback);
}

function convertToMono( input ) {
	var splitter = audioContext.createChannelSplitter(2);
	var merger = audioContext.createChannelMerger(2);

	input.connect( splitter );
	splitter.connect( merger, 0, 0 );
	splitter.connect( merger, 0, 1 );
	return merger;
}

function cancelAnalyserUpdates() {
	window.cancelAnimationFrame( rafID );
	rafID = null;
}

function updateAnalysers(time) {
	if (!analyserContext) {
			var canvas = document.getElementById('analyser');
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
			analyserContext = canvas.getContext('2d');
	}
	var recorder_duration = document.querySelector('.recorder-duration');
	var date = new Date;
	console.log(timeStart);
	var duration = (date.getMinutes() - timeStart.getMinutes()) * 0.001;
	recorder_duration.innerHTML = duration;
	// analyzer draw code here
	{
		var SPACING = 3;
		var BAR_WIDTH = 1;
		var numBars = Math.round(canvasWidth / SPACING);
		var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

		analyserNode.getByteFrequencyData(freqByteData);

		analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
		analyserContext.fillStyle = '#373A3C';
		analyserContext.lineCap = 'round';
		var multiplier = analyserNode.frequencyBinCount / numBars;

		// Draw rectangle for each frequency bin.
		for (var i = 0; i < numBars; ++i) {
			var magnitude = 0;
			var offset = Math.floor( i * multiplier );
			// gotta sum/average the block, or we miss narrow-bandwidth spikes
			for (var j = 0; j < multiplier; j++) {
				magnitude += freqByteData[offset + j];
			}

			magnitude = magnitude / multiplier;
			var magnitude2 = freqByteData[i * multiplier];
			analyserContext.fillStyle = 'hsl( ' + Math.round((i * 360) / numBars) + ', 100%, 50%)';
			analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
		}
	}

	rafID = window.requestAnimationFrame( updateAnalysers );
}

function toggleMono() {
	if (audioInput != realAudioInput) {
			audioInput.disconnect();
			realAudioInput.disconnect();
			audioInput = realAudioInput;
	} else {
			realAudioInput.disconnect();
			audioInput = convertToMono( realAudioInput );
	}

	audioInput.connect(inputPoint);
}

function gotStream(stream) {
	inputPoint = audioContext.createGain();

	// Create an AudioNode from the stream.
	realAudioInput = audioContext.createMediaStreamSource(stream);
	audioInput = realAudioInput;
	audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect( analyserNode );

	audioRecorder = new Recorder( inputPoint );

	zeroGain = audioContext.createGain();
	zeroGain.gain.value = 0.0;
	inputPoint.connect( zeroGain );
	zeroGain.connect( audioContext.destination );
	updateAnalysers();
}

function initAudio() {
	if (!navigator.getUserMedia)
			navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mediaDevices.getUserMedia;
	if (!navigator.cancelAnimationFrame)
			navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
	if (!navigator.requestAnimationFrame)
			navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

	navigator.getUserMedia(
		{'audio': {
			'mandatory': {
				'googEchoCancellation': 'false',
				'googAutoGainControl': 'false',
				'googNoiseSuppression': 'false',
				'googHighpassFilter': 'false'
			},
			'optional': []
		}
	}, gotStream, function(e) {
		alert('Error getting audio');
		console.log(e);
	});
}

window.addEventListener('load', initAudio);

btn_record.addEventListener('click', startRecording);
btn_repeat.addEventListener('click', startRecording);
button_type_stop.addEventListener('click', stopRecording);
button_type_play.addEventListener('click', playSound);
