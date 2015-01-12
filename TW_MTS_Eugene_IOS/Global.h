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
@end

