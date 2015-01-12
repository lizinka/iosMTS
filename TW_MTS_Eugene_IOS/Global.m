//
//  Global.m
//  M-FXMargin
//
//  Created by jay lee on 10. 9. 15..
//  Copyright 2010 (주)윈웨이시스템. All rights reserved.
//

#import "Global.h"


@implementation Global

- (id) initWithIF {
	broadCode = [[NSMutableArray alloc] init];
	broadCodeName = [[NSMutableArray alloc] init];
	return self;
}

- (NSString *) getLocalIPAddress {
	BOOL success;
	struct ifaddrs * addrs;
	const struct ifaddrs * cursor;
	NSString *address = @"127.0.0.1";
	success = getifaddrs(&addrs) == 0;
	if (success) {
		cursor = addrs;
		while (cursor != NULL) {
			if (cursor->ifa_addr->sa_family == AF_INET && (cursor->ifa_flags & IFF_LOOPBACK) == 0) 
			{
				NSString *name = [NSString stringWithUTF8String:cursor->ifa_name];
				if ([name isEqualToString:@"en0"]) //en0 Wi-Fi adapter
				{
					address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)cursor->ifa_addr)->sin_addr)];
				    break;
				}
			}
			cursor = cursor->ifa_next;
		}
		freeifaddrs(addrs);
	}
	return address;
}

-(NSString *)getAccountWithHyphen : (NSString *)acno {
	NSRange range_a0 = {0, 3};
	NSString *sacno0 = [acno substringWithRange:range_a0];
	NSRange range_a1 = {3, 2};
	NSString *sacno1 = [acno substringWithRange:range_a1];
	NSRange range_a2 = {5, 6};
	NSString *sacno2 = [acno substringWithRange:range_a2];
	NSString *sacm = [NSString stringWithFormat:@"%@-%@-%@", sacno0, sacno1, sacno2];
	
	return sacm;
}

-(NSString *)getAccountNoWithHyphen : (NSString *)acno {
	NSRange range_a0 = {0, 3};
	NSString *sacno0 = [acno substringWithRange:range_a0];
	NSRange range_a1 = {4, 2};
	NSString *sacno1 = [acno substringWithRange:range_a1];
	NSRange range_a2 = {7, 6};
	NSString *sacno2 = [acno substringWithRange:range_a2];
	NSString *sacm = [NSString stringWithFormat:@"%@%@%@", sacno0, sacno1, sacno2];
	
	return sacm;
}

-(void)setCodeMaster {
	 
	NSBundle *bundle = [NSBundle mainBundle];	
	NSString *plistPath = [bundle pathForResource:@"amidictionary" ofType:@"plist"];
	amcodeDict = [[NSDictionary alloc] initWithContentsOfFile:plistPath]; 
	
	plistPath = [bundle pathForResource:@"rjobriendictionary" ofType:@"plist"];
	rjcodeDict = [[NSDictionary alloc] initWithContentsOfFile:plistPath]; 
}

-(NSString *)getPriceFromTickcount : (NSString *)code strPrice : (NSString *)sprice Indicator : (int)pind Tickcount : (int)tcount {
	NSString *sVal;
	if ([code hasSuffix:@"_A"])
        sVal = [amcodeDict objectForKey:code];
	else
		sVal = [rjcodeDict objectForKey:code];
	
	sVal = [sVal substringFromIndex : 3];
	
	int iPrice = [sprice floatValue] * powf(10, pind);
	int iTsize = [sVal floatValue] * powf(10, pind) * tcount;
	iPrice += iTsize;
	
	NSString *strformat0 = @"%.";
	NSString *strformat1 = @"f";
	NSString *sformat = [NSString stringWithFormat:@"%@%d%@", strformat0, pind, strformat1];
	NSString *retPrice = [NSString stringWithFormat: sformat, iPrice * powf(10, -pind)];
	
	return retPrice;
}

-(void)setBroadData : (NSString *)sdata {
	[broadCode removeAllObjects];
	[broadCodeName removeAllObjects];
	
	//sdata = [sdata stringByAppendingString:@"	"];
	
	NSArray *recordArray = [sdata componentsSeparatedByString:@"	"];
	
	for (int i = 0; i < recordArray.count; i++) {
		if ((i % 2) == 0) {
			NSString *str = [recordArray objectAtIndex:i];
			[broadCode addObject:str];
		}
		else {
			NSString *str = [recordArray objectAtIndex:i];
			[broadCodeName addObject:str];
		}

	}
}

-(NSString *)getBroadData : (NSString *)code {
	
	int idx = [broadCode indexOfObject:code];
	return [broadCodeName objectAtIndex:idx];
	
}

-(NSString *)getOrderState : (int)gubun {
	switch (gubun) {
		case 10:
			return @"주문대기";
		case 11:
			return @"주문";
		case 20:
			return @"정정대기";
		case 21:
			return @"정정";
		case 30:
			return @"취소대기";
		case 31:
			return @"취소";
		default:
			return @"";
	}
}

-(NSString *)getOrderGubun : (int)gubun {
	switch (gubun) {
		case 1:
			return @"매수";
		case 2:
			return @"매도";
		default:
			return @"";
	}
}

-(NSString *)getOrderType : (int)gubun {
	switch (gubun) {
		case 1:
			return @"시장가";
		case 2:
			return @"지정가";
		case 3:
			return @"STOP Market";
		case 4:
			return @"STOP Limit";
		case 5:
			return @"OCO";
		case 6:
			return @"FOK";
		default:
			return @"";
	}
}

-(NSString *)getOrderTradetype : (int)gubun {
	switch (gubun) {
		case 11:
			return @"진입";
		case 12:
			return @"청산";
		default:
			return @"";
	}
}

-(NSString *)getDateSelebrate : (NSString *)date {
	NSRange range_a0 = {0, 4};
	NSString *sdate0 = [date substringWithRange:range_a0];
	NSRange range_a1 = {4, 2};
	NSString *sdate1 = [date substringWithRange:range_a1];
	NSRange range_a2 = {6, 2};
	NSString *sdate2 = [date substringWithRange:range_a2];
	NSString *sdate = [NSString stringWithFormat:@"%@/%@/%@", sdate0, sdate1, sdate2];
	
	return sdate;
}

-(NSString *)trim:(NSString *)sString
{
    NSString *removeSpaceString = [sString stringByReplacingOccurrencesOfString:@" " withString:@""];
    
    return removeSpaceString;
}

@end


