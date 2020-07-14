//
//  BetaOutClientConfiguration.h
//  BetaOutSDK
//
//  Created by Jayant Saxena on 01/03/16.
//  Copyright © 2016 BetaOut. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 The `BOMutableConfiguration` represents a `BOConfiguration` object that can be mutated.
 It is only usable during the execution of the block passed to `BOConfiguration.+configurationWithBlock:`,
 during which time you should set your properties on it, similar to the following:
 ```
 configuration.apiKet = @"YOUR API KEY"
 configuration.projectId = @"YOUR PROJECT ID"
 ```
 */

@protocol BOMutableConfiguration <NSObject>

///--------------------------------------
#pragma mark - Connecting to BetaOut
///--------------------------------------

/**
 The BetaOut.com application id to configure the SDK with.
 */
@property (nullable, nonatomic, copy) NSString *apiKey;

/**
 If using BetaOut Push Services to configure the SDK with.
 */

@property (nonatomic, assign) BOOL handlePushNotificationsEnabled;

/**
 The BetaOut.com client key to configure the SDK with.
 */
@property (nullable, nonatomic, copy) NSString *projectId;


///--------------------------------------
#pragma mark - Other Properties
///--------------------------------------

/**
 The maximum load time allow to load landing page contents.
 */
@property (nonatomic, assign) NSInteger landingPageLoadTime;

/**
 Whether or not to enable production in the SDK.
 The default value is `NO`.
 */
@property (nonatomic, assign, getter=isInProduction) BOOL inProduction;

/**
 If enabled, the BO library automatically registers for remote notifications when push is enabled and
 intercepts incoming notifications in both the foreground and upon launch.
 Defaults to YES. If this is disabled, you will need to register for remote notifications in
 application:didFinishLaunchingWithOptions: and forward all notification-related app delegate calls
 to BOPushManager
 */
@property (nonatomic, assign, getter=isAutomaticSetupEnabled) BOOL automaticSetupEnabled;

@end



/**
 The `BOConfiguration` represents the local configuration of the SDK to connect to the server with.
 These configurations can be stored, copied, and compared, but cannot be safely changed once the SDK is initialized.
 Use this object to construct a configuration for the SDK in your application, and pass it to
 `BetaOut.+initializeWithConfiguration:`.
 */
@interface BOConfiguration : NSObject <NSCopying>

///--------------------------------------
#pragma mark - Connecting to BetaOut
///--------------------------------------

/**
 The BetaOut.com application id to configure the SDK with.
 */
@property (nullable, nonatomic, copy, readonly) NSString *apiKey;

/**
 If using BetaOut Push Services to configure the SDK with.
 */

@property (nonatomic, assign) BOOL handlePushNotificationsEnabled;

/**
 The BetaOut.com client key to configure the SDK with.
 */
@property (nullable, nonatomic, copy, readonly) NSString *projectId;


///--------------------------------------
#pragma mark - Other Properties
///--------------------------------------

/**
 The maximum load time allow to load landing page contents.
 */
@property (nonatomic, assign, readonly) NSInteger landingPageLoadTime;

/**
 Whether or not to enable production in the SDK.
 The default value is `NO`.
 */
@property (nonatomic, assign, readonly, getter=isInProduction) BOOL inProduction;


/**
 If enabled, the BO library automatically registers for remote notifications when push is enabled and
 intercepts incoming notifications in both the foreground and upon launch.
 Defaults to YES. If this is disabled, you will need to register for remote notifications in 
 application:didFinishLaunchingWithOptions: and forward all notification-related app delegate calls 
 to BOPushManager
 */
@property (nonatomic, assign, readonly, getter=isAutomaticSetupEnabled) BOOL automaticSetupEnabled;

///--------------------------------------
#pragma mark - Creating a Configuration
///--------------------------------------

/**
 Create a new SDK configuration object. This will create a temporarily modifiable configuration, and pass it to a block
 to be initialized.
 
 Example usage:
 
 ```
 [BOConfiguration configurationWithBlock:^(id<BOMutableConfiguration> configuration) {
 configuration.applicationId = ...;
 configuration.clientKey = ...;
 configuration.localDatastoreEnabled = ...;
 }];
 ```
 @param configurationBlock A block used to modify the created configuration.
 @return A newly created configuration.
 */
+ (instancetype)configurationWithBlock:(void (^)(id<BOMutableConfiguration> configuration))configurationBlock;


/**
 Create a new Default SDK configuration object.
 */
+ (instancetype)defaultConfiguration;

+ (instancetype)new NS_UNAVAILABLE;
- (instancetype)init NS_UNAVAILABLE;
@end

NS_ASSUME_NONNULL_END

