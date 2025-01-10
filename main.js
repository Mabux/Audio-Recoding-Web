let mediaRecorder;
let audioChunks = [];

const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const recordingsList = document.getElementById('recordings');

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      displayRecording(audioUrl);
      audioChunks = [];
    };

    mediaRecorder.start();
    recordButton.disabled = true;
    stopButton.disabled = false;
    recordButton.classList.add('recording');
  } catch (err) {
    console.error('Error accessing microphone:', err);
    alert('Error accessing microphone. Please ensure you have granted microphone permissions.');
  }
}

function stopRecording() {
  mediaRecorder.stop();
  mediaRecorder.stream.getTracks().forEach(track => track.stop());
  recordButton.disabled = false;
  stopButton.disabled = true;
  recordButton.classList.remove('recording');
}

function displayRecording(audioUrl) {
  const recordingItem = document.createElement('div');
  recordingItem.className = 'recording-item';
  
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = audioUrl;
  
  const downloadButton = document.createElement('button');
  downloadButton.textContent = 'Download';
  downloadButton.onclick = () => {
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `recording-${new Date().getTime()}.wav`;
    a.click();
  };
  
  recordingItem.appendChild(audio);
  recordingItem.appendChild(downloadButton);
  recordingsList.prepend(recordingItem);
}

recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
