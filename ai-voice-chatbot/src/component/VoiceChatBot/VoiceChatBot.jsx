import React, { useState, useRef } from "react";
import {
  Layout,
  Input,
  Button,
  List,
  Avatar,
  Spin,
  Alert,
  Flex,
  Typography,
  message as antdMessage,
} from "antd";
import {
  AudioOutlined,
  SendOutlined,
  StopOutlined,
  UserOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import "./VoiceChatBot.css"; // Assuming you have some styles in this file

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

export default function VoiceChatBot() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunks = useRef([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  const appendMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const handleSendText = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    appendMessage("user", input);
    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
    const file = new File([audioBlob], "input.webm", { type: "audio/webm" });

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("message", input);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/ask", {
        method: "POST",
        body: formData,
      });
      setIsLoading(false);

      const data = await res.json();
      if (data?.response) {
        appendMessage("bot", data.response);
        // if (data.audio_url) {
        //   // const audio = new Audio(data.audio_url);
        //   // audio.play();
        // }
      }
    } catch (err) {
      antdMessage.error("Failed to fetch AI response");
      setIsLoading(false);
    }

    setInput("");
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    audioChunks.current = [];

    recorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const file = new File([audioBlob], "input.webm", { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", file);
      formData.append("message", "");

      try {
        setIsLoading(true);
        const response = await fetch("http://127.0.0.1:5000/api/ask", {
          method: "POST",
          body: formData,
        });
        setIsLoading(false);

        const data = await response.json();
        if (data?.text) appendMessage("bot", data.text);

        if (data.audio_url) {
          const aiAudio = new Audio(data.audio_url);
          aiAudio.play();
        } else {
          antdMessage.error("No audio returned from backend");
        }
      } catch (error) {
        setIsLoading(false);
        antdMessage.error("Voice upload failed");
      }
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", minWidth:"90vh", background: "#f0f2f5" }}>
      {
        isLoading && (
          <Spin tip="Loading...">
          <Alert
            message="Qwik AI Loading"
            description="I am here to help! Please wait while I process your request."
            type="info"
          />
        </Spin>
        )
      }
      <Header style={{ background: "#001529", color: "#fff", fontSize: 20 }}>
        🤖 Qwik AI Voice & Chat Assistant
      </Header>

      <Content style={{ padding: "2rem", maxWidth: 1600, margin: "auto" }}>
        <List
          bordered
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              style={{
                background: item.role === "user" ? "#e6f7ff" : "#f9f0ff",
                width:"40vw",
                overflow: "hidden",
                justifyContent:
                  item.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <List.Item.Meta
                avatar={
                  item.role === "user" ? (
                    <Avatar icon={<UserOutlined />} />
                  ) : (
                    <Avatar icon={<RobotOutlined />} />
                  )
                }
                title={item.role === "user" ? "Divyanshu Goyal" : "Qwik Ai Assistant"}
                description={<Typography.Text>{item.text}</Typography.Text>}
              />
            </List.Item>
          )}
          style={{
            marginBottom: "1rem",
            background: "#fff",
            borderRadius: 8,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        />

        <TextArea
          value={input}
          style={{
            resize: "none",
            borderRadius: 8,
            borderColor: "#d9d9d9",
            width:"40vw",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "border-color 0.3s, box-shadow 0.3s",
            
          }}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSendText();
            }
          }}
          rows={3}
          placeholder="Type your message..."
        />

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendText}
          >
            Send
          </Button>

          <Button
            type="dashed"
            icon={isRecording ? <StopOutlined /> : <AudioOutlined />}
            danger={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? "Stop" : "Record"}
          </Button>
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        This AI Chatbot is Built by me using React + Gemini and Ant Designs
      </Footer>
    </Layout>
  );
}
