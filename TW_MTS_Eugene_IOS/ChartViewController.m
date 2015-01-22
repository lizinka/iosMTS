//
//  ChartViewController.m
//  TW_MTS_Eugene_IOS
//
//  Created by winway on 2015. 1. 14..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#import "ChartViewController.h"
#import "StructLayout.h"
@implementation ChartViewController

@synthesize akchart;
@synthesize global;

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
    global = [[Global alloc] initWithIF];
    m_IsReadyAutoData = FALSE;
    [AKChartView class];
    
    NSString* strSet = [self LoadSet:@"snek_multi_a"];
    [self.akchart Init:strSet];
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    
    [self.akchart SetDataFeeder:self];
    ShowNumericWnd = false;
    m_bIsNextMode = false;
    
    FontSize = 11;
    m_nPeriod = 0;
}

-(void) SetSettingValue:(NSString*) sSetting
{
    m_Setting = [[NSString alloc] initWithString:sSetting];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewWillDisappear:(BOOL)animated
{
    [self.akchart removeFromSuperview];
    [super viewWillDisappear:animated];
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

-(void)ReqData:(NSMutableData*)rdata : (int)nPeriod
{
    m_Reqdata = nil;
    m_Reqdata = [[NSMutableData alloc] initWithData:rdata];
    m_IsReadyAutoData = false;
    
    Xibg3002_OUT Xibg3002_out;

    char bdata[[rdata length]];
    [rdata getBytes:bdata length:[rdata length]];
    memset(&Xibg3002_out, 0x00, sizeof(Xibg3002_OUT));
    memcpy(&Xibg3002_out, &bdata[0], sizeof(Xibg3002_OUT));
    
    char cKey = Xibg3002_out.o_cDataKey[0];
    int nDiv = 0;
    
    if (cKey >= '1' && cKey <= '9') {
        nDiv = cKey - '1';
    }
    else if (cKey >= 'A' && cKey <= 'K')
    {
        nDiv = 9 + cKey - 'A';
    }
    
    NSString *sCode = [[NSString alloc] initWithBytes:&Xibg3002_out.o_code[0] length:sizeof(Xibg3002_out.o_code) encoding:0x80000000 + kCFStringEncodingDOSKorean];
    
    int nPeriodCycle = 1;
    if (nPeriod == EAK_PEROID_SEC) {
        nPeriodCycle = atoi(Xibg3002_out.o_nmin) * 60;
    }
    
    m_nPeriod = nPeriod;
    
    [self.akchart PriceModify:0 :sCode :@"" :nPeriod :nPeriodCycle :nDiv];
    
}

- (void) Request: (int)PriceID :(NSString*)Code :(int)Period :(int)PeriodCycle
{
    /*const char sPeriod[][8] = { "t", "s", "d", "w", "m" };
    NSString* str = [NSString stringWithFormat:@"%@_%s_%d", Code, sPeriod[Period], PeriodCycle];
    [self LoadData: PriceID :str]; */
    
    if (m_Reqdata == nil) {
        return;
    }
    
    char bdata[[m_Reqdata length]];
    [m_Reqdata getBytes:bdata length:[m_Reqdata length]];
    
    Xibg3002_OUT Xibg3002_out;
    memset(&Xibg3002_out, 0x00, sizeof(Xibg3002_OUT));
    memcpy(&Xibg3002_out, &bdata[0], sizeof(Xibg3002_OUT));
    
    int count = atoi(Xibg3002_out.o_nrec);
    int dsize = 0;
    
    NSString *r_tday, *r_time, *r_open, *r_high, *r_lowp, *r_last, *r_tvol;
    Xibg3002_OCCUR Xibg3002_occur;
    m_cDataKey = Xibg3002_out.o_cDataKey[0];
    
    for (int i = 0; i < count; i++)
    {
        [self.akchart PriceAppendData:PriceID];
        dsize = sizeof(Xibg3002_OUT) + (sizeof(Xibg3002_OCCUR) * i);
        memcpy(&Xibg3002_occur, &bdata[dsize], sizeof(Xibg3002_OCCUR));
        r_tday = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_tday[0] length:sizeof(Xibg3002_occur.r_tday) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        r_time = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_time[0] length:sizeof(Xibg3002_occur.r_time) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateDateTime:PriceID :[r_tday intValue] : [r_time intValue]];
        r_open = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_open[0] length:sizeof(Xibg3002_occur.r_open) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:PriceID :EAK_DATA_OPEN: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_open]] :m_cDataKey]];
        r_high = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_high[0] length:sizeof(Xibg3002_occur.r_high) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:PriceID :EAK_DATA_HIGH: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_high]] :m_cDataKey]];
        r_lowp = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_lowp[0] length:sizeof(Xibg3002_occur.r_lowp) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:PriceID :EAK_DATA_LOW: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_lowp]] :m_cDataKey]];
        r_last = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_last[0] length:sizeof(Xibg3002_occur.r_last) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:PriceID :EAK_DATA_CLOSE: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_last]] :m_cDataKey]];
        r_tvol = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_tvol[0] length:sizeof(Xibg3002_occur.r_tvol) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:PriceID :EAK_DATA_VOLUME: [r_tvol floatValue]];
    }
    
    [self.akchart PriceUpdateEnd:PriceID];
    
    m_IsReadyAutoData = TRUE;
}

