import React, {Component} from 'react';
import {
    Text,
    View,
    Platform,
    ListView,
} from 'react-native';
import styles from './styles';
import {Col, Row, Grid} from "react-native-easy-grid";
import ActionBar from '../../components/ActionBar';
require('../../utils/Helper');

const colors = ['#FFFFFF', '#EDF7F9'];

class Compatibility extends Component {
    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        this.state = {
            dataSource: dataSource.cloneWithRowsAndSections(this.convertItemsArrayToMap())
        };
    }

    convertItemsArrayToMap() {
        var items = {};
        this.props.route.items.forEach(function (item) {
            if (!items[item['brand']]) {
                items[item['brand']] = [];
            }

            items[item['brand']].push(item);

        });

        return items;
    }

    renderRow(item, sectionID, key) {
        return (
            <View key={key}
                  style={{paddingVertical: 0, backgroundColor: colors[key % 2]}}>
                <Row style={{
                    'backgroundColor': colors[key % 2],
                    paddingVertical: 0,
                    marginVertical: 0
                }}>
                    <Col><Text style={styles.cell}>{item['model']}</Text></Col>
                    <Col><Text style={styles.cell}>{item['yearStart']}
                        - {item['yearEnd']}</Text></Col>
                    <Col><Text style={styles.cell}>{item['engine']}</Text></Col>
                    <Col><Text style={styles.cell}>{item['power-hp']}</Text></Col>
                    <Col><Text style={styles.cell}>{item['power-kw']}</Text></Col>
                    <Col><Text style={styles.cell}>{item['engine-type']}</Text></Col>
                </Row>
            </View>
        )
    }

    renderSectionHeader(sectionData, brand) {
        return (
            <View>
                <View style={styles.tableHeaderContainer}>
                    <Row style={styles.tableHeader}>
                        <Col><Text
                            style={[styles.cell, styles.tableHeaderText]}>{brand}</Text></Col>
                    </Row>
                </View>
                <View style={styles.tableHeaderContainer}>
                    <Row style={styles.tableHeader}>
                        <Col><Text
                            style={[styles.cell, styles.tableHeaderText]}>Model</Text></Col>
                        <Col><Text
                            style={[styles.cell, styles.tableHeaderText]}>Year</Text></Col>
                        <Col><Text
                            style={[styles.cell, styles.tableHeaderText]}>Engine</Text></Col>
                        <Col><Text style={[styles.cell, styles.tableHeaderText]}>Power
                            (hp)</Text></Col>
                        <Col><Text style={[styles.cell, styles.tableHeaderText]}>Power
                            (kW)</Text></Col>
                        <Col><Text style={[styles.cell, styles.tableHeaderText]}>Engine
                            type</Text></Col>
                    </Row>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' ? <View style={[styles.iosStatusBar, {zIndex: 2}]}/> : null}
                <ActionBar
                    title={this.props.route.title}
                    navigator={this.props.navigator}
                    openDrawer={() => this.props.openDrawer()}>
                </ActionBar>
                <Grid>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSectionHeader={this.renderSectionHeader}
                        stickyHeaderIndices={Platform.OS === 'ios' ? [0] : []}
                    />
                </Grid>
            </View>
        );
    }
}

export default Compatibility;
