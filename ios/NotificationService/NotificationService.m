//
//  NotificationService.m
//  BetaoutRichPush
//
//  Created by Jayant on 22/03/17.
//  Copyright © 2017 BetaOut. All rights reserved.
//

#import "NotificationService.h"
#import <UIKit/UIKit.h>

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService



- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
  self.contentHandler = contentHandler;
  self.bestAttemptContent = [request.content mutableCopy];
  
  NSString *attachmentUrlString = [request.content.userInfo objectForKey:@"attachment-url"];
  if (![attachmentUrlString isKindOfClass:[NSString class]])
    return;
  
  NSURL *url = nil;
  
  if([attachmentUrlString hasSuffix:@".png"] || [attachmentUrlString hasSuffix:@".jpg"] || [attachmentUrlString hasSuffix:@".jpeg"])
  {
    if([attachmentUrlString rangeOfString:@"d39sghb3udgxv0.cloudfront.net"].location != NSNotFound)
      url = [NSURL URLWithString:[NSString stringWithFormat:@"%@;w=%f", attachmentUrlString, [[UIScreen mainScreen] bounds].size.width * 1]];
    else
      url = [NSURL URLWithString:attachmentUrlString];
  }
  else
    url = [NSURL URLWithString:attachmentUrlString];
  
  if (!url)
    return;
  else
    NSLog(@"%@", url);
  
  [[[NSURLSession sharedSession] downloadTaskWithURL:url completionHandler:^(NSURL * _Nullable location, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    
    if (!error) {
      NSString *tempDict = NSTemporaryDirectory();
      NSString *attachmentID = [[response.URL.absoluteString lastPathComponent] rangeOfString:@";w"].location != NSNotFound ? [[[NSUUID UUID] UUIDString] stringByAppendingString:[[[response.URL.absoluteString lastPathComponent] componentsSeparatedByString:@";"] firstObject]] : [[[NSUUID UUID] UUIDString] stringByAppendingString:[response.URL.absoluteString lastPathComponent]];
      
      if([response.suggestedFilename rangeOfString:@";w"].location != NSNotFound)
        attachmentID = [[[NSUUID UUID] UUIDString] stringByAppendingString:[[response.suggestedFilename componentsSeparatedByString:@";"] firstObject]];
      else
        attachmentID = [[[NSUUID UUID] UUIDString] stringByAppendingString:response.suggestedFilename];
      
      NSString *tempFilePath = [tempDict stringByAppendingPathComponent:attachmentID];
      
      if ([[NSFileManager defaultManager] moveItemAtPath:location.path toPath:tempFilePath error:&error]) {
        UNNotificationAttachment *attachment = [UNNotificationAttachment attachmentWithIdentifier:attachmentID URL:[NSURL fileURLWithPath:tempFilePath] options:nil error:&error];
        if (!attachment) {
          NSLog(@"Create attachment error: %@", error);
        } else {
          _bestAttemptContent.attachments = [_bestAttemptContent.attachments arrayByAddingObject:attachment];
        }
      } else {
        NSLog(@"Move file error: %@", error);
      }
    } else {
      NSLog(@"Download file error: %@", error);
    }
    
    [[NSOperationQueue mainQueue] addOperationWithBlock:^{
      self.contentHandler(self.bestAttemptContent);
    }];
    
  }] resume];
}

- (void)serviceExtensionTimeWillExpire {
  // Called just before the extension will be terminated by the system.
  // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
  self.contentHandler(self.bestAttemptContent);
}

@end
