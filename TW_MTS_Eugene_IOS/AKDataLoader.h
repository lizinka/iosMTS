//
//  AKDataLoader.h
//  AKChartdemo
//
//  Created by Alan Kim on 5/5/14.
//  Copyright (c) 2014 Alan Kim. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AKChart/AKChartView.h"

@interface AKDataLoader : NSObject
{
    NSData *myData;
    
    @public
    int nLen;
    char* pPos;
    char* pPosEnd;
    int _PriceID;
    
    int DataCnt;
    int CurrentStart;
    
    float _c, _o, _h, _l, _v;
    int _d, _t;
}

@property (weak, nonatomic) AKChartView *akchart;

- (void) LoadAndSend: (int)PriceID :(NSString*)strName;
- (void) Load: (int)PriceID :(NSString*)strName;
- (void) SendHalf;
- (void) SendOne;
- (void) SendOne:(int)nIndex;
- (void) Send:(int)nStart :(int)nEnd;
- (void) SendInsert:(int)nStart :(int)nEnd;
@end
