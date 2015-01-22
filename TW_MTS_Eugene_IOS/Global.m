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

- (double) GetFixToDouble: (NSString *) Str : (char) DisplayType
{
    int TailSize;
    double Exp1, Exp2;
    NSString* sformat;
    [self GetExpVal:DisplayType :&Exp1: &Exp2:&TailSize :&sformat];
    return [self GetFixed2N:Str :Exp1 :Exp2 :TailSize];
    
    
}

- (double) GetFixed2N : (NSString*) Str : (double) Exp1: (double)  Exp2 : (int) TailSize
{
    int i, iPos, tmrk, len, iBody;
    double dVal;
    NSMutableString* Body, *Tail;
    bool mMinus;
    
    
    dVal = 0;
    mMinus = false;
    len = [Str length];
    
    Body = [ NSMutableString stringWithString:Str];
    i = 0; tmrk = 0;
    iPos = 0;
    while (i < len)
    {
        
        if (([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @","]) || ((iPos == 0) && ([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @" "])))
        {
            i++;
            continue;
        }
        if ([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @" "])  break;
        
        if ([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @"."] || [[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @"'"])
        {
            tmrk = 1;
            break;
        }
        
        if ((([[Str substringWithRange:NSMakeRange(i, 1)] compare: @"0"] == NSOrderedAscending) || ([[Str substringWithRange:NSMakeRange(i, 1)] compare: @"9"] == NSOrderedDescending) ) && ([[Str substringWithRange:NSMakeRange(i, 1)] compare: @"-"] != NSOrderedSame)) {
            break;
        }
        [Body replaceCharactersInRange:NSMakeRange(iPos,1) withString:[Str substringWithRange:NSMakeRange(i, 1)]];
        
        iPos++;
        i++;
    }
    
    
    //   [Body initWithCapacity: iPos ];
    Body = [Body substringWithRange:NSMakeRange(0, iPos)];
    Tail = [ NSMutableString stringWithString:Str];
    i++;
    iPos = 0;
    if (tmrk == 1)
        while (i < len)
        {
            
            if ([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @","] || [[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @"'"])
            {
                
                i++;
                continue;
            }
            if ([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @" "])  break;
            [Tail replaceCharactersInRange:NSMakeRange(iPos, 1) withString:[Str substringWithRange:NSMakeRange(i, 1)]];
            iPos++;
            i++;
        }
    
    //   [Tail initWithCapacity: iPos -1];
    Tail = [Tail substringWithRange:NSMakeRange(0, iPos)];
    if ([Body length]  > 0)
    {
        
        mMinus = ([[Str substringWithRange:NSMakeRange(1, 1)] isEqualToString: @"-"]);
        iBody = [Body intValue];
        if ([Tail length] > 0)
        {
            if ([Tail length] < TailSize)
                //   Tail := Tail + StringOfChar('0', TailSize - Length(Tail));
                [Tail appendString:@"0"];
            
            
            if (Exp1 == 0.25)
            {
                if (([[Tail substringWithRange:NSMakeRange([Tail length], 1)] isEqualToString: @"2"]) || ([[Tail substringWithRange:NSMakeRange([Tail length], 1)] isEqualToString: @"7"]))
                {
                    [Tail appendString:@"5"];
                }
            }
            dVal = [Tail floatValue]; //  StrtoFloatDef(tail, 0);
            dVal = (dVal / Exp2);
        }
        if (mMinus)
            dVal = dVal*-1 + iBody;
        else
            dVal = dVal + iBody;
    }
    else
    {
        mMinus = ([[Str substringWithRange:NSMakeRange(1, 1)] isEqualToString: @"-"]);
      
        if ([Tail length] > 0)
        {
            if ([Tail length] < TailSize)
                //   Tail := Tail + StringOfChar('0', TailSize - Length(Tail));
                [Tail appendString:@"0"];
            
            
            if (Exp1 == 0.25)
            {
                if (([[Tail substringWithRange:NSMakeRange([Tail length], 1)] isEqualToString: @"2"]) || ([[Tail substringWithRange:NSMakeRange([Tail length], 1)] isEqualToString: @"7"]))
                {
                    [Tail appendString:@"5"];
                }
            }
            dVal = [Tail floatValue]; //  StrtoFloatDef(tail, 0);
            dVal = (dVal / Exp2);
        }
        if (mMinus)
            dVal = dVal*-1 ;
        else
            dVal = dVal ;
        
    }
    return  dVal;
    
}
- (NSString*) GetDoubleToFix : (double) Value : (char) DisplayType
{
    int TailSize;
    double Exp1, Exp2;
    NSString *sformat;
    //GetExpVal(DisplayType, Exp1, Exp2, TailSize, sformat);
    [self GetExpVal:DisplayType :&Exp1 :&Exp2 :&TailSize :&sformat];
    //   :(DisplayType, Exp1, Exp2, TailSize, sformat);
    return [self GetN2Fixed:Value :Exp1 :Exp2 :TailSize :sformat ];
    
}
- (NSString*) GetN2Fixed : (double) Value: (double) Exp1 : (double) Exp2 : (int) TailSize: (NSString*) sformat
{
    
    int iBody;
    double itail;
    NSString *stail ;
    NSString *rValue;
    
    
    
    if (![sformat isEqualToString: @""])
    {
        iBody = Value;
        itail = (Value - iBody) * Exp2;
        if (itail < 0)
        {
            itail = itail + 0.01;
            stail = [NSString stringWithFormat:sformat,  itail * (-1)] ;
            return  [@"-"  stringByAppendingString: [NSString stringWithFormat:@"%.0d%@%@", iBody, @"'", stail] ];
        }
        else
        {
            itail = itail + 0.01;
            stail = [NSString stringWithFormat:sformat,  itail ] ;
            rValue =  [NSString stringWithFormat:@"%.0d%@%@", iBody, @"'", stail];
            
            return rValue;
        }
    }
    else
    {
        // Result := format('%.'+ IntToStr(TailSize) +'f', [Value]);
        stail = [[@"%."  stringByAppendingString: [NSString stringWithFormat:@"%d",TailSize]] stringByAppendingString: @"f"];
        return  stail;
    }
    
    
}


- (void) GetExpVal : (char) DisplayType : (double*) exp1 : (double*)  exp2 : (int*) TailSize : (NSString**) sformat
{
    
    switch  (DisplayType)
    {
        case '1'://	 1/1		 999999999	*/
            *exp1 = 1.  ; *exp2 = 1.        ;
            *TailSize = 0; *sformat = @"";
            break;
        case '2':		//* '2'	 1/10		99999999.9	*/
            *exp1 = 1.	; *exp2 = 10.		    ; *TailSize = 1; *sformat = @"";
            break;
        case '3'	:
            *exp1 = 1.	; *exp2 = 100.	    ; *TailSize = 2; *sformat = @"";
            break;
        case '4':	//* '4'	 1/1000	999999.999		*/
            *exp1 = 1.	; *exp2 = 1000.	    ; *TailSize = 3; *sformat = @"";
            break;
            
        case '5':	//* '5'	 1/10000	99999.9999	*/
            *exp1 = 1.	; *exp2 = 10000.	  ; *TailSize = 4; *sformat =  @"";
            break;
            
        case  '6'	://* '6'	 1/100000	9999.99999	*/
            *exp1 = 1.	; *exp2 = 100000.	  ; *TailSize = 5; *sformat = @"";
            break;
            
        case '7'	://* '7'	 1/1000000	999.999999	*/
            *exp1 = 1.	; *exp2 = 1000000.	; *TailSize = 6; *sformat = @"";
            break;
            
        case	'8'://* '8'	 1/10000000	99.9999999	*/
            *exp1 = 1.	; *exp2 = 10000000.	; *TailSize = 7; *sformat = @"";
            break;
            
        case	'9'://* '9'	 1/100000000	9.99999999	*/
            *exp1 = 1.	; *exp2 = 100000000.; *TailSize = 8; *sformat = @"";
            break;
            
        case		'A'://* 'A'	 1/2		99999999'9	*/
            *exp1 = 1.	; *exp2 = 2.		; *TailSize = 1;  *sformat = @"0";
            break;
            
        case		'B'://* 'B'	 1/4		99999999'9	*/
            *exp1 = 1.	; *exp2 = 4.		; *TailSize = 1;  *sformat = @"0";
            break;
            
        case		'C'://* 'C'	 1/8		99999999'9	*/
            *exp1 = 1.	; *exp2 = 8.		; *TailSize = 1;  *sformat = @"0";
            break;
            
        case		'D'://* 'D'	 1/16		9999999'99	*/
            *exp1 = 1.	; *exp2 = 16.		; *TailSize = 2;  *sformat = @"00";
            break;
            
        case		'E'://* 'E'	 1/32		9999999'99	*/
            *exp1 = 1.	; *exp2 = 32.		; *TailSize = 2;  *sformat = @"00";
            break;
        case		'F'://* 'F'	 1/64		9999999'99	*/
            *exp1 = 1.	; *exp2 = 64.		; *TailSize = 2;  *sformat = @"00";
            break;
            
        case		'G'://* 'G'	 1/128	999999'999		*/
            *exp1 = 1.	; *exp2 = 128.		; *TailSize = 3;  *sformat = @"000";
            break;
            
        case		'H'://* 'H'	 1/256	999999'999		*/
            *exp1 = 1.	; *exp2 = 256.		; *TailSize = 3;  *sformat = @"000";
            break;
            
        case		'I'://* 'I'	 0.5/32	999999'99.9		*/
            *exp1 = 0.5	; *exp2 = 32.		; *TailSize = 1;  *sformat = @"00.0";
            break;
            
        case		'J'://* 'J'	 0.5/64	999999'99.9		*/
            *exp1 = 0.5	; *exp2 = 64.		; *TailSize = 1;  *sformat  = @"00.0";
            break;
            
        case		'K'://* 'K'	 0.25/32	999999'99.99	*/
            *exp1 = 0.25	; *exp2 = 32.		; *TailSize = 2; *sformat = @"00.0";
            break;
            
        default:
            *exp1 = 1; *exp2 = 1; *TailSize = 0 ; *sformat = @"";
            break;
            
    }
    
    
}

- (NSString*)  GetFixData :(char) DisplayType: (NSString*) str
{
    NSMutableString * ResultData = [NSMutableString stringWithString:str];;
    switch  (DisplayType)
    {
        case '1'://	 1/1		 999999999	*/
            break;
        case '2':		//* '2'	 1/10		99999999.9	*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 1];
            break;
        case '3'	://* '3'	 1/100	9999999.99		*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 2];
            break;
        case '4':	//* '4'	 1/1000	999999.999		*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 3];
            break;
            
        case '5':	//* '5'	 1/10000	99999.9999	*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 4];
            break;
            
        case '6'	://* '6'	 1/100000	9999.99999	*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 5];
            break;
            
        case '7'	://* '7'	 1/1000000	999.999999	*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 6];
            break;
            
        case '8'://* '8'	 1/10000000	99.9999999	*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 7];
            break;
            
        case '9'://* '9'	 1/100000000	9.99999999	*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 8];
            break;
            
        case		'A'://* 'A'	 1/2		99999999'9	*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 1];
            break;
            
        case		'B'://* 'B'	 1/4		99999999'9	*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 1];
            break;
            
        case		'C'://* 'C'	 1/8		99999999'9	*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 1];
            break;
            
        case		'D'://* 'D'	 1/16		9999999'99	*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 2];
            break;
            
        case		'E'://* 'E'	 1/32		9999999'99	*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 2];
            break;
        case		'F'://* 'F'	 1/64		9999999'99	*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 2];
            break;
            
        case		'G'://* 'G'	 1/128	999999'999		*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 3];
            break;
            
        case		'H'://* 'H'	 1/256	999999'999		*/
            [ResultData insertString:@"'" atIndex:[ResultData length] - 3];
            break;
            
        case		'I'://* 'I'	 0.5/32	999999'99.9		*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 1];
            [ResultData insertString:@"'" atIndex:[ResultData length] - 4];
            break;
            
        case		'J'://* 'J'	 0.5/64	999999'99.9		*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 1];
            [ResultData insertString:@"'" atIndex:[ResultData length] - 4];
            break;
            
        case		'K'://* 'K'	 0.25/32	999999'99.99	*/
            [ResultData insertString:@"." atIndex:[ResultData length] - 1];
            [ResultData insertString:@"'" atIndex:[ResultData length] - 4];
            break;
            
        default:
            break;
    }
    return ResultData;
    
}

- (NSString*) CalcRealSise:(NSString*)sPrice:(int)nDiv:(int)nOpos
{
    sPrice = [self trim:sPrice];
    
    if ([sPrice isEqual:@""])
    {
        return @"0.0";
    }

    NSRange nDecimalIndex = [sPrice rangeOfString:@"."];
    NSMutableString* sRealPrice = [sPrice copy];
    if (nDecimalIndex.location > 0)
    {
        if ([sPrice length] > nDecimalIndex.location + nDiv + 1)
        {
            [sRealPrice deleteCharactersInRange:NSMakeRange(nDecimalIndex.location + nDiv + 1, [sPrice length])];
        }
    }
    
    if (nOpos > 0) {
        int nSepIndex = nDecimalIndex.location - nOpos;
        if (nDecimalIndex.location == NSNotFound)
        {
            nSepIndex = [sPrice length] - nOpos;
        }
        [sRealPrice insertString:@"'" atIndex:nSepIndex];
    }
    
    return [NSString stringWithString:sRealPrice];
}
@end


