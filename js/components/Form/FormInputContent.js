import React, { Component } from 'react';

import FormContentText           from './FormContentText';
import FormContentTextWithoutDefaultValue from './FormContentTextWithoutDefaultValue';
import FormContentTar            from './FormContentTar';
import FormContentNumber         from './FormContentNumber';
import FormContentTextWithText   from './FormContentTextWithText';
import FormContentCbo            from './FormContentCbo';
import FormContentRdo            from './FormContentRdo';
import FormContentDate           from './FormContentDate';
import FormContentTime           from './FormContentTime';
import FormContentDateTime       from './FormContentDateTime';
import FormContentTabOneItem     from './FormContentTabOneItem';
import FormContentTextWithAction from './FormContentTextWithAction';
import FormContentChk    		 from './FormContentChk';
import FormContentChkWithAction  from './FormContentChkWithAction';
import FormContentRta            from './FormContentRta';
import FormDrawSignImage         from './FormDrawSignImage';
import FormContentFile           from './FormContentFile';
import FormContentGrid     		 from './FormContentGrid';
import FormInputContentGrid      from './FormInputContentGrid';
import FormContentGridForEvaluation  from './FormContentGridForEvaluation';
import FormInputContentGridForDeputy from './FormInputContentGridForDeputy';
import FormContentTabRdo            from './FormContentTabRdo';

export default class FormInputContent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let inputComponent = null;
		switch (this.props.data.columntype) {
			case "txt":
				inputComponent = (
					<FormContentText 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang     ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "txtWithoutDefaultValue":
				inputComponent = (
					<FormContentTextWithoutDefaultValue 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang     ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "cal":
			case "tab1":
			case "tar":
				inputComponent = (
					<FormContentTar 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang     ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "number":
				inputComponent = (
					<FormContentNumber 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang     ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "cbo":
			case "cbotab":
				inputComponent = (
					<FormContentCbo 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "rdo":
				inputComponent = (
					<FormContentRdo 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "tab":
			case "tabcar":
			case "tableave":
			case "tableaveforlocal":
				if (this.props.data.isedit == "N") {
					inputComponent = (
						<FormContentGrid 
							data     ={this.props.data} 
							editable ={this.props.editable} 
							onPress  ={this.props.onPress}
							lang 	 ={this.props.lang}
              				user 	 ={this.props.user}
			  			/>
			  		);
				} else {
					inputComponent = (
						<FormInputContentGrid 
							data     ={this.props.data} 
							editable ={this.props.editable} 
							onPress  ={this.props.onPress}
							lang 	 ={this.props.lang}
              				user 	 ={this.props.user}
			  			/>
			  		);
				}
				break;
			case "tabForEvaluation":
				inputComponent = (
					<FormContentGridForEvaluation
						data        = {this.props.data} 
						editable    = {this.props.editable} 
						onPress     = {this.props.onPress}
						lang        = {this.props.lang}
						user        = {this.props.user}
						formActions = {this.props.formActions ? this.props.formActions : null}
						formContent = {this.props.formContent ? this.props.formContent : null}
		  			/>
		  		);
				break;
			case "tabForDeputy":	
				inputComponent = (
					<FormInputContentGridForDeputy 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang 	 ={this.props.lang}
	      				user 	 ={this.props.user}
	      				mixParam ={this.props.mixParam}
		  			/>
		  		);
				break;
			case "txtwithtxt":
				inputComponent = (
					<FormContentTextWithText 
  	  		  			data     ={this.props.data} 
  	  		  			editable ={this.props.editable} 
  	  		  			onPress  ={this.props.onPress}
  	  		  			lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
    		  		/>
				);
				break;
			case "rta":
				inputComponent = (
					<FormContentRta  
				  		data     ={this.props.data} 
				  		editable ={this.props.editable} 
				  		onPress  ={this.props.onPress}
				  		lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
				  	/>
				);
				break;
			case "sgn": // 已經修改完成 但是未在表單上測試
				inputComponent = (
					<FormDrawSignImage 
		  				data     ={this.props.data} 
		  				editable ={this.props.editable} 
		  				onPress  ={this.props.onPress}
		  				lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "attfile":
				inputComponent = (
					<FormContentFile 
			  			data     ={this.props.data} 
			  			editable ={this.props.editable} 
			  			onPress  ={this.props.onPress}
			  			lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				)
				break;
			case "datetime":
				inputComponent = (
					<FormContentDateTime 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "date":
			case "answerdate":
				inputComponent = (
					<FormContentDate 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "time":
				inputComponent = (
					<FormContentTime 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "taboneitem":
				inputComponent = (
					<FormContentTabOneItem 
						data     ={this.props.data} 
						editable ={this.props.editable} 
						onPress  ={this.props.onPress}
						lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
					/>
				);
				break;
			case "txtwithaction":
				/*他的欄位要大改 改成談框方式進行選擇*/
				inputComponent = (
					<FormContentTextWithAction 
		  				data     ={this.props.data} 
		  				editable ={this.props.editable} 
		  				onPress  ={this.props.onPress}
		  				lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "chk": // 多欄位選單統一編輯
				inputComponent = (
					<FormContentChk 
		  				data     ={this.props.data} 
		  				editable ={this.props.editable} 
		  				onPress  ={this.props.onPress}
		  				lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "chkwithaction":
				inputComponent = (	 // 加簽選單所使用到的元件
					<FormContentChkWithAction 
		  				data     ={this.props.data} 
		  				editable ={this.props.editable} 
		  				onPress  ={this.props.onPress}
		  				lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
			case "tabwithmem": // 多欄位選單統一編輯
				inputComponent = (
					<FormContentChk 
		  				data     ={this.props.data} 
		  				editable ={this.props.editable} 
		  				onPress  ={this.props.onPress}
		  				lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
				/*
				case "tarwithvalue": //特製的文件格式 暫時先隱藏 以後可能用得到
					if ( content[index].valueList[0] ) render.push(<FormContentText key={index} data={content[index]}/>);
					break;
				*/
				/*  
				case "chk": //目前表單簽核裡面沒有，要用老闆的帳號進去我的表單才有 "資訊的ERP開關帳"
					render.push(<FormContentChk  data={this.state.data}/>);
				  break;
				*/
			case "tabrdo": // 多欄位選單統一編輯
				inputComponent = (
					<FormContentTabRdo 
		  				data     ={this.props.data} 
		  				editable ={this.props.editable} 
		  				onPress  ={this.props.onPress}
		  				lang 	 ={this.props.lang}
              			user 	 ={this.props.user}
		  			/>
				);
				break;
		}

		return inputComponent;
	}
}