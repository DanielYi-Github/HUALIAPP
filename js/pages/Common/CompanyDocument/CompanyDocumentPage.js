import React, { Component } from 'react'
import { View, FlatList, Keyboard } from "react-native";
import { Card, CardItem, Container, Content, Text, Title } from "native-base";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import HeaderForSearch from "../../../components/HeaderForSearch";
import * as NavigationService from "../../../utils/NavigationService";
import FunctionPageBanner from "../../../components/FunctionPageBanner";
import CompanyDocumentCard from "../../../components/CompanyDocument/CompanyDocumentCard";
import CompanyDocumentCardItem from "../../../components/CompanyDocument/CompanyDocumentCardItem";
import * as CompanyDocumentAction from "../../../redux/actions/CompanyDocumentAction";
import Common from "../../../utils/Common";
import NoMoreItem from '../../../components/NoMoreItem';

class CompanyDocumentPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            //搜寻展示
            isShowSearch: false,//展示搜寻组件
            isSearch: false,//是否搜寻资料
            searchData: [],//搜寻资料
            isSearchEnd: false,//是否查询加载结束
            //关键字
            isSEqualsT: true,//搜寻关键字简繁体是否相同
            keyword: "",//搜寻关键字
            sKeyword: "",//简体搜寻关键字
            tKeyword: "",//繁体搜寻关键字
        }
    }

    componentDidMount() {
        this.props.actions.initCompanyDocument()
    }

    render() {
        let newestData = this.props.state.CompanyDocument.companyDocumentNewestData//最新文件
        let loading = this.props.state.CompanyDocument.loading//是否加载中
        //加载提示文字
        let loadText = this.props.state.Language.lang.ListFooter.Loading//加载中
        if (!loading) {
            loadText = this.props.state.Language.lang.ListFooter.NoMore//暂无更多
        }
        return (
            <Container>
                {/*标题*/}
                <HeaderForSearch
                    isLeftButtonIconShow={true}
                    leftButtonIcon={{ name: 'arrow-back' }}
                    leftButtonOnPress={() => NavigationService.goBack()}

                    title={this.props.state.Language.lang.CompanyDocumentPage.CompanyDocument}
                    titleOnPress={() => { this.setState({ isShowSearch: true }) }}

                    isRightButtonIconShow={true}
                    rightButtonIcon={{ name: 'search' }}
                    rightButtonOnPress={() => { this.setState({ isShowSearch: true }) }}

                    isShowSearch={this.state.isShowSearch}
                    placeholder={this.props.state.Language.lang.ContactPage.SearchKeyword}
                    searchButtomText={this.props.state.Language.lang.Common.Search}

                    onChangeText={(text) => this.onChangeSearchText(text)}
                    onSubmitEditing={this.searchButtomOnPress}

                    searchButtomOnPress={this.searchButtomOnPress}
                    closeSearchButtomOnPress={this.closeSearchButtomOnPress}
                />
                {/*内容*/}
                <Content>
                    {/*图片*/}
                    <FunctionPageBanner
                        explain={this.props.state.Language.lang.DocumentCategoriesPage.Introduction}
                        imageBackground={require("../../../image/functionImage/companyDocument.jpeg")}
                    />
                    {/*文件*/}
                    {
                        newestData.length == 0 ?//有无资料
                            <NoMoreItem text={loadText} />
                            :
                            !this.state.isShowSearch ?//是否显示搜寻内容
                                <>
                                    {/*最新文件*/}
                                    <CompanyDocumentCard
                                        explainIconName={'document'}
                                        explainText={this.props.state.Language.lang.DocumentCategoriesPage.NewsFiles}
                                        data={newestData}
                                        visitData={this.props.state.CompanyDocument.companyDocumentVisitData}
                                        cardItemOnPress={this.showDocument}
                                        lang={this.props.state.Language.lang}
                                        maxDetailNum={10}
                                    />
                                    {/*分类文件*/}
                                    {
                                        this.props.state.CompanyDocument.companyDocumentData.map(typeData => {
                                            return (
                                                <CompanyDocumentCard
                                                    explainIconName={'folder-open'}
                                                    explainText={typeData.typeName}
                                                    type={typeData.type}
                                                    data={typeData.data}
                                                    visitData={this.props.state.CompanyDocument.companyDocumentVisitData}
                                                    cardItemOnPress={this.showDocument}
                                                    lang={this.props.state.Language.lang}
                                                />
                                            )
                                        })
                                    }
                                </>
                                :
                                //搜寻内容
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.state.searchData}
                                    ListHeaderComponent={this.renderSearchHeader}
                                    renderItem={this.renderSearchCard}
                                    ListFooterComponent={this.renderSearchFooter}
                                    onEndReachedThreshold={0.3}
                                    onEndReached={this.loadMoreSearchData}
                                />
                    }
                </Content>
            </Container>
        )
    }
    renderSearchHeader = () => {
        return (
            <View>
                <Title style={{ paddingTop: 20 }}>{this.props.state.Language.lang.FindPage.SearchResult}</Title>
                <View style={{ width: "50%", height: 3, backgroundColor: "#757575", alignSelf: 'center', marginBottom: 10 }} />
            </View>
        )
    }
    renderSearchCard = ({ item }) => {
        let visitCount = this.props.state.CompanyDocument.companyDocumentVisitData[item.OID]
        return (
            <Card>
                <CompanyDocumentCardItem
                    fileIcon={item.ICON}
                    fileName={item.SUBJECT}
                    fileDate={item.RELEASE_DAT}
                    fileSize={item.FILESIZE}
                    fileVisitCount={visitCount}
                    onPress={() => this.showDocument(item)}
                />
            </Card>
        )
    }
    renderSearchFooter = () => {
        let isSearchLoading = this.state.isSearchLoading
        let text = this.props.state.Language.lang.ListFooter.Searching
        if (!isSearchLoading) {
            text = this.props.state.Language.lang.ListFooter.NoMore
        }
        return (
            <NoMoreItem text={text} />
        )
    }

    //编辑关键字时判断简繁体是否相同，并设定相应的关键字
    onChangeSearchText = (text) => {
        let result = Common.getSearchKeyword(text)
        let isSEqualsT = result.isSEqualsT
        let keyword = ""
        let sKeyword = ""
        let tKeyword = ""
        if (isSEqualsT) {//简繁体相同
            keyword = result.keyword
        } else {
            sKeyword = result.sKeyword
            tKeyword = result.tKeyword
        }
        this.setState({
            isSEqualsT,
            keyword,
            sKeyword,
            tKeyword
        })
    }
    //关闭搜寻时初始化搜寻状态
    closeSearchButtomOnPress = () => {
        this.setState({
            isShowSearch: false,
            isSearch: false,
            searchData: [],
            isSEqualsT: true,
            keyword: "",
            sKeyword: "",
            tKeyword: ""
        })
    }
    //搜寻按钮方法
    searchButtomOnPress = () => {
        Keyboard.dismiss()//收缩键盘
        //判断搜寻的关键字是否有值
        let keywordLength = this.state.isSEqualsT ? this.state.keyword.length : this.state.sKeyword.length;
        if (keywordLength !== 0) {
            this.setState({
                isSearch: true
            });
            this.loadMoreSearchData()
        }

    }
    //加载更多搜寻资料
    loadMoreSearchData = () => {
        let isSearchEnd = this.state.isSearchEnd
        if (!isSearchEnd) {
            let searchLength = this.state.searchData.length
            if (searchLength % 10 == 0) {
                let appOid = this.props.state.CompanyDocument.companyDocumentAppOid
                let pageNum = searchLength > 0 ? searchLength++ : searchLength
                let pageSize = 10
                let isSEqualsT = this.state.isSEqualsT
                let queryExcute = []
                if (isSEqualsT) {
                    let keyword = this.state.keyword
                    let arrCondition = [keyword]
                    queryExcute.push(CompanyDocumentAction.queryCompanyDocumentData(appOid, pageNum, pageSize, null, arrCondition))
                } else {
                    let sKeyword = this.state.sKeyword
                    let tKeyword = this.state.tKeyword
                    let arrCondition = [sKeyword, tKeyword]
                    queryExcute.push(CompanyDocumentAction.queryCompanyDocumentData(appOid, pageNum, pageSize, null, arrCondition))
                }
                Promise.all(queryExcute).then(result => {
                    let arrFile = []
                    for (const fileData of result) {
                        arrFile = arrFile.concat(fileData.raw())
                    }
                    //去除重复元素
                    Common.filterDuplicateElement(arrFile)
                    //将分类ICON放进文件
                    let arrType = this.props.state.CompanyDocument.companyDocumentType
                    CompanyDocumentAction.packCompanyDocumentData(arrType, arrFile)
                    let searchData = this.state.searchData.concat(arrFile)
                    this.setState({
                        searchData
                    })
                })

            }
        }
    }
    //显示文件
    showDocument = (item) => {
        let oid = item.OID
        //更新访问数
        this.props.actions.increaseVisitCount(oid)
        //跳转文件画面
        let file = this.props.state.CompanyDocument.companyDocumentFileUrlData[oid]
        file = file ? file : item.FILEURL
        NavigationService.navigate("ViewFile", {
            url: 'companydoc/getCompanyDocumentUrl',
            content: {
                oid,
                fileid: item.FILEID
            },
            file,
            fileType: "pdf",
            pageTtile: item.SUBJECT,
            isDecode: true,
            callBack: this.showDocumentCallBack(oid)
        });
    }
    //回調更新fileUrl
    showDocumentCallBack = (oid) => {
        //data参数为ViewFilePage组件回调时传递的参数
        return (data) => {
            let file = data.file
            this.props.actions.updateCompanyDocumentFileUrl(oid, file)
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
)(CompanyDocumentPage)