import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';

const { width, height } = Dimensions.get('window');

export const GLOBAL_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // White clean background
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.01,
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: width < 350 ? 22 : 28,
    color: COLORS.text, // Deep navy text
    fontWeight: 'bold',
    marginBottom: 10,
  },

  AppBarWrappercontainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

appBar: {
  backgroundColor: "#0F172A", // Deep navy modern tone
  width: "100%",
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  paddingBottom: 10,
},

appBarContent: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
},

appBarLeft: {
  flexDirection: "column",
  alignItems: "baseline",
  justifyContent:'space-between',
  gap: 4,
},

greetingText: {
  color: "#E5E7EB", // light gray for subtle “Hi,”
  fontSize: 15,
  fontWeight: "400",
},

userNameText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "700",
},

appBarCenter: {
  position: "absolute",
  left: 0,
  right: 0,
  alignItems: "center",
},

appBarTitle: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "700",
  letterSpacing: 0.5,
},

logoutButton: {
  backgroundColor: "#EF4444", // soft red
  padding: 8,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

});
