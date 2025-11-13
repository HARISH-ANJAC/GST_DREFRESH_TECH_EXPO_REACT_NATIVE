// BillScreen.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Alert,
  // ActivityIndicator, // No longer needed here
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../styles/BillScreenStyles"; // Import the styles
import { COLORS } from "../constants/colors"; // Import the colors
import { useNavigation } from "@react-navigation/native";
import { initDB, saveInvoice } from "../database/db";
import useAuth from "../components/useAuth";

// Reusable Input Component
const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  ...props
}) => (
  <View style={props.fullWidth ? styles.inputWrapperFull : styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.placeholder}
      keyboardType={keyboardType}
      {...props}
    />
  </View>
);
const BillScreen = () => {
  const navigation = useNavigation();

  // --- Invoice Info State ---
  const [invoiceType, setInvoiceType] = useState("Inside TN");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("SRV-2025-042");
  const {UserData} =useAuth();
  // --- Customer State ---
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerGST, setCustomerGST] = useState("");
  const [customerAadhar, setCustomerAadhar] = useState("");

  // --- Products State ---
  const [products, setProducts] = useState([
    { id: 1, name: "", hsn: "", per: "", caseQty: "", price: "" },
  ]);
  const [nextId, setNextId] = useState(2);

  // --- Date Picker Handler ---
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  // --- Product Handlers ---
  const handleProductChange = useCallback((id, field, value) => {
    setProducts((currentProducts) =>
      currentProducts.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }, []);

  const addProduct = () => {
    if (products.length >= 20) {
      Alert.alert("Limit Reached", "Maximum 20 products allowed per invoice.");
      return;
    }

    setProducts([
      ...products,
      { id: nextId, name: "", hsn: "", per: "", caseQty: "", price: "" },
    ]);
    setNextId(nextId + 1);
  };

  const removeProduct = (id) => {
    if (products.length === 1) {
      Alert.alert("Cannot Remove", "You must have at least one product.");
      return;
    }
    setProducts((currentProducts) =>
      currentProducts.filter((p) => p.id !== id)
    );
  };

const totals = useMemo(() => {
  let subTotal = 0;

  products.forEach((p) => {
    const qty = parseFloat(p.caseQty) || 0;
    const price = parseFloat(p.price) || 0;
    subTotal += qty * price;
  });

  let cgst = 0,
    sgst = 0,
    igst = 0,
    grandTotal = 0;

  if (invoiceType === "Inside TN") {
    cgst = subTotal * 0.09;
    sgst = subTotal * 0.09;
    grandTotal = subTotal + cgst + sgst;
  } else {
    igst = subTotal * 0.18;
    grandTotal = subTotal + igst;
  }

  return {
    subTotal,
    cgst,
    sgst,
    igst,
    grandTotal,
  };
}, [products, invoiceType]);

  // --- Save Invoice (API Call) ---
const handleSaveInvoice = async () => {
  try {
    if (!customerName || !customerPhone) {
      Alert.alert("Missing Info", "Customer Name and Phone are required.");
      return;
    }

    if (products.some((p) => !p.name || !p.caseQty || !p.price)) {
      Alert.alert("Missing Product Info", "Please fill all fields for all products.");
      return;
    }

    const dateString = new Date(date).toISOString().split("T")[0];
    
    const invoiceData = {
      user_id: UserData.USER_ID, // Ideally from user session
      invoiceType,
      date: dateString,
      invoiceNumber,
      shopName: UserData.name.toUpperCase(),
      customerName,
      mobile: customerPhone,
      total: totals.grandTotal,
      invoiceData: {  //name: "", hsn: "", per: "", caseQty: "", price: ""
         items: products.map((p) => ({
            id: p.id,
            name: p.name?.trim() || "N/A",
            hsn: p.hsn?.trim() || "N/A",
            per: p.per?.trim() || "N/A",
            caseQty: parseFloat(p.caseQty) || 0,
            price: parseFloat(p.price) || 0,
            amount: (parseFloat(p.caseQty) || 0) * (parseFloat(p.price) || 0),
          })),
        subtotal: totals.subTotal,
        cgst: totals.cgst,
        sgst: totals.sgst,
        igst: totals.igst,
        grandTotal: totals.grandTotal,
      },
    };

    console.log("🧾 Sending Invoice:", invoiceData);

    const response = await fetch("https://drefresh.com/h/h/api_add_invoice.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });

    const result = await response.json();
    console.log("✅ API Response:", result);

    if (result.status === "success") {
      Alert.alert("✅ Success", result.message || "Invoice saved successfully!");
      // Reset form
      setCustomerName("");
      setCustomerEmail("");
      setCustomerAddress("");
      setCustomerPhone("");
      setCustomerGST("");
      setCustomerAadhar("");
      setProducts([{ id: 1, name: "", hsn: "", per: "", caseQty: "", price: "" }]);
      setNextId(2);
      navigation.navigate("Home");
    } else {
      Alert.alert("⚠️ Error", result.message || "Failed to save invoice.");
    }
  } catch (error) {
    console.error("❌ Save Error:", error);
    Alert.alert("Error", "Something went wrong while saving the invoice.");
  }
};

  // --- Preview Invoice (same as before) ---
// In BillScreen.jsx - Update the handlePreviewInvoice function
// In BillScreen.jsx - Update handlePreviewInvoice function
const handlePreviewInvoice = () => {
  if (!customerName || !customerPhone) {
    Alert.alert("Missing Info", "Customer Name and Phone are required.");
    return;
  }
  if (products.some((p) => !p.name || !p.caseQty || !p.price)) {
    Alert.alert(
      "Missing Product Info",
      "Please fill all fields for all products."
    );
    return;
  }

  const serializableDate = date instanceof Date ? date.toISOString() : date;

  // Create a clean, properly structured data object
  const invoiceData = {
    // Core invoice info
    invoiceType,
    date: serializableDate,
    invoiceNumber,
    
    // Customer info in both formats for compatibility
    customer: {
      name: customerName,
      email: customerEmail,
      address: customerAddress,
      phone: customerPhone,
      gst: customerGST,
      aadhar: customerAadhar,
    },
    customerName: customerName, // For backward compatibility
    mobile: customerPhone, // For backward compatibility
    
    // Totals info
    totals: {
      subTotal: totals.subTotal,
      grandTotal: totals.grandTotal,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
    },
    total: totals.grandTotal, // For backward compatibility
    
    // Items info
    items: products.map((p) => ({
      id: p.id,
      name: p.name?.trim() || "N/A",
      description: p.per?.trim() || "",
      quantity: parseFloat(p.caseQty) || 0,
      caseQty: parseFloat(p.caseQty) || 0, // For backward compatibility
      price: parseFloat(p.price) || 0,
      amount: (parseFloat(p.caseQty) || 0) * (parseFloat(p.price) || 0),
      hsn: p.hsn || "N/A",
      per: p.per || "N/A"
    })),
    
    // Legacy structure for compatibility
    invoiceData: {
      items: products.map((p) => ({
        id: p.id,
        name: p.name?.trim() || "N/A",
        description: p.per?.trim() || "",
        quantity: parseFloat(p.caseQty) || 0,
        price: parseFloat(p.price) || 0,
        amount: (parseFloat(p.caseQty) || 0) * (parseFloat(p.price) || 0),
      })),
      subtotal: totals.subTotal,
      cgst: totals.cgst,
      sgst: totals.sgst,
      igst: totals.igst,
      grandTotal: totals.grandTotal,
    }
  };

  console.log("Preview Data:", invoiceData); // Debug log

  try {
    navigation.navigate("InvoicePreview", { invoiceData });
  } catch (error) {
    console.error("Error navigating:", error);
    Alert.alert("Error", "Could not open invoice preview.");
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headerTitle}>Create GST Invoice</Text>

          {/* --- Invoice Info Section --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>

            {/* Invoice Type Dropdown (Full Width) */}
            <View style={styles.inputWrapperFull}>
              <Text style={styles.label}>Region</Text>
              <TouchableOpacity
                style={styles.dropdownTouchable}
                onPress={() =>
                  setInvoiceType(
                    invoiceType === "Inside TN" ? "Outside TN" : "Inside TN"
                  )
                }
              >
                <Text style={styles.dropdownText}>{invoiceType}</Text>
                <FontAwesome
                  name="caret-down"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Date Picker and Invoice Number (Half Width) */}
            <View style={styles.row}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.dropdownTouchable}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {date.toLocaleDateString("en-GB")}
                  </Text>
                  <FontAwesome
                    name="calendar"
                    size={16}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <FormInput
                  label="Invoice #"
                  value={invoiceNumber}
                  onChangeText={setInvoiceNumber}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* --- Customer Info Section --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.row}>
              <FormInput
                label="Enter Name"
                value={customerName}
                onChangeText={setCustomerName}
              />
              <FormInput
                label="E-mail Address"
                value={customerEmail}
                onChangeText={setCustomerEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.row}>
              <FormInput
                label="Address 1"
                value={customerAddress}
                onChangeText={setCustomerAddress}
              />
              <FormInput
                label="Phone Number"
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.row}>
              <FormInput
                label="GST Number"
                value={customerGST}
                onChangeText={setCustomerGST}
              />
              <FormInput
                label="Aadhar Number"
                value={customerAadhar}
                onChangeText={setCustomerAadhar}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* --- Products Section --- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Product Details</Text>

            {products.map((product, index) => (
              <View style={styles.productCard} key={product.id}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeProduct(product.id)}
                >
                  <FontAwesome name="trash-o" size={16} color={COLORS.error} />
                </TouchableOpacity>

                <Text style={styles.productHeader}>Product {index + 1}</Text>

                <FormInput
                  label="Product Name OR Description"
                  value={product.name}
                  onChangeText={(val) =>
                    handleProductChange(product.id, "name", val)
                  }
                  fullWidth
                />
                <View style={styles.row}>
                  <FormInput
                    label="HSN"
                    value={product.hsn}
                    onChangeText={(val) =>
                      handleProductChange(product.id, "hsn", val)
                    }
                    keyboardType="number-pad"
                  />
                  <FormInput
                    label="Per"
                    value={product.per}
                    onChangeText={(val) =>
                      handleProductChange(product.id, "per", val)
                    }
                    placeholder="e.g. 1 box"
                  />
                </View>
                <View style={styles.row}>
                  <FormInput
                    label="Case (Qty)"
                    value={product.caseQty}
                    onChangeText={(val) =>
                      handleProductChange(product.id, "caseQty", val)
                    }
                    keyboardType="numeric"
                  />
                  <FormInput
                    label="Price (Per Case)"
                    value={product.price}
                    onChangeText={(val) =>
                      handleProductChange(product.id, "price", val)
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.totalLabel}>Sub Total</Text>
                  <Text style={styles.totalValue}>
                    ₹{" "}
                    {(
                      (parseFloat(product.caseQty) || 0) *
                      (parseFloat(product.price) || 0)
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addProductButton}
              onPress={addProduct}
            >
              <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.addProductButtonText}>
                Add Another Product
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* --- Bottom CTA (Totals & Save) --- */}
        <View style={styles.bottomCtaContainer}>
          {/* --- Totals Section --- */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sub Total</Text>
              <Text style={styles.totalValue}>
                ₹ {totals.subTotal.toFixed(2)}
              </Text>
            </View>

            {invoiceType === "Inside TN" ? (
              <>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>CGST (9%)</Text>
                  <Text style={styles.totalValue}>
                    ₹ {(totals.cgst || 0).toFixed(2)}
                  </Text>

                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>SGST (9%)</Text>
                  <Text style={styles.totalValue}>
                    ₹ {totals.sgst.toFixed(2)}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>IGST (18%)</Text>
                <Text style={styles.totalValue}>
                  ₹ {totals.igst.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                ₹ {totals.grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* --- Save Button --- */}
          <View style={styles.ButtonContainer}>
            <TouchableOpacity
              style={styles.saveButton} 
              onPress={handleSaveInvoice}
            >
              <Text style={styles.saveButtonText}>Save Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton,{backgroundColor: COLORS.primary}]} 
              onPress={handlePreviewInvoice}
            >
              <Text style={styles.saveButtonText}>Preview Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BillScreen;
