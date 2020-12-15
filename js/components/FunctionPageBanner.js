import React,{Component} from 'react';
import { View, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { Icon, Button, Text, connectStyle } from 'native-base';

class FunctionPageBanner extends Component{
	constructor(props) {
	  	super(props);
		this.state = {};
	}

	render(){
		return(
			<View>
				<View style={{alignItems: 'center', marginTop: 10}}>
					<View 
						style={[
							this.props.style.MainPageBackground,
							{
								height              :160, 
								width               :this.props.style.PageSize.width*.95, 
								marginTop           : 25, 
								borderTopLeftRadius : 10, 
								borderTopRightRadius: 10, 
								position            : 'absolute',
							}
						]}
					>
				  </View>
				  <View>
				    <ImageBackground 
				      style      ={{
							width         :this.props.style.PageSize.width*.85, 
							height        :185, 
							justifyContent:'flex-end', 
							alignContent  :"flex-end"
				      }}
				      source     ={this.props.imageBackground} 
				      resizeMode ='cover'
				      imageStyle ={{ borderRadius:10 }}
				    >
				    	{
				    		(this.props.isShowButton) ?
				    			<Button
				    			  small
				    			  iconRight
				    			  style={{
				    			  	backgroundColor: this.props.style.ButtonBgColor, 
				    			  	borderRadius: 10, 
				    			  	paddingLeft: 20, 
				    			  	height:40, 
				    			  	alignSelf:"flex-end"
				    			  }}
				    			  onPress={this.props.onPress}
				    			 >
				    			  <Text style={{color: this.props.style.FunctionPageBannerBg }}>{this.props.buttonText}</Text>
				    			  <Icon name={'caret-down'} style={{ color: this.props.style.FunctionPageBannerBg }}/>
				    			</Button>
				    		:
				    			null
				    	}
				    </ImageBackground>
				  </View>
				</View>
				<View style={{
					alignSelf              : 'center', 
					width                  :this.props.style.PageSize.width*.95, 
					backgroundColor        :this.props.style.FunctionPageBannerBg, 
					borderBottomLeftRadius : 10,
					borderBottomRightRadius: 10,
					padding                : 10,
					alignItems             : 'center',
					marginBottom           : 5 ,
				}}>
					{
						this.props.explain ?
				  			<Text style={{color: this.props.style.ExplainTextBgColor}}>{this.props.explain}</Text>
						:
							null
					}
				</View>
			</View>
		);
	}

}

export default connectStyle( 'Component.MainPageBackground', {} )(FunctionPageBanner);
