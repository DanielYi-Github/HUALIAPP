import * as UpdateDataUtil from './UpdateDataUtil';
import DateFormat          from  'dateformat'; //  https://www.npmjs.com/package/dateformat

let FormUnit = {
  // 保存多語系內容
  language:{},
  // 欄位規則檢查
  formFieldRuleCheck(value, formItem, formContent, columntype){
    if (formItem.rulesList == null) return true;                       // 馬上結束
    let compareResult = true;                                          // 比對結果
    
    for(let rule of formItem.rulesList){                               // 一個欄位可能有多個比較規則
      let selfComparisonId = formItem.component.id;
      let idListValue = this.getIdListValue(rule, formContent, selfComparisonId); // 取得需要進行比對欄位的值
      let compareLanguage = this.getCompareLanguage(rule.comparison);  // 取得比較字元的語言意思
      rule.computeList = (rule.computeList == null) ? [] : rule.computeList;
      if (rule.computeList.length == 0) { 
        // 一個欄位比對                             
        if (idListValue[0].value == null) return true;
        compareResult = this.compare( value, rule.comparison, idListValue[0].value, columntype);

        if (compareResult != true) {
          return { message:`${formItem.component.name} ${this.language.Connot}${compareLanguage} ${idListValue[0].name}`};
        }
      } else {
        // 多個欄位比對                                                                 
      }
    }
    return compareResult;
  },
  // 欄位筆數特殊規則比較
  formRowRuleCheck(value, formItem, parentItem, editCheckItemIndex){
    let compareResult = true;     // 比對結果
    //如果編輯資料為第一筆，直接離開
    if ( editCheckItemIndex == 0 ) return compareResult;
    switch(parentItem.columntype) {
      /* 台籍幹部休假單的表格規則
         新一筆的起始時間不能小於前一筆的起迄時間
      */
      case "tableave":
        if (parentItem.defaultvalue == null) return compareResult;  // 馬上結束
        if (parentItem.defaultvalue.length == 0) return compareResult;  // 馬上結束

        let editIndex = (editCheckItemIndex == -1) ? parentItem.defaultvalue.length : editCheckItemIndex;
        if (formItem.columntype == "date"){
          let compareLanguage  = this.getCompareLanguage(">");           // 取得比較字元的語言意思
          let comparisonObject = parentItem.defaultvalue[editIndex-1][2];
          let compareResult    = this.compare( value, ">", comparisonObject.defaultvalue, formItem.columntype);
          if (compareResult != true) {
            return { message:`${formItem.component.name} ${this.language.Connot}${compareLanguage} ${this.language.Previous}${comparisonObject.component.name}`};
          }
        }

        break;
      /* 派車單的表格規則
         以周日為一周的第一天，兩筆資料間不能跨週
         如第一筆日期為周日，則不可再新增資料
      */
      case "tabcar":
        if (parentItem.defaultvalue == null) return compareResult;      // 馬上結束
        if (parentItem.defaultvalue.length == 0) return compareResult;  // 馬上結束
        if (formItem.columntype == "date"){
            let editIndex = (editCheckItemIndex == -1) ? parentItem.defaultvalue.length : editCheckItemIndex;
            // 第一筆資料是不是星期天 或 新增資料不能是星期天
            let comparisonObject = parentItem.defaultvalue[editIndex-1][0];
            let comparisonWeekday = (new Date(`${comparisonObject.defaultvalue} 00:00:00`)).getDay();
            let weekday = (new Date(`${value} 00:00:00`)).getDay();
            if( comparisonWeekday == 0 || weekday == 0 ){
              return { message:`${formItem.component.name} ${this.language.Including}`};
            }
            // 第一筆資料與第二筆資料不能跨週
            let comparisonDate = (new Date(`${comparisonObject.defaultvalue} 00:00:00`)); 
            let date = (new Date(`${value} 00:00:00`));
            let timeDisparity = (date - comparisonDate) / 86400000;
            if( timeDisparity == 0 ) return compareResult;              // 當天，馬上結束
            if (timeDisparity > 0) {
              if ( timeDisparity > (6-comparisonWeekday)  ) {
                return { message:`${formItem.component.name} ${this.language.CrossWeek}`};
              }
            } else {
              if ( timeDisparity < (1-comparisonWeekday)  ) {
                return { message:`${formItem.component.name} ${this.language.CrossWeek}`};
              }
            }

        }
        break;
      /* 請假單的表格規則
         起日ITEM4 迄日ITEM6 期間不能跨年 起日年份不等於迄日年份時提示不可跨年休假
         相同工號情況下，新一筆的起始時間不能小於前一筆的起迄時間
      */
      case "tableaveforlocal":
        if (parentItem.defaultvalue.length != 0) {
          // 強制先填寫性名
          if (formItem.component.id != "ITEM2" && parentItem.listComponent[1].defaultvalue == null) {
            return { message:`${parentItem.listComponent[1].component.name} ${this.language.requireFirst}`};
          }
          
          // 是否自己是整天的狀況下填寫的
          let isWholeDay =  typeof parentItem.listComponent[4].defaultvalue == "String" ? 
                              new Boolean(parentItem.listComponent[4].defaultvalue) :
                              parentItem.listComponent[4].defaultvalue;          

          // 請整天的情況下
          if (isWholeDay) {
            if (formItem.columntype == "date"){
              for(let lastRecord of parentItem.defaultvalue){
                // 是否同姓名
                if (lastRecord[1].defaultvalue == parentItem.listComponent[1].defaultvalue) {
                  // 被比對的對象是否整日
                  if(lastRecord[4].defaultvalue == "true"){
                    // 起始日必須晚於上一筆起迄日
                    let compareLanguage  = this.getCompareLanguage(">");           // 取得比較字元的語言意思
                    let comparisonObject = lastRecord[7];
                    let compareResult    = this.compare( value, ">", comparisonObject.defaultvalue, formItem.columntype);
                    
                    if (compareResult != true) {
                      return { message:`${formItem.component.name} ${this.language.Connot}${compareLanguage} ${this.language.PreviousSameName}${comparisonObject.component.name}`};
                    }
                  }else{
                    // 起始日必須晚於上一筆起始日
                    let compareLanguage  = this.getCompareLanguage(">");           // 取得比較字元的語言意思
                    let comparisonObject = lastRecord[7];
                    let compareResult    = this.compare( value, ">", comparisonObject.defaultvalue, formItem.columntype);
                    
                    if (compareResult != true) {
                      return { message:`${formItem.component.name} ${this.language.Connot}${compareLanguage} ${this.language.PreviousSameName}${comparisonObject.component.name}`};
                    }
                  }
                }
              }
            }
          } else {
            // 一定要先選日期，才可選時間
            if (formItem.columntype == "date"){
                for(let lastRecord of parentItem.defaultvalue){
                  // 是否同姓名
                  if (lastRecord[1].defaultvalue == parentItem.listComponent[1].defaultvalue) {
                    // 被比對的對象是否整日
                    if(lastRecord[4].defaultvalue == "true"){
                      // 起始日必須晚於上一筆起迄日
                      let compareLanguage  = this.getCompareLanguage(">");           // 取得比較字元的語言意思
                      let comparisonObject = lastRecord[7];
                      let compareResult    = this.compare( value, ">", comparisonObject.defaultvalue, formItem.columntype);
                      
                      if (compareResult != true) {
                        return { message:`${formItem.component.name} ${this.language.Connot}${compareLanguage} ${this.language.PreviousSameName}${comparisonObject.component.name}`};
                      }
                    }
                  }
                }
            }

            if (formItem.columntype == "time"){
                for(let lastRecord of parentItem.defaultvalue){
                  // 是否同姓名
                  if (lastRecord[1].defaultvalue == parentItem.listComponent[1].defaultvalue) {
                    // 是否是同一日，是，則起時不能早於上一筆的迄時：否則沒差
                    if (lastRecord[5].defaultvalue == parentItem.listComponent[5].defaultvalue ) {
                      // 否起始時間早於上一筆起迄時間
                      let compareLanguage  = this.getCompareLanguage(">");           // 取得比較字元的語言意思
                      let comparisonObject = lastRecord[8];
                      let compareResult    = this.compare( value, ">", comparisonObject.defaultvalue, formItem.columntype);
                      
                      if (compareResult != true) {
                        return { message:`${formItem.component.name} ${this.language.Connot}${compareLanguage} ${this.language.PreviousSameName}${comparisonObject.component.name}`};
                      }
                    }
                  }
                }
            }
          }
        }

        // 比對起日ITEM4 迄日ITEM6 期間不能跨年
        if (formItem.component.id == "ITEM4" || formItem.component.id == "ITEM6") {
          let item4Value, item6Value;
          if (formItem.component.id == "ITEM4") {
            item4Value = value;
            item6Value = parentItem.listComponent[7].defaultvalue;
          } else {
            item4Value = parentItem.listComponent[5].defaultvalue;
            item6Value = value;
          }
          if ( item4Value == null || item6Value == null ) return compareResult;  // 馬上結束

          item4Value = (new Date(`${item4Value}`)).getFullYear();
          item6Value = (new Date(`${item6Value}`)).getFullYear();
          if (item4Value !== item6Value) {
            return { message:`${parentItem.listComponent[5].component.name} ${this.language.and} ${parentItem.listComponent[7].component.name} ${this.language.CrossYear}`};
          }
        }
        break;
    }

    return compareResult;
  },
  getIdListValue(rule, formContent, selfComparisonId) {
    let valueList = [];
    for (let id of rule.idList) {
      // 如果自己跟自己比，不取defaultValue值
      if (id == selfComparisonId) {
        switch (rule.type) {
          case "number":
            valueList.push({
              name: rule.number,
              value: rule.number
            });
            break;
          default:
            valueList.push({
              name: rule.number,
              value: rule.number
            });
        }
      } else {
        switch (id) {
          case "today":
            valueList.push({
              name: this.language.Today,
              value: DateFormat(new Date(), "yyyy/mm/dd")
            });
            break;
          default:
            for (let item of formContent) {
              if (id == item.component.id) {
                valueList.push({
                  name: item.component.name,
                  value: item.defaultvalue
                });
                break;
              }
            }
        }
      }
    }
    return valueList;
  },
  compare(value, comparison, comparisonValue, columntype){
    // 數值換算
    switch(columntype) {
      case "datetime":
        value           = (new Date(`${value}`)).getTime();
        comparisonValue = (new Date(`${comparisonValue}`)).getTime();
        break;
      case "date":
        value           = (new Date(`${value} 00:00:00`)).getTime();
        comparisonValue = (new Date(`${comparisonValue} 00:00:00`)).getTime();
        break;
      case "time":
        let date        = DateFormat(new Date(), "yyyy/mm/dd");
        value           = (new Date(`${date} ${value}:00`)).getTime();
        comparisonValue = (new Date(`${date} ${comparisonValue}:00`)).getTime();
        break;
      case "number":
        value           = parseFloat(value);
        comparisonValue = parseFloat(comparisonValue);
        break;
      default:
        value           = Number(value);
        comparisonValue = Number(comparisonValue);
    }

    //開始比對
    let result = eval(value+comparison+comparisonValue);
    return result;
  },
  getCompareLanguage(comparison){
    // 比對內容所呈現的文字，要與運算相反
    let language = "";
    switch(comparison) {
      case "<":
        language = this.language.BiggerOrEqual;
        break;
      case "<=":
        language = this.language.Bigger;
        break;
      case ">":
        language = this.language.SmallerOrEqual;
        break;
      case ">=":
        language = this.language.Smaller;
        break;
      case "==":
        language = this.language.NotEqual;
        break;
      default:
    }

    return language;
  },
  // 更新欄位value值
  updateFormValue(value, formItem, formFormat){
    switch(formItem.columntype ) {
      case "tab":
      case "taboneitem":  
        formItem = value;       // 修改表格狀態
        break;
      case "tabcar":
        formItem = value;       // 修改表格狀態
        break;
      case "tableave":
        formItem = value;       // 修改表格狀態
        break;
      case "tableaveforlocal":
        formItem = value;       // 修改表格狀態
        break;
      case "tabForEvaluation":
        formItem = value;       // 修改表格狀態
        break;
      case "rdo":
        formItem.defaultvalue = value;  
        for(let item of formItem.listComponent){
          item.defaultvalue = (formItem.defaultvalue == item.component.id) ? "true" : "false";
        }
        break;
      case "txtwithaction":
        for(let key in formItem.actionValue.relationMap){
          for(let item of formFormat){
            if ( formItem.actionValue.relationMap[key] == item.component.id ) {
              item.defaultvalue = value[key];
            }
          }
        }
        break;
      default:
        formItem.defaultvalue = value;  // 修改表格狀態
        formItem.requiredAlbert = false;// 解決必填警告
    }
    return formItem;
  },
  // 取得欄位action資料
  async getActionValue(user, item, itemListComponent = []){
    let returnValue = null;
    if (item.action) {
      let actionObject = { count:0 };
      for(let column of item.actionColumn){
        for(let component of itemListComponent){
          actionObject[column] = (column == component.component.id) ? component.defaultvalue : false;
        }
      }

      await UpdateDataUtil.getCreateFormDetailFormat(user, item.action, actionObject).then((data)=>{
        returnValue = data;
        returnValue["actionObject"] = actionObject;
      }); 
    }
    return returnValue;
  },
  // 取得欄位columnaction資料
  async getColumnactionValue(user, item, parentItem = []){
    let returnValue = [];
    if (item.columnaction) {
      let columnactionObject = {};
      let isGetColumnactionValueFromObject = false; // 用來確認最後的取直方式
      for(let column of item.columnactionColumn){     
          switch( item.columntype ) {
            case "rdo":
              let isMatch = false;
              for(let it of item.listComponent){
                if(column == it.component.id){
                  isMatch = true;
                  columnactionObject[column] = it.defaultvalue;
                } 
              }
              if (!isMatch) {
                if (column == item.component.id) {
                  columnactionObject[column] = item.defaultvalue; 
                } else {
                  for(let pItem of parentItem){
                    if (column == pItem.component.id) columnactionObject[column] = pItem.defaultvalue;
                  }
                }
              }
              break;
            case "tableave":
              if (item.defaultvalue.length != 0) {
                let values = [];
                for (let [i, temps] of item.defaultvalue.entries()) {
                  let value = {
                    ROWINDEX: i.toString()
                  };
                  for (let [j, temp] of temps.entries()) {
                    value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
                  }
                  values.push(value);
                }
                columnactionObject[column] = values; 
              }
              break;
            default:
              isGetColumnactionValueFromObject = true;
              //是否取值欄位自己擁有，沒有的話去上層parentItem找
              if (column == item.component.id) {
                columnactionObject[column] = {
                  value :item.defaultvalue,
                  required: item.required == "Y" ? true : false
                }; 
              } else {
                for(let pItem of parentItem){
                  if (column == pItem.component.id) {
                    columnactionObject[column] = {
                      value :pItem.defaultvalue,
                      required: pItem.required == "Y" ? true : false
                    }
                  }
                }
              }
          }
      }

      // 只要有一個key值為空就不發request，改成
      // for(var index in columnactionObject) if(columnactionObject[index] == null) return returnValue;
      if (isGetColumnactionValueFromObject) {
        // 所有必填欄位有值才會觸發
        for (let [key, value] of Object.entries(columnactionObject)) {
          if (value.required && value.value == null) { return returnValue; }
          else{ columnactionObject[key] = value.value; }
        }
      } else {
        for(var index in columnactionObject) if(columnactionObject[index] == null) return returnValue;
      }

      await UpdateDataUtil.getCreateFormDetailFormat(user, item.columnaction, columnactionObject).then((data)=>{
        returnValue = data;
      }); 
    }
    return returnValue;
  },
  // 取得欄位columnaction資料
  async getColumnactionValueForButton(user, item, buttonItem, parentItem = []){
    let returnValue = [];
    if (buttonItem.columnaction) {
      await UpdateDataUtil.getCreateFormDetailFormat(
        user, 
        buttonItem.columnaction, 
        buttonItem.columnactionColumnParam
      ).then((data)=>{
        returnValue = data;
      }); 
    }
    return returnValue;

    /*
      for(let column of buttonItem.columnactionColumn){     
          switch( item.columntype ) {
            
            case "rdo":
              let isMatch = false;
              for(let it of item.listComponent){
                if(column == it.component.id){
                  isMatch = true;
                  columnactionObject[column] = it.defaultvalue;
                } 
              }
              if (!isMatch) {
                if (column == item.component.id) {
                  columnactionObject[column] = item.defaultvalue; 
                } else {
                  for(let pItem of parentItem){
                    if (column == pItem.component.id) columnactionObject[column] = pItem.defaultvalue;
                  }
                }
              }
              break;
            
            case "tableave":
              if (item.defaultvalue.length != 0) {
                let values = [];
                for (let [i, temps] of item.defaultvalue.entries()) {
                  let value = {
                    ROWINDEX: i.toString()
                  };
                  for (let [j, temp] of temps.entries()) {
                    value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
                  }
                  values.push(value);
                }
                columnactionObject[column] = values; 
              }
              break;
            
            case "tab":
              if (item.defaultvalue.length != 0) {
                let values = [];
                for (let [i, temps] of item.defaultvalue.entries()) {
                  let value = {
                    ROWINDEX: i.toString()
                  };
                  for (let [j, temp] of temps.entries()) {
                    value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
                  }
                  values.push(value);
                }
                columnactionObject[column] = values; 
              }
              break;
            default:
              isGetColumnactionValueFromObject = true;
              //是否取值欄位自己擁有，沒有的話去上層parentItem找
              if (column == item.component.id) {
                columnactionObject[column] = {
                  value :item.defaultvalue,
                  required: item.required == "Y" ? true : false
                }; 
              } else {
              }
          }
      }

      // 只要有一個key值為空就不發request，改成
      // for(var index in columnactionObject) if(columnactionObject[index] == null) return returnValue;
      if (isGetColumnactionValueFromObject) {
        // 所有必填欄位有值才會觸發
        for (let [key, value] of Object.entries(columnactionObject)) {
          if (value.required && value.value == null) { return returnValue; }
          else{ columnactionObject[key] = value.value; }
        }
      } else {
        for(var index in columnactionObject) if(columnactionObject[index] == null) return returnValue;
      }
    */
  },
  // 欄位顯示隱藏檢查
  checkFormFieldShow(columnactionValue, formFormat){
    for(let actionValue of columnactionValue){
      for(let content of formFormat){        // 判斷該值是否填寫表單中顯示
        if (actionValue.id == content.component.id) {
          content.defaultvalue = actionValue.value == "" ? content.defaultvalue : this.deepClone(actionValue.value);
          content.paramList    = actionValue.paramList;
          content.show         = actionValue.visible;
          content.required     = (actionValue.required) ? "Y" : "F";

          // 需要加入判斷，確認vo是array還是object，如果是array表示要修改的資料為表格grid
          if (actionValue.voList) {
            for(let vo of actionValue.voList){     
              for(let com of content.listComponent){
                if (vo.id == com.component.id) {
                  com.visible   = vo.visible;
                  com.required  = vo.required; 
                  com.defaultvalue = vo.value; 
                  com.paramList = vo.paramList; 
                }
              }
            }
          }

        }
      }
    }
    return formFormat;
  },
  // 針對listButtom的值進行整理
  formatListButtonOfForm(items){
    for(let item of items){
      let usefulItem = false;
      usefulItem = item.listButton != null ? true : false;
      usefulItem = ( usefulItem && item.listButton.length != 0 ) ? true : false;
      if (usefulItem) {
        for(let button of item.listButton){
          let columnactionColumnParam = {}
          for(let columnactionColumn of button.columnactionColumn){
            for(let itemm of items){
              if (columnactionColumn == itemm.component.id) {
                columnactionColumnParam[columnactionColumn] = itemm.defaultvalue
              }else if( itemm.columntype == "txtwithtxt" ){
                for(let itemmm of itemm.listComponent){
                  if (columnactionColumn == itemmm.component.id) {
                    columnactionColumnParam[columnactionColumn] = itemmm.defaultvalue
                  }
                }
              }
            }
          }
          button.columnactionColumnParam = columnactionColumnParam;
        }
      }
    }
    // return items;
  },
  // 整理成可編輯的欄位格式
  formatEditalbeFormField(item){
    switch(item.columntype) {
      case "tab":
      case "tabForEvaluation":
        let defaultvalues = [];
        let defaultvaluesCount = item.listComponent[0].defaultvalue.length;
        let tempDefaultvalues = this.deepClone(item.listComponent);

        for (let i = 0; i < defaultvaluesCount; i++) {
          for(let j in item.listComponent){
            tempDefaultvalues[j].defaultvalue = item.listComponent[j].defaultvalue[i];
          }
          defaultvalues.push(this.deepClone(tempDefaultvalues));
        }

        item.defaultvalue = defaultvalues 

        // 是否可以添加一筆資料，目前預設為不能添加比數，也不能刪除比數
        item.enableCreateData = false;
        item.enableDeleteData = false;
        break;
      default:
    }
    return item;
  },
  // 整理欄位送值資料
  formatSubmitFormValue(allFormFormat = null) {
    let formValue = [];
    for(let item of allFormFormat){ 
      switch(item.columntype) {
        case "rdo":
          for(let i of item.listComponent){
              formValue.push({
              columntype:item.columntype,
              id        :i.component.id,
              value     :(item.defaultvalue == i.component.id) ? "true" : "false"
              });
          } 
          break;
        case "tab":
        case "tabcar":  // 派車單的表格欄位輸入
        case "tabForEvaluation": //每月考核單的欄位輸入
          if (item.defaultvalue == null || item.defaultvalue.length == 0) {
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: []
            });
          } else {
            let values = [];
            for (let [i, temps] of item.defaultvalue.entries()) {
              let value = {
                ROWINDEX: i.toString()
              };
              for (let [j, temp] of temps.entries()) {
                value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
              }
              values.push(value);
            }
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: values
            });
          }
          break;
        case "tableave":  // 台級休假單的表格欄位輸入
            if ( item.defaultvalue==null || item.defaultvalue.length==0 ) {
                formValue.push({
                columntype:item.columntype,
                id        :item.component.id,
                value     :[]
                });
            } else {
              let values=[];
              for(let [i, temps] of item.defaultvalue.entries()){
                let value = { ROWINDEX : i.toString() };
                for(let [j, temp] of temps.entries()){ 
                  // "ITEM1": "2019/11/12",
                  // "ITEM2": "全天_@1@_Ad",
                  // "ITEM3": "2019/11/12",
                  // "ITEM4": "全天_@1@_Ad",
                  // "ITEM5": "年假_@1@_10",
                  // "ITEM6": "1"
                  if (temp.columntype == "cbo") {
                    value[temp.component.id] = "";
                    for (let cboObject of temp.paramList) {
                      if (temp.defaultvalue == cboObject.paramcode) {
                        value[temp.component.id] = `${cboObject.paramname}_@1@_${temp.defaultvalue}`;
                      }
                    }
                  } else {
                    value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
                  }
                }
                values.push(value);
              }
                formValue.push({
                columntype:item.columntype,
                id        :item.component.id,
                value     :values
                });
            }
            break;
        case "tableaveforlocal":  // 休假單的表格欄位輸入
            if ( item.defaultvalue==null || item.defaultvalue.length==0 ) {
                formValue.push({
                  columntype:item.columntype,
                  id        :item.component.id,
                  value     :[]
                });
            } else {
              let values=[];
              for(let [i, temps] of item.defaultvalue.entries()){
                let value = { ROWINDEX : i.toString() };
                for(let [j, temp] of temps.entries()){ 
                  // "ITEM1": "2019/11/12",
                  // "ITEM2": "全天_@1@_Ad",
                  // "ITEM3": "2019/11/12",
                  // "ITEM4": "全天_@1@_Ad",
                  // "ITEM5": "年假_@1@_10",
                  // "ITEM6": "1"
                  if (temp.columntype == "cbo") {
                    value[temp.component.id] = "";
                    for (let cboObject of temp.paramList) {
                      if (temp.defaultvalue == cboObject.paramcode) {
                        value[temp.component.id] = `${cboObject.paramname}_@1@_${temp.defaultvalue}`;
                      }
                    }
                  } else {
                    value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
                  }
                }
                values.push(value);
              }
                formValue.push({
                  columntype:item.columntype,
                  id        :item.component.id,
                  value     :values
                });
            }
            break;
        case "taboneitem":
          // 修改taboneitem 的 formValue, type為tab ，value為 預設為空array
            if (item.defaultvalue==null || item.defaultvalue.length==0) {
                formValue.push({
                columntype:"tab",
                id        :item.component.id.substr(0, item.component.id.indexOf('.')),
                value     :[]
                });
            } else {
              let values = [];
              let keyMap = Object.keys(item.actionValue.relationMap);
              for (let [i, items] of item.defaultvalue.entries()) {
                let value = {
                  ROWINDEX: i.toString()
                };
                for (let [j, key] of keyMap.entries()) {
                  value[`ITEM${j+1}`] = items[key];
                }
                values.push(value);
              }

              formValue.push({
                columntype: "tab",
                id: item.component.id.substr(0, item.component.id.indexOf('.')),
                value: values
              });
            }

            break;
        case "tabwithmem":  // 選人時的多選欄位輸入
          if (item.defaultvalue == null || item.defaultvalue.length == 0) {
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: []
            });
          } else {
            let values = [];
            for (let [i, temps] of item.defaultvalue.entries()) {
              values.push(temps.COLUMN1);
            }
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: values
            });
          }
          break;
        default:
          formValue.push({
            columntype:item.columntype,
            id        :item.component.id,
            value     :item.defaultvalue ? item.defaultvalue : ""
          });
      }
    }
    return formValue
  },
  // 整理問卷送值資料
  formatSubmitSurveyValue(allFormFormat = null) {
    let formValue = [];
    for(let item of allFormFormat){ 
      switch(item.columntype) {
        case "tab":
        case "tabcar":  // 派車單的表格欄位輸入
          if (item.defaultvalue == null || item.defaultvalue.length == 0) {
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: []
            });
          } else {
            let values = [];
            for (let [i, temps] of item.defaultvalue.entries()) {
              let value = {
                ROWINDEX: i.toString()
              };
              for (let [j, temp] of temps.entries()) {
                value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
              }
              values.push(value);
            }
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: values
            });
          }
          break;
        case "tableave":  // 台級休假單的表格欄位輸入
            if ( item.defaultvalue==null || item.defaultvalue.length==0 ) {
                formValue.push({
                columntype:item.columntype,
                id        :item.component.id,
                value     :[]
                });
            } else {
              let values=[];
              for(let [i, temps] of item.defaultvalue.entries()){
                let value = { ROWINDEX : i.toString() };
                for(let [j, temp] of temps.entries()){ 
                  // "ITEM1": "2019/11/12",
                  // "ITEM2": "全天_@1@_Ad",
                  // "ITEM3": "2019/11/12",
                  // "ITEM4": "全天_@1@_Ad",
                  // "ITEM5": "年假_@1@_10",
                  // "ITEM6": "1"
                  if (temp.columntype == "cbo") {
                    value[temp.component.id] = "";
                    for (let cboObject of temp.paramList) {
                      if (temp.defaultvalue == cboObject.paramcode) {
                        value[temp.component.id] = `${cboObject.paramname}_@1@_${temp.defaultvalue}`;
                      }
                    }
                  } else {
                    value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
                  }
                }
                values.push(value);
              }
                formValue.push({
                columntype:item.columntype,
                id        :item.component.id,
                value     :values
                });
            }
            break;
        case "tableaveforlocal":  // 休假單的表格欄位輸入
            if ( item.defaultvalue==null || item.defaultvalue.length==0 ) {
                formValue.push({
                  columntype:item.columntype,
                  id        :item.component.id,
                  value     :[]
                });
            } else {
              let values=[];
              for(let [i, temps] of item.defaultvalue.entries()){
                let value = { ROWINDEX : i.toString() };
                for(let [j, temp] of temps.entries()){ 
                  // "ITEM1": "2019/11/12",
                  // "ITEM2": "全天_@1@_Ad",
                  // "ITEM3": "2019/11/12",
                  // "ITEM4": "全天_@1@_Ad",
                  // "ITEM5": "年假_@1@_10",
                  // "ITEM6": "1"
                  if (temp.columntype == "cbo") {
                    value[temp.component.id] = "";
                    for (let cboObject of temp.paramList) {
                      if (temp.defaultvalue == cboObject.paramcode) {
                        value[temp.component.id] = `${cboObject.paramname}_@1@_${temp.defaultvalue}`;
                      }
                    }
                  } else {
                    value[temp.component.id] = temp.defaultvalue ? temp.defaultvalue : "";
                  }
                }
                values.push(value);
              }
                formValue.push({
                  columntype:item.columntype,
                  id        :item.component.id,
                  value     :values
                });
            }
            break;
        case "taboneitem":
          // 修改taboneitem 的 formValue, type為tab ，value為 預設為空array
            if (item.defaultvalue==null || item.defaultvalue.length==0) {
                formValue.push({
                columntype:"tab",
                id        :item.component.id.substr(0, item.component.id.indexOf('.')),
                value     :[]
                });
            } else {
              let values = [];
              let keyMap = Object.keys(item.actionValue.relationMap);
              for (let [i, items] of item.defaultvalue.entries()) {
                let value = {
                  ROWINDEX: i.toString()
                };
                for (let [j, key] of keyMap.entries()) {
                  value[`ITEM${j+1}`] = items[key];
                }
                values.push(value);
              }

              formValue.push({
                columntype: "tab",
                id: item.component.id.substr(0, item.component.id.indexOf('.')),
                value: values
              });
            }

            break;
        case "tabwithmem":  // 選人時的多選欄位輸入
          if (item.defaultvalue == null || item.defaultvalue.length == 0) {
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: []
            });
          } else {
            let values = [];
            for (let [i, temps] of item.defaultvalue.entries()) {
              values.push(temps.COLUMN1);
            }
            formValue.push({
              columntype: item.columntype,
              id: item.component.id,
              value: values
            });
          }
          break;
        default:
          formValue.push({
            columntype:item.columntype,
            id        :item.component.id,
            value     :item.defaultvalue ? item.defaultvalue : ""
          });
      }
    }
    return formValue
  },
  // deep clone
  deepClone(src) {
    return JSON.parse(JSON.stringify(src));
  }
}

export default FormUnit;