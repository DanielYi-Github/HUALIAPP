import React, { Component } from 'react'
import { CardItem, Button, Left, Body, Right, Text, Icon } from "native-base";

export default class CompanyDocumentCardItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // fileIcon: this.props.fileIcon,
            // fileName: this.props.fileName,//文件名称
            // fileDate: this.props.fileDate,//文件日期
            // fileSize: this.props.fileSize,//文件大小
            // fileVisitCount: this.props.fileVisitCount,//文件查看次数
            isClick: true,//是否可以触发点击
        }
    }

    render() {
        let icon = this.props.fileIcon
        icon = icon ? icon.split(",") : []
        let iconName = icon[0]
        let iconColor = icon[1]
        let buttonBgc = icon[2]
        let iconType = icon[3]
        return (
            <CardItem button onPress={this.cardItemOnPress}>
                <Body>
                    <Body style={{ flexDirection: 'row' }}>
                        <Button
                            rounded
                            onPress={() => { }}
                            style={{
                                height: 55,
                                width: 55,
                                justifyContent: 'center',
                                backgroundColor: buttonBgc
                            }}
                        >
                            <Icon name={iconName} style={{ color: iconColor }} type={iconType} />
                        </Button>
                        <Body style={{ paddingLeft: 10 }}>
                            <Body style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Left>
                                    <Text>{this.props.fileName}</Text>
                                </Left>
                            </Body>
                        </Body>
                        <Right style={{ flex: 0 }}>
                            <Icon name="arrow-forward" />
                        </Right>
                    </Body>
                    <Body style={{ paddingTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                        <Body style={{ flexDirection: 'row' }}>
                            <Icon name={'clock'} type={'Feather'} style={{ fontSize: 25 }} />
                            <Text style={{ paddingLeft: 5 }} note>{this.props.fileDate}</Text>
                        </Body>
                        <Body style={{ flexDirection: 'row', paddingLeft: 20 }}>
                            <Icon name={'eye'} type={'Feather'} style={{ fontSize: 25 }} />
                            <Text style={{ paddingLeft: 5 }} note>{this.props.fileVisitCount}</Text>
                        </Body>
                        <Body style={{ flexDirection: 'row' }}>
                            <Icon name={'save'} type={'Feather'} style={{ fontSize: 25 }} />
                            <Text style={{ paddingLeft: 5 }} note>{this.props.fileSize}</Text>
                        </Body>
                    </Body>
                </Body>
            </CardItem>
        )
    }

    cardItemOnPress = () => {
        let isClick = this.state.isClick
        if (isClick) {
            this.setState({
                isClick: false
            })
            this.props.onPress()
        }
        //防止连续点击
        setTimeout(() => {
            this.setState({
                isClick: true
            })
        }, 1000)
    }

}