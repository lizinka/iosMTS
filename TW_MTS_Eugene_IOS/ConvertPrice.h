//
//  ConvertPrice.h
//  TW_MTS_Eugene_IOS
//
//  Created by jay lee on 2015. 1. 13..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#ifndef TW_MTS_Eugene_IOS_ConvertPrice_h
#define TW_MTS_Eugene_IOS_ConvertPrice_h


#endif

Byte f10_0     =               '1';
Byte f10_1     =               '2';
Byte f10_2     =               '3';
Byte f10_3     =               '4';
Byte f10_4     =              '5';
char f10_5     =               '6';
char f10_6     =               '7';
char f10_7     =               '8';
char f10_8     =               '9';
char f2_1      =               'A';
char f4_1      =              'B';
char f8_1      =               'C';
char f16_1     =               'D';
char f32_1     =               'E';
char f64_1     =               'F';
char f128_1    =               'G';
char f256_1    =               'H';
char f32_H1    =               'I';
char f64_H1    =               'J';
char f32_Q1    =               'K';


@interface ConvertPrice : NSObject {

}
- (double) GetFixToDouble : (NSString *) Str : (char) DisplayType;
- (double) GetFixed2N : (NSString*) Str : (double) Exp1: (double)  Exp2 : (int) TailSize;

- (NSString*) GetDoubleToFix : (double) Value : (char) DisplayType;
- (NSString*) GetN2Fixed : (double) Value: (double) Exp1 : (double) Exp2 : (int) TailSize: (NSString*) sformat;
- (void) GetExpVal : (char) DisplayType : (double*) Exp1 : (double*)  Exp2 : (int*) TailSize : (NSString*) sformat;
- (NSString*)  GetFixData :(char) DisplayType: (NSString*) str;
@end