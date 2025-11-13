  import { useEffect, useState, useCallback } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { ToastAndroid } from "react-native";
  import { useNavigation } from "@react-navigation/native";

  // Export a custom hook
  const useAuth = () => {
    const [userName, setUserName] = useState("User");
    const [UserData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
      const loadUser = async () => {
        try {
          const userData = await AsyncStorage.getItem("userData");
          if (userData) {
            const user = JSON.parse(userData);
            setUserData(user);
            setUserName(user.name || "User");
          } else {
            setUserName("User");
            setUserData(null);
          }
        } catch (err) {
          setUserName("User");
          setUserData(null);
        }
      };
      loadUser();
    }, []);

    // Memoized logout handler
    const handleLogout = useCallback(async () => {
      await AsyncStorage.removeItem('userData');
      navigation.navigate("Login");
      ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
    }, [navigation]);

    return { userName,UserData, handleLogout };
  };

  export default useAuth;