-(void)setReadyRealData:(bool)isReady
{
    m_IsReadyAutoData = isReady;
}

-(bool)getReadyRealData
{
    return m_IsReadyAutoData;
}

-(void)UpdateChartRealData:(NSDictionary*)realData
{
    [self.akchart PriceRealBegin:0];
    int nDiv, nOpos;
    NSDictionary *detail = [[NSDictionary alloc] initWithDictionary:[realData objectForKey:@"commen"]];
    NSString* sTmp = [detail objectForKey:@"time"];
    NSString* sDate = [sTmp substringWithRange:NSMakeRange(0, 8)];
    NSString* sTime = [sTmp substringWithRange:NSMakeRange(9, 6)];
    
    nDiv = [[detail objectForKey:@"zdiv"] intValue];
    nOpos = [[detail objectForKey:@"cpos"] intValue];

    sTmp = [[detail objectForKey:@"LastPrice"] stringValue];
    float fTemp = [global GetFixToDouble:([global CalcRealSise:sTmp :nDiv :nOpos]) :m_cDataKey];
    [self.akchart PriceRealUpdateData:0 : EAK_DATA_CLOSE :fTemp];
    sTmp = [[detail objectForKey:@"OpenPrice"] stringValue];
    fTemp = [global GetFixToDouble:([global CalcRealSise:sTmp :nDiv :nOpos]) :m_cDataKey];
    [self.akchart PriceRealUpdateData:0 : EAK_DATA_OPEN :fTemp];
    sTmp = [[detail objectForKey:@"HighPrice" ] stringValue];
    fTemp = [global GetFixToDouble:([global CalcRealSise:sTmp :nDiv :nOpos]) :m_cDataKey];
    [self.akchart PriceRealUpdateData:0 : EAK_DATA_HIGH :fTemp];
    sTmp = [[detail objectForKey:@"LowPrice"] stringValue];
    fTemp = [global GetFixToDouble:([global CalcRealSise:sTmp :nDiv :nOpos]) :m_cDataKey];
    [self.akchart PriceRealUpdateData:0 : EAK_DATA_LOW :fTemp];
    fTemp = [[detail objectForKey:@"LastVolume"] floatValue];
    [self.akchart PriceRealUpdateData:0 : EAK_DATA_VOLUME :fTemp];
    
    [self.akchart PriceRealUpdateDateTime:0 :[sDate intValue] :[sTime intValue]];
    [self.akchart PriceRealEnd:0];
}

