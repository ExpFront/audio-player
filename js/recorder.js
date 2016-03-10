(function(window) {

	var WORKER_PATH = 'js/recorderjs/recorderWorker.js';

	var Recorder = function(source, cfg) {
		var config = cfg || {};
		var bufferLen = config.bufferLen || 4096;
		this.context = source.context;

		if (!this.context.createScriptProcessor) {
			this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
		} else {
			this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
		}

		var worker = new Worker(config.workerPath || WORKER_PATH);

		worker.postMessage({
			command: 'init',
			config: {
				sampleRate: this.context.sampleRate
			}
		});

		var recording = false, currCallback;

		this.node.onaudioprocess = function(e) {

			if (!recording) {
				return;
			}

			worker.postMessage({
				command: 'record',
				buffer: [
					e.inputBuffer.getChannelData(0),
					e.inputBuffer.getChannelData(1)
				]
			});
		}

		this.configure = function(config) {
			for (var prop in config) {
				if (cfg.hasOwnProperty(prop)){
					config[prop] = cfg[prop];
				}
			}
		}

		this.record = function() {
			recording = true;
		}

		this.stop = function() {
			recording = false;
		}

		this.clear = function() {
			worker.postMessage({ command: 'clear' });
		}

		this.getBuffers = function(cb) {
			currCallback = cb || config.callback;
			worker.postMessage({ command: 'getBuffers' })
		}

		this.exportWAV = function(cb, type) {
			currCallback = cb || config.callback;
			type = type || config.type || 'audio/wav';

			if (!currCallback) {
				throw new Error('Callback not set');
			}

			worker.postMessage({
				command: 'exportWAV',
				type: type
			});
		}

		this.exportMonoWAV = function(cb, type) {
			currCallback = cb || config.callback;
			type = type || config.type || 'audio/wav';

			if (!currCallback) {
				throw new Error('Callback not set');
			}

			worker.postMessage({
				command: 'exportMonoWAV',
				type: type
			});
		}

		worker.onmessage = function(e) {
			var blob = e.data;
			currCallback(blob);
		}

		source.connect(this.node);
		this.node.connect(this.context.destination);
	};

	Recorder.setupDownload = function(blob, filename) {
		var file = (window.URL || window.webkitURL).createObjectURL(blob);
		var btn_upload = document.querySelector('.btn-upload');
		var btn_play = document.querySelector('.btn-play');

		btn_upload.onclick = function() {
			$.ajax({
				type: 'POST',
				url: 'server_path',
				data: file,
				contentType: false,
				cache: false,
				processData: false
			});
		};

		var wave = document.querySelector('#waveform'); // To clear after repeat
		wave.innerHTML = '';

		var wavesurfer = WaveSurfer.create({
			container: '#waveform',
			waveColor: '#2d83d9 ',
			progressColor: '#96c1ec'
		});

		wavesurfer.load(file);

		btn_play.onclick = function() {
			console.log(file);
			wavesurfer.playPause();
		};

		// link.download = filename || 'output.wav';
	}

	window.Recorder = Recorder;

})(window);
