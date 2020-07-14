//
//  BetaOutConstants.h
//  BetaOutSDK
//
//  Created by Jayant Saxena on 01/03/16.
//  Copyright © 2016 BetaOut. All rights reserved.
//

#import <Foundation/Foundation.h>

///--------------------------------------
#pragma mark - Blocks
///--------------------------------------

typedef enum : NSInteger {
    UNSUBSCRIBE_NOPUSH = -1,
    SUBSCRIBE_ONLY_INAPP = 0,
    SUBSCRIBE_ALERT_AND_INAPP_PUSH = 1
} BOSubscribePushType;



typedef void (^BOBooleanResultBlock)(BOOL succeeded, NSError *_Nullable error);
typedef void (^BOIntegerResultBlock)(int number, NSError *_Nullable error);
typedef void (^BOArrayResultBlock)(NSArray *_Nullable objects, NSError *_Nullable error);
typedef void (^BOSetResultBlock)(NSSet *_Nullable channels, NSError *_Nullable error);

typedef void (^BORequestResultBlock)(NSURLResponse *_Nullable response, id _Nullable responseObject, NSError *_Nullable error);
typedef void (^BOProgressBlock)(int percentDone);


