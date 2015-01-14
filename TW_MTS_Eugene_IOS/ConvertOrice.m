//
//  ConvertOrice.m
//  TW_MTS_Eugene_IOS
//
//  Created by jay lee on 2015. 1. 14..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ConvertPrice.h"

@implementation ConvertPrice

- (double) GetFixToDouble : (NSString *) Str : (char) DisplayType
{
    int TailSize;
    double Exp1, Exp2;
    NSString* sformat;
    [self GetExpVal:DisplayType :&Exp1: &Exp2:&TailSize :sformat];
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
    i = 1; tmrk = 0;
    iPos = 1;
    while (i <= len)
    {
        
        if (([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @","]) || ((iPos == 1) && ([[Str substringWithRange:NSMakeRange(i, 1)] isEqualToString: @" "])))
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
    
    
    [Body initWithCapacity: iPos -1];
    Tail = [ NSMutableString stringWithString:Str];
    i++;
    iPos = 1;
    if (tmrk == 1)
        while (i <= len)
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
   
    [Tail initWithCapacity: iPos -1];
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
    return  dVal;

}
- (NSString*) GetDoubleToFix : (double) Value : (char) DisplayType
{
    int TailSize;
    double Exp1, Exp2;
    NSString *sformat;
    //GetExpVal(DisplayType, Exp1, Exp2, TailSize, sformat);
    [self GetExpVal:DisplayType :&Exp1 :&Exp2 :&TailSize :sformat];
  //   :(DisplayType, Exp1, Exp2, TailSize, sformat);
    return [self GetN2Fixed:Value :Exp1 :Exp2 :TailSize :sformat ];
    
}
- (NSString*) GetN2Fixed : (double) Value: (double) Exp1 : (double) Exp2 : (int) TailSize: (NSString*) sformat
{
   
    int iBody;
    double itail;
    NSString *stail ;

    

    if (![sformat isEqualToString: @""])
    {
        iBody = Value;
        itail = (Value - iBody) * Exp2;
        if (itail < 0)
        {
            itail = itail + 0.01;
            stail = [NSString stringWithFormat:sformat, iBody, @"'", itail * (-1)] ;
            return  [@"-"  stringByAppendingString: [NSString stringWithFormat:@"%.0d%@%@", iBody, @"'", stail] ];
        }
        else
        {
          itail = itail - 0.01;
          stail = [NSString stringWithFormat:sformat, iBody, @"'", itail ] ;
          return  [NSString stringWithFormat:@"%.0d%@%@", iBody, @"'", stail];
        }
    }
    else
    {
       // Result := format('%.'+ IntToStr(TailSize) +'f', [Value]);
        stail = [[@"%."  stringByAppendingString: [NSString stringWithFormat:@"%d",TailSize]] stringByAppendingString: @"f"];
        return  stail;
    }

    
}


- (void) GetExpVal : (char) DisplayType : (double*) exp1 : (double*)  exp2 : (int*) TailSize : (NSString*) sformat
{

   switch  (DisplayType)
   {
       case '1'://	 1/1		 999999999	*/
           *exp1 = 1.  ; *exp2 = 1.        ;
           *TailSize = 0; sformat = @"";
           break;
       case '2':		//* '2'	 1/10		99999999.9	*/
           *exp1 = 1.	; *exp2 = 10.		    ; *TailSize = 1; sformat = @"";
           break;
       case '3'	:
           *exp1 = 1.	; *exp2 = 100.	    ; *TailSize = 2; sformat = @"";
           break;
       case '4':	//* '4'	 1/1000	999999.999		*/
           *exp1 = 1.	; *exp2 = 1000.	    ; *TailSize = 3; sformat = @"";
           break;

       case '5':	//* '5'	 1/10000	99999.9999	*/
           *exp1 = 1.	; *exp2 = 10000.	  ; *TailSize = 4; sformat =  @"";
           break;

       case  '6'	://* '6'	 1/100000	9999.99999	*/
           *exp1 = 1.	; *exp2 = 100000.	  ; *TailSize = 5; sformat = @"";
           break;

       case '7'	://* '7'	 1/1000000	999.999999	*/
           *exp1 = 1.	; *exp2 = 1000000.	; *TailSize = 6; sformat = @"";
           break;

       case	'8'://* '8'	 1/10000000	99.9999999	*/
           *exp1 = 1.	; *exp2 = 10000000.	; *TailSize = 7; sformat = @"";
           break;

       case	'9'://* '9'	 1/100000000	9.99999999	*/
           *exp1 = 1.	; *exp2 = 100000000.; *TailSize = 8; sformat = @"";
           break;

       case		'A'://* 'A'	 1/2		99999999'9	*/
           *exp1 = 1.	; *exp2 = 2.		; *TailSize = 1;  sformat = @"0";
           break;

       case		'B'://* 'B'	 1/4		99999999'9	*/
           *exp1 = 1.	; *exp2 = 4.		; *TailSize = 1;  sformat = @"0";
           break;

       case		'C'://* 'C'	 1/8		99999999'9	*/
           *exp1 = 1.	; *exp2 = 8.		; *TailSize = 1;  sformat = @"0";
           break;

      case		'D'://* 'D'	 1/16		9999999'99	*/
           *exp1 = 1.	; *exp2 = 16.		; *TailSize = 2;  sformat = @"00";
           break;

       case		'E'://* 'E'	 1/32		9999999'99	*/
           *exp1 = 1.	; *exp2 = 32.		; *TailSize = 2;  sformat = @"00";
           break;
       case		'F'://* 'F'	 1/64		9999999'99	*/
           *exp1 = 1.	; *exp2 = 64.		; *TailSize = 2;  sformat = @"00";
           break;

       case		'G'://* 'G'	 1/128	999999'999		*/
           *exp1 = 1.	; *exp2 = 128.		; *TailSize = 3;  sformat = @"000";
           break;

       case		'H'://* 'H'	 1/256	999999'999		*/
           *exp1 = 1.	; *exp2 = 256.		; *TailSize = 3;  sformat = @"000";
           break;

       case		'I'://* 'I'	 0.5/32	999999'99.9		*/
           *exp1 = 0.5	; *exp2 = 32.		; *TailSize = 1;  sformat = @"00.0";
           break;

       case		'J'://* 'J'	 0.5/64	999999'99.9		*/
           *exp1 = 0.5	; *exp2 = 64.		; *TailSize = 1;  sformat  = @"00.0";
           break;

       case		'K'://* 'K'	 0.25/32	999999'99.99	*/
           *exp1 = 0.25	; *exp2 = 32.		; *TailSize = 2; sformat = @"00.0";
           break;

       default:
           *exp1 = 1; *exp2 = 1; *TailSize = 0 ; sformat = @"";
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
            [ResultData insertString:@"." atIndex:1];
            break;
        case '3'	://* '3'	 1/100	9999999.99		*/
            [ResultData insertString:@"." atIndex:2];
            break;
        case '4':	//* '4'	 1/1000	999999.999		*/
            [ResultData insertString:@"." atIndex:3];
            break;
            
        case '5':	//* '5'	 1/10000	99999.9999	*/
            [ResultData insertString:@"." atIndex:4];
            break;
            
        case '6'	://* '6'	 1/100000	9999.99999	*/
            [ResultData insertString:@"." atIndex:5];
            break;
            
        case '7'	://* '7'	 1/1000000	999.999999	*/
            [ResultData insertString:@"." atIndex:6];
            break;
            
        case '8'://* '8'	 1/10000000	99.9999999	*/
            [ResultData insertString:@"." atIndex:7];
            break;
            
        case '9'://* '9'	 1/100000000	9.99999999	*/
            [ResultData insertString:@"." atIndex:8];
            break;
            
        case		'A'://* 'A'	 1/2		99999999'9	*/
            [ResultData insertString:@"'" atIndex:1];
            break;
            
        case		'B'://* 'B'	 1/4		99999999'9	*/
            [ResultData insertString:@"'" atIndex:1];
            break;
            
        case		'C'://* 'C'	 1/8		99999999'9	*/
            [ResultData insertString:@"'" atIndex:1];
            break;
            
        case		'D'://* 'D'	 1/16		9999999'99	*/
            [ResultData insertString:@"'" atIndex:2];
            break;
            
        case		'E'://* 'E'	 1/32		9999999'99	*/
            [ResultData insertString:@"'" atIndex:2];
            break;
        case		'F'://* 'F'	 1/64		9999999'99	*/
            [ResultData insertString:@"'" atIndex:2];
            break;
            
        case		'G'://* 'G'	 1/128	999999'999		*/
            [ResultData insertString:@"'" atIndex:3];
            break;
            
        case		'H'://* 'H'	 1/256	999999'999		*/
            [ResultData insertString:@"'" atIndex:3];
            break;
            
        case		'I'://* 'I'	 0.5/32	999999'99.9		*/
            [ResultData insertString:@"." atIndex:1];
            [ResultData insertString:@"'" atIndex:4];
            break;
            
        case		'J'://* 'J'	 0.5/64	999999'99.9		*/
            [ResultData insertString:@"." atIndex:1];
            [ResultData insertString:@"'" atIndex:4];
            break;
            
        case		'K'://* 'K'	 0.25/32	999999'99.99	*/
            [ResultData insertString:@"." atIndex:1];
            [ResultData insertString:@"'" atIndex:4];
            break;
            
        default:
            break;
    }
    return ResultData;
    
}

@end

