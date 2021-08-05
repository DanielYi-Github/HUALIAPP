import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Content, Item, Label, Input, Icon, connectStyle } from 'native-base';

const BaseScript =
    `
        var height = null;
        function changeHeight() {
          if (document.body.scrollHeight != height) {
            height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'setHeight',
              height: height,
            }))
          }
        }
        setInterval(changeHeight, 50);
    `;

const FixTinyText = '<meta name="viewport" content="width=device-width, initial-scale=1">';
let CopyPastDisable = "";

class FormContentRta extends Component {
	constructor(props) {
		super(props);

    // 名稱、值、參數、能否編輯、強制編輯、欄位資料 
    this.state = {
      labelname: props.data.component.name,
      height   : 0,
      value    : null,
    };

    // 補齊字體顏色設定
    CopyPastDisable = `<style>* { -webkit-user-select: none; color:${this.props.style.textColor}; }</style>`;
	}

  onMessage = (event) => {
     try {
       let action = JSON.parse(event)
       if (action.type === 'setHeight' && action.height > 0 && this.state.height==0) {
         this.setState({ height: action.height })
       }
     } catch (error) {
     }
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

    if (editable) {
        value = (this.props.data.defaultvalue == null ) ? null : this.props.data.defaultvalue;
        if (value == null) {
          value = (value == this.state.value) ? value : this.state.value;
        } else {
          value = (this.state.value == null) ? value : this.state.value; 
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
                     <Input 
                        // multiline
                        ref="focusInput"
                        value = {value}
                        style={{ textAlign: 'right'}}
                        onEndEditing ={ async (text)=>{
                          await this.props.onPress(text.nativeEvent.text, this.props.data);
                          this.setState({ value:null });
                        }}
                        onFocus = {(e)=>{
                          // this.setState({ value:value });
                        }}
                        onChangeText ={(text)=>{
                          this.setState({ value:text });
                        }}
                      />
                      <Icon 
                        name='edit' 
                        type='MaterialIcons'
                        onPress={()=>{
                           this.refs["focusInput"].wrappedInstance.focus();
                        }}
                      />
                      {
                        (this.props.data.requiredAlbert) ?
                          <Icon name='alert' />
                        :
                          null
                      }
                  </Item>
        );
    } else {
          return(
            <Content 
              style={{borderBottomWidth: 1, borderBottomColor: '#D9D5DC'}} 
              contentContainerStyle={{ width: this.props.style.PageSize.width*0.88 }}
              scrollEnabled={false}
            >
              <View style={{width: '100%'}}>
                <Item fixedLabel style={{borderBottomWidth: 0, paddingTop: 15, paddingBottom: 15}}>
                  <Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
                  <Label style={{flex: 0}}>{this.state.labelname}</Label>
                </Item>
                <View style={{width: '98%', paddingLeft: 8}}>
                  {
                    (Platform.OS === "ios") ?
                      <WebView
                           injectedJavaScript={BaseScript}
                           source={{ html: FixTinyText+CopyPastDisable+this.props.data.defaultvalue}}
                           style={{ width: "100%", height: this.state.height, backgroundColor: 'transparent' }}
                           onMessage={event => this.onMessage(event.nativeEvent.data) }
                           scrollEnabled={false}
                      />
                    :
                      <WebView
                           injectedJavaScript={BaseScript}
                           source={{ html: FixTinyText+CopyPastDisable+this.props.data.defaultvalue, baseUrl:""}}
                           style={{ width: "100%", height: this.state.height, backgroundColor: 'transparent' }}
                           javaScriptEnabled // 仅限Android平台。iOS平台JavaScript是默认开启的。
                           domStorageEnabled // 适用于安卓
                           onMessage={event => this.onMessage(event.nativeEvent.data) }
                           scrollEnabled={false}
                           
                      />
                    }
                </View>
              </View>
            </Content>
          );
    }
	}
}

export default connectStyle( 'Component.FormContent', {} )(FormContentRta);
