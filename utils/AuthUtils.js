import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeUserSession = async (userData) => {
  try {
    await AsyncStorage.setItem("@user_session", JSON.stringify(userData));
  } catch (e) {
    console.error("Error storing user session", e);
  }
};

export const getUserSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@user_session");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error retrieving user session", e);
  }
};

export const removeUserSession = async () => {
  try {
    await AsyncStorage.removeItem("@user_session");
  } catch (e) {
    console.error("Error removing user session", e);
  }
};
