import React, {Component} from 'react';
import {
    Text,
    View,
    Platform,
    ScrollView,
    TouchableHighlight,
} from 'react-native';
import styles from './styles';
import {Col, Row, Grid} from "react-native-easy-grid";
import ActionBar from '../../components/ActionBar';
import * as Sort from '../../utils/Sort';
require('../../utils/Helper');


class ReplacementsPage extends Component {
    constructor(props) {
        super(props);
        this.items = this.props.route.items.sort((a, b) => {
          let first = a.price ? parseFloat(a.price.replace(',', '')) : null;
          let second = b.price ? parseFloat(b.price.replace(',', '')) : null;
          if (first === null) return 1;
          if (second === null) return -1;
          return first - second;
        })
        this.state = {
            showSpinner: false
        };
        this.headerTitle = this.props.route.title;
    }

    render() {
        let colors = ['#FFFFFF', '#EDF7F9'];
        let columnKeys = [];
        Object.keys(this.items[0]).map(function (key) {
            columnKeys.push(key);
        });

        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
                <View>
                    <ActionBar
                        title={this.headerTitle}
                        navigator={this.props.navigator}
                        openDrawer={() => this.props.openDrawer()}>
                    </ActionBar>
                </View>
                <Grid>
                    <ScrollView vertical={true} stickyHeaderIndices={[0]}>
                        <View style={styles.tableHeaderContainer}>
                            <Row style={styles.tableHeader}>
                                <Col><Text style={[styles.cell, styles.tableHeaderText]}>Name</Text></Col>
                                <Col><Text style={[styles.cell, styles.tableHeaderText]}>Part Number</Text></Col>
                                <Col><Text style={[styles.cell, styles.tableHeaderText]}>Brand</Text></Col>
                                <Col><Text style={[styles.cell, styles.tableHeaderText]}>Price</Text></Col>
                            </Row>
                        </View>
                        {this.items
                          .map((item, key) =>
                            <TouchableHighlight
                                key={key}
                                underlayColor="#333"
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (item['id']) {
                                        this.props.navigator.push({
                                            id: 'ProductPage',
                                            partId: item['id']
                                        });
                                    }
                                }}>
                                <View style={{paddingVertical: 0, backgroundColor: colors[key % 2]}}>
                                    <Row style={{
                                        backgroundColor: colors[key % 2],
                                        paddingVertical: 0,
                                        marginVertical: 0
                                    }}>
                                        <Col><Text style={styles.cell}>{item['name']}</Text></Col>
                                        <Col><Text style={styles.cell}>{item['partNumber']}</Text></Col>
                                        <Col><Text style={styles.cell}>{item['brand']}</Text></Col>
                                        <Col><Text
                                            style={styles.cell}>{
                                            (item['price'] != null) ?
                                                `${item['currency'].outputUnicode()} ${item['price']}`
                                                :
                                                `No information`
                                        }</Text></Col>
                                    </Row>
                                </View>
                            </TouchableHighlight>
                        )}
                    </ScrollView>
                </Grid>
            </View>
        );
    }
}

export default ReplacementsPage;
