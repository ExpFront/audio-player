function drawBuffer( width, height, context, data ) {
	var step = Math.ceil( data.length / width );
	var amp = height / 2;
	context.fillStyle = '#373A3C';
	context.lineWidth = 2;
	context.clearRect(0, 0, width, height);
	console.log(data);
	for (var i = 0; i < width; i++) {
		var min = 1.0;
		var max = -1.0;

		for (j = 0; j < step; j++) {
			var datum = data[(i * step) + j];

			if (datum < min) {
				min = datum;
			}

			if (datum > max) {
				max = datum;
			}
		}
		context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
	}
}

//
//
// if (!analyserContext) {
// 	var canvas = document.querySelector('.wavedisplay');
// 	canvasWidth = canvas.width;
// 	canvasHeight = canvas.height;
// 	analyserContext = canvas.getContext('2d');
// }
// var recorder_duration = document.querySelector('.recorder-duration');
// // analyzer draw code here
// {
// 	var SPACING = 3;
// 	var BAR_WIDTH = 1;
// 	var numBars = Math.round(canvasWidth / SPACING);
// 	var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
//
// 	analyserNode.getByteFrequencyData(freqByteData);
//
// 	analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
// 	analyserContext.fillStyle = '#373A3C';
// 	analyserContext.lineCap = 'round';
// 	var multiplier = analyserNode.frequencyBinCount / numBars;
// 	// Draw rectangle for each frequency bin.
// 	for (var i = 0; i < numBars; ++i) {
// 		var magnitude = 0;
// 		var offset = Math.floor( i * multiplier );
// 		// gotta sum/average the block, or we miss narrow-bandwidth spikes
// 		for (var j = 0; j < multiplier; j++) {
// 			magnitude += freqByteData[offset + j];
// 		}
//
// 		magnitude = magnitude / multiplier;
// 		var magnitude2 = freqByteData[i * multiplier];
// 		console.log(-magnitude);
// 		analyserContext.fillStyle = 'hsl( ' + Math.round((i * 360) / numBars) + ', 100%, 50%)';
// 		analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
// 	}
// }
//
// rafID = window.requestAnimationFrame( updateAnalysers );
