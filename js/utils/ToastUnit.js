import { Platform } from 'react-native';
import variable from '../theme/variables/platform';
import Toast from 'react-native-toast-message';

const isIphoneX = variable.isIphoneX;
const isIOS = Platform.OS == 'ios' ? true: false;

let ToastUnit = {
	show(type = 'info', text = 'Hello', isAuthPage = false, LoadFormError = null){
		let topOffset = 30
		if (isIOS) {
			if (isIphoneX) {
				topOffset = 50;
			}
		} else {
			if (isAuthPage) {
				topOffset = 50;
			} else {
				topOffset = 0;
			}
		}

		Toast.show({
			type: type,
			position: 'top',
			text1: text,
			topOffset: topOffset,
			onHide: () => {
				if (LoadFormError) {
					LoadFormError();
				} else {
					null
				}
			},
		});
		/*
		Toast.show({
		  type: 'success | error | info',
		  position: 'top | bottom',
		  text1: 'Hello',
		  text2: 'This is some something 👋',
		  visibilityTime: 4000,
		  autoHide: true,
		  topOffset: 30,
		  bottomOffset: 40,
		  onShow: () => {},
		  onHide: () => {},
		  onPress: () => {}
		});
		*/
	}
}

export default ToastUnit;

