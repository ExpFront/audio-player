//
// var module = {
// 					 init: function () {
// 							 var me = this;
//
// 							 window.onload = function () {
// 									 try {
// 											 window.AudioContext = window.AudioContext || window.webkitAudioContext  || window.mozAudioContext || window.msAudioContext;
// 											 navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
// 											 window.URL = window.URL || window.webkitURL || window.mozURL  || window.msURL;
// 											 me.context = new window.AudioContext();
// 											 me.context.createGain = me.context.createGain || me.context.createGainNode;
// 									 } catch (e) {
// 											 window.alert('Your browser does not support WebAudio, try Google Chrome');
// 									 }
//
// 									 if (navigator.getUserMedia) {
// 											 navigator.getUserMedia({audio: true}, function (stream) {
// 													 var input = me.context.createMediaStreamSource(stream);
// 													 me.recorder = new Recorder(input);
// 											 }, function (e) {
// 													 window.alert('Please enable your microphone to begin recording');
// 											 });
// 									 } else {
// 											 window.alert('Your browser does not support recording, try Google Chrome');
// 									 }
// 							 };
// 					 },
// 					 /**
// 						* @method cue
// 						*/
// 					 cue: function (url, callback) {
// 							 console.log('player.cue', url);
// 							 var me = this;
// 							 if (this.request) {
// 									 this.request.abort();
// 							 } else {
// 									 this.request = new XMLHttpRequest();
// 							 }
// 							 this.request.open('GET', url, true);
// 							 this.request.responseType = 'arraybuffer';
// 							 this.request.onload = function () {
// 									 console.log('player.cue.complete');
// 									 me.context.decodeAudioData(me.request.response, function (buffer) {
// 											 callback(buffer);
// 									 });
// 							 };
// 							 this.request.send();
// 					 },
// 					 /**
// 						* @method play
// 						*/
// 					 play: function (data, callback) {
// 							 console.log('player.play', this.context.currentTime, data);
// 							 var me = this,
// 									 source = this.context.createBufferSource(),
// 									 gainNode = this.context.createGain();
// 							 if (!source.start) { source.start = source.noteOn; }
// 							 if (!source.stop) { source.stop = source.noteOff; }
// 							 source.connect(gainNode);
// 							 gainNode.connect(this.context.destination);
// 							 source.buffer = data;
// 							 source.loop = true;
// 							 source.startTime = this.context.currentTime;
// 							 source.start(0);
// 							 return source;
// 					 },
// 					 /**
// 						* @method stop
// 						*/
// 					 stop: function (source) {
// 							 console.log('player.stop', this.context.currentTime, source);
// 							 if (source) {
// 									 source.stop(0);
// 							 }
// 					 },
// 					 /**
// 						* @method record
// 						*/
// 					 record: function () {
// 							 console.log('player.record', this.context.currentTime);
// 							 this.recorder.clear();
// 							 this.recorder.startTime = this.context.currentTime;
// 							 this.recorder.record();
// 					 },
// 					 /**
// 						* @method recordStop
// 						*/
// 					 recordStop: function (callback) {
// 							 var me = this;
// 							 console.log('player.recordStop', this.context.currentTime);
// 							 this.recorder.stop();
// 							 this.recorder.getBuffer(function (buffers) {
// 									 callback(buffers);
// 							 });
// 					 },
// 					 /**
// 						* @method sync
// 						*/
// 					 sync: function (action, target, param, callback) {
// 							 var me = this,
// 									 offset = (this.context.currentTime - target.startTime) % target.buffer.duration,
// 									 time = target.buffer.duration - offset;
// 							 console.log('player.sync', this.context.currentTime + time, action);
// 							 if (this.syncTimer) {
// 									 window.clearTimeout(this.syncTimer);
// 							 }
// 							 this.syncTimer = window.setTimeout(function () {
// 									 var returned = me[action](param);
// 									 if (callback) {
// 											 callback(returned);
// 									 }
// 							 }, time * 1000);
// 					 },
// 					 /**
// 						* @method createBuffer
// 						*/
// 					 createBuffer: function (buffers, channelTotal) {
// 							 var channel = 0,
// 									 buffer = this.context.createBuffer(channelTotal, buffers[0].length, this.context.sampleRate);
// 							 for (channel = 0; channel < channelTotal; channel += 1) {
// 									 buffer.getChannelData(channel).set(buffers[channel]);
// 							 }
// 							 return buffer;
// 					 },
// 					 /**
// 						* @method getOffset
// 						*/
// 					 getOffset: function (vocalsRecording, backingInstance, offset) {
// 							 var diff = (this.recorder.startTime + (offset / 1000)) - backingInstance.startTime;
// 							 console.log('player.getOffset', diff);
// 							 return {
// 									 before: Math.round((diff % backingInstance.buffer.duration) * this.context.sampleRate),
// 									 after: Math.round((backingInstance.buffer.duration - ((diff + vocalsRecording.duration) % backingInstance.buffer.duration)) * this.context.sampleRate)
// 							 };
// 					 },
// 					 /**
// 						* @method offsetBuffer
// 						*/
// 					 offsetBuffer: function (vocalsBuffers, before, after) {
// 							 console.log('player.offsetBuffer', vocalsBuffers, before, after);
// 							 var i = 0,
// 									 channel = 0,
// 									 channelTotal = 2,
// 									 num = 0,
// 									 audioBuffer = this.context.createBuffer(channelTotal, before + vocalsBuffers[0].length + after, this.context.sampleRate),
// 									 buffer = null;
// 							 for (channel = 0; channel < channelTotal; channel += 1) {
// 									 buffer = audioBuffer.getChannelData(channel);
// 									 for (i = 0; i < before; i += 1) {
// 											 buffer[num] = 0;
// 											 num += 1;
// 									 }
// 									 for (i = 0; i < vocalsBuffers[channel].length; i += 1) {
// 											 buffer[num] = vocalsBuffers[channel][i];
// 											 num += 1;
// 									 }
// 									 for (i = 0; i < after; i += 1) {
// 											 buffer[num] = 0;
// 											 num += 1;
// 									 }
// 							 }
// 							 return audioBuffer;
// 					 }
// 			 };
//
// 			 /* example additional code */
//
// 			 var offset = -150,
// 					 backing = null,
// 					 backingInstance = null,
// 					 backingOriginal = null,
// 					 vocals = null,
// 					 vocalsBuffers = null,
// 					 vocalsInstance = null,
// 					 vocalsOffset = null,
// 					 vocalsRecording = null;
//
// 			 module.init();
//
// 			 document.getElementById('play').addEventListener('click', function () {
// 					 module.cue('90bpm.wav', function (file) {
// 							 backing = file;
// 							 backingInstance = module.play(backing);
// 							 backingOriginal = backingInstance;
// 					 });
// 			 });
//
// 			 document.getElementById('stop').addEventListener('click', function () {
// 					 module.stop(backingInstance);
// 			 });
//
// 			 document.getElementById('play2').addEventListener('click', function () {
// 					 vocalsInstance = module.play(vocals);
// 			 });
//
// 			 document.getElementById('stop2').addEventListener('click', function () {
// 					 module.stop(vocalsInstance);
// 			 });
//
// 			 document.getElementById('record').addEventListener('click', function () {
// 					 vocals = null;
// 					 module.record();
// 			 });
//
// 			 document.getElementById('recordStop').addEventListener('click', function () {
// 					 module.recordStop(function (buffers) {
// 							 // calculate filled version for looping playback
// 							 vocalsBuffers = buffers;
// 							 vocalsRecording = module.createBuffer(vocalsBuffers, 2);
// 							 vocalsOffset = module.getOffset(vocalsRecording, backingOriginal, offset);
// 							 vocals = module.offsetBuffer(vocalsBuffers, vocalsOffset.before, vocalsOffset.after);
// 					 });
// 			 });
//
// 			 document.getElementById('recordSync').addEventListener('click', function () {
// 					 vocals = null;
// 					 module.sync('record', backingInstance);
// 			 });
//
// 			 document.getElementById('recordSyncStop').addEventListener('click', function () {
// 					 module.sync('recordStop', backingInstance, function (buffers) {
// 							 // calculate filled version for looping playback
// 							 vocalsBuffers = buffers;
// 							 vocalsRecording = module.createBuffer(vocalsBuffers, 2);
// 							 vocalsOffset = module.getOffset(vocalsRecording, backingOriginal, offset);
// 							 vocals = module.offsetBuffer(vocalsBuffers, vocalsOffset.before, vocalsOffset.after);
// 					 });
// 			 });
//
// 			 document.getElementById('playSync').addEventListener('click', function () {
// 					 module.sync('play', backingInstance, vocals, function (data) {
// 							 vocalsInstance = data;
// 					 });
// 			 });
//
// 			 document.getElementById('stopSync').addEventListener('click', function () {
// 					 module.sync('stop', backingInstance, vocalsInstance);
// 			 });
//
// 			 document.getElementById('offset').addEventListener('change', function (e) {
// 					 offset = e.target.value;
// 					 document.getElementById('offsetTotal').innerHTML = e.target.value;
// 					 vocalsOffset = module.getOffset(vocalsRecording, backingOriginal, offset);
// 					 vocals = module.offsetBuffer(vocalsBuffers, vocalsOffset.before, vocalsOffset.after);
// 					 // instant playback
// 					 module.stop(backingOriginal);
// 					 module.stop(backingInstance);
// 					 module.stop(vocalsInstance);
// 					 backingInstance = module.play(backing);
// 					 vocalsInstance = module.play(vocals);
// 			 });
//
// 			 document.getElementById('export').addEventListener('click', function () {
// 					 // export original recording
// 					 module.recorder.exportWAV(function(blob) {
// 							 var url = URL.createObjectURL(blob),
// 									 li = document.createElement('li'),
// 									 au = document.createElement('audio'),
// 									 hf = document.createElement('a');
//
// 							 au.controls = true;
// 							 au.src = url;
// 							 hf.href = url;
// 							 hf.download = new Date().toISOString().replace('T', '-').slice(0, -5) + '.wav';
// 							 hf.innerHTML = hf.download;
// 							 li.appendChild(au);
// 							 li.appendChild(hf);
// 							 document.getElementById('downloads').appendChild(li);
// 					 });
// 			 });
//
// 			 document.getElementById('export2').addEventListener('click', function () {
// 					 // export modified/filled recording
// 					 module.recorder.exportWAV(function(blob) {
// 							 var url = URL.createObjectURL(blob),
// 									 li = document.createElement('li'),
// 									 au = document.createElement('audio'),
// 									 hf = document.createElement('a');
// 							 au.controls = true;
// 							 au.src = url;
// 							 hf.href = url;
// 							 hf.download = new Date().toISOString().replace('T', '-').slice(0, -5) + (offset === '0' ? '-' + offset : offset) + 'ms.wav';
// 							 hf.innerHTML = hf.download;
// 							 li.appendChild(au);
// 							 li.appendChild(hf);
// 							 document.getElementById('downloads').appendChild(li);
// 					 }, 'audio/wav', vocalsOffset.before, vocalsOffset.after);
// 			 });
//
//
//
//
//
//
//
//
//
// // CROSS BROWSING
// // var video = document.querySelector('video');
// //
// // if (navigator.getUserMedia) {
// //   navigator.getUserMedia({audio: true, video: true}, function(stream) {
// //     video.src = stream;
// //   }, onFailSoHard);
// // } else if (navigator.webkitGetUserMedia) {
// //   navigator.webkitGetUserMedia('audio, video', function(stream) {
// //     video.src = window.webkitURL.createObjectURL(stream);
// //   }, onFailSoHard);
// // } else {
// //   video.src = 'somevideo.webm'; // fallback.
// // }




