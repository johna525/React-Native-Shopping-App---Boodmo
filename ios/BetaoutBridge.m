#import "BetaoutBridge.h"
#import "BetaOut.h"
@import Firebase;

@implementation BetaoutBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(betaoutInit:(NSString *)apiKey projectId:(NSString *)projectId)
{
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      BOConfiguration *conf = [BOConfiguration configurationWithBlock:^(id<BOMutableConfiguration>  _Nonnull configuration) {
        configuration.apiKey = apiKey;
        configuration.projectId = projectId;
        configuration.handlePushNotificationsEnabled = true; //If using Betaout for Push Messages
      }];
      //Start
      [BetaOut startWithConfiguration:conf];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(logout)
{
  @try {
    [BetaOut logOut];
    [FIRAnalytics logEventWithName:@"bo_logout"
                        parameters:NULL];
    
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(customerSetup:(NSString * _Nullable)customerId email:(NSString * _Nullable)email phone:(NSString * _Nullable)phone)
{
  @try {
    [BetaOut setCustomerId:customerId];
    [BetaOut setCustomerEmailId:email];
  
    if (phone.length > 0) {
      [BetaOut setCustomerPhone:phone];
    }
    [FIRAnalytics logEventWithName:@"bo_customer_setup"
                        parameters:@{
                                     @"id":customerId,
                                     @"email":email,
                                     @"phone":phone
                                     }];
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(viewProduct:(NSDictionary * _Nullable)options)
{
  @try {
    BOProduct* pd       = [BetaOut productWithID:options[@"id"] andSellingPrice:[options[@"price"] doubleValue]];
    pd.productImageURL  = options[@"imageUrl"];
    pd.name             = options[@"name"];
    pd.sku              = options[@"sku"];
    pd.productURL       = options[@"url"];
    pd.quantity         = [options[@"quantity"] intValue];
    pd.brand            = options[@"brand"];
    pd.productGroupID   = options[@"groupID"];
    pd.productGroupName = options[@"groupName"];
    [pd belongToCategoryWithID:options[@"groupID"] name:options[@"groupName"] andParentCategoryID:@"0"];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut viewProducts:pd withAppendProperties:NULL updateProperties:NULL resultBlock:
       ^(NSURLResponse * _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
         NSLog(@"viewProduct: %@", responseObject);
         
         if([[responseObject valueForKey:@"responseCode"] intValue] == 200)
           NSLog(@"Hurray View Product tracked successfully");
         else
           NSLog(@"FAILED:: View Product tracking :(     Check for errors");
      }];
      [FIRAnalytics logEventWithName:@"bo_product_view"
                          parameters:NULL];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}


RCT_EXPORT_METHOD(addProduct:(NSDictionary * _Nullable)options)
{
  @try {
    BOProduct* pd       = [BetaOut productWithID:options[@"productId"] andSellingPrice:[options[@"productPrice"] doubleValue]];
    pd.productImageURL  = options[@"productImageURL"];
    pd.name             = options[@"productName"];
    pd.productURL       = options[@"productURL"];
    pd.quantity         = [options[@"productQuantity"] intValue];
    pd.brand            = options[@"productBrand"];
    pd.productGroupID   = options[@"productGroupID"];
    pd.productGroupName = options[@"productGroupName"];

    BOCart* cart = [BetaOut cartWithTotal:[options[@"cartTotal"] doubleValue] forRevenue:[options[@"cartRevenue"] doubleValue] andCurrency:options[@"cartCurrency"]];

    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut addProducts:[NSArray arrayWithObject:pd] toCart:cart withAppendProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key1"] updateProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key2"] resultBlock:
       ^(NSURLResponse * _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
         NSLog(@"%@", responseObject);
      }];
      [FIRAnalytics logEventWithName:@"bo_add_product"
                          parameters:NULL];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(removeProduct:(NSDictionary * _Nullable)options)
{
  @try {
    BOProduct* pd       = [BetaOut productWithID:options[@"productId"] andSellingPrice:[options[@"productPrice"] doubleValue]];
    pd.productImageURL  = options[@"productImageURL"];
    pd.name             = options[@"productName"];
    pd.productURL       = options[@"productURL"];
    pd.quantity         = [options[@"productQuantity"] intValue];
    pd.brand            = options[@"productBrand"];
    pd.productGroupID   = options[@"productGroupID"];
    pd.productGroupName = options[@"productGroupName"];

    BOCart* cart = [BetaOut cartWithTotal:[options[@"cartTotal"] doubleValue] forRevenue:[options[@"cartRevenue"] doubleValue] andCurrency:options[@"cartCurrency"]];

    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut removeProducts:pd fromCart:cart withAppendProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key1"] updateProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key2"] resultBlock:
       ^(NSURLResponse * _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
         NSLog(@"%@", responseObject);
      }];
      [FIRAnalytics logEventWithName:@"bo_remove_product"
                          parameters:NULL];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(editProduct:(NSDictionary * _Nullable)options)
{
  @try {
    BOProduct* pd       = [BetaOut productWithID:options[@"productId"] andSellingPrice:[options[@"productPrice"] doubleValue]];
    pd.productImageURL  = options[@"productImageURL"];
    pd.name             = options[@"productName"];
    pd.productURL       = options[@"productURL"];
    pd.quantity         = [options[@"productQuantity"] intValue];
    pd.brand            = options[@"productBrand"];
    pd.productGroupID   = options[@"productGroupID"];
    pd.productGroupName = options[@"productGroupName"];

    BOCart* cart = [BetaOut cartWithTotal:[options[@"cartTotal"] doubleValue] forRevenue:[options[@"cartRevenue"] doubleValue] andCurrency:options[@"cartCurrency"]];

    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut updateProducts:pd inCart:cart withAppendProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key1"] updateProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key2"] resultBlock:^(NSURLResponse * _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
        NSLog(@"%@", responseObject);
      }];
      [FIRAnalytics logEventWithName:@"bo_edit_product"
                          parameters:NULL];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(fullCartUpdate:(NSDictionary * _Nullable)options)
{
  @try {
    NSArray *products = options[@"products"];
    NSDictionary *cart = options[@"cart"];
    NSMutableArray *payloadProducts = [[NSMutableArray alloc] init];
    BOCart* payloadCart = [BetaOut cartWithTotal:[cart[@"total"] doubleValue] forRevenue:[cart[@"revenue"] doubleValue] andCurrency:cart[@"currency"]];
    
    for (NSDictionary *product in products) {
      BOProduct *pd       = [BetaOut productWithID:product[@"id"] andSellingPrice:[product[@"price"] doubleValue]];
      pd.productImageURL  = product[@"imageURL"];
      pd.name             = product[@"name"];
      pd.productURL       = product[@"url"];
      pd.quantity         = [product[@"quantity"] intValue];
      pd.brand            = product[@"brand"];
      pd.productGroupID   = product[@"groupID"];
      pd.productGroupName = product[@"groupName"];
      
      [payloadProducts addObject:pd];
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut updateProducts:payloadProducts inCart:payloadCart withAppendProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key1"] updateProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key2"] resultBlock:^(NSURLResponse * _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
        NSLog(@"%@", responseObject);
        [FIRAnalytics logEventWithName:@"bo_update_cart"
                            parameters:NULL];
      }];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(clearCart:(NSDictionary * _Nullable)options)
{
  @try {
    NSDictionary *cart = options[@"cart"];
    BOCart* payloadCart = [BetaOut cartWithTotal:[cart[@"total"] doubleValue] forRevenue:[cart[@"revenue"] doubleValue] andCurrency:cart[@"currency"]];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut clearCart:payloadCart withAppendProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key1"] updateProperties:[NSDictionary dictionaryWithObject:@"value" forKey:@"key2"] resultBlock:^(NSURLResponse * _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
        NSLog(@"%@", responseObject);
        [FIRAnalytics logEventWithName:@"bo_clear_cart"
                            parameters:NULL];
      }];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}


RCT_EXPORT_METHOD(logEvent:(NSString * _Nullable)events updateProperties:(NSDictionary * _Nullable)updateProperties)
{
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut logEvents:events withAppendProperties:nil updateProperties:updateProperties resultBlock:^(NSURLResponse * _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
        NSLog(@"%@", responseObject);
      }];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(updateProperties:(NSDictionary *)properties)
{
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      [BetaOut updateProperties:properties resultBlock:^(NSURLResponse *                                                                                                              _Nullable response, id  _Nullable responseObject, NSError * _Nullable error) {
        NSLog(@"%@", responseObject);
        
        [FIRAnalytics logEventWithName:@"bo_update_properties"
                            parameters:NULL];
        
        if([[responseObject valueForKey:@"responseCode"] intValue] == 200)
          NSLog(@"Update User Properties posted");
        else
          NSLog(@"FAILED : Update User Properties");
      }];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

@end
