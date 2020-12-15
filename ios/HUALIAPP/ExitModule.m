//
//  ExitModule.m
//  ExitApp
//
//  Created by Mahesh Bokhani on 09/07/20.

#import "ExitModule.h"
 
@implementation ExitApp
 
RCT_EXPORT_MODULE()
 
RCT_EXPORT_METHOD(exit)
{
 NSLog(@"Exit Button Press");
 exit(0);
}
// Here create multiple RCT_EXPORT_METHOD
 
@end
