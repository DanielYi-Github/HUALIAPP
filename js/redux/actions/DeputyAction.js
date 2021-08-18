import * as types from '../actionTypes/DeputyTypes';
import { Alert }  from 'react-native';
import * as UpdateDataUtil from '../../utils/UpdateDataUtil';
import * as SQLite         from '../../utils/SQLiteUtil';
import * as LoggerUtil     from '../../utils/LoggerUtil';
import Common              from '../../utils/Common';
import * as LoginTypes     from '../actionTypes/LoginTypes';
import * as NavigationService  from '../../utils/NavigationService';

export function iniDeputyData(){
	return async (dispatch) => {
		dispatch(isLoading(true));
		console.log("this",this);
		await this.paramInit();				// 捞取代理人下拉参数档资料
		await this.cboParamInit();			// 捞取流程分类及流程名称
		await this.loadBPMDeputySetting();	// 捞取代理人API资料
		dispatch(isLoading(false));
	}
}

export function loadBPMDeputySetting() {
	return async (dispatch, getState) => {
	    await UpdateDataUtil.getBPMDeputySetting(getState().UserInfo.UserInfo).then(async (data) => {
	    	console.log("loadBPMDeputySetting", data);
			dispatch(setDeputyBasic(data));	// Call API返回资料存到redux
	    	await this.basicInit(data);		// 处理转化数据格式
	    	this.getDeputyTip();			// 代理启动状态
	    }).catch((e) => {
	    	console.log(e);
	    	if(e.code==0){
				dispatch(logout(e.message,true));
	    	}else{
	        	this.errorTip();
	    	}
			dispatch(setDeputyBasic({}));
	    });
	}
}

