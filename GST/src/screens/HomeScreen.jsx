// HomeScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Dimensions,
  Settings,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GLOBAL_STYLES } from "../constants/styles"; // Your global styles
import { styles } from "../styles/HomeStyles"; // New styles for this screen
import { useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import useAuth from "../components/useAuth"; // Your auth hook
import { COLORS } from "../constants/colors"; // Your colors
import { getInvoices, initDB } from "../database/db";
import { formatDate } from "../Utils/DateUtils";

// Component to render each bill item
const BillCard = ({ item, onPress }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.totalAmount}>₹{item.total}</Text>
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
        {item.type}
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
);

const HomeScreen = () => {
  const { userName, handleLogout } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get("window");
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const loadInvoices = async () => {
      await initDB();
      const data = await getInvoices();
      setBills(data);
      console.log("Bill : ", JSON.stringify(data));
    };

    loadInvoices();

    const unsubscribe = navigation.addListener("focus", loadInvoices);
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
            <Text style={GLOBAL_STYLES.greetingText}>
              Hi, {userName || "Biller"}
            </Text>
            <Text style={GLOBAL_STYLES.appBarTitle}>Home</Text>

            <TouchableOpacity
              style={GLOBAL_STYLES.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <MaterialIcons name="logout" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content - Bill List */}
        <View
          style={[
            styles.container,
            { paddingBottom: insets.bottom + height * 0.1 },
          ]}
        >
          <FlatList
            data={bills}
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
                onPress={() =>
                  navigation.navigate("InvoicePreview", {
                    invoiceData: item.invoiceData,
                  })
                }
                // onDelete={() => handleDelete(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContainer,
              { paddingBottom: insets.bottom + height * 0.04 },
            ]}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>All Bills</Text>
                <Text
                  style={styles.listItems}
                >{`Item(s) : ${bills.length}`}</Text>
              </View>
            }
          />
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { marginBottom: insets.bottom }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Bill")} // Navigate to your BillScreen
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Add Bill</Text>
        </TouchableOpacity>
      </View>

    </>
  );
};

export default HomeScreen;
