//
//  BOModels.h
//  BetaOutSDK
//
//  Created by Jayant on 27/06/16.
//  Copyright © 2016 BetaOut. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BOProduct : NSObject

@property (nonatomic)           double                  costPrice;

@property (nonatomic)           double                  oldPrice;
@property (nonatomic)           double                  discount;
@property (nonatomic)           double                  margin;

@property (nonatomic)           long                    quantity;

@property (nonatomic, strong)   NSString*               sku;
@property (nonatomic, strong)   NSString*               name;
@property (nonatomic, strong)   NSString*               productURL;
@property (nonatomic, strong)   NSString*               productImageURL;
@property (nonatomic, strong)   NSString*               brand;

@property (nonatomic, strong)   NSString*               productGroupID;
@property (nonatomic, strong)   NSString*               productGroupName;


- (BOOL)belongToCategoryWithID:(NSString*)catid name:(NSString*)name andParentCategoryID:(NSString*)pid;
- (BOOL)addSpecs:(NSDictionary*)d;
- (BOOL)addTags:(NSString*)sp;

@end


@interface BOCart : NSObject

@property (nonatomic, strong)   NSString*               cartId;
@property (nonatomic, strong)   NSString*               abandon_cart_url;
@property (nonatomic, strong)   NSString*               abandon_cart_deeplink_android;
@property (nonatomic, strong)   NSString*               abandon_cart_deeplink_ios;

@end


@interface BOOrder : NSObject

@property (nonatomic)           double                  shipping;
@property (nonatomic)           double                  tax;
@property (nonatomic)           double                  discount;
@property (nonatomic, strong)   NSString*               coupon;
@property (nonatomic, strong)   NSString*               shipping_method;

- (BOOL)updateOrderStatus:(NSString*)orderNewStatus;

@end


