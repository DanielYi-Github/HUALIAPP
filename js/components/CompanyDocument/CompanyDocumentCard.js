import React, { Component } from 'react'
import { View, FlatList, Dimensions } from "react-native";
import { Card, Label, CardItem, Button } from "native-base";
import ExplainCardItem from '../ExplainCardItem';
import CompanyDocumentCardItem from "./CompanyDocumentCardItem";
import * as NavigationService from "../../utils/NavigationService";

const itemHeight = Dimensions.get("window").height / 10;
export default class CompanyDocumentCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            explainIconName: this.props.explainIconName,//说明图标
<<<<<<< HEAD
            explainText: this.props.explainText,//说明文字
=======
            // explainText: this.props.explainText,//说明文字
>>>>>>> dev_companydocument
            showNum: 3,//显示数量
            maxDetailNum: this.props.maxDetailNum,//detail显示最多笔
            cardItemOnPress: this.props.cardItemOnPress,//cardItem点击事件
        }
    }

    render() {
        return (
            <Card>
                <ExplainCardItem
                    iconName={this.state.explainIconName}
<<<<<<< HEAD
                    text={this.state.explainText}
=======
                    text={this.props.explainText}
>>>>>>> dev_companydocument
                />
                <FlatList
                    keyExtractor={item => item.id}
                    data={this.props.data.slice(0, this.state.showNum)}
                    initialNumToRender={10}
                    scrollEnabled={false}//禁止滚动
                    renderItem={this.renderCardItem}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListFooterComponent={this.renderFooter}
                />
            </Card>
        )
    }

    renderCardItem = ({ item }) => {
        let visitCount = this.props.visitData[item.OID]
        return (
            <CompanyDocumentCardItem
                fileIcon={item.ICON}
                fileName={item.SUBJECT}
                fileDate={item.RELEASE_DAT}
                fileSize={item.FILESIZE}
                fileVisitCount={visitCount}
                onPress={() => this.state.cardItemOnPress(item)}
            />
        )
    }

    renderSeparator = () => {
        return <View style={{ height: 1, backgroundColor: '#e6e6e6' }} />;
    }

    renderFooter = () => {
        let length = this.props.data.length
        let text = this.props.lang.ListFooter.LoadMore
        let onPress = () => this.goCompanyDocumentDetail()
        if (length <= this.state.showNum) {
            text = this.props.lang.ListFooter.NoMore
            onPress = null
        }
        return (
            <View style={{ height: itemHeight, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    full
                    bordered
                    light
                    onPress={onPress}
                >
                    <Label>{text}</Label>
                </Button>
            </View>
        )
    }

    goCompanyDocumentDetail = () => {
        NavigationService.navigate("CompanyDocumentDetail", { type: this.props.type, data: this.props.data, maxDetailNum: this.state.maxDetailNum, cardItemOnPress: this.state.cardItemOnPress })
    }
}
