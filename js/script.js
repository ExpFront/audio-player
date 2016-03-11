window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null;
var realAudioInput = null;
var inputPoint = null;
var audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;

// HTML Elements
var recorder_body = document.querySelector('.recorder-body');
var recorder_footer = document.querySelector('.recorder-footer');
var recorder_duration = document.querySelector('.recorder-duration');
var btn_record = document.querySelector('.btn-record');
var btn_stop = document.querySelector('.btn-stop');
var btn_play = document.querySelector('.btn-play');
var btn_repeat = document.querySelector('.btn-repeat');
var initialDate;
var i = 0;
var data = [];
var waveform = new Waveform({
	container: document.getElementById("test"),
	interpolate: false
});

function saveAudio() {
		audioRecorder.exportWAV(doneEncoding);
		// could get mono instead by saying
		// audioRecorder.exportMonoWAV(doneEncoding);
}

function gotBuffers(buffers) {

		// drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);

		// slider.oninput = function () {
		// 	var zoomLevel = Number(slider.value);
		// 	wavesurfer.zoom(zoomLevel);
		// };
		// the ONLY time gotBuffers is called is right after a new recording is completed -
		// so here's where we should set up the download.
		audioRecorder.exportWAV(doneEncoding);
}

function getBufferCallback(buffers) {
	var newSource = audioContext.createBufferSource();
	var newBuffer = audioContext.createBuffer(2, buffers[0].length, audioContext.sampleRate);
	newBuffer.getChannelData(0).set(buffers[0]);
	newBuffer.getChannelData(1).set(buffers[1]);
	newSource.buffer = newBuffer;

	newSource.connect(audioContext.destination);
	newSource.start(0);
}

function doneEncoding(blob) {
	Recorder.setupDownload(blob, 'myRecording' + ((recIndex < 10) ? '0' : '') + recIndex + '.wav');
	recIndex++;
}

function startRecording() {
	if (!audioRecorder) {
		return;
	}

	initialDate = new Date;
	btn_record.classList.add('recording');
	btn_record.style.display = 'none';
	btn_play.style.display = 'none';
	btn_stop.style.display = 'block';
	recorder_body.style.display = 'block';
	audioRecorder.clear();
	audioRecorder.record();
	updateAnalysers();
}

function showRecordingWave(buffer) {
	for (i; i < buffer[0].length; ++i) {
		for (var j = 0; j < buffer[0][i].length; j++) {
			console.log('ye');
		}
	}

		var ctx = waveform.context;
		var gradient = ctx.createLinearGradient(0, 0, 0, waveform.height);
		gradient.addColorStop(0.0, "#f60");
		gradient.addColorStop(1.0, "#ff1b00");
		waveform.innerColor = gradient;
		var pushed =  Math.cos(i++/25) - 0.2 + Math.random() * buffer[0][0];
		console.log('pushed' + pushed);
		console.log(buffer[0][0])
		data.push(pushed);

		waveform.update({
			data: data
		});
}

function stopRecording() {
	audioRecorder.stop();
	btn_record.classList.remove('recording');
	btn_stop.style.display = 'none';
	btn_play.style.display = 'block';
	recorder_footer.style.display = 'block';
	audioRecorder.getBuffers(gotBuffers);
	cancelAnalyserUpdates();
}

function playSound() {
	audioRecorder.getBuffers(getBufferCallback);
}

function convertToMono(input) {
	var splitter = audioContext.createChannelSplitter(2);
	var merger = audioContext.createChannelMerger(2);

	input.connect(splitter);
	splitter.connect(merger, 0, 0);
	splitter.connect(merger, 0, 1);

	return merger;
}

function cancelAnalyserUpdates() {
	window.cancelAnimationFrame(rafID);
	rafID = null;
}

function updateAnalysers(time) {
	// if (!analyserContext) {
	// 	var canvas = document.querySelector('.wavedisplay');
	// 	canvasWidth = canvas.width;
	// 	canvasHeight = canvas.height;
	// 	analyserContext = canvas.getContext('2d');
	// }

	recorder_duration.innerHTML = getDuration(initialDate);

	audioRecorder.getBuffers(showRecordingWave);

	rafID = window.requestAnimationFrame(updateAnalysers);
}

function getDuration(initialDate) {
	var date = new Date();
	var milliseconds = date - initialDate;
	var duration = (milliseconds / 1000).toFixed(2);

	return duration;
}

function toggleMono() {
	if (audioInput != realAudioInput) {
		audioInput.disconnect();
		realAudioInput.disconnect();
		audioInput = realAudioInput;
	} else {
		realAudioInput.disconnect();
		audioInput = convertToMono(realAudioInput);
	}

	audioInput.connect(inputPoint);
}

function gotStream(stream) {
	inputPoint = audioContext.createGain();

	realAudioInput = audioContext.createMediaStreamSource(stream);
	audioInput = realAudioInput;
	audioInput.connect(inputPoint);

	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect(analyserNode);

	audioRecorder = new Recorder(inputPoint);

	zeroGain = audioContext.createGain();
	zeroGain.gain.value = 0.0;
	inputPoint.connect(zeroGain);
	zeroGain.connect(audioContext.destination);
}

function initAudio() {
	if (!navigator.getUserMedia) {
		navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	}

	if (!navigator.cancelAnimationFrame) {
		navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
	}
	if (!navigator.requestAnimationFrame) {
		navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;
	}

	navigator.getUserMedia(
		{
			'audio': {
			'mandatory': {
				'googEchoCancellation': 'false',
				'googAutoGainControl': 'false',
				'googNoiseSuppression': 'false',
				'googHighpassFilter': 'false'
			},
			'optional': []
		},
	}, gotStream, function(e) {
		alert('Error getting audio');
		console.log(e);
	});
}

// Event Listeners
window.addEventListener('load', initAudio);

btn_record.addEventListener('click', startRecording);
btn_repeat.addEventListener('click', startRecording);
btn_stop.addEventListener('click', stopRecording);