export function basicInit(data) {
	return async (dispatch, getState) => {
		let basicClone = deepClone(data);
		let deputyRulesData = deepClone(basicClone.deputyRules);
		let lang = getState().Language.lang.DeputyPage;
		let deputyState = getState().Deputy;
      	if(basicClone){
			let rulesMemActionValue = null;

			let itemCount = 0;	// 列表的数量
			let RulesListComponent = deputyRulesData.listComponent;
			for(let i in RulesListComponent){
				if(RulesListComponent[i].component.id == "txtCond"){
					if(RulesListComponent[i].defaultvalue != null){
						itemCount = RulesListComponent[i].defaultvalue.length;
					}
					break;	
				}
			}
			// defaultvalue组成
			let defaultvalueList = [];
			for(let i=0 ; i<itemCount ; i++){
				let itemObjList = [];
				for(let j=0 ; j<10 ; j++){
					let obj = {};
					// 条件代号
					if(j == 0){
						for(let k in RulesListComponent){
							if(RulesListComponent[k].component.id == "txtCondID"){
								obj = deepClone(RulesListComponent[k]);
								break;		
							}
						}
						// 将defaultvalue数组改为对应的值
						obj.defaultvalue = obj.defaultvalue[i];
						obj.isedit = "N";
					}

					// 条件
					if(j == 1){
						for(let k in RulesListComponent){
							if(RulesListComponent[k].component.id == "txtCond"){
								obj = deepClone(RulesListComponent[k]);
								break;		
							}
						}
						obj.columntype = "deputytxt";
						// 将defaultvalue数组改为对应的值
						obj.defaultvalue = obj.defaultvalue[i];
						obj.isedit = "N";
					}

					// 条件1
					if(j == 2 || j == 3){
						for(let k in RulesListComponent){
							if(RulesListComponent[k].component.id == "txtCond1ID"){
								obj = deepClone(RulesListComponent[k]);
								break;		
							}
						}
						// 将defaultvalue数组改为对应的值
						obj.defaultvalue = obj.defaultvalue[i];
						obj.isedit = "N";
						// 条件1显示组件
						if(j == 3){
							obj.columntype = "cbo";
							obj.component.id = "txtCond1";
							obj.component.name = lang.Condition1;
							obj.isedit = "Y";
							obj.paramList = deputyState.condition1Param;
							for(let k in deputyState.condition1Param){
								if(obj.defaultvalue == deputyState.condition1Param[k].paramcode){
									obj.columnaction = deputyState.condition1Param[k].columnaction;
									break;
								}
							}
						}
					}

					// 关联性
					if(j == 4 || j == 5){
						for(let k in RulesListComponent){
							if(RulesListComponent[k].component.id == "txtRelationID"){
								obj = deepClone(RulesListComponent[k]);
								break;		
							}
						}
						// 将defaultvalue数组改为对应的值
						obj.defaultvalue = obj.defaultvalue[i];
						obj.isedit = "N";
						// 关联性显示组件
						if(j == 5){
							obj.columntype = "cbo";
							obj.component.id = "txtRelation";
							obj.component.name = lang.Relation;
							obj.isedit = "Y";
							obj.paramList = deputyState.relationParam;
						}
					}

					// 条件2
					if(j == 6 || j == 7){
						for(let k in RulesListComponent){
							if(RulesListComponent[k].component.id == "txtCond2ID"){
								obj = deepClone(RulesListComponent[k]);
								break;		
							}
						}
						// 将defaultvalue数组改为对应的值
						obj.defaultvalue = obj.defaultvalue[i];
						obj.isedit = "N";
						// 条件2显示组件
						if(j == 7){
							obj.component.id = "txtCond2";
							obj.component.name = lang.Condition2;
							obj.isedit = "Y";
							let cond2ParamList = null;
							let cond1ID = itemObjList[2].defaultvalue;			// 条件1内存值（ID）
							if(cond1ID != null && cond1ID != "$AF$KEYWORD"){	// 条件1不等于工作主题
								obj.columntype = "cbo";
								cond2ParamList = await this.getInitCondicton2Param(cond1ID);
							}else {
								obj.columntype = "txt";
							}
							obj.paramList = cond2ParamList;
						}
					}

					// 代理人工号
					if(j == 8){
						for(let k in RulesListComponent){
							if(RulesListComponent[k].component.id == "txtRuleDeputyID"){
								obj = deepClone(RulesListComponent[k]);
								break;		
							}
						}
						// 将defaultvalue数组改为对应的值
						obj.defaultvalue = obj.defaultvalue[i];
						obj.isedit = "Y";
					}

					// 代理人姓名
					if(j == 9){
						for(let k in RulesListComponent){
							if(RulesListComponent[k].component.id == "txtRuleDeputyName"){
								obj = deepClone(RulesListComponent[k]);
								break;		
							}
						}
						// 将defaultvalue数组改为对应的值
						obj.defaultvalue = obj.defaultvalue[i];
						let rulesMemObj = null;
						rulesMemObj = await getRulesMemActionValue(getState().UserInfo.UserInfo,obj);
						if(rulesMemObj){
							obj = rulesMemObj.rulesMem;
							rulesMemActionValue = rulesMemObj.rulesMemActionValue;
						}
						obj.isedit = "Y";
					}
					itemObjList.push(obj);
				}
				defaultvalueList.push(itemObjList);
			}
			console.log('defaultvalueList',defaultvalueList);

			// listComponent组成
			let listComponentValue = [];
			for(let l=0 ; l<10 ; l++){
				let obj = {};
				// 条件代号
				if(l == 0){
					for(let k in RulesListComponent){
						if(RulesListComponent[k].component.id == "txtCondID"){
							obj = deepClone(RulesListComponent[k]);
							break;		
						}
					}
					obj.isedit = "N";
				}

				// 条件
				if(l == 1){	
					for(let k in RulesListComponent){
						if(RulesListComponent[k].component.id == "txtCond"){
							obj = deepClone(RulesListComponent[k]);
							break;		
						}
					}
					obj.columntype = "deputytxt";
					obj.isedit = "N";
				}

				// 条件1
				if(l == 2 || l == 3){
					for(let k in RulesListComponent){
						if(RulesListComponent[k].component.id == "txtCond1ID"){
							obj = deepClone(RulesListComponent[k]);
							break;		
						}
					}
					obj.isedit = "N";
					// 条件1显示组件
					if(l == 3){
						obj.columntype = "cbo";
						obj.component.id = "txtCond1";
						obj.component.name = lang.Condition1;
						obj.isedit = "Y";
						obj.paramList = deputyState.condition1Param;
						for(let k in deputyState.condition1Param){
							if(obj.defaultvalue == deputyState.condition1Param[k].paramcode){
								obj.columnaction = deputyState.condition1Param[k].columnaction;
								break;
							}
						}
					}
				}

				// 关联性
				if(l == 4 || l == 5){
					for(let k in RulesListComponent){
						if(RulesListComponent[k].component.id == "txtRelationID"){
							obj = deepClone(RulesListComponent[k]);
							break;		
						}
					}
					obj.isedit = "N";
					// 关联性显示组件
					if(l == 5){
						obj.columntype = "cbo";
						obj.component.id = "txtRelation";
						obj.component.name = lang.Relation;
						obj.isedit = "Y";
						obj.paramList = deputyState.relationParam;
					}
				}

				// 条件2
				if(l == 6 || l == 7){
					for(let k in RulesListComponent){
						if(RulesListComponent[k].component.id == "txtCond2ID"){
							obj = deepClone(RulesListComponent[k]);
							break;		
						}
					}
					obj.isedit = "N";
					// 条件2显示组件
					if(l == 7){
						obj.columntype = "cbo";
						obj.component.id = "txtCond2";
						obj.component.name = lang.Condition2;
						obj.isedit = "Y";
						obj.paramList = [];
					}
				}

				// 代理人工号
				if(l == 8){
					for(let k in RulesListComponent){
						if(RulesListComponent[k].component.id == "txtRuleDeputyID"){
							obj = deepClone(RulesListComponent[k]);
							break;		
						}
					}
					obj.isedit = "Y";
				}

				// 代理人姓名
				if(l == 9){
					for(let k in RulesListComponent){
						if(RulesListComponent[k].component.id == "txtRuleDeputyName"){
							obj = deepClone(RulesListComponent[k]);
							break;		
						}
					}
					let rulesMemObj = null;
					rulesMemObj = await getRulesMemActionValue(getState().UserInfo.UserInfo,obj);
					if(rulesMemObj){
						obj = rulesMemObj.rulesMem;
						rulesMemActionValue = rulesMemObj.rulesMemActionValue;
					}
					obj.isedit = "Y";
				}
				// defaultvalue值为空
				obj.defaultvalue = null;
				listComponentValue.push(obj);
			}
			console.log('listComponentValue',listComponentValue);
			basicClone.deputyRules.listComponent = listComponentValue;
			basicClone.deputyRules.defaultvalue = defaultvalueList;

            // //拼接card呈現方式
            // let listComponent = basicClone.deputyRules.listComponent;
            // //確認組件數
            // let comList = listComponent.length;
			// console.log('comList',comList);
            // let count = 0;
            // if (comList > 0) {
            // 	for(let i in listComponent){
            // 		if(listComponent[i].component.id=="txtRuleDeputyID"){
			// 			//組件數存在-確認資料筆數
			// 			if (listComponent[i].defaultvalue) {
			// 				count = listComponent[i].defaultvalue.length;
			// 				break;
			// 			}
            // 		}
            // 	}
            // }
            // //是否有初始化資料
			// if(count > 0) {
			// 	//遍歷組件並分別取出顯示筆數
			// 	//分3組3段
			// 	let arrayRule = new Array(count);
			// 	let ruleList1 = [];
          	// 	for (var i = 0; i < count; i++) {
	        //         let ruleList2 = [];
	        //         for (var j = 0; j < comList; j++) {
			// 			arrayRule[i] = deepClone(listComponent);
			// 			arrayRule[i][j].defaultvalue = arrayRule[i][j].defaultvalue[i];
			// 			ruleList2[j] = arrayRule[i][j];
	        //         }
	        //         ruleList1[i] = ruleList2;
            //   	}
			// 	let tempList;
			// 	let tempList2;
			// 	//分3組5段
			// 	for(let i in ruleList1) {
			// 		let arryCondition1 = ["","",""];
			// 		let arryCondition2 = ["","",""];
			// 		//分割 條件1-關係-條件2
			// 		for(let j in ruleList1[i]){
			// 			if(ruleList1[i][j].component.id=="txtCondID"){
			// 				arryCondition1 = ruleList1[i][j].defaultvalue.replace(/\"/g, "").split(" ");
			// 			}
			// 			if(ruleList1[i][j].component.id=="txtCond"){
			// 				arryCondition2 = ruleList1[i][j].defaultvalue.replace(/\"/g, "").split(" ");
			// 			}
			// 		}

			// 		//key ["$AF$PRJ", "==", "一般;資訊;人資"]
			// 		let cond1Key=arryCondition1[0];
			// 		let relationKey=arryCondition1[1];
			// 		let cond2Key=arryCondition1[2];
			// 		//value ["專案名稱", "等於", "一般;資訊;人資"]
			// 		let cond1Value=arryCondition2[0];
			// 		let relationValue=arryCondition2[1];
			// 		let cond2Value=arryCondition2[2];

			// 		//判斷是否為多選
			// 		let strs1 = cond2Key.split(";"); //字符分割 
			// 		let strs2 = cond2Value.split(";"); //字符分割 
			// 		//初始化com組件類型-管制多規則不可編輯問題
			// 		let columntype1 = "cbo";
			// 		let columntype2 = "cbo";
			// 		let columntype3 = "cbo";
			// 		let isCboEdit = "Y";
			// 		let cond2ParamList = [];
			// 		//若存在多規則-則設置為文本框並不可編輯
			// 		if (strs1.length > 2) {
			// 			columntype1 = "txt";
			// 			columntype2 = "txt";
			// 			columntype3 = "txt";
			// 			isCboEdit = "N";
			// 		} else if (strs1.length == 1) {
			// 			//若只存在一個規則則判斷規則
			// 			if (cond1Key != "$AF$KEYWORD") {
			// 				//規則不為文字框則進行參數list賦值
			// 				cond2ParamList = await this.getInitCondicton2Param(cond1Key);
			// 			} else {
			// 				columntype1 = "cbo";
			// 				columntype2 = "cbo";
			// 				columntype3 = "txt";
			// 			}
			// 		}

	        //         // defaultvalue拼接初始化
	        //         tempList = [
	        //           {//條件1-隱藏
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: "hidetxt",
	        //             component: {
	        //               name: lang.Condition1,
	        //               id: "txtCond1"
	        //             },
	        //             defaultvalue: cond1Key,
	        //             isedit: "N",
	        //             listComponent: null,
	        //             paramList: [],
	        //             required: "Y"
	        //           }, 
	        //           {//條件1
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: columntype1,
	        //             component: {
	        //               name: lang.Condition1,
	        //               id: "txtCond1"
	        //             },
	        //             defaultvalue: cond1Value,
	        //             isedit: isCboEdit,
	        //             listComponent: null,
	        //             paramList: deputyState.condition1Param,
	        //             required: "Y"
	        //           }, 
	        //           {//關聯性-隱藏
	        //             action: null,
	        //             actionColumn: null,
	        //             columntype: "hidetxt",
	        //             component: {
	        //               name: lang.Relation,
	        //               id: "relation"
	        //             },
	        //             defaultvalue: relationKey,
	        //             isedit: "N",
	        //             listComponent: null,
	        //             paramList: [],
	        //             required: "Y"
	        //           }, 
	        //           {//關聯性
	        //             action: null,
	        //             actionColumn: null,
	        //             columntype: columntype2,
	        //             component: {
	        //               name: lang.Relation,
	        //               id: "relation"
	        //             },
	        //             defaultvalue: relationValue,
	        //             isedit: isCboEdit,
	        //             listComponent: null,
	        //             paramList: deputyState.relationParam,
	        //             required: "Y"
	        //           }, 
	        //           {//條件二-隱藏
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: "hidetxt",
	        //             component: {
	        //               name: lang.Condition2,
	        //               id: "txtCond2"
	        //             },
	        //             defaultvalue: cond2Key,
	        //             isedit: "N",
	        //             listComponent: null,
	        //             paramList: [],
	        //             required: "Y"
	        //           }, 
	        //           {//條件二
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: columntype3,
	        //             component: {
	        //               name: lang.Condition2,
	        //               id: "txtCond2"
	        //             },
	        //             defaultvalue: cond2Value,
	        //             isedit: isCboEdit,
	        //             listComponent: null,
	        //             paramList: cond2ParamList,
	        //             required: "Y"
	        //           }
			// 		];

		    // 		// componetList拼接初始化
	        //         tempList2 = [
	        //           {//條件1-隱藏
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: "hidetxt",
	        //             component: {
	        //               name: lang.Condition1,
	        //               id: "txtCond1"
	        //             },
	        //             defaultvalue: cond1Key,
	        //             isedit: "N",
	        //             listComponent: null,
	        //             paramList: [],
	        //             required: "Y"
	        //           }, 
	        //           {//條件1
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: "cbo",
	        //             component: {
	        //               name: lang.Condition1,
	        //               id: "txtCond1"
	        //             },
	        //             defaultvalue: cond1Value,
	        //             isedit: "Y",
	        //             listComponent: null,
	        //             paramList: deputyState.condition1Param,
	        //             required: "Y"
	        //           }, 
	        //           {//關聯性-隱藏
	        //             action: null,
	        //             actionColumn: null,
	        //             columntype: "hidetxt",
	        //             component: {
	        //               name: lang.Relation,
	        //               id: "relation"
	        //             },
	        //             defaultvalue: relationKey,
	        //             isedit: "N",
	        //             listComponent: null,
	        //             paramList: [],
	        //             required: "Y"
	        //           }, 
	        //           {//關聯性
	        //             action: null,
	        //             actionColumn: null,
	        //             columntype: "cbo",
	        //             component: {
	        //               name: lang.Relation,
	        //               id: "relation"
	        //             },
	        //             defaultvalue: relationValue,
	        //             isedit: "Y",
	        //             listComponent: null,
	        //             paramList: deputyState.relationParam,
	        //             required: "Y"
	        //           }, 
	        //           {//條件二-隱藏
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: "hidetxt",
	        //             component: {
	        //               name: lang.Condition2,
	        //               id: "txtCond2"
	        //             },
	        //             defaultvalue: cond2Key,
	        //             isedit: "N",
	        //             listComponent: null,
	        //             paramList: [],
	        //             required: "Y"
	        //           }, 
	        //           {//條件二
	        //             action: null,
	        //             actionColumn: null,
	        //             columnaction: null,
	        //             columntype: "cbo",
	        //             component: {
	        //               name: lang.Condition2,
	        //               id: "txtCond2"
	        //             },
	        //             defaultvalue: cond2Value,
	        //             isedit: "Y",
	        //             listComponent: null,
	        //             paramList: [],
	        //             required: "Y"
	        //           }
			// 		];

	        //         let tempRuleList1 = deepClone(ruleList1)
	        //         let newRuleList1 =[];
		    //     	// 多規則代理人跳頁人員選單
		    //     	let rulesMemObj = null;
		    // 		for(let j in tempRuleList1[i]){
		    // 			if(tempRuleList1[i][j].component.id=="txtRuleDeputyID"){
		    // 				//代理人開窗開放
		    // 				tempRuleList1[i][j].isedit = "Y";
		    // 				newRuleList1.push(tempRuleList1[i][j]);
		    // 			}
	    	// 			if(tempRuleList1[i][j].component.id=="txtRuleDeputyName"){
	    	// 				//撈取多規則開窗
			// 				console.log('getState().UserInfo.UserInfo',getState().UserInfo.UserInfo);
			// 				console.log('tempRuleList1[i][j]',tempRuleList1[i][j]);
			// 				rulesMemObj = await getRulesMemActionValue(getState().UserInfo.UserInfo,tempRuleList1[i][j]);
			// 	        	console.log('rulesMemObj', rulesMemObj);
			// 				if(rulesMemObj){
			// 	        		tempRuleList1[i][j]=rulesMemObj.rulesMem;
			// 	        		rulesMemActionValue=rulesMemObj.rulesMemActionValue;
			// 	        	}
		    // 				//代理人開窗開放
			// 	        	tempRuleList1[i][j].isedit = "Y";
		    // 				newRuleList1.push(tempRuleList1[i][j]);
	    	// 			}
		    // 		}
		    // 		tempRuleList1[i]=newRuleList1;
	        //         //拼接成 代理人工號-代理人-條件
	        //         ruleList1[i] = [...tempList, ...tempRuleList1[i]];
			// 		//設定com組件呈現方式
			// 		for (let i = 0; i < comList; i++) {
			// 			basicClone.deputyRules.listComponent[i].defaultvalue = null;
			// 		}
			// 		//組件格式拼接成 條件1-關係-條件2-代理人工號-代理人
			// 		console.log('basicClone.deputyRules.listComponent',deepClone(basicClone.deputyRules.listComponent));
		    //     	if(basicClone.deputyRules.listComponent.length>0){
		    //     		for(let i in basicClone.deputyRules.listComponent){
        	// 				if(basicClone.deputyRules.listComponent[i].component.id=="txtRuleDeputyID"){
			// 					tempList2.push(basicClone.deputyRules.listComponent[i]);
		    //     			}
		    //     			if(basicClone.deputyRules.listComponent[i].component.id=="txtRuleDeputyName"){
			// 		        	if(rulesMemObj){
			// 		        		basicClone.deputyRules.listComponent[i]=rulesMemObj.rulesMem;
			// 		        	}
			// 					tempList2.push(basicClone.deputyRules.listComponent[i]);
		    //     			}
		    //     		}
		    //     	}
			// 		let conTempList = deepClone(tempList2);
			// 		for (let i in conTempList) {
			// 			//修改各段默認值為空且可編輯
			// 			conTempList[i].defaultvalue = null;
			// 			conTempList[i].isedit = "Y";
			// 		}

			// 		//替換data資料為temp資料
			// 		basicClone.deputyRules.listComponent = conTempList;
			// 		basicClone.deputyRules.defaultvalue = ruleList1;
			// 	}

			// 	let tj = {
			// 		action: null,
			// 		actionColumn: null,
			// 		columnaction: null,
			// 		columntype: "deputytxt",
			// 		component: {name: "条件", id: "txtCondAll"},
			// 		defaultvalue: null,
			// 		isedit: true,
			// 		listComponent: null,
			// 		paramList: [],
			// 		required: "Y"
			// 	};
			// 	basicClone.deputyRules.listComponent.splice(0, 0, tj);

			// 	let condList = [];
			// 	let arrListComponent = deputyRulesData.listComponent;
			// 	for(let i in arrListComponent){
			// 		if(arrListComponent[i].component.id == 'txtCond'){
			// 			condList = arrListComponent[i].defaultvalue;
			// 		}
			// 	}
			// 	let arrDefaultvaluet = basicClone.deputyRules.defaultvalue;
			// 	for(let i in arrDefaultvaluet){
			// 		let tj1 = {
			// 			action: null,
			// 			actionColumn: null,
			// 			columnaction: null,
			// 			columntype: "deputytxt",
			// 			component: {name: "条件", id: "txtCondAll"},
			// 			defaultvalue: condList[i],
			// 			isedit: true,
			// 			listComponent: null,
			// 			paramList: [],
			// 			required: "Y"
			// 		};
			// 		arrDefaultvaluet[i].splice(0, 0, tj1);
			// 	}

			// } else {
			// 	//沒有則初始化組件
			// 	let tempList3 =
			// 		[{
			// 			action: null,
			// 			actionColumn: null,
			// 			columnaction: null,
			// 			columntype: "hidetxt",
			// 			component: {
			// 			name: lang.Condition1,
			// 			id: "txtCond1"
			// 			},
			// 			defaultvalue: null,
			// 			isedit: "N",
			// 			listComponent: null,
			// 			paramList: [],
			// 			required: "Y"
			// 		}, {
			// 			action: null,
			// 			actionColumn: null,
			// 			columnaction: null,
			// 			columntype: "cbo",
			// 			component: {
			// 			name: lang.Condition1,
			// 			id: "txtCond1"
			// 			},
			// 			defaultvalue: null,
			// 			isedit: "Y",
			// 			listComponent: null,
			// 			paramList: deputyState.condition1Param,
			// 			required: "Y"
			// 		}, {
			// 			action: null,
			// 			actionColumn: null,
			// 			columntype: "hidetxt",
			// 			component: {
			// 			name: lang.Relation,
			// 			id: "relation"
			// 			},
			// 			defaultvalue: null,
			// 			isedit: "N",
			// 			listComponent: null,
			// 			paramList: [],
			// 			required: "Y"
			// 		}, {
			// 			action: null,
			// 			actionColumn: null,
			// 			columntype: "cbo",
			// 			component: {
			// 			name: lang.Relation,
			// 			id: "relation"
			// 			},
			// 			defaultvalue: null,
			// 			isedit: "Y",
			// 			listComponent: null,
			// 			paramList: deputyState.relationParam,
			// 			required: "Y"
			// 		}, {
			// 			action: null,
			// 			actionColumn: null,
			// 			columnaction: null,
			// 			columntype: "hidetxt",
			// 			component: {
			// 			name: lang.Condition2,
			// 			id: "txtCond2"
			// 			},
			// 			defaultvalue: null,
			// 			isedit: "N",
			// 			listComponent: null,
			// 			paramList: [],
			// 			required: "Y"
			// 		}, {
			// 			action: null,
			// 			actionColumn: null,
			// 			columnaction: null,
			// 			columntype: "cbo",
			// 			component: {
			// 			name: lang.Condition2,
			// 			id: "txtCond2"
			// 			},
			// 			defaultvalue: null,
			// 			isedit: "Y",
			// 			listComponent: null,
			// 			paramList: [],
			// 			required: "Y"
			// 	}];
	        // 	// 多規則代理人跳頁-人員選單初始化
	        // 	if(basicClone.deputyRules.listComponent.length>0){
			// 		for(let i in basicClone.deputyRules.listComponent){
			// 			if(basicClone.deputyRules.listComponent[i].component.id=="txtRuleDeputyID"){
			// 				//設定com組件呈現方式
			// 				//組件格式拼接成 條件1-關係-條件2-代理人工號
			// 				tempList3.push(basicClone.deputyRules.listComponent[i]);
			// 			}
			// 			if(basicClone.deputyRules.listComponent[i].component.id=="txtRuleDeputyName"){
			// 				let rulesMemObj=await getRulesMemActionValue(getState().UserInfo.UserInfo,basicClone.deputyRules.listComponent[1]);
			// 		    	if(rulesMemObj){
			// 		    		basicClone.deputyRules.listComponent[i]=rulesMemObj.rulesMem;
			// 		    		rulesMemActionValue=rulesMemObj.rulesMemActionValue;
			// 		    	}
			// 				//組件格式拼接成 條件1-關係-條件2-代理人工號-代理人
			// 		    	tempList3.push(basicClone.deputyRules.listComponent[i]);
			// 			}
			// 		}
	        // 	}
			// 	let conTempList = deepClone(tempList3);
			// 	for (let i in conTempList) {
			// 		//修改各段默認值為空且可編輯
			// 		conTempList[i].defaultvalue = null;
			// 		conTempList[i].isedit = "Y";
			// 	}
			// 	//替換data資料為temp資料
			// 	basicClone.deputyRules.listComponent = conTempList;
			// 	basicClone.deputyRules.defaultvalue = [];
        	// }

        	//時間戳轉換為API格式
	        // if (basicClone.startExecuteTime == -1) {
	        //   basicClone.startExecuteTime = (new Date()).getTime();
	        // }
			// console.log('basicClone.startExecuteTime', basicClone.startExecuteTime);
	        // let startExecuteTime = Common.dateFormatNoSecond(basicClone.startExecuteTime, "/");
			// console.log('startExecuteTime',startExecuteTime);
	        // if (basicClone.endExecuteTime == -1) {
	        //   basicClone.endExecuteTime = (new Date()).getTime() + 24 * 60 * 60 * 1000 - 1;
	        // }
	        // let endExecuteTime = Common.dateFormatNoSecond(basicClone.endExecuteTime, "/");
	        
			//根據啟用狀態決定是否可編輯
	        if (basicClone.state != null) {
	          basicClone.deputyName.isedit = basicClone.state ? "N" : "Y";
	          basicClone.informName.isedit = basicClone.state ? "N" : "Y";
	        }
	        if (basicClone.deputyRule) {
	          basicClone.deputyRules.isedit = basicClone.state ? "N" : "Y";
	        }

			// iseditList
			let arrListComponent = deputyRulesData.listComponent;
			let iseditList = [];
			for(let i in arrListComponent){
				if(arrListComponent[i].component.id == 'isEdit'){
					iseditList = arrListComponent[i].defaultvalue;
					break;
				}
			}
			basicClone.deputyRules["iseditList"] = iseditList;

			// 多规则代理组件类型
	        basicClone.deputyRules.columntype="tabForDeputy";

            //組件初始化
			let deputyWayObj = updateDeputyWayData(lang, basicClone.deputyRule, basicClone.state, deputyState.deputyWayParam);
			let startExecuteTime = basicClone.startExecuteTime;
			console.log('startExecuteTime',startExecuteTime);
			let startExecuteTimeObj = updateStartExecuteTime(lang, startExecuteTime, basicClone.state);
			console.log('startExecuteTimeObj',startExecuteTimeObj);
			let endExecuteTime = basicClone.endExecuteTime;
			console.log('endExecuteTime',endExecuteTime);
		    let endExecuteTimeObj = updateEndExecuteTime(lang, endExecuteTime, basicClone.state);
        	console.log('endExecuteTimeObj',endExecuteTimeObj);
			//單一人員代理選單初始化
            let deputyNameObj=await getDeputyActionValue(getState().UserInfo.UserInfo,basicClone.deputyName);
        	let deputyActionValue=null;
        	if(deputyNameObj){
        		basicClone.deputyName=deputyNameObj.deputyName;
        		deputyActionValue=deputyNameObj.deputyActionValue;
        	}
        	
			//通知人員選單初始化
            let informNameObj=await getInformActionValue(getState().UserInfo.UserInfo,basicClone.informName);
        	let informActionValue=null;
        	if(informNameObj){
        		basicClone.informName=informNameObj.informName;
        		informActionValue=informNameObj.informActionValue;
        	}
			
		    let iniOtherObj={
		    	deputyWay:deputyWayObj,
		    	startExecuteTime:startExecuteTimeObj,
		    	endExecuteTime:endExecuteTimeObj,
		    	deputyActionValue:deputyActionValue,
		    	informActionValue:informActionValue,
		    	rulesMemActionValue:rulesMemActionValue
		    }

			console.log('basicClone', basicClone);
			console.log('iniOtherObj', iniOtherObj);
  			dispatch(setTransferBasic(basicClone));
  			dispatch(setOrtherInit(iniOtherObj));
		}
  	}

}

