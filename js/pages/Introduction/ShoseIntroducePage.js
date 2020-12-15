import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Container, Content, Title, Text, H3, Label, connectStyle} from 'native-base';
import HeaderForGeneral    from '../../components/HeaderForGeneral';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ShoseIntroducePage extends React.Component {
  constructor(props) {
    super(props);
    start = new Date().getTime();
    this.state = {
      lang: this.props.state.Language.lang.ShoseIntroducePage
    }
  }

  render() {
    return (
      <Container>
        <HeaderForGeneral
          isLeftButtonIconShow  = {true}
          leftButtonIcon        = {{name:"menu"}}
          leftButtonOnPress     = {()=>this.props.navigation.toggleDrawer()} 
          isRightButtonIconShow = {false}
          rightButtonIcon       = {null}
          rightButtonOnPress    = {null} 
          title                 = {this.state.lang.ShoemakingInstroduce}
        />
        <Content contentContainerStyle={{alignItems:"flex-start", padding:10}}>
          {/*
          <Image
            resizeMode ='contain' 
            source={require(`../../image/initialPage/services.jpg`)}
            style={{height:Styles.InitialPageServiceImage.height,width:"100%"}}
          />
          */}
          <Text style={{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.InstroduceContent1}
          </Text>
          <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.InstroduceContent2}
          </Text>
          <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.InstroduceContent3}
          </Text>
          <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.InstroduceContent4}
          </Text>
          <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.InstroduceContent5}
          </Text>
          {/*
          <Image
            resizeMode ='contain' 
            source={require(`../../image/initialPage/company1.jpg`)}
            style={[styles.marginTopTopTop,{height:Styles.InitialPageCompanyLogo.height,width:"100%"}]}
          />
         */} 
          <H3 style={[styles.marginTopTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.Surface}</H3>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent1}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent11}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent2}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent21}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent3}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent31}</Text>

          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent4}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent41}</Text>

          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent5}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent51}</Text>

          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent6}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent61}</Text>

          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent7}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent71}</Text>

          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.SurfaceContent8}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.SurfaceContent81}</Text>


          <H3 style={[styles.marginTopTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.Buttom}</H3>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.ButtomContent1}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.ButtomContent11}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.ButtomContent2}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.ButtomContent21}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.ButtomContent3}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.ButtomContent31}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.ButtomContent4}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.ButtomContent41}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.ButtomContent5}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.ButtomContent51}</Text>

          <H3 style={[styles.marginTopTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.Other}</H3>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.OtherContent1}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.OtherContent11}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.OtherContent2}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.OtherContent21}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.OtherContent3}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.OtherContent31}</Text>
          <Title style={[styles.marginTopTop,{color:this.props.style.inputWithoutCardBg.inputColor}]}>{this.state.lang.OtherContent4}</Title>
            <Text style={[styles.marginTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.OtherContent41}</Text>

          <Text style={[styles.marginTopTopTop,{color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.lang.Peroration}
          </Text>

          <Label style={[styles.marginTopTopTop,{fontSize:14, alignSelf:"center", color:this.props.style.inputWithoutCardBg.inputColorPlaceholder}]}>
            {this.state.lang.DataSource}
          </Label>
        </Content>
      </Container>
    );
  }


}

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 10,
  },
  marginTopTop: {
    marginTop: 20,
  },
  marginTopTopTop: {
    marginTop: 30,
  }
});

export let ShoseIntroducePageStyle = connectStyle( 'Component.InputWithoutCardBackground', {} )(ShoseIntroducePage);
export default connect(
  (state) => ({
    state: { ...state },
  })
)(ShoseIntroducePageStyle);