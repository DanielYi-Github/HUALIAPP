import React, { Component } from 'react'
import { CardItem, Body, Left, Label, Thumbnail, Title } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";
export default class DailyOralEnglishCardItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let sourceUrl = this.getImageByDate(this.props.pushdate)//根据日期获取默认图片
        sourceUrl = this.props.imageurl != '' ? { uri: this.props.imageurl } : sourceUrl
        return (
            <CardItem>
                <TouchableOpacity
                    onPress={this.props.onPress}
                >
                    <Body style={{ flexDirection: 'row' }}>
                        <Left style={{ flex: 0, width: '30%' }}>
                            <Thumbnail
                                style={{ width: '100%', height: "100%" }}
                                resizeMode={"contain"}
                                source={sourceUrl}
                            />
                        </Left>
                        <Body style={{ flex: 0, width: '70%', paddingLeft: 20 }}>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Title style={styles.fontSize}>{this.props.content}</Title>
                            </Body>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Title style={styles.fontSize}>{this.props.translate}</Title>
                            </Body>
                            <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                <Label style={styles.fontSize}>{this.props.pushdate}</Label>
                            </Body>
                        </Body>
                    </Body>
                </TouchableOpacity>
            </CardItem>
        )
    }

    getImageByDate(date) {
        let day = new Date(date).getDay()
        let sourceUrl
        switch (day) {
            case 0:
                sourceUrl = require("../../image/dailyOralEnglish/Sunday.jpg")
                break
            case 1:
                sourceUrl = require("../../image/dailyOralEnglish/Monday.jpg")
                break
            case 2:
                sourceUrl = require("../../image/dailyOralEnglish/Tuesday.jpg")
                break
            case 3:
                sourceUrl = require("../../image/dailyOralEnglish/Wednesday.jpg")
                break
            case 4:
                sourceUrl = require("../../image/dailyOralEnglish/Thursday.jpg")
                break
            case 5:
                sourceUrl = require("../../image/dailyOralEnglish/Friday.jpg")
                break
            case 6:
                sourceUrl = require("../../image/dailyOralEnglish/Saturday.jpg")
                break
            default:
                sourceUrl = ''
                break
        }
        return sourceUrl
    }
}

const styles = StyleSheet.create({
    fontSize: {
        fontSize: 15
    }
})