import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../constants/colors";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContainer: {
    padding: width * 0.05,
    paddingBottom: 100, // Space for button
  },
  header: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 5,
  },
  shopName: {
    fontSize: width * 0.045,
    color: COLORS.text,
    fontWeight: "500",
  },
  shopAddress: {
    fontSize: width * 0.038,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  // --- Info Sections ---
  section: {
    marginBottom: height * 0.02,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  infoBox: {
    width: "48%",
  },
  sectionTitle: {
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingBottom: 4,
  },
  infoText: {
    fontSize: width * 0.04,
    color: COLORS.text,
    marginBottom: 4,
  },
  infoTextBold: {
    fontWeight: "600",
  },

  // --- Products Table ---
  table: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
    marginTop: height * 0.01,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.inputBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  th: {
    fontSize: width * 0.035,
    fontWeight: "700",
    color: COLORS.text,
    padding: 10,
    textAlign: "left",
  },
  thName: { flex: 3 },
  thQty: { flex: 1, textAlign: "right" },
  thPrice: { flex: 2, textAlign: "right" },
  thTotal: { flex: 2, textAlign: "right" },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  td: {
    fontSize: width * 0.035,
    color: COLORS.text,
    padding: 10,
    textAlign: "left",
  },
  tdName: { flex: 3 },
  tdQty: { flex: 1, textAlign: "right" },
  tdPrice: { flex: 2, textAlign: "right" },
  tdTotal: { flex: 2, textAlign: "right", fontWeight: "600" },

  // --- Totals Section ---
  totalsContainer: {
    marginTop: height * 0.03,
    alignSelf: "flex-end",
    width: "60%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: width * 0.04,
    color: COLORS.text,
    fontWeight: "600",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 2,
  },
  grandTotalLabel: {
    fontSize: width * 0.05,
    color: COLORS.text,
    fontWeight: "700",
  },
  grandTotalValue: {
    fontSize: width * 0.05,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
