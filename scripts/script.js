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

// Variables
var recorder = document.getElementsByClassName('recorder')[0];
var button_type_start = document.getElementsByClassName('button_type_start')[0];


function saveAudio() {
		audioRecorder.exportWAV( doneEncoding );
		// could get mono instead by saying
		// audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {
		var canvas = document.getElementById( 'wavedisplay' );

		drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

		// the ONLY time gotBuffers is called is right after a new recording is completed -
		// so here's where we should set up the download.
		audioRecorder.exportWAV( doneEncoding );
}

function doneEncoding( blob ) {
		Recorder.setupDownload( blob, 'myRecording' + ((recIndex < 10) ? '0' : '') + recIndex + '.wav' );
		recIndex++;
}

function toggleRecording( e ) {
		if (button_type_start.classList.contains('recording')) {
				// stop recording
				audioRecorder.stop();
				button_type_start.classList.remove('recording');
				audioRecorder.getBuffers( gotBuffers );
		} else {
				// start recording
				if (!audioRecorder) {
					return;
				}
				button_type_start.classList.add('recording');
				recorder.style.display = 'block';
				audioRecorder.clear();
				audioRecorder.record();
				audioRecorder.getBuffers( gotBuffers );
		}
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

		// analyzer draw code here
		var canvas = document.getElementById( 'wavedisplay' );

		drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

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
						navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				if (!navigator.cancelAnimationFrame)
						navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
				if (!navigator.requestAnimationFrame)
						navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

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

window.addEventListener('load', initAudio);

button_type_start.addEventListener('click', toggleRecording);
