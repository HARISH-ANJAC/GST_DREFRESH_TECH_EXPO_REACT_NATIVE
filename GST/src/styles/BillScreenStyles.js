import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS } from "../constants/colors"; // Make sure this path is correct

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // --- Containers ---
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: width * 0.05,
    paddingBottom: height * 0.1, // Ensure space at bottom
  },
  sectionContainer: {
    marginBottom: height * 0.03,
  },

  // --- Typography ---
  headerTitle: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingBottom: 8,
  },

  // --- Form & Input Elements ---
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.015,
  },
  inputWrapper: {
    width: "48%",
  },
  inputWrapperThird: {
    width: "32%",
  },
  inputWrapperFull: {
    width: "100%",
    marginBottom: height * 0.015,
  },
  label: {
    fontSize: width * 0.038,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 52,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: width * 0.04,
    color: COLORS.text,
  },
  dropdownTouchable: {
    height: 52,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: width * 0.04,
    color: COLORS.text,
  },
  dateText: {
    fontSize: width * 0.04,
    color: COLORS.text,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // --- Product Card ---
  productCard: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  productHeader: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: height * 0.015,
    paddingBottom: 10,
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 1,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.errorBackground,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  // --- Buttons ---
  addProductButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.02,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  addProductButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "600",
    marginLeft: 10,
  },
  // --- Bottom CTA ---
  bottomCtaContainer: {
    paddingHorizontal: width * 0.05,
    // Add extra padding at the bottom for iOS devices with home bar
    paddingBottom: Platform.OS === "ios" ? height * 0.04 : height * 0.01,
    backgroundColor: COLORS.background, // Use background color
    borderTopWidth: 1, // Add a separator line
    borderTopColor: COLORS.borderColor,
    // Optional: add a subtle shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },

  ButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBlock: '0.1%',
  },
  saveButton: {
    backgroundColor: COLORS.success,
    height: height * 0.05,
    borderRadius: 10,
    paddingInline: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.01,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
    fontWeight: "700",
  },

  // --- Totals Section ---
  totalsContainer: {
    paddingTop: height * 0.01,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: width * 0.034,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: width * 0.034,
    color: COLORS.text,
    fontWeight: "600",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 2,
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 1,
  },
  grandTotalLabel: {
    fontSize: width * 0.04,
    color: COLORS.text,
    fontWeight: "700",
  },
  grandTotalValue: {
    fontSize: width * 0.04,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
