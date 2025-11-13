// components/ConfirmModal.jsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

const ConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "delete", // 'delete', 'warning', 'info'
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case "delete":
        return {
          icon: "delete",
          color: COLORS.error,
          backgroundColor: "#fee",
        };
      case "warning":
        return {
          icon: "warning",
          color: COLORS.warning,
          backgroundColor: "#fff9e6",
        };
      case "info":
        return {
          icon: "info",
          color: COLORS.primary,
          backgroundColor: "#e6f7ff",
        };
      default:
        return {
          icon: "help",
          color: COLORS.primary,
          backgroundColor: "#f0f0f0",
        };
    }
  };

  const { icon, color, backgroundColor } = getIconAndColor();

  const handleConfirm = () => {
    console.log("✅ User confirmed action:", {
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
    });
    onConfirm();
  };

  const handleCancel = () => {
    console.log("❌ User cancelled action:", {
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.modalHeader, { backgroundColor }]}>
            <MaterialIcons name={icon} size={32} color={color} />
            <Text style={styles.modalTitle}>{title}</Text>
          </View>

          {/* Body */}
          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>{message}</Text>
          </View>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: color }]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  modalBody: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    color: "#666",
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: COLORS.error,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ConfirmModal;