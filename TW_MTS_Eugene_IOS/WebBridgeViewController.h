//
//  WebBridgeViewController.h
//  TW_MTS_Eugene_IOS
//
//  Created by winway on 2015. 1. 8..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "StructLayout.h"
#import "zlib.h"
#import "SocketConnector.h"
#import "Reachability.h"
#import "Global.h"

#define MSGK_NPM 0x10  // normal presentation msg
#define MSGK_PCA 0x71  // public certificate authority
#define MSGK_KEY 0x70  // ecrypt/decrypt key exchange
#define ACTF_ENO 0x20  // ecrypted outbound msg
#define ACTF_ENI 0x10  // ecrypted inbound msg
#define ACTF_EIO 0x40  // ecrypted in/out msg
#define CHKF_KEY 0x10  // public key for CA
#define CHKF_CON 0x80  // continue data

#define ZM_ZIP   0x01  // 압축
#define ZM_ER1   0x02  // 에러 메세지
#define ZM_ER2   0x04  // 다이알로그 에러 메세지'

#define ZF_POL   '0'   // polling
#define ZF_MSG   '1'   // normal msg-req/rsp
#define ZF_UNS   '2'   // 긴급메세지, 체결데이타
#define ZF_RTU   '3'   // 리얼시세
#define ZF_SYM   '4'   // 리얼심볼정보
#define ZF_CLS   '8'   // Close Screen
#define ZF_DEL   '5'   // real cancel

@interface WebBridgeViewController : UIViewController <SocketIF>
{
    SocketConnector *conn;
    NSTimer *timerHBeat;
    int gHBeatcount;
    
    LoginIN loginIN;
    LoginOUT loginOUT;
    
    bool m_bIsChartShow;
    Global *global;
    NSMutableDictionary *trDataMoreHashMap;
    NSMutableDictionary *trTransHashMap;
    NSMutableDictionary *trTransHashMapReal;
    Reachability *internetReach;
    NSString *m_sLoginInfo;
    NSString *UserId;
    NSString *Password;
    NSString *LoginType;
    NSString *m_sChartSetting;
    uint16_t rwmid[10];
    NSMutableData *recvd[10];
    int m_nChartHeight;
    BOOL m_bIsChartShow;
    bool m_bisReconnMode;
}

@property (nonatomic, strong) IBOutlet UIWebView *webView;
@property (nonatomic, strong) Global *global;

-(void) LoadTrHashDatas:(int) nIndex;
- (void)settimerHBeat;
- (void)sendHBeatCheck;
- (void)csendWData:(NSString*)sSend;
- (void)ChartDestroy;
-(void)ChartShow;
-(NSData *)gzipDecompress : (NSData *)data;

@end
