// HomeStyles.js
import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../constants/colors"; // ✅ Ensure this import path is correct

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // 🔹 Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
mainContent: {
  flex: 1,
  backgroundColor: COLORS.background,
  paddingHorizontal: width * 0.01,
  paddingTop: height * 0.01,
  paddingBottom: height * 0.04,
  // no bottom padding, center states correctly
},

  // 🔹 FlatList
  listContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
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
  listItems: {
    fontSize: width * 0.04,
    fontWeight: "700",
    color: COLORS.text,
  },

  // 🔹 Loader
loaderWrapper: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: width * 0.05,
  backgroundColor: COLORS.background,
},
  loadingText: {
    marginTop: 10,
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // 🔹 Error
errorWrapper: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: width * 0.1,
  backgroundColor: COLORS.background,
},
  errorText: {
    fontSize: width * 0.04,
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: width * 0.04,
  },

  // 🔹 Empty List
emptyWrapper: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: width * 0.1,
  backgroundColor: COLORS.background,
},
  emptyText: {
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // 🔹 Bill Card
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

  // 🔹 Status Badge
  badge: {
    fontSize: width * 0.032,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: "#fff",
    fontVariant: ["small-caps"],
    overflow: "hidden",
  },
  InsideTNBadge: {
    backgroundColor: COLORS.success, // ✅ Example: Green
  },
  OutsideTNBadge: {
    backgroundColor: COLORS.error, // ✅ Example: Red/Orange
  },

  // 🔹 Preview Button
  PreviewText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: "4%",
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}20`, // Light tinted primary
  },

  // 🔹 Delete Swipe
  swipeableContainer: {
    marginVertical: 4,
  },
  deleteContainer: {
    width: 80,
    height: "100%",
    marginLeft: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 8,
  },
  deleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  // 🔹 Floating Action Button (FAB)
  fab: {
    position: "absolute",
    bottom: height * 0.01,
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
