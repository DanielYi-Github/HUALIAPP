import React, { Component } from 'react'
import { Container, Content, Card, CardItem } from "native-base";
import { FlatList } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CompanyDocumentCardItem from "../../../components/CompanyDocument/CompanyDocumentCardItem";
import HeaderForGeneral from "../../../components/HeaderForGeneral";
import * as NavigationService from "../../../utils/NavigationService";
import * as CompanyDocumentAction from "../../../redux/actions/CompanyDocumentAction";
import NoMoreItem from '../../../components/NoMoreItem';

class CompanyDocumentDetailPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: this.props.route.params.title,//标题
            type: this.props.route.params.type,//文件分类
            data: this.props.route.params.data,//文件
            isEnd: false,//是否加载结束
            maxNum: this.props.route.params.maxDetailNum ? this.props.route.params.maxDetailNum : null,//显示最大笔数
            cardItemOnPress: this.props.route.params.cardItemOnPress,//cardItem点击事件
        }
    }

    componentDidMount() {
        //判断有无显示最大笔数
        let maxNum = this.state.maxNum
        if (maxNum != null) {
            let length = this.state.data.length
            if (length > maxNum) {
                let data = this.state.data.slice(0, maxNum)
                this.setState({
                    data,
                    isEnd: true
                })
            } else if (length == maxNum) {
                this.setState({
                    isEnd: true
                })
            }
        }
    }

    render() {
        return (
            <Container>
                <HeaderForGeneral
                    isLeftButtonIconShow={true}
                    leftButtonIcon={{ name: "arrow-back" }}
                    leftButtonOnPress={() => NavigationService.goBack()}
                    title={this.state.title}
                />
                <Content>
                    <FlatList
                        keyExtractor={item => item.id}
                        data={this.state.data}
                        initialNumToRender={10}
                        renderItem={this.renderCardItem}
                        ListFooterComponent={this.renderFooter}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMoreData}
                    />
                </Content>
            </Container>
        )
    }

    renderCardItem = ({ item }) => {
        let visitCount = this.props.state.CompanyDocument.companyDocumentVisitData[item.OID]
        return (
            <Card>
                <CompanyDocumentCardItem
                    fileIcon={item.ICON}
                    fileName={item.SUBJECT}
                    fileDate={item.RELEASE_DAT}
                    fileSize={item.FILESIZE}
                    fileVisitCount={visitCount}
                    onPress={() => this.state.cardItemOnPress(item)}
                />
            </Card>
        )
    }
    renderFooter = () => {
        let isEnd = this.state.isEnd
        let text = this.props.state.Language.lang.ListFooter.Loading
        if (isEnd) {
            text = this.props.state.Language.lang.ListFooter.NoMore
        }
        return (
            <NoMoreItem text={text} />
        )
    }
    loadMoreData = () => {
        let isEnd = this.state.isEnd
        if (!isEnd) {
            let dataLength = this.state.data.length//资料笔数
            let appOid = this.props.state.CompanyDocument.companyDocumentAppOid
            let type = this.state.type == "" ? null : this.state.type
            let pageNum = dataLength
            let pageSize = 10
            CompanyDocumentAction.queryCompanyDocumentData(appOid, pageNum, pageSize, type).then(result => {
                let arrFile = result.raw()
                let length = arrFile.length
                let arrType = this.props.state.CompanyDocument.companyDocumentType
                CompanyDocumentAction.packCompanyDocumentData(arrType, arrFile)
                let data = this.state.data.concat(arrFile)
                if (length == 0 || length % 10 != 0) {
                    this.setState({
                        data,
                        isEnd: true
                    })
                } else {
                    this.setState({
                        data
                    })
                }
            })
        }

    }
}

export default connect(
    (state) => ({
        state: {
            Language: state.Language,
            CompanyDocument: state.CompanyDocument
        }
    }),
    (dispatch) => ({
        actions: bindActionCreators({
            ...CompanyDocumentAction
        }, dispatch)
    })
)(CompanyDocumentDetailPage)