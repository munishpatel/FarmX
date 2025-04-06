import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// API Configuration
const API_CONFIG = {
  development: 'http://localhost:5001',
  production: 'https://your-production-api.com',
};

// File changed

const API_URL = API_CONFIG.development;

const AssistantScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const scrollViewRef = useRef(null);

  // Check API connection on component mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "test connection"
        }),
      });
      
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server. Please check if the server is running.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setIsConnected(false);
      Alert.alert(
        'Connection Error',
        'Unable to connect to the server. Please check if the server is running.',
        [{ text: 'OK' }]
      );
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !isConnected) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        const assistantMessage = {
          id: Date.now() + 1,
          text: data.result.response,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          sources: data.result.sources
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}`,
        sender: 'error',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // If connection error, try to reconnect
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        checkApiConnection();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isError = message.sender === 'error';

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage,
        isError && styles.errorMessage
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.assistantMessageText,
          isError && styles.errorMessageText
        ]}>
          {message.text}
        </Text>
        {message.sources && (
          <View style={styles.sourcesContainer}>
            <Text style={styles.sourcesTitle}>Sources:</Text>
            {message.sources.map((source, index) => (
              <Text key={index} style={styles.sourceText}>
                {source.agent}: {source.result.status}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
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

  return (
    <LinearGradient colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {!isConnected && (
          <View style={styles.connectionBanner}>
            <Text style={styles.connectionText}>Not connected to server</Text>
            <TouchableOpacity onPress={checkApiConnection} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => renderMessage(msg))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primaryDark} />
              <Text style={styles.loadingText}>Processing your query...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={handleImagePick} style={styles.iconBtn}>
            <Ionicons name="image-outline" size={22} color={colors.primaryDark} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, !isConnected && styles.inputDisabled]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={isConnected ? "Ask about sustainable farming..." : "Server disconnected"}
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={isConnected && !isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (isLoading || !isConnected) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isLoading || !inputText.trim() || !isConnected}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

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
    backgroundColor: colors.primaryDark,
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
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
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
  sendButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  iconBtn: {
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.Regular,
  },
  connectionBanner: {
    backgroundColor: '#FFE5E5',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: fonts.Regular,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: fonts.Regular,
  },
  inputDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sourcesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sourcesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: fonts.SemiBold,
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
    fontFamily: fonts.Regular,
  },
});

export default AssistantScreen;