/* Copyright 2013 Chris Wilson

	 Licensed under the Apache License, Version 2.0 (the "License");
	 you may not use this file except in compliance with the License.
	 You may obtain a copy of the License at

			 http://www.apache.org/licenses/LICENSE-2.0

	 Unless required by applicable law or agreed to in writing, software
	 distributed under the License is distributed on an "AS IS" BASIS,
	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 See the License for the specific language governing permissions and
	 limitations under the License.
*/

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

/* TODO:

- offer mono option
- "Monitor input" switch
*/

function saveAudio() {
		audioRecorder.exportWAV( doneEncoding );
		// could get mono instead by saying
		// audioRecorder.exportMonoWAV( doneEncoding );
}

function gotBuffers( buffers ) {
		var canvas = document.getElementById( "wavedisplay" );

		drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

		// the ONLY time gotBuffers is called is right after a new recording is completed -
		// so here's where we should set up the download.
		audioRecorder.exportWAV( doneEncoding );
}

function doneEncoding( blob ) {
		Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
		recIndex++;
}

function toggleRecording( e ) {
		if (e.classList.contains("recording")) {
				// stop recording
				audioRecorder.stop();
				e.classList.remove("recording");
				audioRecorder.getBuffers( gotBuffers );
		} else {
				// start recording
				if (!audioRecorder)
						return;
				e.classList.add("recording");
				audioRecorder.clear();
				audioRecorder.record();
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
				var canvas = document.getElementById("analyser");
				canvasWidth = canvas.width;
				canvasHeight = canvas.height;
				analyserContext = canvas.getContext('2d');
		}

		// analyzer draw code here
		{
				var SPACING = 3;
				var BAR_WIDTH = 1;
				var numBars = Math.round(canvasWidth / SPACING);
				var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

				analyserNode.getByteFrequencyData(freqByteData);

				analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
				analyserContext.fillStyle = '#F6D565';
				analyserContext.lineCap = 'round';
				var multiplier = analyserNode.frequencyBinCount / numBars;

				// Draw rectangle for each frequency bin.
				for (var i = 0; i < numBars; ++i) {
						var magnitude = 0;
						var offset = Math.floor( i * multiplier );
						// gotta sum/average the block, or we miss narrow-bandwidth spikes
						for (var j = 0; j< multiplier; j++)
								magnitude += freqByteData[offset + j];
						magnitude = magnitude / multiplier;
						var magnitude2 = freqByteData[i * multiplier];
						analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
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
						navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				if (!navigator.cancelAnimationFrame)
						navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
				if (!navigator.requestAnimationFrame)
						navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

		navigator.getUserMedia(
				{
						"audio": {
								"mandatory": {
										"googEchoCancellation": "false",
										"googAutoGainControl": "false",
										"googNoiseSuppression": "false",
										"googHighpassFilter": "false"
								},
								"optional": []
						},
				}, gotStream, function(e) {
						alert('Error getting audio');
						console.log(e);
				});
}

window.addEventListener('load', initAudio );
