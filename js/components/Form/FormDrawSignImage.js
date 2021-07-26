import React, { Component } from 'react';
import { Content, Label, Thumbnail, Item, connectStyle } from 'native-base';

class FormDrawSignImage extends Component {
	constructor(props) {
		super(props);
		/*
		this.state = {
			list:this.props.data.valueList
		};
		*/
	}

	render(){
		// 328長 170高
		let imageWidth = this.props.style.PageSize.width;
		let imageHeight = imageWidth*170/328;

		let required = (this.props.data.required == "Y") ? "*" : "  ";
		let data = this.props.data;
		let image = data.defaultvalue.substr( data.defaultvalue.indexOf(";")+1 );
		let name = data.component.name == "null" ? "" : data.component.name
		return (
			<Content contentContainerStyle={{width:this.props.style.PageSize.width*0.88, alignItems: 'flex-start'}}>
              <Item fixedLabel style={{borderBottomWidth: 0, paddingTop: 15, paddingBottom: 0}}>
  	 			  	<Label style={{flex: 0, color:"#FE1717"}}>{required}</Label>
  	                <Label>{name}</Label>
			  </Item>
			  <Item>
			  	<Thumbnail square 
			  		source ={{uri:image}} 
			  		style  ={{height:imageHeight, width:imageWidth}} 
			  	/>
			  </Item>			  
			</Content>
		);

	}

	/*
	let dataArray = [];
	render() {
		// 328長 170高
		let imageWidth = this.props.style.PageSize.width;
		let imageHeight = imageWidth*170/328;

		var list = this.state.list;
		var dataArray = [];

		for (var i in list) {
			if( list[i] != "" ){
				var frontData = list[i].substr( 0, list[i].indexOf(";") ).split(","); // 找尋第一個";"位置，擷取";"之前的字串,對字串進行","切割
				var temp = {
					key  :frontData[0],
					name :frontData[1],
					image:list[i].substr( list[i].indexOf(";")+1 ),
				};

				dataArray.push(
					<Content 
						key={i}
						style={{borderBottomWidth: 1, borderBottomColor: '#D9D5DC'}} 
						contentContainerStyle={{width:this.props.style.PageSize.width*0.88}}
					>
						<Label style={{fontSize:15, marginTop: 5}}>{temp.name}</Label>
						<Thumbnail square 
							source ={{uri:temp.image}} 
							style  ={{height:imageHeight, width:imageWidth}} 
						/>
					</Content>
				);

			}
		}

		return (
			<Content>
				{dataArray}
			</Content>
		);
	}
	*/
}

export default connectStyle( 'Component.FormContent', {} )(FormDrawSignImage);
