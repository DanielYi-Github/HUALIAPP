import React, { Component } from 'react'
import { Container, Content, Text, View, Body, Left, Right, Label, Button, CardItem } from "native-base";
import { Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import HeaderForGeneral from "../../../components/HeaderForGeneral";
import * as NavigationService from '../../../utils/NavigationService';

export default class DailyOralEnglishDetailPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: this.props.route.params.data,
            title: this.props.route.params.title
        }

        console.log('DailyOralEnglishDetailPage constructor');
    }

    goDailyOralEnglishList = data => {
        NavigationService.navigate("DailyOralEnglish");
    }

    render() {
        let imageUrl = this.getImageByDate(this.state.data.date)
        return (
            <Container>
                <HeaderForGeneral
                    isLeftButtonIconShow={true}
                    leftButtonIcon={{ name: "arrow-back" }}
                    leftButtonOnPress={() => this.props.navigation.goBack()}
                    title={this.state.title}
                />
                <Content>
                    <View style={{ padding: 10 }}>
                        <View>
                            <Image
                                style={{ width: '100%', height: 200, borderRadius: 10 }}
                                resizeMode={"cover"}
                                source={imageUrl}
                            />
                        </View>
                        <View style={{ padding: 5 }}>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Text style={{ fontSize: 18 }}>{this.state.data.content}</Text>
                            </Body>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Text style={{ fontSize: 18 }}>{this.state.data.note}</Text>
                            </Body>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Label style={{ color: 'gray', fontSize: 18 }}>{this.state.data.date}</Label>
                            </Body>
                        </View>
                        <Body>
                            <CardItem button style={{ flexDirection: 'row', width: '100%' }} onPress={this.goDailyOralEnglishList}>
                                <Left />
                                <Body>
                                    <Text style={{ color: 'black', fontSize: 18 }}>查看更多</Text>
                                </Body>
                                <Right />
                            </CardItem>
                        </Body>
                    </View>
                </Content>
            </Container>
        )
    }

    static getDerivedStateFromProps(props, state) {
        let type = props.route.params.data.type
        if (type != null) {
            const content = props.route.params.data.title
            const note = props.route.params.data.explain
            let newData = {
                content,
                note,
                date: '2021-06-07',
            }
            return {
                title: type,
                data: newData
            }
        } else {
            let data = Object.assign({}, props.route.params.data)
            return {
                title: type,
                data
            }
        }
    }

    getImageByDate(date) {
        let day = new Date(date).getDay()
        let sourceUrl
        switch (day) {
            case 0:
                sourceUrl = require("../../../image/dailyOralEnglish/Sunday.jpg")
                break
            case 1:
                sourceUrl = require("../../../image/dailyOralEnglish/Monday.jpg")
                break
            case 2:
                sourceUrl = require("../../../image/dailyOralEnglish/Tuesday.jpg")
                break
            case 3:
                sourceUrl = require("../../../image/dailyOralEnglish/Wednesday.jpg")
                break
            case 4:
                sourceUrl = require("../../../image/dailyOralEnglish/Thursday.jpg")
                break
            case 5:
                sourceUrl = require("../../../image/dailyOralEnglish/Friday.jpg")
                break
            case 6:
                sourceUrl = require("../../../image/dailyOralEnglish/Saturday.jpg")
                break
            default:
                sourceUrl = ''
                break
        }
        return sourceUrl
    }

    DateButton = () => {

        return (
            <Content>
                <Button
                    transparent
                    small
                    rounded
                    style={styles.dateButton}
                >
                    <Text>一</Text>
                </Button>
            </Content>
        )
    }

}

const styles = StyleSheet.create({
    dateButtonText: {
        fontSize: 10,
        textAlign: 'center'
    },
    dateButton: {
        width: 40,
        height: 40
    }
})