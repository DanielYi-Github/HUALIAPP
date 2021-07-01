import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Body, CardItem, Container, Content, Left, Right, Text, View, Thumbnail, Title, Label, Card } from "native-base";
import HeaderForGeneral from "../../../components/HeaderForGeneral";
import { FlatList, TouchableOpacity } from 'react-native';
import * as NavigationService from '../../../utils/NavigationService';
import * as SQLite       from '../../../utils/SQLiteUtil';

class DailyOralEnglishPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '每日一句英語',
            data: []
        }
    }

    componentDidMount(){
        
    }

    render() {
        return (
            <Container>
                <HeaderForGeneral
                    isLeftButtonIconShow={true}
                    leftButtonIcon={{ name: "arrow-back" }}
                    leftButtonOnPress={() => this.props.navigation.goBack()}
                    title={this.state.title}
                />
                <Content>
                    <FlatList
                        keyExtractor={item => item.oid}
                        data={this.state.data.reverse()}
                        renderItem={this.renderListItem}
                        // onEndReached={this.state.isEnd ? null : this.loadMoreData}
                        // onEndReachedThreshold={0.3}
                    />
                </Content>
            </Container>
        )
    }

    goDailyOralEnglishDetail = data => {
        NavigationService.navigate("DailyOralEnglishDetail", { title: this.state.title, data: data });
    }

    renderListItem = ({ item }) => {
        let sourceUrl = this.getImageByDate(item.date)
        return (
            <Card>
                <CardItem>
                    <TouchableOpacity
                        onPress={() => this.goDailyOralEnglishDetail(item)}
                    >
                        <Body style={{ flexDirection: 'row' }}>
                            <Left style={{ flex: 0, width: '30%' }}>
                                <Thumbnail
                                    style={{ width: '100%', height: "100%" }}
                                    resizeMode={"contain"}
                                    source={sourceUrl}
                                />
                            </Left>
                            <Body style={{ flex: 0, width: '70%', padding: 5, paddingLeft: 20 }}>
                                <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                    <Title style={{ color: 'black', fontSize: 15 }}>{item.content}</Title>
                                </Body>
                                <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                    <Title style={{ color: 'black', fontSize: 15 }}>{item.note}</Title>
                                </Body>
                                <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                    <Label style={{ color: 'gray', fontSize: 15 }}>{item.date}</Label>
                                </Body>
                            </Body>
                        </Body>
                    </TouchableOpacity>
                </CardItem>
            </Card>
        )
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
}

export default connect(
    (state) => ({
        state: { ...state }
    })
)(DailyOralEnglishPage)
