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

@interface ChartViewController : UIViewController<AKDataFeeder>
{
    int FontSize;
    bool ShowNumericWnd;
    
    NSTimer* timer;
    NSTimer* timer2;
    AKDataLoader* loader1;
    AKDataLoader* loader2;
    
    int TimerCnt;
}

@property (strong, nonatomic) IBOutlet AKChartView *akchart;

- (void) LoadData: (int)PriceID :(NSString*)strName;

- (NSString*) LoadSet: (NSString*)setName;


- (void)onTimer:(NSTimer *)timer;

@end
