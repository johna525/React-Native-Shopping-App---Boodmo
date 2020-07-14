//
//  BetaOutSDK.h
//  BetaOutSDK
//
//  Created by Jayant Saxena on 01/03/16.
//  Copyright © 2016 BetaOut. All rights reserved.
//


#import <UserNotifications/UserNotifications.h>
#import <UIKit/UIKit.h>

#import <Foundation/Foundation.h>

#import <CoreLocation/CoreLocation.h>

#import "BOConfiguration.h"
#import "BetaOutConstants.h"
#import "BOModels.h"

@interface BetaOut : NSObject
/**
 * This flag is set to `YES` if the application is set up
 * with the "remote-notification" background mode and is running
 * iOS7 or greater.
 */
@property (nonatomic, assign, readonly) BOOL remoteNotificationBackgroundModeEnabled;


// start creates the BetaOut singleton
+ (void)start;
+ (void)startWithConfiguration:(BOConfiguration *)configuration;

+ (BOProduct*)productWithID:(NSString*)productId andSellingPrice:(double)sell;
+ (BOCart*)cartWithTotal:(double)total forRevenue:(double)revenu andCurrency:(NSString*)cur;
+ (BOOrder*)orderWithID:(NSString*)oid withTotal:(double)tot forRevenue:(double)revenu status:(NSString*)st usingPaymentMethod:(NSString*)pay andCurrency:(NSString*)cur;


+ (void)viewProducts:(id)productsInfo withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp resultBlock:(BORequestResultBlock)resultBlock;
+ (void)addProducts:(id)productsInfo toCart:(BOCart *)cartInfo withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp resultBlock:(BORequestResultBlock)resultBlock;
+ (void)removeProducts:(id)productsInfo fromCart:(BOCart *)cartInfo withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp resultBlock:(BORequestResultBlock)resultBlock;
+ (void)updateProducts:(id)productsInfo inCart:(BOCart *)cartInfo withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp resultBlock:(BORequestResultBlock)resultBlock;
+ (void)clearCart:(BOCart *)cartInfo withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp resultBlock:(BORequestResultBlock)resultBlock;

+ (void)orderPlaced:(BOOrder*)orderInfo withCart:(BOCart *)cartInfo products:(id)productsInfo  withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp andCustomProperties:(NSDictionary *)customProperties resultBlock:(BORequestResultBlock)resultBlock;

+ (void)completePurchaseWithOrder:(BOOrder*)orderInfo withCart:(BOCart *)cartInfo products:(id)productsInfo withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp andCustomProperties:(NSDictionary *)customProperties resultBlock:(BORequestResultBlock)resultBlock;


+ (void)appendProperties:(NSDictionary *)properties resultBlock:(BORequestResultBlock)resultBlock;
+ (void)incrementProperties:(NSDictionary *)properties resultBlock:(BORequestResultBlock)resultBlock;
+ (void)updateProperties:(NSDictionary *)properties resultBlock:(BORequestResultBlock)resultBlock;
+ (void)logEvents:(id)events withAppendProperties:(NSDictionary*)appendProp updateProperties:(NSDictionary*)updateProp resultBlock:(BORequestResultBlock)resultBlock;

+ (void)unSubscribeForPushMessage:(BOSubscribePushType)val resultBlock:(BORequestResultBlock)resultBlock;

+ (void)logOut;
+ (void)setCustomerId:(NSString*)cid;
+ (void)setCustomerEmailId:(NSString*)email;
+ (void)setCustomerPhone:(NSString*)phone;

@end
