//
//  ChartViewController.m
//  TW_MTS_Eugene_IOS
//
//  Created by winway on 2015. 1. 14..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#import "ChartViewController.h"
@implementation ChartViewController

@synthesize akchart;

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    //[self.akchart Init:nil];
    
    /*
     NSString* strSet = [self LoadSet:@"snek_single"];
     [self.akchart Init:strSet];
     [self.akchart AddIndicator:0 :@"MA"];
     [self.akchart AddIndicator:0 :@"MA"];
     [self.akchart AddIndicator:0 :@"MA"];
     
     NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
     
     [Params setObject:@"12" atIndexedSubscript:0];
     [self.akchart SetIndicatorParams:0 :0 :Params];
     [Params setObject:@"24" atIndexedSubscript:0];
     [self.akchart SetIndicatorParams:0 :1 :Params];
     [Params setObject:@"60" atIndexedSubscript:0];
     [self.akchart SetIndicatorParams:0 :2 :Params];
     */
    
    NSString* strSet = [self LoadSet:@"snek_multi_b"];
    [self.akchart Init:strSet];
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    
    
    // for snek_multi_b ----------------------------------------
    [self.akchart AddIndicator:0 :@"MA"];
    [self.akchart AddIndicator:0 :@"MA"];
    [self.akchart AddIndicator:0 :@"MA"];
    [self.akchart AddIndicator:0 :@"매물대"];
    [self.akchart AddIndicator:0 :@"RSI"];
    [Params setObject:@"12" atIndexedSubscript:0];
    [self.akchart SetIndicatorParams:0 :0 :Params];
    [Params setObject:@"24" atIndexedSubscript:0];
    [self.akchart SetIndicatorParams:0 :1 :Params];
    [Params setObject:@"60" atIndexedSubscript:0];
    [self.akchart SetIndicatorParams:0 :2 :Params];
    
    [self.akchart AddIndicator:1 :@"일목균형표"];
    [self.akchart AddIndicator:1 :@"TRIX"];
    //-----------------------------------------------------------
    
    
    
    
    
    /*[self.akchart AddIndicator:0 :@"Envelope"];
     [self.akchart AddIndicator:0 :@"Volume"];*/
    
    /*[self.akchart AddIndicator:1 :@"MA"];
     [self.akchart AddIndicator:1 :@"MA"];
     [self.akchart AddIndicator:1 :@"MA"];
     [self.akchart AddIndicator:1 :@"일목균형표"];
     [self.akchart AddIndicator:1 :@"TRIX"];
     [Params setObject:@"12" atIndexedSubscript:0];
     [self.akchart SetIndicatorParams:1 :0 :Params];
     [Params setObject:@"24" atIndexedSubscript:0];
     [self.akchart SetIndicatorParams:1 :1 :Params];
     [Params setObject:@"60" atIndexedSubscript:0];
     [self.akchart SetIndicatorParams:1 :2 :Params];*/
    
    //[self.akchart AddIndicator:1 :@"BollingerBand"];
    
    
    
    [self.akchart SetDataFeeder:self];
    ShowNumericWnd = false;
    
    FontSize = 11;
    
    [self.akchart PriceModify:0 :@"000660" :@"SK하이닉스" : EAK_PEROID_DAY :1 :EAK_DECIMAL_0];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)willAnimateRotationToInterfaceOrientation:(UIInterfaceOrientation)toInterfaceOrientation duration:(NSTimeInterval)duration
{
    if( UIInterfaceOrientationIsPortrait(toInterfaceOrientation) )
    {
        
    }
    else
    {
        CGRect rt = CGRectMake(1, 1, self.view.bounds.size.width-2, self.view.bounds.size.height-2);
        
        //self.akchart.frame = self.view.bounds;
        self.akchart.frame = rt;
    }
}

- (NSString*) LoadSet: (NSString*)setName
{
    NSString *filePath = [[NSBundle mainBundle] pathForResource:setName ofType:@"set"];
    NSString *set = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
    return set;
}

- (void) LoadData: (int)PriceID :(NSString*)strName
{
    AKDataLoader* loader = [AKDataLoader alloc];
    loader.akchart = self.akchart;
    
    [loader Load:PriceID :strName];
    int nEnd = loader->CurrentStart;
    loader->CurrentStart -= 600;
    if( loader->CurrentStart < 0 )
        loader->CurrentStart = 0;
    int nStart = loader->CurrentStart;
    
    [loader Send:nStart :nEnd];
    
    if( PriceID == 0 )
        loader1 = loader;
    else
        loader2 = loader;
}

- (void) Request: (int)PriceID :(NSString*)Code :(int)Period :(int)PeriodCycle
{
    const char sPeriod[][8] = { "t", "s", "d", "w", "m" };
    NSString* str = [NSString stringWithFormat:@"%@_%s_%d", Code, sPeriod[Period], PeriodCycle];
    
    
    [self LoadData: PriceID :str];
}

- (void) RequestInsert: (int)PriceID :(NSString*)Code :(int)Period :(int)PeriodCycle
{
    /*int nEnd = nCurStart;
     nCurStart -= loader->nLen/(4*7)/10;
     [loader SendInsert:nCurStart : nEnd];*/
    
    timer = [NSTimer scheduledTimerWithTimeInterval:1.5 target:self selector:@selector(onTimer:) userInfo:nil repeats:false];
}


- (void)onTimer:(NSTimer *)timer
{
    //[loader SendOne];
    
    //[loader SendOne:TimerCnt];
    //TimerCnt++;
    
    [timer invalidate];
    
    int nEnd = loader1->CurrentStart;
    loader1->CurrentStart -= 100;
    if( loader1->CurrentStart < 0 )
        loader1->CurrentStart = 0;
    [loader1 SendInsert:loader1->CurrentStart : nEnd];
}

@end
