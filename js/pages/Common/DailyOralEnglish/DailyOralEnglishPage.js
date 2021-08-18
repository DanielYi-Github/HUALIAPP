import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Container, Card } from "native-base";
import HeaderForGeneral from "../../../components/HeaderForGeneral";
import { FlatList } from 'react-native';
import * as NavigationService from '../../../utils/NavigationService';
import * as DailyOralEnglishAction from "../../../redux/actions/DailyOralEnglishAction";
import DailyOralEnglishCardItem from "../../../components/DailyOralEnglish/DailyOralEnglishCardItem";
import NoMoreItem from "../../../components/NoMoreItem";

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

    componentWillUnmount() {
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
        return (
            <Card>
                <DailyOralEnglishCardItem
                    imageurl={item.IMAGEURL}
                    content={item.CONTENT}
                    translate={item.TRANSLATE}
                    pushdate={item.PUSHDATE}
                    onPress={() => this.goDailyOralEnglishDetail(item)}
                />
            </Card>
        )
    }

    renderFooter = () => {
        let loading = this.props.state.DailyOralEnglish.loading
        let noMoreText = this.props.state.Language.lang.ListFooter.Loading
        if (!loading) {
            noMoreText = this.props.state.Language.lang.ListFooter.NoMore
        }
        return (
            <NoMoreItem text={noMoreText} />
        )
    }
}

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
