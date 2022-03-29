import React, { Component } from 'react';
import { Content, Item, Label, Input, Icon, Text, connectStyle , Switch} from 'native-base';

class FormContentRdoTab extends Component {
	constructor(props) {
		super(props);

		// 名稱、值、參數、能否編輯、強制編輯、欄位資料
		this.state = {
			labelname: props.data.component.name,
            value:null
		};
	}
	
	render() {
		// 確認是否可編輯
		let editable  = this.props.editable;
		if( editable == null ){
			if (typeof this.props.data.isedit != "undefined"){
				editable = (this.props.data.isedit == "Y") ? true : false;	
			}else{
				editable = false;
			}
		}
		let required = (this.props.data.required == "Y") ? "*" : "  ";
		let value = false;

		// editable = true;
		if (editable) {
            value = (this.props.data.defaultvalue == null ) ? false : eval(this.props.data.defaultvalue);
            if( typeof value == "string"){
            	value = (value === 'true');
            }
			return(
				 	<Item fixedLabel 
				 		style={[
				 			this.props.style.CreateFormPageFiledItemWidth,
				 			this.props.style.fixCreateFormPageFiledItemWidth
				 		]} 
				 		error={this.props.data.requiredAlbert}>
		 			   <Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
		               <Label style={{flex: 0}}>{this.state.labelname}</Label>
		               {/*為了撐開同等高度 */}
                        <Input editable={false}/>
                        <Switch 
                            onChange={(prop)=>{
                                this.setState({
                                    value:!this.state.value
                                });
                                this.props.onPress(prop.nativeEvent.value, this.props.data);
                            }}
                            value={value} 
                            style={{ flex: 0,textAlign: 'right'}}
                        />
		            </Item>
			);
		} else {		
			value = (this.props.data.defaultvalue == null || this.props.data.defaultvalue == "") ? value : this.props.data.defaultvalue;
			if( typeof value == "string"){
				value = (value === 'true');
			}
			return(
				  <Item fixedLabel 
					  style={[
					  	this.props.style.CreateFormPageFiledItemWidth,
					  	this.props.style.fixCreateFormPageFiledItemWidth,
					  ]}
				  >
		 			<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
				  	<Label style={{flex: 0}}>{this.state.labelname}</Label>
	               {/*為了撐開同等高度 */}
                    <Input editable={false}/>
                    <Switch 
                        disabled={true}  
                        value={value} 
                        // disabled={!editable}  
                    />
				  </Item>
			);
		}	
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentRdoTab);