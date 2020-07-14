import {
  StyleSheet,
  Dimensions
} from 'react-native';
import * as Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

module.exports = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.PAGE_BACKGROUND
  },
  iosStatusBar: {
    backgroundColor: Colors.PRIMARY,
    height: 20,
    width: SCREEN_WIDTH,
    zIndex: 1
  },
  wrapper: {
    paddingTop: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SEPARATOR
  },
  emptyCartContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    marginBottom: 80
  },
  emptyCartText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  separator: {
    height: 1,
    width: SCREEN_WIDTH,
    marginVertical: 15,
    backgroundColor: Colors.SEPARATOR
  },
  separatorItem: {
    marginVertical: 0,
    marginHorizontal: 10,
    width: SCREEN_WIDTH - 20,
  },
  buttonSubmit: {
    backgroundColor: Colors.BUTTON_BLUE,
  },
  totalContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: Colors.SEPARATOR,
    marginBottom: 20
  },
  innerTotalContainer: {
    width: SCREEN_WIDTH - 20,
    flexDirection: 'column',
  },
  subtotalText: {
    fontSize: 18,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 5
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    lineHeight: 20
  },
  footerSubmit: {
    marginBottom: 20
  },
  footerSubTotal: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 10
  },
  footerSubTotalText: {
    color: '#000000',
    textAlign: 'right',
    fontSize: 16,
    marginBottom: 10
  },
  part: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  partHeader: {
    paddingBottom: 10
  },
  partImage: {
    borderColor: Colors.GREY_LIGHT,
    borderWidth: 1,
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10
  },
  partDescription: {
    paddingLeft: 5,
    overflow: 'hidden',
    width: SCREEN_WIDTH - 150,
  },
  partName: {
    fontWeight: 'bold',
    color: Colors.BUTTON_BLUE,
    marginBottom: 5
  },
  partPrice: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5
  },
  rowBack: {
    alignItems: 'flex-end',
    backgroundColor: Colors.GREY,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  deleteButtonWrapper: {
    width: 115,
    marginTop: 10
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 115,
  },
  textButton: {
    color: Colors.PRIMARY_LIGHT,
    textAlign: 'center'
  },
  footerLoadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    height: 50,
    marginBottom: 20
  },
});
