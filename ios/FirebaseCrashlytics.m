#import "FirebaseCrashlytics.h"
@import Crashlytics;

@implementation FirebaseCrashlytics

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(log:(NSString *)event)
{
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      CLS_LOG(@"%@", event);
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(setKeys:(NSDictionary * _Nullable)options)
{
  @try {
    
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

RCT_EXPORT_METHOD(setUser:(NSDictionary * _Nullable)user)
{
  @try {
    dispatch_async(dispatch_get_main_queue(), ^{
      [CrashlyticsKit setUserIdentifier:user[@"id"]];
      [CrashlyticsKit setUserEmail:user[@"email"]];
      [CrashlyticsKit setUserName:user[@"name"]];
    });
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
  }
}

@end
