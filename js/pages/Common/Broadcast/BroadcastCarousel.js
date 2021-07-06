import React, { Component } from 'react'
import { TouchableOpacity, Dimensions } from 'react-native'
import { Body, Icon, Title, View } from "native-base";
import * as NavigationService from '../../../utils/NavigationService';
import Carousel from 'react-native-snap-carousel';

const window = Dimensions.get("window")
export default class BroadcastCarousel extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [
                { type: '每日一句英语', title: "Correction does much, but encouragement does more.", explain: '纠正很有用，但鼓励的作用更大。', icon: 'alpha-e-box-outline', icontype: 'MaterialCommunityIcons', iconcolor: '#7CB342' },
                { type: '管理文章', title: "看起来不起眼的小事，可能会毁了你的职业", explain: '', icon: 'newspaper', icontype: 'MaterialCommunityIcons', iconcolor: '#673AB7' },
                { type: '集团文件', title: "2021(1-6月)集团汇率", explain: '', icon: 'document', icontype: 'Ionicons', iconcolor: '#3F51B5' }
            ]
        }
    }

    goDailyOralEnglishDetail = data => {
        NavigationService.navigate("DailyOralEnglishDetail", { title: this.state.title, data: data });
    }

    render() {
        return (
            <Carousel
                data={this.state.data}
                renderItem={this.renderItem}
                sliderWidth={window.width}
                itemWidth={window.width}
                loop={true}
                autoplay={true}
                autoplayDelay={5000}
            />
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => this.goDailyOralEnglishDetail(item)}
                >
                    <Body>
                        <Body style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
                            <Icon name={item.icon} type={item.icontype} style={{ color: item.iconcolor }} />
                            <Title style={{ fontSize: 18, color: 'gray' }}>{item.type}</Title>
                        </Body>
                        <Body style={{ alignSelf: 'flex-start', paddingLeft: 5 }}>
                            <Title style={{ fontSize: 15, textAlign: 'left' }}>{item.title}</Title>
                        </Body>
                        {/* <Body style={{ alignSelf: 'flex-start', paddingLeft: 5 }}>
                            <Title style={{ fontSize: 15, textAlign: 'left' }}>{item.explain}</Title>
                        </Body> */}
                    </Body>
                </TouchableOpacity>
            </View>
        )
    }
}