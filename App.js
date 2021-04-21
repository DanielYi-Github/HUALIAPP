import React, { Component } from "react";
import { Container, Header, Content, Accordion } from "native-base";
import SplashScreen           from 'react-native-splash-screen';

const dataArray = [
  { title: "First Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
];
export default class AccordionExample extends Component {

  componentDidMount(){
      SplashScreen.hide();
  }

  render() {
    return (
      <Container>
        <Header />
        <Content padder>
          <Accordion dataArray={dataArray} expanded={0}/>
        </Content>
      </Container>
    );
  }
}