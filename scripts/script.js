// navigator.getUserMedia = (navigator.getUserMedia ||
// 													navigator.mozGetUserMedia ||
// 													navigator.msGetUserMedia ||
// 													navigator.webkitGetUserMedia);
//
// if (navigator.getUserMedia) {
// 	console.log('getUserMedia supported.');
//
// 	var record = document.getElementsByClassName('button_type_start')[0];
// 	var play = document.getElementsByClassName('button_type_play')[0];
// 	var stop = document.getElementsByClassName('button_type_stop')[0];
//
// 	var constraints = { audio: true };
// 	var chunks = [];
//
// 	var onSuccess = function(stream) {
// 		var mediaRecorder = new MediaRecorder(stream);
//
// 		visualize(stream);
//
// 		record.onclick = function() {
// 			mediaRecorder.start();
// 			console.log(mediaRecorder.state);
// 			console.log("recorder started");
// 			record.style.background = "red";
// 			record.style.color = "black";
// 		}
//
// 		stop.onclick = function() {
// 			mediaRecorder.stop();
// 			console.log(mediaRecorder.state);
// 			console.log("recorder stopped");
// 			record.style.background = "";
// 			record.style.color = "";
// 			// mediaRecorder.requestData();
// 		}
//
// 		mediaRecorder.onstop = function(e) {
// 			console.log("data available after MediaRecorder.stop() called.");
//
// 			var clipName = prompt('Enter a name for your sound clip');
//
// 			var clipContainer = document.createElement('article');
// 			var clipLabel = document.createElement('p');
// 			var audio = document.createElement('audio');
// 			var deleteButton = document.createElement('button');
//
// 			clipContainer.classList.add('clip');
// 			audio.setAttribute('controls', '');
// 			deleteButton.innerHTML = "Delete";
// 			clipLabel.innerHTML = clipName;
//
// 			clipContainer.appendChild(audio);
// 			clipContainer.appendChild(clipLabel);
// 			clipContainer.appendChild(deleteButton);
// 			soundClips.appendChild(clipContainer);
//
// 			audio.controls = true;
// 			var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
// 			chunks = [];
// 			var audioURL = window.URL.createObjectURL(blob);
// 			audio.src = audioURL;
// 			console.log("recorder stopped");
//
// 			deleteButton.onclick = function(e) {
// 				evtTgt = e.target;
// 				evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
// 			}
// 		}
//
// 		mediaRecorder.ondataavailable = function(e) {
// 			chunks.push(e.data);
// 		}
// 	}
//
// 	var onError = function(err) {
// 		console.log('The following error occured: ' + err);
// 	}
//
// 	navigator.getUserMedia(constraints, onSuccess, onError);
// } else {
// 	console.log('getUserMedia not supported on your browser!');
// }





// function __log(e, data) {
// 	 log.innerHTML += "\n" + e + " " + (data || '');
//  }
//  var audio_context;
//  var recorder;
//  function startUserMedia(stream) {
// 	 var input = audio_context.createMediaStreamSource(stream);
// 	 __log('Media stream created.');
// 	 input.connect(audio_context.destination);
// 	 __log('Input connected to audio context destination.');
//
// 	 recorder = new Recorder(input);
// 	 __log('Recorder initialised.');
//  }
//  function startRecording(button) {
// 	 recorder && recorder.record();
// 	 button.disabled = true;
// 	 button.nextElementSibling.disabled = false;
// 	 __log('Recording...');
//  }
//  function stopRecording(button) {
// 	 recorder && recorder.stop();
// 	 button.disabled = true;
// 	 button.previousElementSibling.disabled = false;
// 	 __log('Stopped recording.');
//
// 	 // create WAV download link using audio data blob
// 	 createDownloadLink();
//
// 	 recorder.clear();
//  }
//  function createDownloadLink() {
// 	 recorder && recorder.exportWAV(function(blob) {
// 		 var url = URL.createObjectURL(blob);
// 		 var li = document.createElement('li');
// 		 var au = document.createElement('audio');
// 		 var hf = document.createElement('a');
//
// 		 au.controls = true;
// 		 au.src = url;
// 		 hf.href = url;
// 		 hf.download = new Date().toISOString() + '.wav';
// 		 hf.innerHTML = hf.download;
// 		 li.appendChild(au);
// 		 li.appendChild(hf);
// 		 recordingslist.appendChild(li);
// 	 });
//  }
//  window.onload = function init() {
// 	 try {
// 		 // webkit shim
// 		 window.AudioContext = window.AudioContext || window.webkitAudioContext;
// 		 navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
// 		 window.URL = window.URL || window.webkitURL;
//
// 		 audio_context = new AudioContext;
// 		 __log('Audio context set up.');
// 		 __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
// 	 } catch (e) {
// 		 alert('No web audio support in this browser!');
// 	 }
//
// 	 navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
// 		 __log('No live audio input: ' + e);
// 	 });
//  };