export function setBPMDeputy(content, msg){
	return async (dispatch, getState) => {
		dispatch(isLoading(true));
		// 資料保存-並改變畫面狀態
	    await UpdateDataUtil.setBPMDeputySetting(getState().UserInfo.UserInfo, content).then(async (data) => {
	      await this.loadBPMDeputySetting();
	      setTimeout(() => {
	        Alert.alert(msg);
	      }, 200);
	    });
		dispatch(isLoading(false));
	}

}

export function getDeputyTip(){
	return (dispatch, getState) => {
		let Deputy = getState().Deputy;
		let lang = getState().Language.lang.DeputyPage;
    	let stateName = "";
	    if (Deputy.deputyState != null && Deputy.deputyWay != null) {
	        //取得初始化內容進行判斷
	        if (Deputy.startExecuteTime && Deputy.endExecuteTime) {
				let tampStart = new Date(Deputy.startExecuteTime.defaultvalue).getTime();
				let tampNow = (new Date()).getTime();
				//狀態
	            if (Deputy.deputyState) {
	              //"代理模式已啟動，如需編輯請先停用";
	              stateName = lang.Running;
	            } else {
	              if (tampStart > tampNow) {
	                //"已保存，未達特定時間";
	                stateName = lang.SaveNotRunning;
	              } else {
	                //"代理模式已停用"
	                stateName = lang.NoRunning;
	              }
	            }
	        }
	    }
	    dispatch(setDeputyTip(stateName));
	}
}

