import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { LinearGradient } from 'expo-linear-gradient';

export default function Assistant() {
  const [messages, setMessages] = useState([
    { text: "Hi! I’m FarmR.ai. How can I help you today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = async () => {
    if (!inputText.trim()) return;
  
    // Add user message to chat
    const userMessage = { text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const prompt = inputText;
    setInputText("");
  
    try {
      const response = await fetch("http://localhost:5001/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
  
      const botReply = {
        text: data.result || "I'm still learning! Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Failed to get response from backend", err);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong. Please try again.", sender: "bot" },
      ]);
    }
  };
  

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.7,
        base64: false,
      });
    
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const localUri = uri;
        const filename = uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
    
        const formData = new FormData();
        formData.append("image", {
          uri: localUri,
          name: filename,
          type,
        });
    
        // Show user message with image
        setMessages((prev) => [...prev, { image: uri, sender: "user" }]);
    
        try {
          const response = await fetch("http://localhost:5001/api/images/upload", {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          });
    
          const data = await response.json();
    
          // Show bot response with analysis
          setMessages((prev) => [
            ...prev,
            {
              text: data.analysis || "Image received!",
              sender: "bot",
            },
          ]);
        } catch (err) {
          console.error("Upload failed", err);
        }
      }
  };

  const renderMessage = (msg, index) => (
    <View
      key={index}
      style={[
        styles.messageRow,
        msg.sender === "user" ? styles.userRow : styles.botRow,
      ]}
    >
      <Image
        source={
          msg.sender === "user"
            ? require("../../assets/images/user-avatar.png")
            : require("../../assets/images/bot-avatar.png")
        }
        style={styles.avatar}
      />

      <View
        style={[
          styles.messageBubble,
          msg.sender === "user" ? styles.userBubble : styles.botBubble,
        ]}
      >
        {msg.text && <Text style={styles.messageText}>{msg.text}</Text>}

        {msg.image && (
          <Image source={{ uri: msg.image }} style={styles.messageImage} />
        )}

        {msg.buttons && (
          <View style={styles.buttonContainer}>
            {msg.buttons.map((btn, i) => (
              <TouchableOpacity key={i} style={styles.chatButton}>
                <Text style={styles.chatButtonText}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => renderMessage(msg, index))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.iconBtn}>
            <Ionicons name="image-outline" size={22} color={colors.primaryDark} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#E0F7FA',
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.text,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 22,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.text,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: colors.primaryDark,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chatButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chatButtonText: {
    fontFamily: fonts.SemiBold,
    color: colors.primaryDark,
    fontSize: 14,
  },
});
