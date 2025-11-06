import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import BillScreen from "../screens/BillScreen";
import InvoicePreviewScreen from "../screens/InvoicePreviewScreen";


const Stack = createStackNavigator();

const RootNavigator = () => (
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Bill" component={BillScreen}/>
    <Stack.Screen name="InvoicePreview" component={InvoicePreviewScreen} />

    {/* etc */}
  </Stack.Navigator>
);

export default RootNavigator;