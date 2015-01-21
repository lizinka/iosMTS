//
//  AKChartView.h
//  AKChart
//
//  Created by Alan Kim on 4/17/14.
//  Copyright (c) 2014 Alan Kim. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <GLKit/GLKit.h>

enum EAKPeriod
{
    EAK_PEROID_TICK	= 0,
    EAK_PEROID_SEC		= 1,
    EAK_PEROID_DAY		= 2,
    EAK_PEROID_WEEK 	= 3,
    EAK_PEROID_MONTH 	= 4,
    EAK_PEROID_YEAR		= 5,
};

enum EAKDataType
{
    EAK_DATA_CLOSE		= 0,
    EAK_DATA_OPEN		= 1,
    EAK_DATA_HIGH		= 2,
    EAK_DATA_LOW		= 3,
    EAK_DATA_VOLUME		= 4,
    EAK_DATA_AMOUNT		= 5,
    EAK_DATA_OI			= 6,
    EAK_DATA_GREEK		= 7,
};

enum EAKGraphType
{
    EAK_CANDLE_OHLC		= 0,
    EAK_CANDLE_HL		= 1,
    EAK_BAR_OHLC		= 2,
    EAK_BAR_HLC			= 3,
    EAK_BAR_HL			= 4,
    EAK_RISE_FALL		= 5,
    EAK_DOT_ON_CLOSE	= 6,
    EAK_LINE_ON_CLOSE	= 7,
    //....
};

enum EAKNumberSystem
{
    EAK_DECIMAL_0	= 0,
    EAK_DECIMAL_1	= 1,
    EAK_DECIMAL_2	= 2,
    EAK_DECIMAL_3	= 3,
    EAK_DECIMAL_4	= 4,
    EAK_DECIMAL_5	= 5,
    EAK_DECIMAL_6	= 6,
    EAK_DECIMAL_7	= 7,
    EAK_DECIMAL_8	= 8,
    
    EAK_FRACTION_2  = 9,
    EAK_FRACTION_4  = 10,
    EAK_FRACTION_8  = 11,
    EAK_FRACTION_16 = 12,
    EAK_FRACTION_32 = 13,
    EAK_FRACTION_64 = 14,
    EAK_FRACTION_128 = 15,
    EAK_FRACTION_256 = 16,
    EAK_FRACTION_32_H = 17,
    EAK_FRACTION_64_H = 18,
    EAK_FRACTION_32_Q = 19,
    
    EAK_DECIMAL_T	= 20, // thousand *1,000
    EAK_DECIMAL_M	= 21, // million  *1,000,000
    EAK_DECIMAL_B	= 22, // billion  *1,000,000,000
};


@interface AKChartView : UIView
{
    @private
    id _wrapper;
}

- (void) Init: (NSString*)Setting;


- (int)  PriceAdd: (NSString*)Code :(NSString*)Name :(int)Period :(int)PeriodCycle :(int)NumberSystem;
- (void) PriceModify: (int)PriceID :(NSString*)Code :(NSString*)Name :(int)Period :(int)PeriodCycle :(int)NumberSystem;

//---------------------------------------------------------------------------------------------
// Request add type interface
//---------------------------------------------------------------------------------------------
- (int)  PriceAppendData: (int)PriceID;
- (void) PriceUpdateData: (int)PriceID :(int)DataType :(float)Value;
- (void) PriceUpdateDateTime: (int)PriceID :(int)Date :(int)Time;
- (void) PriceUpdateEnd: (int)PriceID;

//---------------------------------------------------------------------------------------------
// Request insert type interface
//---------------------------------------------------------------------------------------------
- (void) PriceInsert: (int)PriceID :(int)InsertCount;
- (void) PriceUpdateData: (int)PriceID :(int)Index :(int)DataType :(float)Value;
- (void) PriceUpdateDateTime: (int)PriceID :(int)Index :(int)Date :(int)Time;

//---------------------------------------------------------------------------------------------
// Realtime data interface
//---------------------------------------------------------------------------------------------
- (void) PriceRealBegin: (int)PriceID;
- (void) PriceRealEnd: (int)PriceID;
- (void) PriceRealUpdateData: (int)PriceID : (int)DataType :(float)Value;
- (void) PriceRealUpdateDateTime: (int)PriceID :(int)Date :(int)Time;

//---------------------------------------------------------------------------------------------
// Setting interface
//---------------------------------------------------------------------------------------------
- (int)         GetPriceCount;
- (int)         GetIndicatorCount: (int) PriceID;
- (NSArray*)	GetIndicators;
- (int)         AddIndicator: (int) PriceID :(NSString*)Indicator;
- (int)         RemoveIndicator: (int) PriceID :(int)IndicatorID;
- (NSString*)   GetIndicatorName: (int)PriceID :(int)IndicatorID;
- (NSArray*) 	GetIndicatorParamNames: (NSString*)Indicator;
- (NSArray*) 	GetIndicatorParams: (int)PriceID :(int)IndicatorID;
- (void) 		SetIndicatorParams: (int)PriceID :(int)IndicatorID :(NSArray*)strParams;


- (void)        ShowTitle: (BOOL)bShow;
- (void)        ShowPriceName: (BOOL)bShow;
- (void)        ShowMinimap: (BOOL)bShow;
- (void)        ShowHighLow: (BOOL)bShow;
- (void)        ShowCurrentPriceLine: (int) PriceID :(BOOL)bShow;

- (void)        SetIndicatorDefault: (NSString*)Setting;


- (void) SetDataFeeder: (id)DataFeeder;

- (void) LoadSetting: (NSString*)strSetting;

- (void) SetFont: (int)FontSize :(NSString*)FontName;
- (void) SetFontSize: (int)FontSize;
- (int)  GetFontSize;
- (NSString*) GetFontName;

- (void) ShowNumericWnd: (BOOL)bShow;


- (void) test;

@end


@protocol AKDataFeeder
- (void) Request: (int)PriceID :(NSString*)Code :(int)Period :(int)PeriodCycle;
- (void) RequestInsert: (int)PriceID :(NSString*)Code :(int)Period :(int)PeriodCycle;
@end