export function updateMsgMember(informid,informname){
	return async (dispatch) => {	
  		dispatch(setMsgMember(informid,informname));  
	}
}

export function updateDeputyMember(deputid,deputname){
	return async (dispatch) => {	
  		dispatch(setDeputyMember(deputid,deputname));  
	}
}

async function getRulesMemActionValue(user, item) {
    let returnValue = null;
    let rulesMem = deepClone(item);
	let temp = null;
    if (item.action) {
	      if (!item.actionColumn) {
	        item.actionColumn = [];
	      }
	      let actionObject = {
	        count: 0
	      };
	      for (let column of item.actionColumn) {
	        actionObject[column] = (column == item.defaultvalue) ? true : false;
	      }
	      await UpdateDataUtil.getCreateFormDetailFormat(user, item.action, actionObject).then(async (data) => {
	        returnValue = data;
	        returnValue["actionObject"] = actionObject;
	        rulesMem.actionValue = returnValue;
			temp = {
				rulesMemActionValue:returnValue,
				rulesMem:rulesMem
			};

	      })
    }
	return temp;
}

async function getInformActionValue(user, item) {
    let returnValue = null;
    let informName = deepClone(item);
	let temp=null;
    if (item.action) {
	      if (!item.actionColumn) {
	        item.actionColumn = [];
	      }
	      let actionObject = {
	        count: 0
	      };
	      for (let column of item.actionColumn) {
	        actionObject[column] = (column == item.defaultvalue) ? true : false;
	      }
	      await UpdateDataUtil.getCreateFormDetailFormat(user, item.action, actionObject).then(async (data) => {
	        returnValue = data;
	        returnValue["actionObject"] = actionObject;
	        informName.actionValue = returnValue;
			temp={
				informActionValue:returnValue,
				informName:informName
			};
	      });
    }
	return temp;
}

