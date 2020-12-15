import React from 'react';
import { Alert, StyleSheet, Platform ,View, DeviceEventEmitter } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Text, Container, Header, Content, Button, Icon, List, Body, Left, Title, Right, Item, connectStyle} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HeaderForGeneral   from '../../../components/HeaderForGeneral';
import * as NavigationService  from '../../../utils/NavigationService'; 
import * as PublishAction from '../../../redux/actions/PublishAction';


class PublishSubmitPage extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.state.Publish.publishItemList.length == 0) {
            this.props.navigation.navigate("PublishEdit");
        }

        this.state = {
            publishItemList: this.props.state.Publish.publishItemList,
        }
    }

    componentDidMount(){
      //防止此頁進行返回
      this.props.navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        Alert.alert(
            this.props.lang.IsLeave, //是否離開?
            this.props.lang.DeleteMsg, //離開將遺失所有未發佈訊息
            [
                { text: this.props.lang.Cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: this.props.lang.Sure, onPress: ()=>{
                    this.exit();
                    this.props.navigation.dispatch(e.data.action);
                }},
            ], { cancelable: false }
        )

        this.cancelPublish();
      })
    }

    componentDidUpdate(preProps, preState){
        if (this.props.state.Publish.isSuccess) {
            Alert.alert(
                this.props.lang.SendSuccessfully, //新增成功
                this.props.lang.SendMsg, //訊息已發佈
                [
                    // 需要觸發返回事件 
                    { text: 'OK', onPress: async ()=>{
                        await this.props.navigation.removeListener("beforeRemove");
                        this.exit();
                        this.props.navigation.navigate("Publish");
                    }}, // 需要觸發返回事件
                ], { cancelable: false }
            )
        }
    }


    onBackButtonPressAndroid = () => {
        /*
         *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
         *   and react-navigation's lister will not get called, thus not popping the screen.
         *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
         */
        if (true) {
            this.cancelPublish();
            return true;
        } else {
            return false;
        }
    }

    render() {
        const renderItem = data => (
                <Item  style={styles.rowFront} onPress={() => { this.onRowPress(data.item, data.index.toString()); }}>
                    <Left style={{flexDirection:"column"}}>
                        <Text numberOfLines={1} style={{marginLeft: 20, color: '#000000'}}>
                            {data.item.title}
                        </Text>
                        <Text numberOfLines={1} style={{marginLeft: 20, color: '#000000'}} note>
                            {data.item.context}
                        </Text>
                    </Left>
                    <Right style={{flex:0, justifyContent:"center", height:"100%", marginRight: 20}}>
                        <Text>
                            {data.item.language}
                        </Text>
                    </Right>
                </Item>
            );

        const renderHiddenItem = (data, rowMap) => (
            <Item style={styles.rowBack}>
                <Button full danger 
                    style={{flex:1, height:50, justifyContent: 'flex-end', paddingRight:15}} 
                    onPress={()=>{ this.onRowDelete(data.item, data.index.toString(), rowMap) }}
                >
                    <Icon active name="trash" />
                </Button>
            </Item>
        );

        return (
                <Container>
                    {/*標題列*/}
                    <HeaderForGeneral
                      isLeftButtonIconShow  = {true}
                      leftButtonIcon        = {{name:"close"}}
                      leftButtonOnPress     = {()=>NavigationService.goBack()} 
                      isRightButtonIconShow = {false}
                      rightButtonIcon       = {null}
                      rightButtonOnPress    = {null} 
                      title                 = {this.props.lang.PublishSubmitPageTitle}
                      isTransparent         = {false}
                    />
                    
    		        <Content>   
                        <SwipeListView
                            keyExtractor     ={(item, index) => index.toString()}
                            extraData        ={this.state}
                            data             ={this.state.publishItemList}
                            renderItem       ={renderItem}
                            renderHiddenItem ={renderHiddenItem}
                            rightOpenValue   ={-75}
                            disableRightSwipe
                        />
    			        <Body style={styles.buttonView}>
    			        	{this.renderAddButton()}
    			        	{this.renderSubmitButton()}
    			        </Body>
    		        </Content>
				</Container>
        );
    }

    onRowPress = (data, rowId) => {
        this.props.actions.editPublishItem(data, rowId);
        this.props.navigation.navigate("PublishEdit");
    }

    onRowDelete = (data, rowId, rowMap) => {
        this.closeRow(rowMap, rowId);
        let row = {
            index: parseInt(rowId),
            languageKey: data.languageKey
        };
        this.props.actions.deletePublishItem(row);
        
    }

    closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    renderAddButton = () => {
        let langLength = this.props.state.Publish.languageList.length;
        let dataLength = this.state.publishItemList.length;

        if (langLength == dataLength) {
            return null;
        } else {
            return (
                <Button onPress={this.addPublish} style={styles.addButton}>
					<Body style={styles.addView}>
						<Text style={styles.addText}>
							{this.props.lang.AddLanguage}{/*新增下一個語系*/}
						</Text>
					</Body>
		        </Button>
            );
        }
    }

    addPublish = () => {
        this.props.navigation.navigate("PublishEdit");
    }

    renderSubmitButton = () => {
        if (this.state.publishItemList.length == 0) {
            return null;
        } else {
            return (
                <Button onPress={this.submitPublish} style={styles.submitButton}>
					<Body style={styles.submitView}>
						<Text style={styles.submitText}>
							{this.props.lang.NextPage}{/*下一頁*/}
						</Text>
					</Body>
		        </Button>
            );
        }
    }

    submitPublish = () => {
        this.props.navigation.navigate("PublishSubmitSelect", {
            data: this.state.publishItemList
        });
    }

    cancelPublish = () => {
        Alert.alert(
            this.props.lang.IsLeave, //是否離開?
            this.props.lang.DeleteMsg, //離開將遺失所有未發佈訊息
            [
                { text: this.props.lang.Cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: this.props.lang.Sure, onPress: this.exit },
            ], { cancelable: false }
        )
    }

    exit = () => {
        this.props.actions.cancelPublish();
        this.setState({ publishItemList: [] });
    }
}

const styles = StyleSheet.create({
    buttonView: {
        width: "100%",
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center'
    },
    addButton: {
        height: 40,
        width: '90%',
        backgroundColor: '#04b9e6',
        borderRadius: 5,
        justifyContent: 'center',
        //alignItems: 'center',

        alignSelf:"center",
    },
    addView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addText: {
        color: '#f8f8f8',
        fontSize: 20,
    },
    submitButton: {
        height: 40,
        width: '90%',
        backgroundColor: '#20b11d',
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf:"center",
        marginTop: 20
    },
    submitView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitText: {
        color: '#f8f8f8',
        fontSize: 20,
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        justifyContent: 'flex-end', 
        flex: 1,
        height: 50,
    },
});

export let PublishSubmitPageStyle = connectStyle( 'Page.PublishPage', styles )(PublishSubmitPage);

export default connect(
    (state) => ({
        state: { ...state },
        lang: state.Language.lang.PublishSubmitPage
    }),
    (dispatch) => ({
        actions: bindActionCreators({
            ...PublishAction,
        }, dispatch)
    })
)(PublishSubmitPageStyle);
