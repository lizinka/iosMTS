//
//  ChartViewController.h
//  TW_MTS_Eugene_IOS
//
//  Created by winway on 2015. 1. 14..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AKChart/AKChartView.h"
#import "AKDataLoader.h"
#import "Global.h"

@protocol ChartEventProtocol

-(void)RequireInsertData:(void*)reqData:(NSString*)sTrCode;

@end

@interface ChartViewController : UIViewController<AKDataFeeder>
{
    int FontSize;
    bool ShowNumericWnd;
    
    NSTimer* timer;
    NSTimer* timer2;
    AKDataLoader* loader1;
    AKDataLoader* loader2;
    NSMutableData* m_Reqdata;
    Global* global;
    bool m_bIsNextMode;
    id<ChartEventProtocol> chartEventIF;
    
    int TimerCnt;
    int m_nPeriod;
    bool m_IsReadyAutoData;
    char m_cDataKey;
    NSString* m_Setting;
}

@property (strong, nonatomic) IBOutlet AKChartView *akchart;
@property (nonatomic, strong) Global *global;
@property (nonatomic, assign) id<ChartEventProtocol> chartEventIF;

- (void) LoadData: (int)PriceID :(NSString*)strName;
- (NSString*) LoadSet: (NSString*)setName;
-(void)ReqData:(NSMutableData*)rdata:(int)nPeriod;
- (void) UpdateNextData:(NSMutableData*)data;
-(bool) getNextMode;
-(void)setReadyRealData:(bool)isReady;
-(bool)getReadyRealData;
-(void)UpdateChartRealData:(NSDictionary*)realData;
-(void) SetSettingValue:(NSString*) sSetting;
-(void)ChangeIndicatorSetting:(NSString*)sIndiData;

-(void) SetIndiPutbar:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiBollingerband:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiMA:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiDayBarance:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiEnvelop:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiMACD:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiStochFast:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiStochSlow:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiRSI:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiDMI:(NSDictionary*) sData:(int) nIndex;
-(void) SetIndiTRIX:(NSDictionary*) sData:(int) nIndex;


- (void)onTimer:(NSTimer *)timer;

@end
