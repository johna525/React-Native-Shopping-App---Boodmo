import React from 'react';
import {
  View,
} from 'react-native';
import Button from '../../../components/Button';
import Products from './Review/Products';
import Total from './Review/Total';

require('../../../utils/Helper');
import styles from '../styles';

class ReviewStep extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit() {
    this.props.onSubmit();
  }

  render() {

    return (
      <View style={styles.stepContainer}>
        {
          this.props.reviewCart.items_count ?
            <View style={styles.stepContent}>
              <Products
                reviewCart={this.props.reviewCart}
                navigator={this.props.navigator}/>
              <Total
                itemsCount={this.props.reviewCart.items_count}
                subTotal={this.props.reviewCart.subtotal}
                deliveryTotal={this.props.reviewCart.delivery_total}
                grandTotal={this.props.reviewCart.grand_total}
                originalTotal={this.props.reviewCart.grand_total_list}
                currency={this.props.reviewCart.currency}/>
              <Button
                disabled={false}
                loading={this.props.isFetching}
                loadingDisabled={this.props.isFetching}
                onPress={this.handleSubmit.bind(this)}
                style={styles.buttonSubmit}
                textStyle={styles.buttonSubmitText}>
                                CONTINUE
              </Button>
            </View>
            : null
        }
      </View>
    );
  }
}

export default ReviewStep;
