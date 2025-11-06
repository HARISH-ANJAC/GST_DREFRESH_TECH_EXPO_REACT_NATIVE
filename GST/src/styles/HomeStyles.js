import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../constants/colors"; // Make sure this path is correct

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.15, // Ensure space for FAB
  },
  listHeader: {
    marginBottom: height * 0.02,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: width * 0.055,
    fontWeight: "700",
    color: COLORS.text,
  },
  listItems:{
    fontSize:width*0.04,
    fontWeight:'700',
    color:COLORS.text,
  },
  // Bill Card Styles
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: height * 0.015,
  },
  customerName: {
    fontSize: width * 0.045,
    fontWeight: "600",
    color: COLORS.text,
    // flex: 1, // Removed, wrapper in JSX will handle layout
  },
  totalAmount: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 10,
  },
  cardBody: {
    marginBottom: height * 0.015,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: width * 0.038,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: width * 0.038,
    color: COLORS.text,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingTop: height * 0.015,
  },
  badge: {
    fontSize: width * 0.032,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: "#fff",
    fontVariant:'small-caps',
    overflow: "hidden", // for borderRadius on text
  },
  InsideTNBadge: {
    backgroundColor: COLORS.success, // e.g., green
  },
  OutsideTNBadge: {
    backgroundColor: COLORS.error, // e.g., orange
  },
  PreviewText:{
    color:COLORS.primary,
    fontSize:14,
    fontWeight:'600'
  },
  actionButton: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly',
    gap:'4%',
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}20`, // Light primary background
  },

  // Floating Action Button (FAB)
  fab: {
    position: "absolute",
    bottom: height * 0.04,
    right: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