async function getDeputyActionValue(user, item) {
    let returnValue = null;
    let deputyName = deepClone(item);
	let temp=null;
    if (item.action) {
		if (!item.actionColumn) {
			item.actionColumn = [];
		}
		let actionObject = {
		count: 0
		};
		for (let column of item.actionColumn) {
			actionObject[column] = (column == item.defaultvalue) ? true : false;
		}
		await UpdateDataUtil.getCreateFormDetailFormat(user, item.action, actionObject).then(async (data) => {
			returnValue = data;
			returnValue["actionObject"] = actionObject;
			deputyName.actionValue = returnValue;
			temp={
				deputyName:deputyName,
				deputyActionValue:returnValue
			};
		})
	}
	return temp;
  }

//結束時間
function  updateEndExecuteTime(lang, datetime, deputyState){
    let isedit = deputyState ? "N" : "Y";
    let endExecuteTime = {
      action: null,
      actionColumn: null,
      columntype: "datetime",
      component: {
        name: lang.DeputyEndTime,
        id: "endExecuteTime"
      },
      defaultvalue: datetime,
      isedit: isedit,
      listComponent: null
    }
    return endExecuteTime;
}

export function onPressEndExecuteTime(value){
	return async (dispatch, getState) => {	
	    let endObj=updateEndExecuteTime(getState().Language.lang.DeputyPage, value, getState().Deputy.deputyState);
  		dispatch(setEndExecuteTime(endObj));  
	}

}

