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
    width: "100%",
    height: height * 0.1,
    backgroundColor: COLORS.primary, // Brand orange header
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: COLORS.text, // Deep navy shadow tone
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 32,
  },

  appBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: width * 0.05,
  },

  greetingText: {
    color: COLORS.background, // White for clarity over orange
    fontSize: height * 0.018,
    opacity: 0.9,
  },

  appBarTitle: {
    color: COLORS.background, // White title text
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 1,
  },

  logoutButton: {
    padding: height * 0.01,
    borderRadius: 8,
    backgroundColor: COLORS.text, // Deep navy instead of red
  },
});