- (void) RequestInsert: (int)PriceID :(NSString*)Code :(int)Period :(int)PeriodCycle
{
    /*int nEnd = nCurStart;
     nCurStart -= loader->nLen/(4*7)/10;
     [loader SendInsert:nCurStart : nEnd];*/
    
    //timer = [NSTimer scheduledTimerWithTimeInterval:1.5 target:self selector:@selector(onTimer:) userInfo:nil repeats:false];
    //이미 넥스트모드로 시세 요청중이면 return;
    if (m_bIsNextMode) {
        return;
    }
    
    if (m_Reqdata == nil) {
        return;
    }
    
    Xibg3002_OUT Xibg3002_out;
    
    char bdata[[m_Reqdata length]];
    [m_Reqdata getBytes:bdata length:[m_Reqdata length]];
    memset(&Xibg3002_out, 0x00, sizeof(Xibg3002_OUT));
    memcpy(&Xibg3002_out, &bdata[0], sizeof(Xibg3002_OUT));
    
    if(Xibg3002_out.o_next != 'Y')
    {
        return;
    }
    
    Xibg3002_IN Xibg3002_in;
    memset(&Xibg3002_in, 0x00, sizeof(Xibg3002_in));
    memcpy(Xibg3002_in.code, Xibg3002_out.o_code, sizeof(Xibg3002_out.o_code));
    memcpy(Xibg3002_in.nmin, Xibg3002_out.o_nmin, sizeof(Xibg3002_out.o_nmin));
    memcpy(Xibg3002_in.dcnt, Xibg3002_out.o_nrec, sizeof(Xibg3002_out.o_nrec));
    memcpy(&Xibg3002_in.next, &Xibg3002_out.o_next, sizeof(Xibg3002_out.o_next));
    memcpy(Xibg3002_in.tkey, Xibg3002_out.o_tkey, sizeof(Xibg3002_out.o_tkey));
    
    NSString *sTrCode = @"m3001";
    if (m_nPeriod == 4) {
        sTrCode = @"m3005";
    }
    else if (m_nPeriod == 3) {
        sTrCode = @"m3004";
    }
    else if (m_nPeriod == 2) {
        sTrCode = @"m3003";
    }
    else if (m_nPeriod == 1) {
        sTrCode = @"m3002";
    }
    else if (m_nPeriod == 0) {
        sTrCode = @"m3001";
    }
    
    m_bIsNextMode = true;
    [self.chartEventIF RequireInsertData:(void*)&Xibg3002_in :sTrCode];
}

- (void) UpdateNextData:(NSMutableData*)data
{
    m_Reqdata = data;
    
    if (m_Reqdata == nil) {
        return;
    }
    
    char bdata[[m_Reqdata length]];
    [m_Reqdata getBytes:bdata length:[m_Reqdata length]];
    
    Xibg3002_OUT Xibg3002_out;
    memset(&Xibg3002_out, 0x00, sizeof(Xibg3002_OUT));
    memcpy(&Xibg3002_out, &bdata[0], sizeof(Xibg3002_OUT));
    
    int count = atoi(Xibg3002_out.o_nrec);
    int dsize = 0;
    
    NSString *r_tday, *r_time, *r_open, *r_high, *r_lowp, *r_last, *r_tvol;
    Xibg3002_OCCUR Xibg3002_occur;
    
    [self.akchart PriceInsert:0 :count];
    
    for (int i = 0; i < count; i++)
    {
        dsize = sizeof(Xibg3002_OUT) + (sizeof(Xibg3002_OCCUR) * i);
        memcpy(&Xibg3002_occur, &bdata[dsize], sizeof(Xibg3002_OCCUR));
        r_tday = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_tday[0] length:sizeof(Xibg3002_occur.r_tday) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        r_time = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_time[0] length:sizeof(Xibg3002_occur.r_time) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateDateTime:0:i:[r_tday intValue] : [r_time intValue]];
        r_open = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_open[0] length:sizeof(Xibg3002_occur.r_open) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:0:i:EAK_DATA_OPEN: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_open]] :m_cDataKey]];
        r_high = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_high[0] length:sizeof(Xibg3002_occur.r_high) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:0:i:EAK_DATA_HIGH: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_high]] :m_cDataKey]];
        r_lowp = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_lowp[0] length:sizeof(Xibg3002_occur.r_lowp) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:0:i:EAK_DATA_LOW: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_lowp]] :m_cDataKey]];
        r_last = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_last[0] length:sizeof(Xibg3002_occur.r_last) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:0:i:EAK_DATA_CLOSE: [global GetFixToDouble:[global GetFixData:m_cDataKey : [global trim:r_last]] :m_cDataKey]];
        r_tvol = [[NSString alloc] initWithBytes:&Xibg3002_occur.r_tvol[0] length:sizeof(Xibg3002_occur.r_tvol) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        [self.akchart PriceUpdateData:0:i:EAK_DATA_VOLUME: [r_tvol floatValue]];
    }
    
    [self.akchart PriceUpdateEnd:0];
    
    m_bIsNextMode = false;
}

