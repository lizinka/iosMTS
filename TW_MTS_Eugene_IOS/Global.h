//
//  Global.h
//  M-FXMargin
//
//  Created by jay lee on 10. 9. 15..
//  Copyright 2010 (주)윈웨이시스템. All rights reserved.
//

#import <Foundation/Foundation.h>
#include <ifaddrs.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <net/if.h>
#include <net/if_dl.h>
#include <arpa/inet.h>
#include <ifaddrs.h>

@interface Global : NSObject {
	NSDictionary *amcodeDict;
	NSDictionary *rjcodeDict;
	NSMutableArray *broadCode;
	NSMutableArray *broadCodeName;
}

-(id) initWithIF;
-(NSString *) getLocalIPAddress;
-(NSString *)getAccountWithHyphen : (NSString *)acno;
-(NSString *)getAccountNoWithHyphen : (NSString *)acno;
-(void)setCodeMaster;
-(NSString *)getPriceFromTickcount : (NSString *)code strPrice : (NSString *)sprice Indicator : (int)pind Tickcount : (int)tcount;

-(void)setBroadData : (NSString *)sdata;
-(NSString *)getBroadData : (NSString *)code;

-(NSString *)getOrderState : (int)gubun;
-(NSString *)getOrderGubun : (int)gubun;
-(NSString *)getOrderType : (int)gubun;
-(NSString *)getOrderTradetype : (int)gubun;

-(NSString *)getDateSelebrate : (NSString *)date;
-(NSString *)trim : (NSString*)sString;

- (double) GetFixToDouble : (NSString *) Str : (char) DisplayType;
- (double) GetFixed2N : (NSString*) Str : (double) Exp1: (double)  Exp2 : (int) TailSize;

- (NSString*) GetDoubleToFix : (double) Value : (char) DisplayType;
- (NSString*) GetN2Fixed : (double) Value: (double) Exp1 : (double) Exp2 : (int) TailSize: (NSString*) sformat;
- (void) GetExpVal : (char) DisplayType : (double*) Exp1 : (double*)  Exp2 : (int*) TailSize : (NSString**) sformat;
- (NSString*)  GetFixData :(char) DisplayType: (NSString*) str;
- (NSString*) CalcRealSise:(NSString*)sPrice:(int)nDiv:(int)nOpos;
@end