export function onPressStartExecuteTime(value){
	return async (dispatch, getState) => {
	    let startObj=updateStartExecuteTime(getState().Language.lang.DeputyPage, value, getState().Deputy.deputyState);
  		dispatch(setStartExecuteTime(startObj));  
	}
}

//起始時間
function  updateStartExecuteTime (lang, datetime, deputyState){
    let isedit = deputyState ? "N" : "Y";	    

    let startExecuteTime = {
      action: null,
      actionColumn: null,
      columntype: "datetime",
      component: {
        name: lang.DeputyStartTime,
        id: "startExecuteTime"
      },
      defaultvalue: datetime,
      isedit: isedit,
      listComponent: null
    }

    return startExecuteTime;
}


export function switchDisableMsgPrompt(){
	return (dispatch, getState) => {
	  dispatch(setDisableMsgPrompt(!getState().Deputy.disableMsgPrompt));
	}
}

export function switchInformMailMode(){
	return (dispatch, getState) => {
	  dispatch(setInformMailMode(!getState().Deputy.informMailMode));
	}
}

export function switchExecuteDuration(){
	return (dispatch, getState) => {
	  dispatch(setExecuteDuration(!getState().Deputy.executeDuration));
	}
}

export function updateDeputyWay(value){
	return async (dispatch, getState) => {
		let deputyWayObj=updateDeputyWayData(getState().Language.lang.DeputyPage, value, getState().Deputy.deputyState, getState().Deputy.deputyWayParam);
  		dispatch(setDeputyWay(deputyWayObj,value));  
	}

}

