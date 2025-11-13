import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GLOBAL_STYLES } from "../constants/styles";
import { styles } from "../styles/HomeStyles";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import useAuth from "../components/useAuth";
import { COLORS } from "../constants/colors";
import { formatDate } from "../Utils/DateUtils";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FETCH_INVOICES } from "../constants/url";
import Swipeable from "react-native-gesture-handler/Swipeable";
import ConfirmModal from "../components/ConfirmModal";

// 🗑️ Delete Button Component
const DeleteButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.deleteContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.deleteButton}>
        <MaterialIcons name="delete" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </View>
    </TouchableOpacity>
  );
};

// 🧾 BillCard Component
const BillCard = ({ item, onPress, onDelete }) => {
  const swipeableRef = useRef(null);
  const { UserData } = useAuth();
  
  const formatTotal = (total) => {
    if (!total) return "0.00";
    const numberTotal = typeof total === "string" ? parseFloat(total) : total;
    return isNaN(numberTotal) ? "0.00" : numberTotal.toFixed(2);
  };

  const handleDelete = () => {
    console.log("🗑️ Delete button tapped for:", item.id, UserData?.USER_ID);
    onDelete(item);
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const renderRightActions = () => {
    return <DeleteButton onPress={handleDelete} />;
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
      overshootRight={false}
      containerStyle={styles.swipeableContainer}
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.totalAmount}>₹{formatTotal(item.total)}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice:</Text>
            <Text style={styles.infoValue}>#{item.invoiceNo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile:</Text>
            <Text style={styles.infoValue}>{item.mobile}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{formatDate(item.date)}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text
            style={[
              styles.badge,
              item.type === "Inside TN"
                ? styles.InsideTNBadge
                : styles.OutsideTNBadge,
            ]}
          >
            {item.type || "Service"}
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <FontAwesome name="eye" size={16} color={COLORS.primary} />
            <Text style={styles.PreviewText}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
};

const HomeScreen = () => {
  const { userName, handleLogout, UserData } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // API URL for updating invoice status
  const UPDATE_INVOICE_STATUS_URL = "https://drefresh.com/h/h/update_invoice_status.php";

  const handlePreview = (item) => {
    const previewData = {
      ...item,
      customer: {
        name: item.customerName,
        phone: item.mobile,
        address: "",
        email: "",
        gst: "",
        aadhar: "",
      },
      totals: {
        subTotal: item.invoiceData?.subtotal || 0,
        grandTotal: item.total || 0,
        cgst: item.invoiceData?.cgst || 0,
        sgst: item.invoiceData?.sgst || 0,
        igst: item.invoiceData?.igst || 0,
      },
      items: item.invoiceData?.items || [],
      invoiceNumber: item.invoiceNumber,
      date: item.date,
      invoiceType: item.invoiceType,
    };

    navigation.navigate("InvoicePreview", {
      invoiceData: previewData,
    });
  };

  // 🗑️ Handle Delete Bill
  const handleDeleteBill = (item) => {
    console.log("🗑️ Delete initiated for invoice:", {
      id: item.id,
      invoiceNo: item.invoiceNo,
      customerName: item.customerName,
      total: item.total,
      date: item.date,
      type: item.type,
    });
    
    setSelectedBill(item);
    setModalVisible(true);
  };

  // ✅ Confirm Delete - API Call
  const confirmDelete = async () => {
    if (!selectedBill || !UserData?.USER_ID) return;

    try {
      setDeletingId(selectedBill.id);
      
      console.log("🔄 Starting delete process for bill:", {
        billId: selectedBill.id,
        invoiceNo: selectedBill.invoiceNo,
        customerName: selectedBill.customerName,
        userId: UserData.USER_ID,
        timestamp: new Date().toISOString(),
      });

      // Prepare request data
      const requestData = {
        invoice_id: selectedBill.id,
        user_id: UserData.USER_ID,
        status: 0 // 0 for delete
      };

      console.log("📤 Sending delete request:", requestData);

      // Make API call to update invoice status to 0 (delete)
      const response = await axios.post(UPDATE_INVOICE_STATUS_URL, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("📥 API Response:", response.data);

      if (response.data.status === "success") {
        // Remove from local state only if API call is successful
        setBills(prevBills => {
          const updatedBills = prevBills.filter(bill => bill.id !== selectedBill.id);
          console.log("✅ Bill deleted successfully from API. Remaining bills:", updatedBills.length);
          return updatedBills;
        });

        // Log final confirmation
        console.log("🎯 Delete completed for invoice:", {
          deletedInvoice: selectedBill.invoiceNo,
          deletedCustomer: selectedBill.customerName,
          apiResponse: response.data,
          remainingCount: bills.length - 1,
        });

      } else if (response.data.status === "warning") {
        console.warn("⚠️ API Warning:", response.data.message);
        // Even if warning, remove from local state as the operation might have partial success
        setBills(prevBills => prevBills.filter(bill => bill.id !== selectedBill.id));
        
        Alert.alert("Warning", response.data.message || "Invoice might not exist or already deleted.");
        
      } else {
        throw new Error(response.data.message || "Failed to delete invoice");
      }

    } catch (error) {
      console.error("❌ Delete error:", {
        error: error.message,
        invoiceId: selectedBill?.id,
        userId: UserData?.USER_ID
      });
      
      // Show error message to user
      if (error.response) {
        // Server responded with error status
        Alert.alert("Error", error.response.data.message || "Failed to delete invoice. Please try again.");
      } else if (error.request) {
        // Network error
        Alert.alert("Network Error", "Please check your internet connection and try again.");
      } else {
        // Other errors
        Alert.alert("Error", "Failed to delete invoice. Please try again.");
      }
    } finally {
      setDeletingId(null);
      setSelectedBill(null);
      setModalVisible(false);
    }
  };

  const cancelDelete = () => {
    console.log("🚫 Delete cancelled for invoice:", selectedBill?.invoiceNo);
    setSelectedBill(null);
    setModalVisible(false);
  };

  // 🧠 Fetch Invoices via API
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const storedUser = await AsyncStorage.getItem("userData");
      const userData = storedUser ? JSON.parse(storedUser) : null;

      if (!userData?.USER_ID) {
        setErrorMsg("User not found. Please login again.");
        setLoading(false);
        return;
      }

      const API_URL = `${FETCH_INVOICES}?user_id=${userData.USER_ID}`;
      console.log("Fetching Invoices:", API_URL);

      const res = await axios.get(API_URL);

      if (res.data.status === "success") {
        setBills(res.data.data || []);
        console.log("Data : ", res.data.data);
      } else {
        setBills([]);
        setErrorMsg(res.data.message || "Failed to load invoices.");
      }
    } catch (err) {
      console.error("❌ Fetch Invoices Error:", err.message);
      setErrorMsg("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();

    const unsubscribe = navigation.addListener("focus", fetchInvoices);
    return unsubscribe;
  }, []);

  return (
    <>
      <View style={GLOBAL_STYLES.AppBarWrappercontainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
        {/* AppBar */}
        <View
          style={[
            GLOBAL_STYLES.appBar,
            { paddingTop: insets.top, marginBottom: 0 },
          ]}
        >
          <View style={GLOBAL_STYLES.appBarContent}>
            {/* Left: Greeting */}
            <View style={GLOBAL_STYLES.appBarLeft}>
              <Text style={GLOBAL_STYLES.greetingText}>Hi,</Text>
              <Text style={GLOBAL_STYLES.userNameText}>
                {userName || "D Refresh Tech"}
              </Text>
            </View>

            {/* Center: Title */}
            <View style={GLOBAL_STYLES.appBarCenter}>
              <Text style={GLOBAL_STYLES.appBarTitle}>Home</Text>
            </View>

            {/* Right: Logout */}
            <TouchableOpacity
              style={GLOBAL_STYLES.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <MaterialIcons name="logout" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

{/* 📋 Main Content */}
<View style={styles.mainContent}>

  {/* 🌀 Loading State */}
  {loading ? (
    <View style={styles.loaderWrapper}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading invoices...</Text>
    </View>
  ) : errorMsg ? (
    /* ⚠️ Error State */
    <View style={styles.errorWrapper}>
      <Text style={styles.errorText}>{errorMsg}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchInvoices}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  ) : bills.length > 0 ? (
    /* 📦 Data Available */
    <FlatList
      data={bills}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <BillCard
          item={{
            id: item.id,
            type: item.invoiceType,
            invoiceNo: item.invoiceNumber,
            shopName: item.shopName,
            customerName: item.customerName,
            mobile: item.mobile,
            total: item.total,
            date: item.date,
          }}
          onPress={() => handlePreview(item)}
          onDelete={handleDeleteBill}
        />
      )}
      contentContainerStyle={[
        styles.listContainer,
        { paddingBottom: insets.bottom  },
      ]}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Bills</Text>
          <Text style={styles.listItems}>{`Item(s): ${bills.length}`}</Text>
        </View>
      }
      extraData={deletingId}
    />
  ) : (
    /* 🈳 Empty List */
    <View style={styles.emptyWrapper}>
      <Text style={styles.emptyText}>No invoices found</Text>
    </View>
  )}
</View>


        {/* ➕ Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { marginBottom: insets.bottom }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Bill")}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Add Bill</Text>
        </TouchableOpacity>
      </View>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={modalVisible}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice #${selectedBill?.invoiceNo} for ${selectedBill?.customerName}?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </>
  );
};

export default HomeScreen;