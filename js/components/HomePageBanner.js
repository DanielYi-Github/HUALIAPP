import React, { Component } from 'react';
import { View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Title, Text, connectStyle } from 'native-base';
import Carousel from 'react-native-snap-carousel';

class Banner extends Component{
	constructor(props) {
	  super(props);
	}

	render(){
		return(
			<View>
				<Carousel
					data          ={this.props.data}
					renderItem    ={this.renderCarouselItem}
					sliderWidth   ={this.props.style.HomePageBanner.width}
					itemWidth     ={this.props.style.HomePageBanner.width}
					loop          ={true}
					autoplay      ={true}
					autoplayDelay ={5000}
				/>
			</View>
		);
	}

	renderCarouselItem = ({item, index}) => {
		if (item.key == 0 && this.props.title) {
			{/*宏福實業集團*/}
			return (
			  <View style={this.props.style.HomePageBannerView}>
			      <View style={this.props.style.HomePageBannerLogoView}>
			        <Title style={{color:this.props.style.bannerLogoViewFontColor, fontSize: 28 }}>{this.props.title}</Title>
			      </View>
			  </View>
			);
		}
		return (
		    <View>
		    	<TouchableOpacity 
		    		style={{height:"100%", width:"100%"}} 
		    		activeOpacity={0.8}
					onPress = {
						() => {
							if (item.APPID) {
								this.props.checkDirectorPage({
									APPID: item.APPID,
									OID  : item.PORTALURL
								});
							}
						}
					}
		    	>
			        <Image
			          resizeMode ='contain' 
			          source={item.source}
			          style={{height:"100%", width:"100%"}}
			        />
		        </TouchableOpacity>
		    </View>
		); 
	}
}

export default connectStyle( 'Page.HomePage', {} )(Banner);