export function updateDeputyRules(value){
	return async (dispatch) => {
  		dispatch(setDeputyRules(value));  
	}

}

//代理方式
function updateDeputyWayData(lang , deputyRule, deputyState, deputyWayParam){
    let isedit = deputyState ? "N" : "Y";
    let deputyWay = {
      action: null,
      actionColumn: null,
      columntype: "cbo",
      component: {
        name: lang.DeputyWay,
        id: "deputyWay"
      },
      defaultvalue: deputyRule,
      isedit: isedit,
      listComponent: null,
      paramList: deputyWayParam,
      required: "Y"
    }

    return deputyWay;
}

export function getInitCondicton2Param(rule) {
	return async (dispatch, getState) => {
		let temp = [];
		let param = [];
		switch (rule) {
		  case "$AF$PRJ":
		    if (getState().Deputy.MapCategoryParam) {
		      temp = getState().Deputy.MapCategoryParam.contentList;
		    }
		    break
		  case "$AF$PRO":
		    if (getState().Deputy.MapParam) {
		      temp = getState().Deputy.MapParam.contentList;
		    }
		    break
		}
		if (temp.length > 0) {
		  for (let i in temp) {
		    let tempObj = {
		      paramcode: temp[i].VALUE,
		      paramname: temp[i].NAME
		    }
		    param.push(tempObj);
		  }
		}
		return param;
	}
}

