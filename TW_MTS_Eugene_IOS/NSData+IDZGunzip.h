//
//  NSData+IDZGunzip.h
//  TW_MTS_Eugene_IOS
//
//  Created by jay lee on 2015. 1. 29..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#ifndef TW_MTS_Eugene_IOS_NSData_IDZGunzip_h
#define TW_MTS_Eugene_IOS_NSData_IDZGunzip_h


#endif

#import <Foundation/Foundation.h>

extern NSString* const IDZGunzipErrorDomain;


@interface NSData (IDZGunzip)

- (NSData*)gunzip:(NSError**)error;
- (NSData*) gzipData;//: (NSData*)pUncompressedData;
- (NSData *) decompressedDataUsingZLib:(NSUInteger) decompressedSize;
@end
