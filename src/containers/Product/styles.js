import {
  StyleSheet,
  Dimensions
} from 'react-native';
import * as Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

module.exports = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  iosStatusBar: {
    backgroundColor: Colors.PRIMARY,
    height: 20,
    width: SCREEN_WIDTH,
    zIndex: 1
  },
  wrapper: {
    paddingTop: 0,
    paddingBottom: 0,
    width: SCREEN_WIDTH,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  wrapItemColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    marginTop: 1,
    marginBottom: 1,
  },
  wrapItemTitle: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  wrapItemColumnLabel: {
    flexGrow: 1,
    fontSize: 16,
    color: '#000',
  },
  wrapItemColumnText: {
    flexGrow: 2,
    fontSize: 16,
    color: '#70737b',
  },
  wrapItemLinkText: {
    fontSize: 14,
    color: '#15497b',
  },
  wrapItemLinkIcon: {
    fontSize: 20,
    color: '#15497b',
    lineHeight: 25
  },
  wrapItemShowMore: {
    fontSize: 14,
    color: '#428bca',
  },
  collapsibleButton: {
    height: 50,
    alignItems: 'flex-start',
    paddingTop: 15,
  },
  wrapItemLinkCount: {
    fontSize: 20,
    color: '#15497b',
    marginRight: 20,
  },
  wrapDrawingLink: {
    fontSize: 14,
    color: '#428bca',
    marginTop: 10
  },
  textMuted: {
    color: '#E6E6E6'
  },
  representationWarning: {
    width: SCREEN_WIDTH - 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 100,
    bottom: 50,
  },
  link: {
    color: '#428bca'
  },
  aboutItemWrapper: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap'
  }
});
