//
//  WebBridgeViewController.m
//  TW_MTS_Eugene_IOS
//
//  Created by winway on 2015. 1. 8..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#import "WebBridgeViewController.h"

@implementation WebBridgeViewController
@synthesize webView;
@synthesize global;
@synthesize chartV;

- (void)viewDidLoad {
    [super viewDidLoad];
    [self networkCheck];
    
    self.view.autoresizesSubviews = YES;
    self.view.autoresizingMask = UIViewAutoresizingFlexibleHeight|UIViewAutoresizingFlexibleWidth;
    
    global = [[Global alloc] initWithIF];
    UserId = [[NSString alloc] init];
    Password = [[NSString alloc] init];
    LoginType = [[NSString alloc] init];
    m_sReqData = [[NSString alloc] init];
    trTransHashMap = [NSMutableDictionary dictionary];
    trDataMoreHashMap = [NSMutableDictionary dictionary];
    trTransHashMapReal = [NSMutableDictionary dictionary];
    [self LoadTrHashDatas:0];
    [self LoadTrHashDatas:1];
    [self LoadTrHashDatas:2];
    
    for (int i = 0; i < 10; i++) {
        recvd[i]=[[NSMutableData alloc] init];
    }
    
    NSURL *url = [NSURL URLWithString:@"http://codetest.coforward.com/web_mts/prototype/index.html"];
    //NSURL *url = [NSURL URLWithString:@"http://m.naver.com"];
    //NSString *indexFilePath = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:@"www"];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    //NSURL *indexUrl = [NSURL fileURLWithPath:indexFilePath];
    //NSURLRequest *request = [NSURLRequest requestWithURL:indexUrl];
    [webView loadRequest:request];
    //[webView setScalesPageToFit:YES];
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
{
    NSLog(@"Error : %@",error);
}

-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSString *requestURL = [[request URL] absoluteString];
    NSString *decoded = [requestURL stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSLog(@"decoded string :\n%@", decoded);
    if([decoded hasPrefix:@"jscall:"]){
        NSArray *components = [decoded componentsSeparatedByString:@"//"];
        NSString *functionName = [NSString stringWithFormat:@"%@:", [components objectAtIndex:1]];
        NSString *functionArg = [components objectAtIndex:2];
        //NSString *functionTot = [NSString stringWithFormat:@"%@:%@", functionName, functionInja];
        
        [self performSelector:NSSelectorFromString(functionName) withObject:functionArg];
        return NO;
    }
    
    return YES;
}

-(void)setMessage:(NSString *)arg
{
    NSError* error;
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:[arg dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:&error];
    
    if (json == nil) {
        return;
    }
    
    if (error) {
        NSLog(@"error : %@", error.localizedDescription);
        return;
    }
    
    NSString *sTrCodeKey = [json objectForKey:@"pageId"];
    NSString *sTrType = [json objectForKey:@"type"];
    NSString *sTrCode;
    if ([sTrType isEqualToString:@"real"]) {
        //if(m_bIsChartShow)
        //{
        //    [self ChartDestroy];
        //}
        
        sTrCode = @"m9001";
    }
    else if([sTrType isEqualToString:@"more"])
    {
        sTrCode = [trDataMoreHashMap objectForKey:sTrCodeKey];
    }
    else
    {
        if ([sTrCodeKey isEqualToString:@"#ITEM_CHART"])
        {
            if ([sTrType isEqualToString:@"chart"])
            {
                BOOL bIsRedraw = [[json objectForKey:@"newDraw"] boolValue];
                if (!bIsRedraw) {
                    if (chartV != nil && m_bIsChartShow)
                    {
                        //차트 세팅변경 구현.
                        NSDictionary* setObj = [json objectForKey:@"chartSetting"];
                        if([setObj count] > 0)
                        {
                            chartV.view.hidden = NO;
                            chartV.view.frame = CGRectMake(0, 110, 320, 480);
                            [chartV ChangeIndicatorSetting:setObj];
                        }
                    }
                    return;
                }
                
                m_nChartHeight  = [[json objectForKey:@"chartHight"] intValue];
                //sHight = [global trim:sHight];
                //m_nChartHeight = sHight.intValue;
                //차트 시세 요청
                Xibg3002_IN Xibg3002_in;
                NSData *data;
                NSUInteger lengthOfBinary;
                void *binary;
                
                NSString *sTmp = [json objectForKey:@"serverCode"];
                memset(&Xibg3002_in, 0x00, sizeof(Xibg3002_in));
                if (sTmp != nil)
                {
                    data = [sTmp dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                    lengthOfBinary = [data length];
                    binary = (void *)[data bytes]; //void => char ?
                    memcpy(&Xibg3002_in.code, binary, lengthOfBinary);
                }
                
                NSString *sTmp2 = [json objectForKey:@"chartValue"];
                if (sTmp2 != nil)
                {
                    data = [sTmp2 dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                    lengthOfBinary = [data length];
                    binary = (void *)[data bytes]; //void => char ?
                    memcpy(&Xibg3002_in.nmin, binary, lengthOfBinary);
                }
                
                NSString *sTmp3 = @"200";
                data = [sTmp3 dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                lengthOfBinary = [data length];
                binary = (void *)[data bytes]; //void => char ?
                memcpy(&Xibg3002_in.dcnt, binary, lengthOfBinary);
                
                Xibg3002_in.next = 'n';
                
                //m_sReqData = [NSString stringWithFormat:@"%s", (char*)&Xibg3002_in];
                
                //m_sReqData = [[NSString alloc] initWithBytes:(char*)&Xibg3002_in length:sizeof(Xibg3002_in) encoding:];
                
                m_sReqData = [[NSString alloc] initWithBytes:&Xibg3002_in length:sizeof(Xibg3002_in) encoding:0x80000000 + kCFStringEncodingDOSKorean];
                
                sTrCode = [json objectForKey:@"chartType"];
                if ([sTrCode isEqualToString:@"month"]) {
                    sTrCode = @"m3005";
                }
                else if ([sTrCode isEqualToString:@"week"]) {
                    sTrCode = @"m3004";
                }
                else if ([sTrCode isEqualToString:@"day"]) {
                    sTrCode = @"m3003";
                }
                else if ([sTrCode isEqualToString:@"min"]) {
                    sTrCode = @"m3002";
                }
                else if ([sTrCode isEqualToString:@"tic"]) {
                    sTrCode = @"m3001";
                }
                
                if (!m_bIsChartShow) {
                    [self ChartShow];
                }
                
                NSDictionary* setObj = [json objectForKey:@"chartSetting"];
                
                if([setObj count] > 0)
                {
                    [chartV ChangeIndicatorSetting:setObj];
                }
                m_bIsChartShow = true;
                [self Request:5 gtr:@"mobile" tr:sTrCode];
                return;
            }
            else
            {
                sTrCode = [trTransHashMap objectForKey:sTrCodeKey];
                sTrCode = [global trim:sTrCode];
            }
        }
        else if([sTrCodeKey isEqualToString:@"#LOGIN"])
        {
            m_sReqData = arg;
            [self Request:4 gtr:@"mibo1000" tr:@"mibo1030"];
            return;
        }
        else
        {
            if([trTransHashMap objectForKey:sTrCodeKey] == nil)
            {
                if ([sTrCodeKey isEqualToString:@"#CHART_CLOSE"]) {
                    if (m_bIsChartShow)
                    {
                        NSString* sType = [json objectForKey:@"type"];
                        if ([sType isEqualToString:@"hide"])
                        {
                            chartV.view.hidden = YES;
                            chartV.view.frame = CGRectMake(0, 0, 0, 0);
                        }
                        else
                        {
                            [self ChartDestroy];
                        }
                    }
                    
                    return;
                }
            }
            else
            {
                sTrCode = [trTransHashMap objectForKey:sTrCodeKey];
            }
        }
    }
    
    m_sReqData = arg;
    
    if (m_bIsChartShow)
    {
        [self ChartDestroy];
    }
    
    [self Request:5 gtr:@"mobile" tr:sTrCode];
}

-(void)closeApp:(NSString*)arg
{
    exit(1);
}

-(void)ReqLogin:(NSString*) arg
{
    m_sLoginInfo = arg;
    NSError* error;
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:[arg dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:&error];
    
    if (json == nil) {
        return;
    }
    
    if (error) {
        NSLog(@"error : %@", error.localizedDescription);
        return;
    }
    
    NSString *sType = [json objectForKey:@"type"];
    
    if ([sType isEqualToString:@"login"]) {
        conn = [[SocketConnector alloc] initWithIF:self];
        if (conn == nil) {
            return;
        }
        
        UserId = [json objectForKey:@"id"];
        Password = [json objectForKey:@"pass"];
        LoginType = [json objectForKey:@"loginType"];
        
        //UserId = @"opercut";
        //Password = @"pohaha28";
        
        UserId = @"bbangms";
        Password = @"m1475s";
        [conn Connect:@"61.78.34.111" port:33101];
    }
}

-(void) ReqRealCancel:(NSString*)arg
{
    [self Request:5 gtr:@"mobile" tr:@"m9999"];
}

- (int) OnConnected {
    
    NSLog(@"Connected...");
    //로그인 절차밟기
    [NSTimer scheduledTimerWithTimeInterval:0 target:self selector:@selector(RequestStart) userInfo:nil repeats:NO];
    //[self Request:1 gtr:@"gfxlogon" tr:@"usrlogon"];
    return 0;
}

- (void)RequestStart {
    [self Request:1 gtr:@"wfxlogon" tr:@"usrlogon"];
}

- (void) Request:(int)gubun gtr : (NSString*)gtrcode tr : (NSString*)trcode {
    Querydata querydata;
    Xo015101_IN xo015101_IN;
    int icertflag = 0;
    int icertoutflag = 0;
    int iusetrheader = 0;
    NSData *data;
    NSUInteger lengthOfBinary;
    void *binary;
    NSString *sendData;
    NSString *userid;
    
    iusetrheader = 0;
    @try {
        switch (gubun) {
            case 1:
            {
                memset(&loginIN, 0x00, sizeof(LoginIN));
                
                userid = UserId;
                data = [userid dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                lengthOfBinary = [data length];
                binary = (void *)[data bytes]; //void => char ?
                memcpy(&loginIN.usid, binary, lengthOfBinary);
                
                NSString *userpswd = Password;
                data = [userpswd dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                lengthOfBinary = [data length];
                binary = (void *)[data bytes]; //void => char ?
                memcpy(&loginIN.pswd, binary, lengthOfBinary);
                
                
                NSString *optnoptn  = LoginType;
                data = [optnoptn dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                lengthOfBinary = [data length];
                binary = (void *)[data bytes]; //void => char ?
                memcpy(&loginIN.optn, binary, lengthOfBinary);
                
                NSString *stypestype  = @"5";
                data = [stypestype dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                lengthOfBinary = [data length];
                binary = (void *)[data bytes]; //void => char ?
                memcpy(&loginIN.stype, binary, lengthOfBinary);
                
                // loginIN.stype = '5';
                
                NSString *ipadipad  = [global getLocalIPAddress];
                data = [ipadipad dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                lengthOfBinary = [data length];
                binary = (void *)[data bytes]; //void => char ?
                memcpy(&loginIN.ipad, binary, lengthOfBinary);
                
                
                //loginIN->ipad = ;
                sendData = [[NSString alloc] initWithBytes:&loginIN length:sizeof(loginIN) encoding:0x80000000 + kCFStringEncodingDOSKorean];
                //	    NSLog(@"%@", sendData);
                //icertflag = 1;
                //icertoutflag = 1;
            }
                break;
            case 2:
            {
                iusetrheader = 1;
                
                memset(&xo015101_IN, 0x00, sizeof(xo015101_IN));
                
                userid = UserId;
                data = [userid dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];
                lengthOfBinary = [data length];
                binary = (void *)[data bytes]; //void => char ?
                memcpy(&xo015101_IN.usid, binary, lengthOfBinary);
                
                sendData = [[NSString alloc] initWithBytes:&xo015101_IN length:sizeof(xo015101_IN) encoding:0x80000000 + kCFStringEncodingDOSKorean];
            }
                break;
            case 3:
            {
                [self sendHBeatCheck];
            }
                return;
            case 4:
            {
                iusetrheader = 1;
                char sID[8];
                memset(sID, 0x00, 8);
                sendData = [[NSString alloc] initWithBytes:sID length:8 encoding:0x80000000 + kCFStringEncodingDOSKorean];
            }
            case 5:
            {
                data = [m_sReqData dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
                sendData = [[NSString alloc] initWithBytes:[data bytes] length:[data length] encoding:0x80000000 + kCFStringEncodingDOSKorean];
                break;
            }

            default:
                break;
        }
        
        
        memset(&querydata, 0x00, sizeof(Querydata));
        querydata.xywin = 0x01;

        if ([trcode hasPrefix:@"m3005"] || [trcode hasPrefix:@"m3004"] || [trcode hasPrefix:@"m3003"] || [trcode hasPrefix:@"m3002"] || [trcode hasPrefix:@"m3001"])
        {
            querydata.xywin = 0x02;
        }
        querydata.certflag = icertflag;
        querydata.certoutflag = icertoutflag;
        querydata.usetrheader = iusetrheader;
        querydata.dlen = [sendData length];
        
        data = [gtrcode dataUsingEncoding:NSUTF8StringEncoding];
        lengthOfBinary = [data length];
        binary = (void *)[data bytes]; //void => char ?
        memcpy(&querydata.trgroup, binary, lengthOfBinary);
        
        data = [trcode dataUsingEncoding:NSUTF8StringEncoding];
        lengthOfBinary = [data length];
        binary = (void *)[data bytes]; //void => char ?
        memcpy(&querydata.trcode, binary, lengthOfBinary);
        
        //NSString *SendQuerydata = [[NSString alloc] initWithBytes:&querydata length:sizeof(querydata) encoding: 0x80000000 + kCFStringEncodingDOSKorean];
        //totSenddata = [NSString stringWithFormat:@"%@%@", totSenddata, sendData];
        
        [self setSendData:sendData gStruc:&querydata];
    }
    @catch (NSException *ex) {
        NSString *name = [ex name];
        NSLog(@"Name: %@\n", name);
        NSLog(@"Reason: %@\n", [ex reason]);
        /*
         if ([name isEqualToString:NSRangeException])
         NSLog(@"Exception was caugth successfully.\n");
         else 
         [ex raise];
         */
    }
}

- (void)setSendData:(NSString *)msg gStruc:(Querydata *)queryStruc {
    Commheader commheader;
    TrCommheader trCommheader;
    TrLedgeheader trLedgeheader;
    
    @try {
        switch (queryStruc->certflag) {
            case 0:
                break;
            case 3:
                break;
            case 1:      //xecure
                break;
            case 2:      //공인인증 + xecure
                break;
            default:
                break;
        }
        
        memset(&commheader, 0x00, sizeof(Commheader));
        int totsize;
        if (queryStruc->usetrheader == 0)
            totsize = htonl(sizeof(TrCommheader) + msg.length);
        else
            totsize = htonl(sizeof(TrCommheader) + sizeof(TrLedgeheader) + msg.length);
        
        //NSLog(@"%d", htonl(commheader.msgl));
        commheader.func = '1';
        NSString *sTrCode = [[NSString alloc] initWithBytes:queryStruc->trcode length:sizeof(queryStruc->trcode) encoding: 0x80000000 + kCFStringEncodingEUC_KR];
        sTrCode = [global trim:sTrCode];
        if ([sTrCode isEqualToString:@"m9999"]) {
            commheader.func = '5';
        }
        commheader.wmid = queryStruc->xywin;
        
        memset(&trCommheader, 0x20, sizeof(TrCommheader));
        memcpy(&trCommheader.svcp, queryStruc->trgroup, sizeof(trCommheader.svcp));
        memcpy(&trCommheader.svcc, queryStruc->trcode, sizeof(trCommheader.svcc));
        switch (queryStruc->certflag) {
            case 0:
                trCommheader.msgk = MSGK_NPM;
                if (queryStruc->certoutflag == 1) {
                    trCommheader.actf = ACTF_ENO;
                }
                break;
            case 1:
                if (queryStruc->certoutflag == 0) {
                    trCommheader.actf = ACTF_ENI;
                }
                else {
                    trCommheader.actf = ACTF_EIO;
                }
                break;
            case 2:
                trCommheader.msgk = MSGK_PCA;
                trCommheader.chkf = CHKF_KEY;
                if (queryStruc->certoutflag == 0) {
                    trCommheader.actf = ACTF_ENI;
                }
                else {
                    trCommheader.actf = ACTF_EIO;
                }
                break;
            case 3:
                trCommheader.msgk = MSGK_KEY;
                break;
        }
        
        NSString *commheaderData = [[NSString alloc] initWithBytes:&commheader length:sizeof(commheader) encoding: 0x80000000 + kCFStringEncodingEUC_KR];
        NSString *trCommheaderData = [[NSString alloc] initWithBytes:&trCommheader length:sizeof(trCommheader) encoding: 0x80000000 + kCFStringEncodingEUC_KR];
        
        NSString *totSenddata;
        if (queryStruc->usetrheader == 0)
            totSenddata = [NSString stringWithFormat:@"%@%@%@", commheaderData, trCommheaderData, msg];
        else {
            memset(&trLedgeheader, 0x00, sizeof(TrLedgeheader));
            trLedgeheader.wktp = '1';
            memcpy(trLedgeheader.scrn, loginOUT.scrn, sizeof(loginOUT.scrn));
            memcpy(trLedgeheader.usid, loginOUT.usid, sizeof(loginOUT.usid));
            trLedgeheader.utyp = loginIN.stype;
            memcpy(trLedgeheader.brok, loginOUT.brco, sizeof(loginOUT.brco));
            memcpy(trLedgeheader.clnt, loginOUT.clno, sizeof(loginOUT.clno));
            trLedgeheader.aunt = loginOUT.acut;
            memcpy(trLedgeheader.orgn, loginOUT.orco, sizeof(loginOUT.orco));
            trLedgeheader.yhpf = '0';
            NSString *strip = [global getLocalIPAddress];
            char *ipaddr = (char *)[strip cStringUsingEncoding:0x80000000 + kCFStringEncodingEUC_KR];
            memcpy(trLedgeheader.ipad, ipaddr, strip.length);
            memcpy(trLedgeheader.loip, ipaddr, strip.length);
            trLedgeheader.tlog = '1';
            
            NSString *trLedgeheaderData = [[NSString alloc] initWithBytes:&trLedgeheader length:sizeof(trLedgeheader) encoding: 0x80000000 + kCFStringEncodingEUC_KR];
            
            totSenddata = [NSString stringWithFormat:@"%@%@%@%@", commheaderData, trCommheaderData, trLedgeheaderData, msg];
        }
        //NSLog(@"%@", totSenddata);
        [conn Send: totsize sendmsg : totSenddata];
    }
    @catch (NSException *ex) {
        NSString *name = [ex name];
        NSLog(@"Name: %@\n", name);
        NSLog(@"Reason: %@\n", [ex reason]);
    }	
}

- (void)settimerHBeat {
    [timerHBeat invalidate];
    
    //if (gHBeatcount == 3) {
    //	[conn Disconnect];
    //		return;
    //	}
    
    [self Request:3 gtr:@"heartbeat" tr:@"heartbeat"];
    //	gHBeatcount++;
    
    timerHBeat = [NSTimer scheduledTimerWithTimeInterval:30 target:self selector:@selector(settimerHBeat) userInfo:nil repeats:YES];
}

- (void)sendHBeatCheck {
    Commheader commheader;
    
    @try {
        memset(&commheader, 0x00, sizeof(Commheader));
        //commheader.msgl = htonl(0);
        commheader.func = ZF_POL;
        
        NSString *commheaderData = [[NSString alloc] initWithBytes:&commheader length:sizeof(commheader) encoding: 0x80000000 + kCFStringEncodingDOSKorean];
        
        [conn Send:0 sendmsg : commheaderData];
    }
    @catch (NSException *ex) {
        NSString *name = [ex name];
        NSLog(@"Name: %@\n", name);
        NSLog(@"Reason: %@\n", [ex reason]);
    }	
}

- (int) OnReceive:(NSData *)msg {
    Commheader commheader;
    TrCommheader trCommheader;
    RealCommheader realCommheader;
    int msglen = msg.length;
    BOOL isSearch = FALSE;
    
    char *binary = (char *)[msg bytes];
    
    @try {
        
        memcpy(&commheader, &binary[0], sizeof(Commheader));
        NSMutableData *originData = [[NSMutableData alloc] init];
        [originData appendBytes:&binary[sizeof(Commheader)] length:msglen - (sizeof(Commheader))];
        
        if (commheader.msgf == ZM_ZIP) {
            //압축풀기
            NSData *compressedData;
            compressedData =[self gzipDecompress:[NSData dataWithData :originData]];
            msglen = sizeof(Commheader) + compressedData.length;
            
            binary = (char *)[compressedData bytes];
        }
        else if (commheader.func == ZF_POL) {
            //폴링 사용할 지 여부 체크
            gHBeatcount = 0;
            return 0;
        }
        else {
            binary = (char *)[originData bytes];
        }
        
        if (commheader.msgf == ZM_ER1) {
            //에러 메세지 처리
            NSString *rmsg = [[NSString alloc] initWithBytes:&binary[0] length:80 encoding:0x80000000 + kCFStringEncodingDOSKorean];
            
            UIAlertView *alert = [[UIAlertView alloc]
                                  initWithTitle:@"ERROR"
                                  message:rmsg
                                  delegate:nil
                                  cancelButtonTitle:@"확인"
                                  otherButtonTitles:nil];
            [alert show];
            return 0;
        }
        else if (commheader.func == ZF_UNS) {
            //긴급메세지 또는 체결데이타 등등
            BroadHeader broadHeader;
            NSMutableData *recvBroaddata;
            memcpy(&broadHeader, &binary[0], sizeof(BroadHeader));
            //char tmpchar[4];
            //memcpy(&tmpchar, &broadHeader.mlen[0], sizeof(broadHeader.mlen));
            //int datasize = atoi(tmpchar);
            NSString *strsize = [[NSString alloc] initWithBytes:&broadHeader.mlen[0] length:sizeof(broadHeader.mlen) encoding:0x80000000 + kCFStringEncodingDOSKorean];
            int datasize = [strsize intValue];
            switch (broadHeader.mtyp) {
                case 0x01:  //Emergency
                    
                    break;
                case 0x02:  //Order, Pos, Balance notice
                    switch (broadHeader.styp) {
                        case 'S':   //News
                            break;
                        case 'T':   //ServerTime
                            break;
                        default:    //Order
//                            recvBroaddata =[[NSMutableData alloc] init];
//                            [recvBroaddata initWithBytes:&binary[sizeof(BroadHeader)] length: datasize];
//                            if (self.gejaScreen.view.subviews != nil) {
//                                [self.gejaScreen BroadOrderData: recvBroaddata gubun : &broadHeader.styp];
//                            }
//                            [recvBroaddata release];
                            break;
                    }
                    
                    break;
                default:
                    break;
            }
            
            return 0;
        }
        else if (commheader.func == ZF_CLS) {
            //Close Screen
            return 0;
        }
        else if ((commheader.func == ZF_RTU) || (commheader.func == ZF_SYM)) {
            //리얼 시세
            //RealQuote realQuote;
            int datasize = 0;
            int ilen = msglen - sizeof(Commheader);
            //originData는 전체데이터에서 Commheader를뺀 데이터
            NSMutableData* recvRealData = originData;
            
            while (TRUE)
            {
                NSData* tmpData = [recvRealData subdataWithRange:NSMakeRange(0, sizeof(RealCommheader))];
                [recvRealData replaceBytesInRange:NSMakeRange(0, sizeof(RealCommheader)) withBytes:NULL length:0];
                
                //여러개의 실시간 시세를 하나씩 잘라서 처리한다.
                //mlen은 하나의 실시간 시세 길이다.
                memcpy(&realCommheader, [tmpData bytes], sizeof(RealCommheader));
                char tmpLen[3];
                memcpy(tmpLen, realCommheader.mlen, sizeof(realCommheader.mlen));
                
                tmpData = [recvRealData subdataWithRange:NSMakeRange(0, atoi(tmpLen))];
                [recvRealData replaceBytesInRange:NSMakeRange(0, atoi(tmpLen)) withBytes:NULL length:0];
                [self ReceiveRealData:tmpData];
                
                if ([recvRealData length] <= 0)
                    break;
            }
            
            return 0;
        }
        
        int idx;
        for (idx = 0; idx < 10; idx++) {
            if (commheader.wmid == rwmid[idx]) {
                isSearch = TRUE;
                break;
            }
        }
        
        if (!isSearch) {
            for (idx = 0; idx < 10; idx++) {
                if (rwmid[idx] == 0x00) {
                    rwmid[idx] = commheader.wmid;
                    break;
                }
            }
            
        }
        
        memcpy(&trCommheader,  &binary[0], sizeof(TrCommheader));
        
        [recvd[idx] appendBytes:&binary[sizeof(TrCommheader)] length: msglen - (sizeof(Commheader) + sizeof(TrCommheader))];
        
        NSMutableData *recvData;
        recvData=[[NSMutableData alloc] init];
        
        if (trCommheader.chkf == CHKF_CON) {
            return 0;
        }
        else {
            [recvData appendData:recvd[idx]];
            
            rwmid[idx] = 0x00;
            [recvd[idx] setLength:0];
        }
        
        if (trCommheader.msgk == MSGK_KEY) {
            //암호화 keyFinal
            return 0;
        }
        else if (commheader.func == ZF_MSG) {
            
            gHBeatcount = 0;
            
            //if (commheader.wmid == 0x01) {        //Login or acctlist
            NSString *strcode = [[NSString alloc] initWithBytes:trCommheader.svcc length:sizeof(trCommheader.svcc) encoding:0x80000000 + kCFStringEncodingDOSKorean ];
            char *bdata = (char *)[recvData bytes];
            if ([strcode hasPrefix:@"usrlogon"])
            {
                
                //memcpy(&loginOUT, &bdata[sizeof(CommOutheader) + sizeof(TrCommheader)], sizeof(LoginOUT)); //header 추가된 상황
                memcpy(&loginOUT, &bdata[0], sizeof(LoginOUT));
                
                
                //calf = 1; 조건에 따라서 공인인증 안하고 넘어가기(hts인경우)
                
                if (loginOUT.sign == 3)
                {  //로그인 실패시
                    NSString *rmsg = [[NSString alloc] initWithBytes:&loginOUT.rmsg[0] length:sizeof(loginOUT.rmsg) encoding:0x80000000 + kCFStringEncodingDOSKorean];
                    
                    NSError* error;
                    NSMutableDictionary* json = [NSJSONSerialization JSONObjectWithData:[m_sLoginInfo dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:&error];
                    if (json == nil) {
                        return -1;
                    }
                    if (error) {
                        NSLog(@"error : %@", error.localizedDescription);
                        return -1;
                    }
                    if (!m_bisReconnMode)
                    {
                       [json removeObjectForKey:@"id"];
                       [json removeObjectForKey:@"pass"];
                       [json setObject:@"false" forKey:@"state"];
                       [json setObject:@"" forKey:@"tel"];
                       [json setObject:rmsg forKey:@"msg"];
                    

                       NSData* kData = [NSJSONSerialization dataWithJSONObject:json options:NSJSONWritingPrettyPrinted error:nil];
                    
                       NSString* kJson = [[NSString alloc] initWithData:kData encoding:NSUTF8StringEncoding];
                    
                       [self csendWData:kJson];
                    }
                    
                }
                else
                {
                    timerHBeat = [NSTimer scheduledTimerWithTimeInterval:30 target:self selector:@selector(settimerHBeat) userInfo:nil repeats:YES];
                    
                    NSError* error;
                    NSDictionary* jsonOrigin = [NSJSONSerialization JSONObjectWithData:[m_sLoginInfo dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:&error];
                    
                    NSMutableDictionary *json = [jsonOrigin mutableCopy];
                    if (json == nil) {
                        return -1;
                    }
                    if (error) {
                        NSLog(@"error : %@", error.localizedDescription);
                        return -1;
                    }
                    
                    NSString *sTel = [[NSString alloc] initWithBytes:&loginOUT.orco[0] length:sizeof(loginOUT.orco) encoding:0x80000000 + kCFStringEncodingDOSKorean];
                    if (!m_bisReconnMode) {
                       [json removeObjectForKey:@"id"];
                       [json removeObjectForKey:@"pass"];
                       [json setObject:@"true" forKey:@"state"];
                       [json setObject:sTel forKey:@"tel"];
                       [json setObject:@"" forKey:@"msg"];
                    
    
                       jsonOrigin = [json copy];
                       NSData* kData = [NSJSONSerialization dataWithJSONObject:jsonOrigin options:NSJSONWritingPrettyPrinted error:nil];
                       NSString* kJson = [[NSString alloc] initWithData:kData encoding:NSUTF8StringEncoding];
                    
                       [self csendWData:kJson];
                    }
                    
                    if (m_bisReconnMode)
                    {
                        m_bisReconnMode = false;
                    }
                    
                }
            }
            else
            {
                if([strcode hasPrefix:@"mibo1030"])
                {
                    [recvData replaceBytesInRange:NSMakeRange(0, sizeof(TrLedgeheader)) withBytes:NULL length:0];
//                    [recvData resetBytesInRange:NSMakeRange(0, sizeof(TrLedgeheader))];
                }
                
                if ([strcode hasPrefix:@"m3005"] || [strcode hasPrefix:@"m3004"] || [strcode hasPrefix:@"m3003"] || [strcode hasPrefix:@"m3002"] || [strcode hasPrefix:@"m3001"])
                {
                    //차트데이터 처리.
                    NSString* sData = [[NSString alloc] initWithData:recvData encoding:NSUTF8StringEncoding];
                    char pData[[recvData length]];
                    [recvData getBytes:pData length:[recvData length]];
                    
                    int nPeriod = 0;
                    if ([strcode hasPrefix:@"m3005"]) {
                        nPeriod = 4;
                    }
                    else if ([strcode hasPrefix:@"m3004"]) {
                        nPeriod = 3;
                    }
                    else if ([strcode hasPrefix:@"m3003"]) {
                        nPeriod = 2;
                    }
                    else if ([strcode hasPrefix:@"m3002"]) {
                        nPeriod = 1;
                    }
                    else if ([strcode hasPrefix:@"m3001"]) {
                        nPeriod = 0;
                    }

                    if ([chartV getNextMode]) {
                        [chartV UpdateNextData:recvData];
                    }
                    else
                    {
                        [self ReqChartData:recvData:nPeriod];
                        m_bIsChartShow = true;
                    }
                }
                else if ([strcode hasPrefix:@"mibo1030"])
                {
                    NSError* error;
                    NSDictionary* jsonOrigin = [NSJSONSerialization JSONObjectWithData:[m_sReqData dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:&error];
                    NSMutableDictionary *json = [jsonOrigin mutableCopy];
                    if (json == nil) {
                        return -1;
                    }
                    if (error) {
                        NSLog(@"error : %@", error.localizedDescription);
                        return -1;
                    }
                    
                    NSString* sData = [[NSString alloc] initWithData:recvData encoding:NSUTF8StringEncoding];
                    [json setObject:sData forKey:@"data"];
                    
                    NSData* kData = [NSJSONSerialization dataWithJSONObject:json options:NSJSONWritingPrettyPrinted error:nil];
                    NSString* kJson = [[NSString alloc] initWithData:kData encoding:NSUTF8StringEncoding];
                    kJson = [kJson stringByReplacingOccurrencesOfString:@"\n" withString:@""];
                    m_sReqData = kJson;
                    [self Request:5 gtr:@"mobile" tr:@"m0000"];
                }
                else
                {
                    NSString* kJson = [[NSString alloc] initWithData:recvData encoding:NSUTF8StringEncoding];
                    [self csendWData:kJson];
                }
            }
            /*
             else if ([strcode hasPrefix:@"xo015101"]) {
             //계좌번호
             //TrLedgeheader trLedgeheader;
             GridInOut gridInOut;
             Xo015101_OCCUR xo015101_OCCUR;
             
             memcpy(&gridInOut, &bdata[sizeof(TrLedgeheader)], sizeof(GridInOut));
             
             int count = atoi(gridInOut.nrow);
             
             int dsize;
             for (int i=0; i < count; i++) {
             dsize = sizeof(TrLedgeheader) + sizeof(GridInOut) + (sizeof(Xo015101_OCCUR) * i);
             memcpy(&xo015101_OCCUR, &bdata[dsize], sizeof(xo015101_OCCUR));
             
             Acctlist *acctlist = [[Acctlist alloc] init];
             NSString *sacno = [[NSString alloc] initWithBytes:&xo015101_OCCUR.acno[0] length:sizeof(xo015101_OCCUR.acno) encoding:0x80000000 + kCFStringEncodingDOSKorean];
             NSString *sacnm = [[NSString alloc] initWithBytes:&xo015101_OCCUR.acnm[0] length:sizeof(xo015101_OCCUR.acnm) encoding:0x80000000 + kCFStringEncodingDOSKorean];
             NSString *sacgb = [[NSString alloc] initWithBytes:&xo015101_OCCUR.acgb length:sizeof(xo015101_OCCUR.acgb) encoding:0x80000000 + kCFStringEncodingDOSKorean];
             
             acctlist.acno = sacno;
             acctlist.acnm = sacnm;
             acctlist.acgb = sacgb;
             
             [sacno release];
             [sacnm release];
             [sacgb release];
             [acctArray addObject:acctlist];
             [acctlist release];
             }
             
             //로그인 후 첫화면 로그인
             [self.loginScreen.view removeFromSuperview];
             loginScreen = nil;
             [loginScreen release];
             
             if (self.priceBoardScreen.view.superview == nil) {
             if (self.priceBoardScreen == nil) {
             PriceBoardScreen *priceScreenCtrl = [[PriceBoardScreen alloc] initWithNibName:@"PriceBoardView" bundle:nil];  
             self.priceBoardScreen = priceScreenCtrl;
             self.priceBoardScreen.mainPlatformSiseIF = self;
             [priceScreenCtrl release];
             }
             [self.view insertSubview:priceBoardScreen.view atIndex:0];
             }
             
             
             
             menuTabBar.selectedItem = [menuTabBar.items objectAtIndex:0];
             menuTabBar.hidden = FALSE;
             }
             }
             else if (commheader.wmid == 0x02) {        //Chart 
             NSString *strcode = [[NSString alloc] initWithBytes:trCommheader.svcc length:sizeof(trCommheader.svcc) encoding:0x80000000 + kCFStringEncodingDOSKorean ];
             [self.chartScreen ReceiveData:strcode rdata: recvData];
             [strcode release];
             }
             else if (commheader.wmid == 0x03) {        //시세
             NSString *strcode = [[NSString alloc] initWithBytes:trCommheader.svcc length:sizeof(trCommheader.svcc) encoding:0x80000000 + kCFStringEncodingDOSKorean ];
             [self.priceBoardScreen ReceiveData:strcode rdata: recvData];
             [strcode release];
             }
             else if (commheader.wmid == 0x04) {        //주문시세
             NSString *strcode = [[NSString alloc] initWithBytes:trCommheader.svcc length:sizeof(trCommheader.svcc) encoding:0x80000000 + kCFStringEncodingDOSKorean ];
             [self.orderScreen ReceiveData:strcode rdata: recvData];
             [strcode release];
             }
             else if (commheader.wmid == 0x05) {        //주문
             NSString *strcode = [[NSString alloc] initWithBytes:trCommheader.svcc length:sizeof(trCommheader.svcc) encoding:0x80000000 + kCFStringEncodingDOSKorean ];
             [self.orderScreen ReceiveData:strcode rdata: recvData];
             [strcode release];
             }
             else if (commheader.wmid == 0x06) {        //계좌시세
             NSString *strcode = [[NSString alloc] initWithBytes:trCommheader.svcc length:sizeof(trCommheader.svcc) encoding:0x80000000 + kCFStringEncodingDOSKorean ];
             [self.gejaScreen ReceiveData:strcode rdata: recvData];
             [strcode release];
             }
             else if (commheader.wmid == 0x07) {        //계좌조회
             NSString *strcode = [[NSString alloc] initWithBytes:trCommheader.svcc length:sizeof(trCommheader.svcc) encoding:0x80000000 + kCFStringEncodingDOSKorean ];
             [self.gejaScreen ReceiveData:strcode rdata: recvData];
             [strcode release];
             }*/
        }
        
    }	
    @catch (NSException *ex) {
        NSString *name = [ex name];
        NSLog(@"Name: %@\n", name);
        NSLog(@"Reason: %@\n", [ex reason]);
    }	
    
    return 0;
}

-(void) ReceiveRealData: (NSData*) receivedata
{
    NSError* error;
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:receivedata options:kNilOptions error:&error];
    if (json == nil)
    {
        return;
    }
    if (error)
    {
        NSLog(@"error : %@", error.localizedDescription);
        return;
    }
    
    NSString* sRealPage = [json objectForKey:@"pageId"];
    if ([sRealPage isEqualToString:@"#ITEM_CONCLUDE"])
    {
        if (m_bIsChartShow && chartV != nil)
        {
            //차트 리얼데이터 넘김.
            if([chartV getReadyRealData])
            {
                [chartV UpdateChartRealData:json];
            }
        }
    }
    
    NSString* sData = [[NSString alloc] initWithData:receivedata encoding:NSUTF8StringEncoding];
    [self csendWData:sData];
}

-(NSData *)gzipDecompress : (NSData *)data {
    
    if ([data length] == 0)
        return data;
    
    unsigned full_length = [data length];
    unsigned half_length = [data length] / 2;
    
    NSMutableData *decompressed = [NSMutableData dataWithLength: full_length + half_length];
    BOOL done = NO;
    int status;
    
    z_stream strm;
    strm.next_in = (Bytef *)[data bytes];
    strm.avail_in = [data length];
    strm.total_out = 0;
    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    
    if (inflateInit2(&strm, (15+32)) != Z_OK) return nil;
    while (!done)
    {
        // Make sure we have enough room and reset the lengths.
        if (strm.total_out >= [decompressed length])
            [decompressed increaseLengthBy: half_length];
        strm.next_out = [decompressed mutableBytes] + strm.total_out;
        strm.avail_out = [decompressed length] - strm.total_out;
        
        // Inflate another chunk.
        status = inflate (&strm, Z_SYNC_FLUSH);
        if (status == Z_STREAM_END) done = YES;
        else if (status != Z_OK) break;
    }
    if (inflateEnd (&strm) != Z_OK)
        return nil;
    
    // Set real length.
    if (done)
    {
        [decompressed setLength: strm.total_out];
        return [NSData dataWithData: decompressed];
    }
    else 
        return nil;
}

@synthesize hud;

- (int) OnError:(NSError*) err {
    /*UIAlertView *alert = [[UIAlertView alloc]
                          initWithTitle:@"접속에러"
                          message:@"연결이 되지 않습니다."
                          delegate:nil
                          cancelButtonTitle:@"확인"
                          otherButtonTitles:nil];
    [alert show];*/
    
    hud = [LGViewHUD defaultHUD];
    hud.image = [UIImage imageNamed:@"rounded-checkmark.png"];
    hud.topText = @"확인";
    hud.bottomText = @"네트워크 재접속 중입니다.(6)";
    hud.activityIndicatorOn = YES;
    [self setTimer];
    [hud showInView:self.view];
    
    //self.loginScreen.btnDisConnect.enabled  = FALSE;
    NSLog(@"%@",[err description]);//code
    return 0;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)LoadTrHashDatas:(int) nIndex {
    
    //AssetManager assetMgr = this.getResources().getAssets();
    NSString *indexFilePath;
    if (nIndex == 0)
    {
        indexFilePath = [[NSBundle mainBundle] pathForResource:@"MTSTrTransData" ofType:@"dat"];
    }
    else if (nIndex == 1)
    {
        indexFilePath = [[NSBundle mainBundle] pathForResource:@"MTSTrTransMore" ofType:@"dat"];
    }
    else if (nIndex == 2)
    {
        indexFilePath = [[NSBundle mainBundle] pathForResource:@"MTSTrTransReal" ofType:@"dat"];
    }
    
    //NSMutableArray *arrayData = [NSMutableArray alloc];
    //arrayData = [NSMutableArray arrayWithContentsOfFile:indexFilePath];
    
    NSError *error;
    NSString *strFileContent = [NSString stringWithContentsOfFile:indexFilePath encoding:NSUTF8StringEncoding error:&error];

    NSArray *arrayData = [strFileContent componentsSeparatedByString:@"\r\n"];
    
    if (!(arrayData == nil))
    {
        NSString* line, *sKey, *sValue, *sResult;
        NSArray *splitWord;
        
        for( int i = 0; i < [arrayData count]; i++)
        {
            line = [arrayData objectAtIndex:i];
            splitWord =[line componentsSeparatedByString:@"|"];
            sKey =[splitWord objectAtIndex:0];
            sValue =[splitWord objectAtIndex:1];
        
            if (nIndex == 0)
            {
                [trTransHashMap setObject:sValue forKey:sKey];
            }
            else if (nIndex == 1)
            {
                [trDataMoreHashMap setObject:sValue forKey:sKey];
            }
            else if (nIndex == 2)
            {
                [trTransHashMapReal setObject:sValue forKey:sKey];
            }
        }
    }
}

- (void)csendWData:(NSString*)sSend
{
    //NSString *totData = [NSString stringWithFormat:@"from_android('%@')", sSend];
    NSString *totData = [NSString stringWithFormat:@"from_android('%@')", sSend];
    //NSString *decoded = [totData stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
//    totData = [totData stringByReplacingOccurrencesOfString:@"\\" withString:@"\\\\"];
//    totData = [totData stringByReplacingOccurrencesOfString:@"\"" withString:@"\\\""];
//    totData = [totData stringByReplacingOccurrencesOfString:@"\'" withString:@"\\\'"];
    totData = [totData stringByReplacingOccurrencesOfString:@"\n" withString:@""];
//    totData = [totData stringByReplacingOccurrencesOfString:@"\r" withString:@"\\r"];
//    totData = [totData stringByReplacingOccurrencesOfString:@"\f" withString:@"\\f"];
    
     [webView stringByEvaluatingJavaScriptFromString:totData];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (void)ChartDestroy
{
    if (chartV != nil) {
        [chartV.view removeFromSuperview];
        [chartV removeFromParentViewController];
        chartV = nil;
        m_bIsChartShow = false;
    }
}

-(void)ChartShow
{
    chartV = [[ChartViewController alloc] initWithNibName:@"ChartViewController" bundle:nil];
    chartV.view.frame = CGRectMake(0, 110, 320, 480);
    chartV.chartEventIF = self;
    [self.view addSubview:chartV.view];
}

//Chart Protocol
-(void)RequireInsertData:(void*)reqData:(NSString*)sTrCode
{    
    m_sReqData = [[NSString alloc] initWithBytes:reqData length:sizeof(Xibg3002_IN) encoding:0x80000000 + kCFStringEncodingDOSKorean];
    [self Request:5 gtr:@"mobile" tr:sTrCode];
}

-(void)ReqChartData:(NSMutableData*)data:(int)nPeriod
{
    if (chartV != nil) {
        [chartV ReqData:data:nPeriod];
    }
}

//네트워크 상태 체크 Notification 등록
- (void)networkCheck
{
    [[NSNotificationCenter defaultCenter] addObserver: self selector: @selector(reachabilityChanged:) name: kReachabilityChangedNotification object: nil];
    
    internetReach = [Reachability reachabilityForInternetConnection];
    [internetReach startNotifier];
  //  [self updateInterfaceWithReachability:internetReach];
}


// 네트워크 상태가 변경 될 경우 호출된다.
- (void)reachabilityChanged:(NSNotification *)note
{
    Reachability *curReach = [note object];
    NSParameterAssert([curReach isKindOfClass: [Reachability class]]);
    [self updateInterfaceWithReachability:curReach];
    /*[self ChartDestroy];
     chartV = [[ChartViewController alloc] initWithNibName:@"ChartViewController" bundle:nil];
     [self.view addSubview:chartV.view];
     chartV.akchart.frame = CGRectMake(0, 200, 300, 500);*/
}

// 네트워크 상태가 변경 될 경우 처리
- (void)updateInterfaceWithReachability:(Reachability *)curReach
{
    if(curReach == internetReach)
    {
        NetworkStatus netStatus = [curReach currentReachabilityStatus];
        
        NSString *statusString = @"";
        switch (netStatus)
        {
            case NotReachable:
                statusString = @"Access Not Available";
                //재접속 연결을 하고 있는 상태라면 그냥 Return
                if (!m_bisReconnMode ) {
                    
                    m_bisReconnMode = true;
                    @try {
                        NSMutableDictionary *jObj = [[NSMutableDictionary alloc ] init];
                        
                        
                        [jObj setValue:@"#NETWORK" forKey:@"pageId"];
                        [jObj setValue:@"close" forKey:@"type"];
                        
                        
                        NSData* kData = [NSJSONSerialization dataWithJSONObject:jObj options:NSJSONWritingPrettyPrinted error:nil];
                        
                        NSString* kJson = [[NSString alloc] initWithData:kData encoding:NSUTF8StringEncoding];
                        [self csendWData :[[NSString alloc] initWithBytes:&kJson length:sizeof(kJson) encoding:0x80000000 + kCFStringEncodingDOSKorean ]];
                        
                        //         [self setReconnSocket];
                    } @catch (NSException *ex) {
                        
                    }
                    //    networkCheckDlg = new BasicProgressDialog(MainActivity.this);
                    //      networkCheckDlg.execute(5);
                    
                }
                break;
            case ReachableViaWiFi:
                [self setReconnSocket];
                [hud removeFromSuperview];
                break;
            case ReachableViaWWAN:
                [self setReconnSocket];
                [hud removeFromSuperview];
                break;
                
            default:
                [self setReconnSocket];
                [hud removeFromSuperview];
                break;
        }
        
        NSLog(@"Net Status changed. current status=%@ ", statusString);
        
        // 네트워크 상태에 따라 처리
    }
}

- (bool) setReconnSocket { // throws IOException
    @try{
        if([conn GetinStream] != nil)
        {
            [conn Disconnect];
        }
        
        m_bisReconnMode = true;
        
        //로그인 페이지임.
        if ((UserId == nil || [UserId  isEqual: @""]) || (Password == nil || [Password  isEqual: @""]) )
        {
            m_bisReconnMode = false;
            //   if (networkCheckDlg != null)
            //   {
            //       networkCheckDlg.cancel(true);
            //   }
            return true;
        }
        
        
        [conn Connect:@"61.78.34.111" port:33101];
    }
    
    @catch (NSException *ex) {
    }
    return true;
}




- (void) setTimer {
    NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:1
                                                      target:self
                                                    selector:@selector(startTimer:)
                                                    userInfo:nil
                                                     repeats:YES];
    _timer = timer;
    timecount = 5;
}




- (void) startTimer : (NSTimer *) timer {
    NSString* Errmsg;
    Errmsg = [NSString stringWithFormat:@"네트워크 재접속 중입니다.(%d)",timecount-- ];
    hud.bottomText = Errmsg;
    if (timecount == 0)
    {
        [self stopTimer];
        [hud removeFromSuperview];
        
        
        UIAlertView *alertView;
        alertView = [[UIAlertView alloc] initWithTitle:@"접속에러" message:@"연결이 되지 않습니다. 종료하시겠습니까?" delegate:self cancelButtonTitle:@"종료" otherButtonTitles:@"재접속",nil];
        [alertView show];
        
        
    }
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    
    // 사용자가 Yes를 선택한 경우
    if (buttonIndex == 1) {
        
        NetworkStatus netStatus = [internetReach currentReachabilityStatus];
        
       
        switch (netStatus)
        {
            case NotReachable:
                                //재접속 연결을 하고 있는 상태라면 그냥 Return
                hud = [LGViewHUD defaultHUD];
                hud.image = [UIImage imageNamed:@"rounded-checkmark.png"];
                hud.topText = @"확인";
                hud.bottomText = @"네트워크 재접속 중입니다.(6)";
                hud.activityIndicatorOn = YES;
                [self setTimer];
                [hud showInView:self.view];
                break;
            case ReachableViaWiFi:
                [self setReconnSocket];
                [hud removeFromSuperview];
                break;
            case ReachableViaWWAN:
                [self setReconnSocket];
                [hud removeFromSuperview];
                break;
                
            default:
                [self setReconnSocket];
                [hud removeFromSuperview];
                break;
        }

        
        

    }
    else
    {
        exit(0);
    }
}

- (void) stopTimer {
    if( _timer != NULL ) {
        [_timer invalidate];
        _timer = NULL;
    }
}
@end
