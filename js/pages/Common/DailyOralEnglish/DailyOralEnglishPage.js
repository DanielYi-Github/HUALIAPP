import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { StyleSheet } from 'react-native'
import { Body, CardItem, Container, Content, Left, Right, Text, View, Thumbnail, Title, Label, Card } from "native-base";
import HeaderForGeneral from "../../../components/HeaderForGeneral";
import { FlatList, TouchableOpacity } from 'react-native';
import * as NavigationService from '../../../utils/NavigationService';
import * as SQLite from '../../../utils/SQLiteUtil';
import Common from '../../../utils/Common';
import * as DailyOralEnglishAction from "../../../redux/actions/DailyOralEnglishAction";

class DailyOralEnglishPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isEnd: false, //资料是否达到底部
        }
    }

    componentDidMount() {
        this.props.actions.initDailyOralEnglish()
    }

    componentWillUnmount(){
        this.props.actions.resetDailyOralEnglish();
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
                    data={this.props.state.DailyOralEnglish.data}
                    renderItem={this.renderListItem}
                    onEndReachedThreshold={0.3}
                    onEndReached={this.props.actions.loadMoreDailyOralEnglishData}
                    ListFooterComponent={this.renderFooter}
                />
            </Container>
        )
    }

    goDailyOralEnglishDetail = item => {
        NavigationService.navigate("DailyOralEnglishDetail", { data: item });
    }

    renderListItem = ({ item }) => {
        let sourceUrl = this.getImageByDate(item.PUSHDATE)//默认图片
        sourceUrl = item.IMAGEURL != '' ? { uri: item.IMAGEURL } : sourceUrl
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

    renderFooter = () => {
        let loading = this.props.state.DailyOralEnglish.loading
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
        state: 
        { 
            Language: state.Language,
            DailyOralEnglish: state.DailyOralEnglish
        }
    }),
    (dispatch) => ({
        actions: bindActionCreators({
          ...DailyOralEnglishAction
        }, dispatch)
      })
)(DailyOralEnglishPage)