// var context = new window.AudioContext();
//
// var onFailSoHard = function(e) {
// 	console.log('Rejected!', e);
// };
//
// function hasGetUserMedia() {
// 	// Note: Opera builds are unprefixed.
// 	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
// 						navigator.mozGetUserMedia || navigator.msGetUserMedia);
// }
//
// if (hasGetUserMedia()) {
// 	navigator.webkitGetUserMedia({audio: true}, function (stream) {
// 			var input = me.context.createMediaStreamSource(stream);
// 			console.log('APi');
// 			me.recorder = new Recorder(input);
// 	}, onFailSoHard);
// } else {
// 	alert('getUserMedia() is not supported in your browser');
// }


var module = {
					 /**
						* @method init
						*/
					 init: function () {
							 var me = this;

							 window.onload = function () {
									 try {
											 window.AudioContext = window.AudioContext || window.webkitAudioContext  || window.mozAudioContext || window.msAudioContext;
											 navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
											 window.URL = window.URL || window.webkitURL || window.mozURL  || window.msURL;
											 me.context = new window.AudioContext();
											 me.context.createGain = me.context.createGain || me.context.createGainNode;
									 } catch (e) {
											 window.alert('Your browser does not support WebAudio, try Google Chrome');
									 }

									 if (navigator.getUserMedia) {
											 navigator.getUserMedia({audio: true}, function (stream) {
													 var input = me.context.createMediaStreamSource(stream);
													 me.recorder = new Recorder(input);
											 }, function (e) {
													 window.alert('Please enable your microphone to begin recording');
											 });
									 } else {
											 window.alert('Your browser does not support recording, try Google Chrome');
									 }
							 };
					 },
					 /**
						* @method cue
						*/
					 cue: function (url, callback) {
							 console.log('player.cue', url);
							 var me = this;
							 if (this.request) {
									 this.request.abort();
							 } else {
									 this.request = new XMLHttpRequest();
							 }
							 this.request.open('GET', url, true);
							 this.request.responseType = 'arraybuffer';
							 this.request.onload = function () {
									 console.log('player.cue.complete');
									 me.context.decodeAudioData(me.request.response, function (buffer) {
											 callback(buffer);
									 });
							 };
							 this.request.send();
					 },
					 /**
						* @method play
						*/
					 play: function (data, callback) {
							 console.log('player.play', this.context.currentTime, data);
							 var me = this,
									 source = this.context.createBufferSource(),
									 gainNode = this.context.createGain();
							 if (!source.start) { source.start = source.noteOn; }
							 if (!source.stop) { source.stop = source.noteOff; }
							 source.connect(gainNode);
							 gainNode.connect(this.context.destination);
							 source.buffer = data;
							 source.loop = true;
							 source.startTime = this.context.currentTime;
							 source.start(0);
							 return source;
					 },
					 /**
						* @method stop
						*/
					 stop: function (source) {
							 console.log('player.stop', this.context.currentTime, source);
							 if (source) {
									 source.stop(0);
							 }
					 },
					 /**
						* @method record
						*/
					 record: function () {
							 console.log('player.record', this.context.currentTime);
							 this.recorder.clear();
							 this.recorder.startTime = this.context.currentTime;
							 this.recorder.record();
					 },
					 /**
						* @method recordStop
						*/
					 recordStop: function (callback) {
							 var me = this;
							 console.log('player.recordStop', this.context.currentTime);
							 this.recorder.stop();
							 this.recorder.getBuffer(function (buffers) {
									 callback(buffers);
							 });
					 },
					 /**
						* @method sync
						*/
					 sync: function (action, target, param, callback) {
							 var me = this,
									 offset = (this.context.currentTime - target.startTime) % target.buffer.duration,
									 time = target.buffer.duration - offset;
							 console.log('player.sync', this.context.currentTime + time, action);
							 if (this.syncTimer) {
									 window.clearTimeout(this.syncTimer);
							 }
							 this.syncTimer = window.setTimeout(function () {
									 var returned = me[action](param);
									 if (callback) {
											 callback(returned);
									 }
							 }, time * 1000);
					 },
					 /**
						* @method createBuffer
						*/
					 createBuffer: function (buffers, channelTotal) {
							 var channel = 0,
									 buffer = this.context.createBuffer(channelTotal, buffers[0].length, this.context.sampleRate);
							 for (channel = 0; channel < channelTotal; channel += 1) {
									 buffer.getChannelData(channel).set(buffers[channel]);
							 }
							 return buffer;
					 },
					 /**
						* @method getOffset
						*/
					 getOffset: function (vocalsRecording, backingInstance, offset) {
							 var diff = (this.recorder.startTime + (offset / 1000)) - backingInstance.startTime;
							 console.log('player.getOffset', diff);
							 return {
									 before: Math.round((diff % backingInstance.buffer.duration) * this.context.sampleRate),
									 after: Math.round((backingInstance.buffer.duration - ((diff + vocalsRecording.duration) % backingInstance.buffer.duration)) * this.context.sampleRate)
							 };
					 },
					 /**
						* @method offsetBuffer
						*/
					 offsetBuffer: function (vocalsBuffers, before, after) {
							 console.log('player.offsetBuffer', vocalsBuffers, before, after);
							 var i = 0,
									 channel = 0,
									 channelTotal = 2,
									 num = 0,
									 audioBuffer = this.context.createBuffer(channelTotal, before + vocalsBuffers[0].length + after, this.context.sampleRate),
									 buffer = null;
							 for (channel = 0; channel < channelTotal; channel += 1) {
									 buffer = audioBuffer.getChannelData(channel);
									 for (i = 0; i < before; i += 1) {
											 buffer[num] = 0;
											 num += 1;
									 }
									 for (i = 0; i < vocalsBuffers[channel].length; i += 1) {
											 buffer[num] = vocalsBuffers[channel][i];
											 num += 1;
									 }
									 for (i = 0; i < after; i += 1) {
											 buffer[num] = 0;
											 num += 1;
									 }
							 }
							 return audioBuffer;
					 }
			 };

			 /* example additional code */

			 var offset = -150,
					 backing = null,
					 backingInstance = null,
					 backingOriginal = null,
					 vocals = null,
					 vocalsBuffers = null,
					 vocalsInstance = null,
					 vocalsOffset = null,
					 vocalsRecording = null;

			 module.init();

			 document.getElementById('play').addEventListener('click', function () {
					 module.cue('90bpm.wav', function (file) {
							 backing = file;
							 backingInstance = module.play(backing);
							 backingOriginal = backingInstance;
					 });
			 });

			 document.getElementById('stop').addEventListener('click', function () {
					 module.stop(backingInstance);
			 });

			 document.getElementById('play2').addEventListener('click', function () {
					 vocalsInstance = module.play(vocals);
			 });

			 document.getElementById('stop2').addEventListener('click', function () {
					 module.stop(vocalsInstance);
			 });

			 document.getElementById('record').addEventListener('click', function () {
					 vocals = null;
					 module.record();
			 });

			 document.getElementById('recordStop').addEventListener('click', function () {
					 module.recordStop(function (buffers) {
							 // calculate filled version for looping playback
							 vocalsBuffers = buffers;
							 vocalsRecording = module.createBuffer(vocalsBuffers, 2);
							 vocalsOffset = module.getOffset(vocalsRecording, backingOriginal, offset);
							 vocals = module.offsetBuffer(vocalsBuffers, vocalsOffset.before, vocalsOffset.after);
					 });
			 });

			 document.getElementById('recordSync').addEventListener('click', function () {
					 vocals = null;
					 module.sync('record', backingInstance);
			 });

			 document.getElementById('recordSyncStop').addEventListener('click', function () {
					 module.sync('recordStop', backingInstance, function (buffers) {
							 // calculate filled version for looping playback
							 vocalsBuffers = buffers;
							 vocalsRecording = module.createBuffer(vocalsBuffers, 2);
							 vocalsOffset = module.getOffset(vocalsRecording, backingOriginal, offset);
							 vocals = module.offsetBuffer(vocalsBuffers, vocalsOffset.before, vocalsOffset.after);
					 });
			 });

			 document.getElementById('playSync').addEventListener('click', function () {
					 module.sync('play', backingInstance, vocals, function (data) {
							 vocalsInstance = data;
					 });
			 });

			 document.getElementById('stopSync').addEventListener('click', function () {
					 module.sync('stop', backingInstance, vocalsInstance);
			 });

			 document.getElementById('offset').addEventListener('change', function (e) {
					 offset = e.target.value;
					 document.getElementById('offsetTotal').innerHTML = e.target.value;
					 vocalsOffset = module.getOffset(vocalsRecording, backingOriginal, offset);
					 vocals = module.offsetBuffer(vocalsBuffers, vocalsOffset.before, vocalsOffset.after);
					 // instant playback
					 module.stop(backingOriginal);
					 module.stop(backingInstance);
					 module.stop(vocalsInstance);
					 backingInstance = module.play(backing);
					 vocalsInstance = module.play(vocals);
			 });

			 document.getElementById('export').addEventListener('click', function () {
					 // export original recording
					 module.recorder.exportWAV(function(blob) {
							 var url = URL.createObjectURL(blob),
									 li = document.createElement('li'),
									 au = document.createElement('audio'),
									 hf = document.createElement('a');

							 au.controls = true;
							 au.src = url;
							 hf.href = url;
							 hf.download = new Date().toISOString().replace('T', '-').slice(0, -5) + '.wav';
							 hf.innerHTML = hf.download;
							 li.appendChild(au);
							 li.appendChild(hf);
							 document.getElementById('downloads').appendChild(li);
					 });
			 });

			 document.getElementById('export2').addEventListener('click', function () {
					 // export modified/filled recording
					 module.recorder.exportWAV(function(blob) {
							 var url = URL.createObjectURL(blob),
									 li = document.createElement('li'),
									 au = document.createElement('audio'),
									 hf = document.createElement('a');
							 au.controls = true;
							 au.src = url;
							 hf.href = url;
							 hf.download = new Date().toISOString().replace('T', '-').slice(0, -5) + (offset === '0' ? '-' + offset : offset) + 'ms.wav';
							 hf.innerHTML = hf.download;
							 li.appendChild(au);
							 li.appendChild(hf);
							 document.getElementById('downloads').appendChild(li);
					 }, 'audio/wav', vocalsOffset.before, vocalsOffset.after);
			 });









// CROSS BROWSING
// var video = document.querySelector('video');
//
// if (navigator.getUserMedia) {
//   navigator.getUserMedia({audio: true, video: true}, function(stream) {
//     video.src = stream;
//   }, onFailSoHard);
// } else if (navigator.webkitGetUserMedia) {
//   navigator.webkitGetUserMedia('audio, video', function(stream) {
//     video.src = window.webkitURL.createObjectURL(stream);
//   }, onFailSoHard);
// } else {
//   video.src = 'somevideo.webm'; // fallback.
// }
