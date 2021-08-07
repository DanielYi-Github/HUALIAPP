import React, { Component } from 'react'
import { Text } from 'native-base'
import { View } from 'react-native'

export default class FormContentGridLabel extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let value = this.props.data.value;

        try{
            switch (this.props.data.columntype) {
                // case "cbo":
                case "cbotab":
                    for (let param of this.props.data.paramList) {
                        if (param.paramcode == value) {
                            value = param.paramname;
                        }
                    }
                    break;
                
                case "rdotab":
                    value = value.toString();
                    for (let param of this.props.data.paramList) {
                        if (param.paramcode == value) {
                            value = param.paramname;
                        }
                    }
                    break;
                case "hidetxt":
                    return null;
                    break;
                default:
                // code block
            }
        } catch (err) {
            value = this.props.data.value;
        }

        value = (value == null || value == "null" || value == "" || value == " ") ? " " : value;
        let style = this.props.style ? this.props.style : null
        return (
            <View key={this.props.key} style={[{ flexDirection: 'row', flex: 1, alignItems: 'flex-start' },style]}>
                <View style={{ flex: 0 }}>
                    <Text>{this.props.data.label} : </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text>{value}</Text>
                </View>
            </View>
        );
    }
}
