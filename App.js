import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens_core/Home";
import WelcomeScreen from "./screens/WelcomeScreen";
import ReviewMatchSelection01 from "./screens/ReviewMatchSelection01";
import ReviewVideo01 from "./screens/ReviewVideo01";
// --- for Review Reducer
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// import user from "./reducers/user";
// import script from "./reducers/script";
import review from "./reducers/review";

const store = configureStore({
  reducer: { review },
});

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen
            name="ReviewMatchSelection01"
            component={ReviewMatchSelection01}
          />
          <Stack.Screen name="ReviewVideo01" component={ReviewVideo01} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
