import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { PaperAirplaneIcon, MicrophoneIcon, StopIcon } from "@heroicons/react/24/solid";

export default function ModernVoiceChatbot() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const audioChunks = useRef([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const updateChat = (sender, message) => {
    setChat((prev) => [...prev, { sender, message }]);
  };

  const handleTextSubmit = async () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    updateChat("user", userInput);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      const botReply = data.text || "No response";
      const audioUrl = data.audio_url;

      updateChat("bot", botReply);
      if (audioUrl) new Audio(audioUrl).play();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the server.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
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

        const formData = new FormData();
        formData.append("audio", file);

        setLoading(true);
        try {
          const res = await fetch("http://127.0.0.1:5000/api/ask", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          const botReply = data.text || "Voice processed";
          const audioUrl = data.audio_url;

          updateChat("user", "🎤 Voice Message");
          updateChat("bot", botReply);
          if (audioUrl) new Audio(audioUrl).play();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to send audio to the server.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone error",
        description: "Could not access your microphone.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <Flex direction="column" h="100vh" maxW="3xl" mx="auto" bg="white" shadow="md" borderRadius="md" overflow="hidden">
      <Box flex="1" p={4} overflowY="auto" bg="gray.50" >
        <VStack spacing={4} align="stretch">
          {chat.map((msg, idx) => (
            <Box
              key={idx}
              maxW="60%"
              alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
              bg={msg.sender === "user" ? "blue.600" : "gray.200"}
              color={msg.sender === "user" ? "white" : "gray.800"}
              px={4}
              py={2}
              borderRadius="lg"
              wordBreak="break-word"
            >
              {msg.message}
            </Box>
          ))}
          {loading && (
            <Spinner alignSelf="center" />
          )}
        </VStack>
      </Box>

      <Flex p={4} borderTop="1px" borderColor="gray.200" bg="white" align="center" gap={2}>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
          flex="1"
          borderColor="gray.300"
          _focus={{ ring: 2, ringColor: "blue.500" }}
        />
        <Button
          colorScheme="blue"
          onClick={handleTextSubmit}
          aria-label="Send message"
          p={3}
          borderRadius="md"
        >
          <PaperAirplaneIcon style={{ width: 20, height: 20, transform: "rotate(45deg)" }} />
        </Button>
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          p={3}
          borderRadius="md"
          bg={isRecording ? "red.600" : "gray.200"}
          color={isRecording ? "white" : "gray.800"}
          _hover={{ bg: isRecording ? "red.700" : "gray.300" }}
          _active={{ bg: isRecording ? "red.800" : "gray.400" }}
        >
          {isRecording ? (
            <StopIcon style={{ width: 20, height: 20 }} />
          ) : (
            <MicrophoneIcon style={{ width: 20, height: 20 }} />
          )}
        </Button>
      </Flex>
    </Flex>
  );
}
