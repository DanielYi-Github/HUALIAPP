import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Container, Content, Text, View, Body, Left, Right, Label, Button, Card, CardItem } from "native-base";
import { Image, StyleSheet } from 'react-native'
import HeaderForGeneral from "../../../components/HeaderForGeneral";
import * as NavigationService from '../../../utils/NavigationService';

class DailyOralEnglishDetailPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.loadDailyOralEnglishDetailData()
    }

    render() {
        return (
            <Container>
                <HeaderForGeneral
                    isLeftButtonIconShow={true}
                    leftButtonIcon={{ name: "arrow-back" }}
                    leftButtonOnPress={() => this.props.navigation.goBack()}
                    title={this.props.state.Language.lang.HomePage.DailyOralEnglish}
                />
                <Content>
                    <View style={{ padding: 10 }}>
                        <View>
                            <Image
                                style={{ width: '100%', height: 200, borderRadius: 10 }}
                                resizeMode={"cover"}
                                source={this.state.data.IMAGEURL}
                            />
                        </View>
                        <CardItem style={{ flexDirection: 'column', marginVertical: 10, borderRadius: 10 }}>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Text style={styles.fontSize}>{this.state.data.CONTENT}</Text>
                            </Body>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Text style={styles.fontSize}>{this.state.data.TRANSLATE}</Text>
                            </Body>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Label style={[styles.fontSize, { color: 'gray' }]}>{this.state.data.PUSHDATE}</Label>
                            </Body>
                        </CardItem>
                        <CardItem button style={{ flexDirection: 'row', width: '100%', paddingTop: 10 }} onPress={this.goDailyOralEnglishList}>
                            <Body style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={[styles.fontSize]}>{this.props.state.Language.lang.Common.ViewMore}</Text>
                            </Body>
                        </CardItem>
                    </View>
                </Content>
            </Container>
        )
    }

    loadDailyOralEnglishDetailData() {
        let data = this.props.route.params.data
        this.setState({
            data: data
        })

    }

    goDailyOralEnglishList = data => {
        NavigationService.navigate("DailyOralEnglish");
    }

}

const styles = StyleSheet.create({
    fontSize: {
        fontSize: 18
    }
})

export default connect(
    (state) => ({
        state: { Language: state.Language }
    })
)(DailyOralEnglishDetailPage)