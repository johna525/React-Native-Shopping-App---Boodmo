import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import styled from 'styled-components/native';
import ImageViewer from 'react-native-image-zoom-viewer';

import styles from '../Product/styles';
import ActionBar from '../../components/ActionBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import * as Colors from '../../constants/Colors';
import * as Config from '../../constants/Config';

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

class GalleryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: this.props.route.index,
    };
    this.thumbnails = null;
  }

  updateCurrentIndex = (index) => {
    this.setState({currentIndex: index});
    this.thumbnails.scrollToIndex({
      index,
      viewOffset: 2,
      viewPosition: 0.5,
    });
  };

  renderThumbnails = () => {
    return (
      <FlatList
        ref={ref => this.thumbnails = ref}
        keyExtractor={(item, index) => index}
        horizontal
        data={this.props.route.images}
        extraData={this.state}
        getItemLayout={(item, index) => ({length: 74, offset: 74 * index, index})}
        renderItem={({item: thumb, index}) => {
          console.log('thumb: ', thumb);

          return (
            <StyledThumbnail
              active={index === this.state.currentIndex}
            >
              <Touchable
                onPress={() => {
                  this.updateCurrentIndex(index);
                }}
              >
                <Image
                  resizeMode={'contain'}
                  style={{width: 70, height: 70}}
                  source={{uri: Config.IMAGE_FOLDER + thumb}} />
              </Touchable>
            </StyledThumbnail>
          );
        }}
        removeClippedSubviews={false}
      />
    );
  };

  render() {
    let data = [];

    this.props.route.images.map((image) => {
      data.push({
        url: Config.IMAGE_FOLDER_ROOT + image
      });
    });

    return (
      <View style={{
        flexGrow: 1,
        backgroundColor: '#fff',
      }}>
        {Platform.OS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          title={`${this.props.route.partNumber}   Image ${this.state.currentIndex + 1} of ${data.length}`}
          navigator={this.props.navigator}
          openDrawer={() => this.props.openDrawer()}
        />

        <View style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 50 - 100,
        }}>
          <ImageViewer
            backgroundColor={'#fff'}
            flipThreshold={100}
            index={this.state.currentIndex}
            imageUrls={data}
            renderIndicator={() => null}
            loadingRender={() => (
              <LoadingIndicator
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  bottom: 20,
                  left: 0,
                  right: 0,
                  height: 100,
                }}
                size="large"
              />
            )}
            saveToLocalByLongPress={false}
            onChange={this.updateCurrentIndex}
          />
        </View>

        <StyledThumbnails>
          {this.renderThumbnails()}
        </StyledThumbnails>
      </View>
    );
  }
}

const StyledThumbnails = styled.View`
  width: ${Dimensions.get('window').width}px;
  height: 100px;
  padding: 3px
  flex-grow: 1;
  background-color: #fff;
`;

const StyledThumbnail = styled.View`
  display: flex;
  margin-left: 2px;
  margin-right: 2px;
  height: 70px;
  width: 70px;
  justify-content: center;
  background-color: #fff;
  border-bottom-width: 5px;
  border-bottom-color: ${props => props.active ? Colors.PRIMARY_LIGHT : '#fff'};
`;

export default GalleryPage;
