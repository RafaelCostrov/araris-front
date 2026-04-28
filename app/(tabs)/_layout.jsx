import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { House, ChartColumnIncreasing, Plus, Landmark, BotMessageSquare } from "lucide-react-native";

function TabBackground() {
  if (Platform.OS === "android") return null;
  return <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />;
}

function CenterButton({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.centerButtonWrapper}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.centerButton}>
        <Plus color="#fff" size={26} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarBackground: () => <TabBackground />,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{
          tabBarIcon: ({ color, size }) => <ChartColumnIncreasing color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add/index"
        options={{
          tabBarButton: (props) => <CenterButton onPress={props.onPress} />,
        }}
      />
      <Tabs.Screen
        name="irs/index"
        options={{
          tabBarIcon: ({ color, size }) => <Landmark  color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chatbot/index"
        options={{
          tabBarIcon: ({ color, size }) => <BotMessageSquare color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: Platform.OS === "android" ? "rgba(255,255,255,0.98)" : "transparent",
    borderTopWidth: 0,
    elevation: 0,
  },
  tabItem: {
    paddingTop: 10,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: -5,
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
});