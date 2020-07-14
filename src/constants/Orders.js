export const STATUSES = {
  'NULL': 'Empty',
  'CUSTOMER_PROCESSING': 'Processing',
  'PROCESSING': 'Processing',
  'CANCELLED': 'Cancelled',
  'CANCEL_REQUESTED_USER': 'Cancel Requested',
  'SUPPLIER_NEW': 'New (Supplier)',
  'CONFIRMED': 'Confirmed (Supplier)',
  'CANCEL_REQUESTED_SUPPLIER': 'Processing Supplier',
  'DROPSHIPPED': 'Dropshipped',
  'READY_FOR_SHIPPING': 'Ready for Shipping',
  'NEW_SHIPMENT': 'New Shipment',
  'SENT_TO_LOGISTICS': 'Sent to Logistics',
  'REQUEST_SENT': 'Request sent',
  'DISPATCHED': 'Dispatched',
  'COMPLETE': 'Complete',
  'CUSTOMER_DISPATCHED': 'Dispatched',
  'REJECTED': 'Rejected',
  'RETURNED_TO_SUPPLIER': 'Returned to supplier',
  'DENIED': 'Denied',
  'DELIVERED': 'Delivered',
};
export const ORDER_OPEN = 0;
export const ORDER_CLOSED = 1;
export const ORDER_CANCELLED = 2;