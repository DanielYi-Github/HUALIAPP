import React, { Component } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { TouchableOpacity, Dimensions } from 'react-native'
import { Body, Card, CardItem, Icon, Title, View } from "native-base";
import * as NavigationService from '../../utils/NavigationService';
import Carousel from 'react-native-snap-carousel';
import * as BroadcastAction from "../../redux/actions/BroadcastAction";
import * as CommonAction from "../../redux/actions/CommonAction";

const window = Dimensions.get("window")
class BroadcastCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let data = this.props.data
        if (data.length  == 0) {
            return null
        }
        return (
            <Card>
                <CardItem>
                    <Carousel
                        data={data}
                        renderItem={this.renderItem}
                        sliderWidth={window.width}
                        itemWidth={window.width}
                        loop={true}
                        autoplay={true}
                        autoplayDelay={5000}
                    />
                </CardItem>
            </Card>
        )
    }

    goDetail = item => {
        let screenParam = item.CLASS5 ? item.CLASS5 : ""
        if (screenParam == "") {//没有屏幕名称不跳转画面
            return
        }
        screenParam = JSON.parse(screenParam)
        let data = {
            APPID:screenParam.screenname,
            CONTENT1:JSON.stringify(screenParam.param)
        }
        this.props.actions.goDirectorPage(data);
    }

    renderItem = ({ item, index }) => {
        let iconParam = item.CLASS4
        iconParam = iconParam == null ? "" : iconParam.split(',')
        let icon = iconParam[0]
        let iconColor = iconParam[1]
        let iconType = iconParam[2]
        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.goDetail(item)}
                    style={{ flexDirection: 'row' }}
                >
                    <Body>
                        <Body style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
                            {   //有icon时才显示
                                iconParam.length == 3 
                                ?
                                <Icon name={icon} type={iconType} style={{color: iconColor}} />
                                :
                                null
                            }
                            <Title style={{ fontSize: 15, color: 'gray',paddingLeft:5,alignSelf:'flex-end' }}>{item.TITLE}</Title>
                        </Body>
                        <Body style={{ alignSelf: 'flex-start', paddingLeft: 5 }}>
                            <Title style={{ fontSize: 18, textAlign: 'left' }}>{item.CONTENT}</Title>
                        </Body>
                    </Body>
                </TouchableOpacity>
            </View>
        )
    }
}

export default connect(
    (state) => ({
        state: {
            Broadcast:state.Broadcast,
            UserInfo:state.UserInfo
        }
    }),
    (dispatch) => ({
        actions: bindActionCreators({
          ...BroadcastAction,
          ...CommonAction
        }, dispatch)
      })
)(BroadcastCard)