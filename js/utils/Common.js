import { NativeModules } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import CryptoJS from 'crypto-js'
import Md5Encrypt from "react-native-md5";
import {AES_KEY,AES_VI} from './Contant';
import * as DeviceInfo     from './DeviceInfoUtil';

import ReactNativeBiometrics from 'react-native-biometrics'

var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
　　52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
　　-1,　0,　1,　2,　3,  4,　5,　6,　7,　8,　9, 10, 11, 12, 13, 14,
　　15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
　　-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
　　41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

let Common = {
	encrypt(str){
		//一組自定義的key和vi，兩個要相同，要有16碼
		var key = CryptoJS.enc.Utf8.parse(AES_KEY);  
    	var iv  = CryptoJS.enc.Utf8.parse(AES_VI);
    	var encrypted =CryptoJS.AES.encrypt(str,key,{iv:iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.Pkcs7});
    	return encrypted.toString();
	},
	base64encode(str){
		var out, i, len;
	　　var c1, c2, c3;
	　　len = str.length;
	　　i = 0;
	　　out = "";
	　　while(i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if(i == len){
			　　out += base64EncodeChars.charAt(c1 >> 2);
			　　out += base64EncodeChars.charAt((c1 & 0x3) << 4);
			　　out += "==";
			　　break;
			}
			c2 = str.charCodeAt(i++);
			if(i == len){
			　　out += base64EncodeChars.charAt(c1 >> 2);
			　　out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			　　out += base64EncodeChars.charAt((c2 & 0xF) << 2);
			　　out += "=";
			　　break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
	　　}
	　　return out;
	},
	getNetworkStatus(){
		return new Promise((resolve) => NetInfo.getConnectionInfo().then((connectionInfo) => {
				switch(connectionInfo.type){
			  		case 'none':
			  		case 'unknown':
			  			resolve('offline');
			  			break;
			  		case 'wifi':
			  		case 'cellular':
			  			resolve('online');
			  			break;
			  	}	  	
			})
		);
	},
	dateFormat(date){
		if (date == null) {
		} else {
			date = date.replace(' ', 'T');
		}

		var time = new Date( date );
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
	},
	dateFormatNoSecond(date,separator){
		if (date == null) {
		} else {
			date = date.replace(' ', 'T');
		}
		var time = new Date(date);
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		return y+separator+this.add0(m)+separator+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm);
	},
	dateFormatNoTime(date){
		if (date == null) {
		} else {
			date = date.replace(' ', 'T');
		}
		var time = new Date(date);
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		
		return y+'-'+this.add0(m)+'-'+this.add0(d);
	},	
	dateFormatNoYear(date){
		if (date == null) {
		} else {
			date = date.replace(' ', 'T');
		}
		var time = new Date(date);
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		return this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm);
	},
	dateFormatInbusdat(date){
		if (date == null) {
		} else {
			date = date.replace(' ', 'T');
		}
		// date = date.replace(/\-/g, "/").replace(".0","");
		var time = new Date(date).getTime(); 
    	var nowTime = new Date().getTime(); 
 		//一年毫秒数(365 * 86400000 = 31536000000)
 		//Math.ceil为向上取整
 		var y=Math.ceil((nowTime-time)/31536000000);
    	return y.toString();
	},	
	dateFormatNoYearTime(date){
		if (date == null) {
		} else {
			date = date.replace(' ', 'T');
		}
		var time = new Date(date);
		var m = time.getMonth()+1;
		var d = time.getDate();
		
		return this.add0(m)+this.add0(d);
	},	
	add0(v){
		return v<10?'0'+v:v;
	},
    //移除arr中對應obj,並返回新array
    removeArray(_arr, _obj) {
	    var length = _arr.length;
	    for (var i = 0; i < length; i++) {
	        if (_arr[i] == _obj) {
	            if (i == 0) {
	                _arr.shift(); //删除并返回数组的第一个元素
	                return _arr;
	            }else if (i == length - 1) {
	                _arr.pop();  //删除并返回数组的最后一个元素
	                return _arr;
	            }else {
	                _arr.splice(i, 1); //删除下标为i的元素
	                return _arr;
	            }
	        }
	    }
	},
	numDiv(num1, num2) { 
		var baseNum1 = 0, baseNum2 = 0; 
		var baseNum3, baseNum4; 
		try { 
			baseNum1 = num1.toString().split(".")[1].length; 
		} catch (e) { 
			baseNum1 = 0; 
		} 
		try { 
			baseNum2 = num2.toString().split(".")[1].length; 
		} catch (e) { 
			baseNum2 = 0; 
		} 
		// with (Math) { 
			baseNum3 = Number(num1.toString().replace(".", "")); 
			baseNum4 = Number(num2.toString().replace(".", "")); 
			return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1); 
		// } 
	},
	getImei(){
		//imei受限太多，故設為getUniqueId+getDeviceId+getBrand
		let imei=false;
		if(DeviceInfo.getUniqueId()!="unknown"){
			let temp =DeviceInfo.getUniqueId() +"_"+ DeviceInfo.getDeviceId() +"_"+ DeviceInfo.getBrand();
			imei = Md5Encrypt.hex_md5(temp);
		}
	    return imei;
	},
	/**
		正則表達式規則
		return true滿足/false不滿足
	*/
	getRegular(rule,target,matchStr=null){
		let temp=null;

		// 是否为空
		if(rule=="isNull"){
			if(target == null){
				return true;
			}else{
				return false;
			}
		}
		// 是否一致
		if(rule=="isSame"&&matchStr!=null){
			if(target== matchStr){
				return true;
			}else{
				return false;
			}
		}
		// 5-12數字連續 类似111111,222222
		if(rule=="sixNum"){
			temp = /^(\d)\1{5,12}$/;
			return temp.test(target);
		}
		// 5-12字符連續 类似111111,222222
		if(rule=="sixChar"){
			temp = /([0-9A-Za-z])\1{5,12}/g;
			return temp.test(target);
		}
		// 连续判断 类似123456
		if(rule=="series"){
			temp = '0123456789_9876543210';
			if(temp.indexOf(target) > -1){
				return true;
			}else{
				return false;
			}	
		}
		// 是否存在空格
		if(rule=="Blank"){
			temp = /\s+/g;
			return temp.test(target);
		}
		//6位+英文+數字組合
		if(rule=="checkPwd"){
			temp = /^(?![^a-zA-Z]+$)(?!\D+$)[a-zA-Z0-9]{6,}$/;
			return temp.test(target);
		}
		// 是否重复6位搭配 aaaaaa1
		if(rule=="sixChar"){
			temp = /^([0-9A-Za-z])\1{5,12}$/;
			return temp.test(target);
		}
		// 是否包含某字串
		if(rule=="containStr"&&matchStr!=null){
			if(target.indexOf(matchStr)>-1){
				return true;
			}else{
				return false;
			}
		}
		// 字串不可小於6位數且大於12
		if(rule=="strLength6_12"){
			if(target.length>=6&&target.length<=12){
				return true;
			}else{
				return false;
			}
		}
		// 是否存在某字串
		if(rule=="equalStr"&&matchStr!=null){
			if(target==matchStr){
				return true;
			}else{
				return false;
			}
		}

		return true;
	},
	checkPassword(lang,oldPwd=null,newPwd1=null,newPwd2=null,oldPwdfromDB=null,user=null){
		let msg="";
		let checkPwdFlag=false;
		let includeEmpid=false;
		let includeBrndate=false;

		if(user){
			if(this.getRegular("equalStr",newPwd1,user.id)||this.getRegular("equalStr",newPwd1,user.id.toLowerCase())){
				includeEmpid=true;
			}else{
				let brndat=user.brndat?this.dateFormatNoYearTime(user.brndat):this.dateFormatNoYearTime(user.birthday);
				if(this.getRegular("containStr",newPwd1,brndat)){
		 			includeBrndate=true;
				}
			}
		}

		if(!this.getRegular("isNull",newPwd1)&&!this.getRegular("isNull",newPwd2)){
			if(newPwd1.length==0||newPwd2.length==0||oldPwd.length==0){
				//新密碼不可為空
				msg= lang.InitialPasswordPage.PwdNotNull;
			}else if(!this.getRegular("isSame",newPwd1,newPwd2)){
				//新密碼不一致，請重新輸入
				msg= lang.InitialPasswordPage.CheckPwdError;
			}else if(!this.getRegular("strLength6_12",newPwd1)){
				//新密碼不可小於6位數且大於12
				msg= lang.InitialPasswordPage.PwdNeed6_12;
			}else if(this.getRegular("sixNum",newPwd1)||this.getRegular("sixChar",newPwd1)){
		        //新密碼不可以是相同字符
		        msg= lang.InitialPasswordPage.PwdNotSame;
			}else if(this.getRegular("series",newPwd1)){
		        //新密碼不可以是連續數字
				msg= lang.InitialPasswordPage.PwdNotContinuous;
			}else if (!this.getRegular("isSame",oldPwd,oldPwdfromDB)) {
				//旧密码输入错误
				msg=lang.InitialPasswordPage.OldPasswordNotSame;
			}else if (this.getRegular("Blank",newPwd1)||this.getRegular("Blank",newPwd2)) {
				//不允许输入空格
				msg=lang.InitialPasswordPage.NotBlank;
			}else if (includeEmpid) {
				//不允许包含工號
				msg=lang.InitialPasswordPage.NotExistEmpid;
			}else if (includeBrndate) {
				//組合中不允许生日
				msg=lang.InitialPasswordPage.NotExistBirth;
			}else{
				checkPwdFlag=true;
			}
		}

		let tempObj={
			checkPwdFlag:checkPwdFlag,
			msg:msg
		};
		return tempObj;
	},
	//just for ios 10＆ android x及以上
	getBiosResult(){
	 	let temp =null;
		ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
		    const { available, biometryType } = resultObject
		    if (available && biometryType === ReactNativeBiometrics.TouchID) {
		    	temp="TouchID";
		    } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
		    	temp="FaceID";
		    } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
		    	temp="Biometrics";
		    } else {
		    	temp="NotSupport";
		    }
			return temp;
		}).catch((e)=>{
            console.log(e);
			return "NotSupport";
        });
	},
	//just for ios<10＆ android<x
	getBiosConfig(lang){
		//for react-native-touch-id
		let config = {
		  title: lang.Common.HFRunBiosAuth, // Android
		//   imageColor: '#e00606', // Android
		//   imageErrorColor: '#ff0000', // Android
		  sensorDescription: lang.Common.BiosAuth, // Android
		  sensorErrorDescription: lang.Common.AuthFail, // Android
		  cancelText: lang.Common.Cancel// Android
		//   fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
		//   unifiedErrors: false, // use unified error messages (default false)
		//   passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
		};
		let biosObj ={
			title:null,
			config:config
		}
		return biosObj;
	},
	decryptMisInfo(data) {
		var key = CryptoJS.enc.Utf8.parse('HFFMISPrimaryKey');
		var iv = CryptoJS.enc.Utf8.parse('PrimaryKeyHFFMIS');
		var decrypted = CryptoJS.AES.decrypt(data, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.ZeroPadding
		});
		var msg2 = decrypted.toString(CryptoJS.enc.Utf8);
		return msg2;
	},
	switchContactPic(picture,sex=false){
		// 判斷該筆資料的圖片是否有值與圖片型態為何
		if (picture == "" || picture == null || typeof picture == "number") {
			if(sex){
		  		picture = (sex == "F") ? require("../image/user_f.png") : require("../image/user_m.png");
			}else{
				return null
			}
		} else {
		  // 因可能重新渲染所以需在此處稍加判斷
		  if (typeof picture == "string") {
		    picture = (picture.indexOf("http://") < 0) ? {
		      uri: `data:image/png;base64,${picture}`
		    } : {
		      uri: `${picture}`
		    }
		  }
		}
		return picture;
	},
	/**
	 * 将资料转换成SQLiteUtil insertData_new方法的参数格式
	 * @param String tableName 表名称
	 * @param Array datas 数组资料
	 * @param Function dataFun datas资料转换格式方法，需返回一个数组
	 * @param Number columnNum 列数
	 * @param Number batchNum 批量数量
	 * @returns 
	 */
	tranBatchInsertSQL(tableName, datas, dataFun, columnNum, batchNum){
		//拼写初始语句
		let selectInitSQL = 'SELECT ?'
		for (let i = 0; i < columnNum - 1; i++) {
			selectInitSQL += ',?'
		}
		const insertInitSQL = 'INSERT INTO ' + tableName + ' '
		//拼写执行语句及整理对应的资料格式
		let excuteList = [] //拼好的语句及对应资料数组
		let insertSQL = insertInitSQL //拼写的语句
		let dataArray = [] //语句对应资料
		let rowNum = 1 //第几行
		let rowLength = datas.length //行数
		for (const data of datas) {
			dataArray = dataArray.concat(dataFun(data))
			if (rowNum % batchNum == 0) {
				insertSQL += selectInitSQL
				excuteList.push([insertSQL, dataArray])
				//达到批量数量，重新拼写语句及清空资料
				insertSQL = insertInitSQL
				dataArray = [];
			} else if (rowNum == rowLength) {
				insertSQL += selectInitSQL
				excuteList.push([insertSQL, dataArray])
			} else {
				insertSQL += selectInitSQL + ' union all '
			}
			
			rowNum++
		}
		return excuteList
	},
	tranDiffUpdateSQL(tableName, datas, dataFun, columnNum, batchNum){
		//拼写初始语句
		let selectInitSQL = 'SELECT ?'
		for (let i = 0; i < columnNum - 1; i++) {
			selectInitSQL += ',?'
		}
		const deleteInitSQL = 'DELETE FROM THF_NOTICE WHERE OID in ('
		const insertInitSQL = 'INSERT INTO ' + tableName + ' '
		//拼写执行语句及整理对应的资料格式
		let dExcuteList = [] //拼好的delete语句及对应资料数组
		let deleteSQL = deleteInitSQL //拼写的delete语句
		let dDataArray = [] //delete语句对应资料

		let iExcuteList = [] //拼好的insert语句及对应资料数组
		let insertSQL = insertInitSQL //拼写的insert语句
		let iDataArray = [] //insert语句对应资料

		let rowNum = 1 //第几行
		let rowLength = datas.length //行数
		for (const data of datas) {
			dDataArray.push(data.oid)
			iDataArray = iDataArray.concat(dataFun(data))
			if (rowNum % batchNum == 0) {
				deleteSQL += '?)'
				insertSQL += selectInitSQL
				dExcuteList.push([deleteSQL,dDataArray])
				iExcuteList.push([insertSQL,iDataArray])
				//达到批量数量，重新拼写语句及清空资料
				dDataArray = []
				iDataArray = []
				deleteSQL = deleteInitSQL
				insertSQL = insertInitSQL
			} else if (rowNum == rowLength) {
				deleteSQL += '?)'
				insertSQL += selectInitSQL
				dExcuteList.push([deleteSQL,dDataArray])
				iExcuteList.push([insertSQL,iDataArray])
			} else {
				deleteSQL += '?,'
				insertSQL += selectInitSQL + ' union all '
			}
			
			rowNum++
		}

		const excuteList = {
			dExcuteList,
			iExcuteList
		}
		return excuteList
	}
}

export default Common;

