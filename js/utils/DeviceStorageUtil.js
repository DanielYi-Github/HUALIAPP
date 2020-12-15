import AsyncStorage from '@react-native-community/async-storage';

let DeviceStorageUtil = {
	async get(key) {
		try {
			const value = await AsyncStorage.getItem(key);
			if (value !== null) {
				return value;	// We have data!!
			}
		} catch (err) {
			console.log(err);
		}
		return "";
	},
	async set(key, value) {
		try {
			await AsyncStorage.setItem(key, JSON.stringify(value));
		} catch (err) {
			console.log(err);
		}
	},
	async remove(key) {
		try {
			await AsyncStorage.removeItem(key);
		} catch (err) {
			console.log(err);
		}
	},
	async getAllKeys() {
	  let keys = []
	  try {
	    keys = await AsyncStorage.getAllKeys()
	    return keys;
	  } catch(e) {
	  	console.log("error", e);
	  }
	}

}


export default DeviceStorageUtil;