-(bool) getNextMode
{
    return m_bIsNextMode;
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

-(void)ChangeIndicatorSetting:(NSDictionary*)sIndiData
{
    if (sIndiData == nil || [sIndiData count] <= 0)
    {
        return;
    }
    
    int nIndicatorCount = [self.akchart GetIndicatorCount:0];
    
    int nIndex = 0;
    for (nIndex = nIndicatorCount - 1; nIndex >= 0; nIndex--)
    {
        [self.akchart RemoveIndicator:0 :nIndex];
    }
    
    NSArray* sIndiNames = [self.akchart GetIndicators];
    NSString* sIndiName;
    
    NSDictionary* IndiObj = sIndiData;
    NSDictionary* ParamObj;
    int nIndiIndex = 0;
    for (nIndex = 0; nIndex < [sIndiNames count]; nIndex++)
    {
        sIndiName = [sIndiNames objectAtIndex:nIndex];
        if ([IndiObj objectForKey:sIndiName] == nil)
        {
            if ([sIndiName isEqualToString:@"StochasticSlow"])
            {
                sIndiName = @"Stochastic_Slow";
            }
            else if([sIndiName isEqualToString:@"StochasticFast"])
            {
                sIndiName = @"Stochastic_Fast";
            }
            else
            {
                continue;
            }
        }
        
        ParamObj = [IndiObj objectForKey:sIndiName];
        
        if (![[ParamObj objectForKey:@"check"] boolValue])
        {
            continue;
        }
        
        if (![sIndiName isEqualToString:@"MA"])
        {
            [self.akchart AddIndicator:0 :sIndiName];
        }
        
        if ([sIndiName isEqualToString:@"BollingerBand"])
        {
            [self SetIndiBollingerband:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"Envelope"])
        {
            [self SetIndiEnvelop:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"MACD"])
        {
            [self SetIndiMACD:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"Stochastic_Fast"])
        {
            [self SetIndiStochFast:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"Stochastic_Slow"])
        {
            [self SetIndiStochSlow:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"매물대"])
        {
            [self SetIndiPutbar:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"DMI"])
        {
            [self SetIndiDMI:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"TRIX"])
        {
            [self SetIndiTRIX:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"RSI"])
        {
            [self SetIndiRSI:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"일목균형표"])
        {
            [self SetIndiDayBarance:ParamObj :nIndiIndex];
        }
        else if ([sIndiName isEqualToString:@"MA"])
        {
            NSError *e = nil;
            NSArray *jsonArray = [ParamObj objectForKey:@"item"];
            
            if (!jsonArray)
            {
                NSLog(@"Error parsing JSON: %@", e);
            }
            else
            {
                for(NSDictionary *MaObj in jsonArray)
                {
                    [self.akchart AddIndicator:0 :sIndiName];
                    [self SetIndiMA:MaObj :nIndiIndex];
                    nIndiIndex++;
                }
            }
        }
        nIndiIndex++;
    }
}

-(void) SetIndiPutbar:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"value"]  atIndexedSubscript:0];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiBollingerband:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"term"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"multiplier"]  atIndexedSubscript:1];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiMA:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"value"]  atIndexedSubscript:0];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiDayBarance:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"transition"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"base"]  atIndexedSubscript:1];
    [Params setObject:[sData objectForKey:@"before_2"]  atIndexedSubscript:2];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiEnvelop:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"term"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"precent"]  atIndexedSubscript:1];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiMACD:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"short"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"long"]  atIndexedSubscript:1];
    [Params setObject:[sData objectForKey:@"signal"]  atIndexedSubscript:2];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiStochFast:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"term"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"d"]  atIndexedSubscript:1];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiStochSlow:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"trem"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"k"]  atIndexedSubscript:1];
    [Params setObject:[sData objectForKey:@"d"]  atIndexedSubscript:2];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiRSI:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"term"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"signal"]  atIndexedSubscript:1];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiDMI:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"term"]  atIndexedSubscript:0];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}

-(void) SetIndiTRIX:(NSDictionary*) sData:(int) nIndex
{
    if(sData == nil)
    {
        return;
    }
    
    NSMutableArray* Params = [[NSMutableArray alloc] initWithCapacity:1];
    [Params setObject:[sData objectForKey:@"trem"]  atIndexedSubscript:0];
    [Params setObject:[sData objectForKey:@"signal"]  atIndexedSubscript:1];
    [self.akchart SetIndicatorParams:0 :nIndex :Params];
}
@end