export function paramInit(){
	return async (dispatch, getState) => {
	    let relationParam = [];		// 关联性
	    let condition1Param = [];	// 多规则条件
	    let deputyWayParam = [];	// 代理方式
      	let data = [];
	    let deputyRuleComParam = true;	// 是否成功捞取代理下拉资料
		let sql=`
			select * 
			from THF_MASTERDATA 
			where CLASS1 in ('DeputyRules','DeputyRelation','DeputyWay') and STATUS='Y'
		    order by CLASS1,SORT;`
		//初始化執行
		await SQLite.selectData(sql, []).then((result) => {
			console.log('getSQLData', result.raw());
			//如果沒有找到資料，不顯示任何資料
		    for (let i in result.raw()) {
		      data.push(result.raw()[i]);
		    }
		}).catch((e)=>{
			deputyRuleComParam = false;
			LoggerUtil.addErrorLog("DeputyAction paramInit", "APP Action", "ERROR", e);
		});
		if (data.length != 0) {
			data.forEach( param => {
				let tempObj = {
					desccode: null,
					descname: null,
					oid: param.OID,
					paramcode: param.CLASS3,
					paramname: param.CONTENT,
					paramtype: param.CLASS1,
					paramtypename: param.CLASS2,
					parentparam: null,
					columnaction: param.CLASS4,
					columFieldType: param.CLASS5
				}
			  	switch (param.CLASS1) {
					case "DeputyRelation":
						relationParam.push(tempObj);
						break;
					case "DeputyRules":
						condition1Param.push(tempObj);
						break;
					case "DeputyWay":
						tempObj.paramcode = eval(param.CLASS3);
						deputyWayParam.push(tempObj);
						break;
			  	}
			})
		}

	    let mixParam = mixParamInit(condition1Param, relationParam);
	    let paramObj = {
	    	relationParam: relationParam,
	    	condition1Param: condition1Param,
	    	deputyWayParam: deputyWayParam,
	    	deputyRuleComParam: deputyRuleComParam,
	    	mixParam: mixParam
	    }
		dispatch(setDeputyParam(paramObj));
	}
}

export function cboParamInit(){
	return async (dispatch, getState) => {
		let user = getState().UserInfo.UserInfo;
	    let lang = getState().Language.lang.DeputyPage;
	    let MapCategoryParam = await getInitCondicton2("$AF$PRJ",user,lang);
	    let MapParam = await getInitCondicton2("$AF$PRO",user,lang);
		dispatch(setMapInit(MapCategoryParam, MapParam));
	}
}

async function getInitCondicton2 (rule,user,lang){
	let action = null;
	let result = [];
	switch (rule) {
		case "$AF$PRJ":
			action = "action/createpro/getProcessMapCategory";
		break
		case "$AF$PRO":
			action = "action/createpro/getProcessMap";
		break
	}

	let returnValue = null;
	if (action != null) {
		await UpdateDataUtil.getCreateFormDetailFormat(user, action).then(async (data) => {
			if(data){
				returnValue = data;
				result = returnValue;
			}
		}).catch((e)=>{
			result = [];
		});
	}
	return result;
}

function mixParamInit(condition1Param, relationParam){
	let mixParam=[];
    //條件一參數
    for (let i in condition1Param) {
      let tempObj = {
        key: condition1Param[i].paramcode,
        value: condition1Param[i].paramname
      }
      mixParam.push(tempObj);
    }
    //關係參數
    for (let i in relationParam) {
      let tempObj = {
        key: relationParam[i].paramcode,
        value: relationParam[i].paramname
      }
      mixParam.push(tempObj);
    }
    return mixParam;
}

function deepClone(src) {
	return JSON.parse(JSON.stringify(src));
}

export function errorTip(){
	return async (dispatch, getState) => {
		  //無法連線，請確定網路連線狀況
		  setTimeout(() => {
		    Alert.alert(
		      getState().Language.lang.CreateFormPage.Fail,
		      getState().Language.lang.Common.NoInternetAlert, [{
		        text: 'OK',
		        onPress: () => {
		          NavigationService.goBack();
		        }
		      }], {
		        cancelable: false
		      }
		    )
		  }, 200);
	}
}




function setMapInit(MapCategoryParam,MapParam){
	return {
		type: types.MAPINIT,
		MapCategoryParam,
		MapParam
	}
}

function setDeputyParam(paramObj){
	return {
		type: types.DEPUTYPARAM,
		paramObj
	}
}

function setDeputyBasic(deputyBasic){
	return {
		type: types.DEPUTYBASIC,
		deputyBasic,
	}
}

function setTransferBasic(deputyClone){
	return {
		type: types.TRANSFER_BASIC,
		deputyClone,
	}
}

function setOrtherInit(iniOtherObj){
	return {
		type: types.INIT_OTHER,
		iniOtherObj,
	}
}

function setDeputyRules(deputyRulesObj){
	return {
		type: types.SET_DEPUTYRULES,
		deputyRulesObj
	}
}

function setDeputyWay(deputyWayObj,deputyRule){
	return {
		type: types.SET_DEPUTYWAY,
		deputyWayObj,
		deputyRule
	}
}


function setDisableMsgPrompt(flag){
	return {
		type: types.SET_DISABLEMSGPROMPT,
		flag
	}
}

function setInformMailMode(flag){
	return {
		type: types.SET_INFORMMAILMODE,
		flag
	}
}

function setExecuteDuration(flag){
	return {
		type: types.SET_EXECUTEDUATION,
		flag
	}
}

function setStartExecuteTime(timeObj){
	return {
		type: types.SET_STARTEXECUTETIME,
		timeObj
	}
}

function setEndExecuteTime(timeObj){
	return {
		type: types.SET_ENDEXECUTETIME,
		timeObj
	}
}

function setDeputyMember(id,name){
	return {
		type: types.SET_DEPUTYMEMBER,
		id,
		name
	}
}

function setMsgMember(id,name){
	return {
		type: types.SET_MSGMEMBER,
		id,
		name
	}
}

function isLoading(flag){
	return {
		type: types.ISLOADING,
		flag
	}
}

function setDeputyTip(msg){
	return {
		type: types.DEPUTYTIP,
		msg
	}
}
export function logout(message = null, loginPage = null) {
	return {
		type: LoginTypes.UNLOGIN,
		message,
		loginPage
	};
}