import React, { useState, useRef } from "react";

export default function VoiceChatBot() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunks.current = [];

    recorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const file = new File([audioBlob], "input.webm", { type: "audio/webm" });

      // Send the audio file to backend
      const formData = new FormData();
      formData.append("audio", file);

      try {
        const response = await fetch("http://localhost:5000/api/ask", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.audioUrl) {
          const aiAudio = new Audio(data.audioUrl);
          aiAudio.play();
          setAudioUrl(data.audioUrl); // for reference
        } else {
          alert("Failed to get audio URL.");
        }
      } catch (error) {
        console.error("Upload failed", error);
      }
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎙️ AI Voice Chatbot</h2>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={styles.button}
      >
        {isRecording ? "⏹️ Stop" : "🎤 Start Recording"}
      </button>

      {audioUrl && (
        <p>
          Response URL: <a href={audioUrl} target="_blank" rel="noreferrer">Play Again</a>
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
    fontFamily: "Arial",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
};
