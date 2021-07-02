import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Body, CardItem, Container, Content, Left, Right, Text, View, Thumbnail, Title, Label, Card } from "native-base";
import HeaderForGeneral from "../../../components/HeaderForGeneral";
import { FlatList, TouchableOpacity } from 'react-native';
import * as NavigationService from '../../../utils/NavigationService';
import * as SQLite from '../../../utils/SQLiteUtil';
import Common from '../../../utils/Common';

class DailyOralEnglishPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [], //显示的资料
            totalCount: 0, //资料总笔数
            pageSize: 10, //每页资料笔数
            pageNum: 1, //页数
            isEnd: false, //资料是否达到底部
            loading: true
        }
    }

    componentDidMount() {
        this.loadDailyOralEnglishData()
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
                <FlatList
                    keyExtractor={item => item.oid}
                    data={this.state.data}
                    renderItem={this.renderListItem}
                    onEndReachedThreshold={0.3}
                    onEndReached={this.loadMoreData}
                    ListFooterComponent={this.renderFooter}
                />
            </Container>
        )
    }

    loadDailyOralEnglishData() {
        this.setState({ loading: true })
        let count = 0
        let nowDate = new Date().getUTCDate();
        SQLite.selectData("select count(1) as COUNT from THF_DAILY_ORAL_ENGLISH where date(PUSHDATE) <= date('now') ", []).then(result => {
            count = result.raw()[0].COUNT
            return SQLite.selectData("select * from THF_DAILY_ORAL_ENGLISH where date(PUSHDATE) <= date('now')  order by date(PUSHDATE) desc limit 0,10", [])
        }).then(result => {
            let data = [];
            let raw = result.raw()
            for (let item of raw) {
                let sourceUrl = this.getImageByDate(item.PUSHDATE)
                item.IMAGEURL = item.IMAGEURL != '' ? { uri: item.IMAGEURL } : sourceUrl
                item.PUSHDATE = Common.dateFormatNoTime(item.PUSHDATE)
                data.push(item);
            }
            this.setState({
                data: data,
                totalCount: count,
                pageSize: 10,
                pageNum: 1,
                loading: false
            })
        })
    }

    goDailyOralEnglishDetail = item => {
        NavigationService.navigate("DailyOralEnglishDetail", { data: item });
    }

    renderListItem = ({ item }) => {
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
                                    source={item.IMAGEURL}
                                />
                            </Left>
                            <Body style={{ flex: 0, width: '70%', paddingLeft: 20 }}>
                                <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                    <Title style={[styles.fontSize, { color: 'black' }]}>{item.CONTENT}</Title>
                                </Body>
                                <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                    <Title style={[styles.fontSize, { color: 'black' }]}>{item.TRANSLATE}</Title>
                                </Body>
                                <Body style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>
                                    <Label style={[styles.fontSize, { color: 'gray' }]}>{item.PUSHDATE}</Label>
                                </Body>
                            </Body>
                        </Body>
                    </TouchableOpacity>
                </CardItem>
            </Card>
        )
    }

    loadMoreData = () => {
        this.setState({ loading: true })
        let size = this.state.pageSize
        let num = this.state.pageNum
        let totalCount = this.state.totalCount
        if (size * num >= totalCount) {//如果页数*每页笔数达到或超过总笔数则return
            this.setState({ loading: false })
            return
        }
        let count = num * size
        SQLite.selectData("select * from THF_DAILY_ORAL_ENGLISH where date(PUSHDATE) <= date('now') order by date(PUSHDATE) desc limit " + count + "," + size , []).then(result => {
            let data = this.state.data;
            let raw = result.raw()
            for (let item of raw) {
                let sourceUrl = this.getImageByDate(item.PUSHDATE)
                item.IMAGEURL = item.IMAGEURL != '' ? item.IMAGEURL : sourceUrl
                item.PUSHDATE = Common.dateFormatNoTime(item.PUSHDATE)
                data.push(item);
            }
            this.setState({
                data: data,
                pageNum: num + 1,
                loading: false
            })
        })
    }

    renderFooter = () => {
        let loading = this.state.loading
        return (
            <Card>
                <CardItem>
                    <Body style={{ flex: 1, alignItems: 'center' }}>
                        <Text>
                            {
                                loading
                                    ? this.props.state.Language.lang.ListFooter.Loading
                                    : this.props.state.Language.lang.ListFooter.NoMore
                            }
                        </Text>
                    </Body>
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

const styles = StyleSheet.create({
    fontSize: {
        fontSize: 15
    }
})

export default connect(
    (state) => ({
        state: { Language: state.Language }
    })
)(DailyOralEnglishPage)
