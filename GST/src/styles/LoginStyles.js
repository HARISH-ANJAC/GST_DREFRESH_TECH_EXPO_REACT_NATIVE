import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../constants/colors";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: width * 0.08,
  },
  logo: {
    width: width * 0.55,
    height: height * 0.18,
    alignSelf: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: width < 350 ? 26 : 30,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 15,
    marginBottom: height * 0.04,
  },
  inputContainer: {
    marginBottom: height * 0.025,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    height: height * 0.06,
    borderWidth: 1.3,
    borderColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    marginTop: 4,
    color: COLORS.error,
    fontSize: 12,
  },
passwordWrapper: {
  flexDirection: "row",
  alignItems: "center",
  position: "relative",
},

eyeIcon: {
  position: "absolute",
  right: 12,
  top: 14, // adjust this value if needed for vertical centering
  zIndex: 3,
},
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  checkbox: {
    marginRight: 10,
  },
  rememberText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
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
    color: "#64748b",
    fontSize: 12,
    marginTop: 10,
  },
  scrollWrapper: {
  flexGrow: 1,
  justifyContent: "center",
  paddingHorizontal: width * 0.08,
  paddingBottom: 40,
},

});
