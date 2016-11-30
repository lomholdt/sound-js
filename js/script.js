if(navigator.mediaDevices){
	console.info('getUserMedia supported');

	var start = document.querySelector('#start');
	var stop = document.querySelector('#stop');

	stop.disabled = true;

	var constraints = { audio: true };
	var chunks = [];

	var onSuccess = (stream) => {
		var mediaRecorder = new MediaRecorder(stream);

		start.onclick = () => {
			mediaRecorder.start();
			console.info(mediaRecorder.state);
			start.style.background = "red";
			stop.disabled = false;
			start.disabled = true;
		}

		stop.onclick = () => {
			mediaRecorder.stop();
			console.log(mediaRecorder.state);
			start.style.background = "";
			start.style.color = "";

			stop.disabled = true;
			start.disabled = false;
		}

		mediaRecorder.onstop = (e) => {
			console.info("Data ready.");
			var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
			var audioURL = window.URL.createObjectURL(blob);
			chunks = [];
			getFile('recording.ogg', audioURL);
		}

		mediaRecorder.ondataavailable = (e) => {
			chunks.push(e.data);
		}
	};

	var onError = (err) => {
		console.info('Error: ' + err);
	}

	var getFile = (filename, objectUrl) => {
		var a = document.createElement('a');
		a.href = objectUrl;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			window.URL.revokeObjectURL(objectUrl);
		}, 1);
	}

	navigator.getUserMedia(constraints, onSuccess, onError);

} else {
	console.info('getUserMedia is not supported');
}
