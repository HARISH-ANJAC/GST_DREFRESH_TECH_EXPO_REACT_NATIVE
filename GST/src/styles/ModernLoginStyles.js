import { StyleSheet, Dimensions } from "react-native";
// Ensure this path points to your new colors.js file
import { COLORS } from "../constants/colors";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: width * 0.08,
    paddingVertical: 20, // Add vertical padding
  },
  logo: {
    width: width * 0.5,
    height: height * 0.15,
    alignSelf: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: width < 350 ? 28 : 32, // Larger font
    fontWeight: "700",
    color: COLORS.text, // Use new text color
    textAlign: "center",
    marginBottom: 8,
  },
  subText: {
    textAlign: "center",
    color: "#64748b", // A neutral gray
    fontSize: 16, // Slightly larger
    marginBottom: height * 0.04,
  },
  inputContainer: {
    marginBottom: height * 0.025,
  },
  label: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 8, // More space
    fontWeight: "600",
  },
  input: {
    height: 50, // Standard height
    borderWidth: 1,
    borderColor: "#cbd5e1", // Light gray border
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: "#f8fafc", // Slight off-white background
  },
  inputError: {
    borderColor: COLORS.error, // Use new error color
    backgroundColor: "#fee2e2", // Light red background for error
  },
  errorText: {
    marginTop: 5,
    color: COLORS.error,
    fontSize: 13,
    fontWeight: "500",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    height: "100%", // Make icon vertically centered
    justifyContent: "center",
    paddingLeft: 5, // Add some padding
    zIndex: 3,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10, // Add space above
  },
  checkbox: {
    marginRight: 10,
  },
  rememberText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  // Dedicated style for API errors
  apiErrorText: {
    color: COLORS.error,
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 10, // Space below error
  },
  button: {
    backgroundColor: COLORS.primary, // Use new primary color
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Softer shadow
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: "center",
    color: "#64748b", // Neutral gray
    fontSize: 13,
    marginTop: 15,
    paddingBottom: 10, // Ensure it's not cut off
  },
});
