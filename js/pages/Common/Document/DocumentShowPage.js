{
/** 
 * DocumentShowPage 已停用
 * 已替換成共用模板開文檔 ViewFilePage
 */
}




// import React from 'react';
// import { StyleSheet, Dimensions, View , Platform} from 'react-native';
// import * as UpdateDataUtil from '../../../utils/UpdateDataUtil';
// import { Container, Header, Content, Icon, Left, Button, Body, Right, Title, Text, connectStyle } from 'native-base';
// import Styles from '../../../styles/Basic';

// import DocumentShowPdf from '../../../components/Document/DocumentShowPdf';
// import { connect } from 'react-redux';



// class DocumentShowPage extends React.Component {
//   constructor(props) {
//     super(props);
//     // console.log(props);
//     this.state = {
//       detailData: this.props.navigation.getParam('data', null),
//       user: this.props.navigation.getParam('user'),
//     }
//   }

//   componentWillMount() {
//     let oid=this.state.detailData ? this.state.detailData.oid : this.props.navigation.getParam('oid', null);
//     // console.log(oid);
//     let user = this.state.user;
//     UpdateDataUtil.getGroupFileBase64Data(user,oid).then((data)=>{
//         toBase64="data:application/pdf;base64,"+data;
//         this.setState({
//             base64:toBase64
//         });    
//        // return data;
//     }).catch((e)=>{
//       console.log(e);
//       // return 0;
//     });
//   }

// cancelSelect(){
//     this.props.navigation.goBack();
// }

// render() {
//     let base64Data=this.state.base64;
//     const source = {uri:base64Data}
//     return (
//         <Container>
//         {/*標題列*/}
//         {/*
//             (Platform.OS === "ios") ?
//               <Header style={Styles.HeaderBackground} rounded>
//                 <Left>
//                   <Button transparent onPress={this.cancelSelect.bind(this)}>
//                       <Icon name='arrow-back' style={Styles.HeaderText}/>
//                   </Button>
//                 </Left>
//                 <Body style={{flex:0}}>
//                   <Title style={this.props.style.HeaderText}>{this.state.detailData.docname}</Title>
//                 </Body>
//                 <Right/>
//               </Header>
//             :
//               <Header style={Styles.HeaderBackground} rounded>
//                 <Left>
//                   <Button transparent onPress={this.cancelSelect.bind(this)}>
//                       <Icon name='arrow-back' style={Styles.HeaderText}/>
//                   </Button>
//                 </Left>
//                 <Body style={{flex:2}}>
//                   <Title style={Styles.HeaderText}>{this.state.detailData.docname}</Title>
//                 </Body>
//                 <Right style={{flex:0}}/>
//               </Header>
//         */}
//           <DocumentShowPdf source = {source}/>
//         </Container>
//     );
//   }
// }

// let DocumentShowPageStyle = connectStyle( '', {} )(DocumentShowPage);

// export default connect(
//   (state) => ({
//     state: { ...state }
//   })
// )(DocumentShowPageStyle);
