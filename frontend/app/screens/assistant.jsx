import React, { useState, useEffect } from 'react';
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
  const [isTyping, setIsTyping] = useState(false);

  const delayTyping = async (fullText) => {
    setIsTyping(true);
    let typed = "";
    for (let i = 0; i < fullText.length; i++) {
      await new Promise((res) => setTimeout(res, 15));
      typed += fullText[i];
      setMessages((prev) => [...prev.slice(0, -1), { text: typed, sender: "bot" }]);
    }
    setIsTyping(false);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newUserMessage = { text: inputText, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    const userMessage = inputText.toLowerCase();
    setInputText("");

    if (userMessage.includes("onion")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Could you please send me a picture of the affected tomato crop?", sender: "bot" }
        ]);
      }, 500);
    } else if (userMessage.includes("remedies") && userMessage.includes("image")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "", sender: "bot" }]);
        delayTyping(`Diagnosis Summary:
Your tomato crop in Illinois appears to be affected by Early Blight, a common fungal disease caused by Alternaria solani. With a disease presence of 21%, the infection is moderate and requires prompt but sustainable intervention. The disease typically begins as concentric brown spots on older leaves and progresses to defoliation, fruit rot, and yield loss if unchecked.

Suggested Treatment (Organic-focused):
1. Immediate Organic Treatment:
• Neem Oil Spray: Acts as a natural fungicide and insect repellent. Mix 1.5–2 tablespoons of cold-pressed neem oil per gallon of water and spray every 7–10 days.
• Copper-based Fungicides (OMRI listed): Use sparingly and as a last resort, as copper buildup can affect soil microbiota.
• Bacillus subtilis-based bio-fungicides (e.g., Serenade®): These are effective biological controls that target fungal spores without harming beneficial organisms.
2. Remove Affected Leaves:
• Prune and dispose of infected foliage carefully — do not compost it.
3. Improve Air Circulation:
• Stake or cage plants to keep leaves off the ground and ensure better airflow.

Environmental Impact Considerations:
• Reduced Pesticide Dependency: By choosing bio-fungicides and organic sprays, you minimize chemical runoff and reduce risk to pollinators and soil biodiversity.
• Sustainable Soil Health: Avoid copper overuse and encourage crop rotation to maintain microbial diversity and soil vitality.
• Water Management: Early blight thrives in humid conditions; avoid overhead watering and use drip irrigation when possible.

Preventive Steps for Nearby Crops:
• Crop Rotation: Avoid planting tomatoes or other solanaceous crops (potatoes, peppers, eggplants) in the same spot for at least 2 years.
• Sanitation: Clear debris from last season and sterilize tools.
• Mulching: Apply organic mulch to prevent soil splash and spore transfer.
• Disease-Resistant Varieties: Consider planting Early Blight-resistant tomato varieties next season (e.g., 'Mountain Magic', 'Defiant', or 'Iron Lady').

Timeline of Actions:
Day	Action
Day 0	Remove infected leaves and debris. Apply neem oil spray. Improve air circulation.
Day 7	Reapply neem oil or bio-fungicide. Monitor for new infections.
Day 14	Continue spraying if needed. Begin mulching and spacing adjustments.
Day 21+	Evaluate disease progress. If controlled, reduce spraying. Plan for resistant variety procurement.`);
      }, 500);
    } else if (userMessage.includes("fertilizer") || userMessage.includes("7 days")) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "", sender: "bot" }]);
        delayTyping(`🌿 7-Day Sustainable Action Plan
Crop: Tomato
Disease: Early Blight (21%)
Goal: Treat disease, improve plant health, minimize environmental impact

Day 1: Disease Management + Soil Prep
• Morning:
  o Remove heavily infected leaves to prevent spread.
  o Dispose of infected material off-site — not in compost.
• Evening:
  o Apply an organic copper-based fungicide or neem oil spray.
• Soil:
  o Lightly till topsoil and water to prep for fertilizer.

Day 2: Fertilizer Application
• Apply organic fertilizer:
  o NPK 5-10-10 or 4-6-8 (1–2 inches from the stem, not directly on it)
  o OR compost + bone meal + seaweed extract
• Water lightly after application.
• Mulch around the base (straw or shredded leaves) to retain nutrients and moisture.

Day 3: Monitor + Boost Immunity
• Inspect for any new infected leaves.
• Apply seaweed extract spray (foliar feed) to boost plant immunity.
• Maintain dry leaves by watering only at the base.

Day 4: Rest Day
• No spraying or fertilizing.
• Gently prune for airflow if needed.
• Ensure mulch is still intact.

Day 5: Second Organic Spray
• Reapply neem oil or copper fungicide (if needed).
• Target early morning or sunset to avoid sunlight burn.
• Check undersides of leaves for new signs of blight.

Day 6: Support Growth
• Apply fish emulsion or another nitrogen-light organic liquid feed.
• Monitor for fruit development, prune lower stems if they touch soil.

Day 7: Evaluation & Adjustment
• Assess plant vigor and disease progress.
• Take pictures and notes to track improvement.
• If disease persists or worsens beyond 25–30%, consider rotating crops next season.

✅ Summary Recommendations:
• 🧪 Fertilizers: Compost, Bone Meal, Seaweed, Fish Emulsion, NPK 5-10-10
• 🌾 Sprays: Neem Oil / Copper Fungicide (organic, alternate every 3–4 days if needed)
• 🛡️ Prevention: Mulch, good airflow, disease-free seeds, base watering only
• 🌍 Sustainability: No chemical runoffs, disease forecasting with early detection, soil conservation practices`);
      }, 1000);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Would you like help with any of the following?",
            sender: "bot",
            buttons: ["Crop Health", "Weather Forecast", "Fertilizer Advice"],
          },
        ]);
      }, 1000);
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
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("image", {
        uri,
        name: filename,
        type,
      });

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