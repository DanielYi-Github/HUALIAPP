import React, { Component } from 'react'
import { View, Text, Container, Content, ListItem, Left, Right, Label, connectStyle, Spinner } from "native-base";
import HeaderForGeneral from '../../components/HeaderForGeneral';
import * as NavigationService from '../../utils/NavigationService';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CacheUtil from "../../utils/CacheUtil";

class ClearCachePage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            fileLoading: true,
            fileCacheSize: 0.5,
            dataLoading: true,
            dataCacheSize: 0.5,
            arrDataTable: []
        }
    }

    componentDidMount() {
        CacheUtil.getFileCacheSize().then(size => {
            this.setState({
                fileLoading: false,
                fileCacheSize: size
            })
        })
        CacheUtil.getDataCacheSize().then(result => {
            this.setState({
                dataLoading: false,
                dataCacheSize: result.size,
                arrDataTable: result.arrTable
            })
        })
    }

    render() {
        let lang = this.props.state.Language.lang
        let allCacheSize = parseInt(this.state.dataCacheSize) + parseInt(this.state.fileCacheSize)
        return (
            <Container>
                <HeaderForGeneral
                    isLeftButtonIconShow={true}
                    leftButtonIcon={{ name: "arrow-back" }}
                    leftButtonOnPress={() => NavigationService.goBack()}
                    isRightButtonIconShow={false}
                    rightButtonIcon={null}
                    rightButtonOnPress={null}
                    title={lang.MinePage.ClearCache}
                    isTransparent={false}
                />
                <Content>
                    {/* 全部缓存 */}
                    <Label></Label>
                    <ListItem
                        last
                        onPress={() => { this.clearAllCache() }}
                    >
                        <Left>
                            <Text
                                style={{ color: this.props.style.inputWithoutCardBg.inputColor }}
                            >
                                {lang.ClearCachePage.ClearAllCache}
                            </Text>
                        </Left>
                        <Right>
                            {
                                (this.state.fileLoading || this.state.dataLoading)
                                    ?
                                    <Spinner style={{ height: 15 }} />
                                    :
                                    (
                                        <Text
                                            style={{ color: this.props.style.inputWithoutCardBg.inputColor }}
                                        >
                                            {this.getSizeText(allCacheSize)}
                                        </Text>
                                    )
                            }

                        </Right>
                    </ListItem>
                    {/* 文件缓存 */}
                    <Label></Label>
                    <ListItem
                        last
                        onPress={() => { this.clearFileCache() }}
                    >
                        <Left>
                            <Text
                                style={{ color: this.props.style.inputWithoutCardBg.inputColor }}
                            >
                                {lang.ClearCachePage.ClearFileCache}
                            </Text>
                        </Left>
                        <Right>
                            <Text
                                style={{ color: this.props.style.inputWithoutCardBg.inputColor }}
                            >
                                {this.getSizeText(this.state.fileCacheSize)}
                            </Text>
                        </Right>
                    </ListItem>
                    {/* 资料缓存 */}
                    <Label></Label>
                    <ListItem
                        last
                        onPress={() => { this.clearDataCache() }}
                    >
                        <Left>
                            <Text
                                style={{ color: this.props.style.inputWithoutCardBg.inputColor }}
                            >
                                {lang.ClearCachePage.ClearDataCache}
                            </Text>
                        </Left>
                        <Right>
                            {
                                this.state.dataLoading
                                    ?
                                    <Spinner style={{ height: 15 }} />
                                    :
                                    (
                                        <Text
                                            style={{ color: this.props.style.inputWithoutCardBg.inputColor }}
                                        >
                                            {this.getSizeText(this.state.dataCacheSize)}
                                        </Text>
                                    )
                            }
                        </Right>
                    </ListItem>
                </Content>
            </Container>
        )
    }

    clearAllCache = () => {
        this.clearFileCache()
        this.clearDataCache()
    }
    clearFileCache = () => {
        CacheUtil.clearFileCache().then(() => {
            this.setState({
                fileCacheSize: 0
            })
        })
    }
    clearDataCache = () => {
        let arrTable = this.state.arrDataTable
        CacheUtil.clearDataCache(arrTable).then(() => {
            this.setState({
                dataCacheSize: 0
            })
        })
    }

    getSizeText = (size) => {
        if (size == 0) {
            return "0K"
        }
        let mSize = size / 1024 / 1024
        if (mSize > 1) {
            return mSize.toFixed(2) + "M"
        }
        let kSize = size / 1024
        return kSize.toFixed(2) + "K"
    }
}

let ClearCachePageStyle = connectStyle('Component.InputWithoutCardBackground', {})(ClearCachePage);

export default connect(
    (state) => ({
        state: { ...state }
    })
)(ClearCachePageStyle)