//
//  ViewHUD.m
//  M-FXMargin
//
//  Created by jay lee on 2015. 1. 12..
//
//

#import <Foundation/Foundation.h>
#import "VersionCtrl.h"
#import <QuartzCore/QuartzCore.h>
#import "NSData+IDZGunzip.h"
#import "ZipArchive.h"
#import "WebBridgeViewController.h"

static VersionCtrl* defaultHUD = nil;

@interface VersionCtrl (privateAPI)
-(void) startTimerForAutoHide;

@end

@implementation VersionCtrl



- (id)initWithFrame:(CGRect)frame delegate:(id)aDelegate {
    //  [super initWithFrame:frame];
    delegate = aDelegate;
    

        
        

   // UCZProgressView *progressView = [[UCZProgressView alloc] initWithFrame:CGRectMake(0.0, 0.0, 320.0, 568.0)];
    //    self.progressView = [[UCZProgressView alloc] initWithFrame:CGRectMake(30.0f, 80.0f, 225.0f, 90.0f)];
    //    [self.progressAlert addSubview:self.progressView];
//       [self.progressView setProgressViewStyle:UIProgressViewStyleBar];
    
    
  //  self.progressView = [[UCZProgressView alloc] initWithFrame:CGRectMake(30.0f, 80.0f, 225.0f, 90.0f)];
   // self.progressView.progress = 0.01;
   
   // [self.progressView setProgress:0.03 animated:TRUE];
    
    //    [self.progressAlert release];
    
      //  self.progressView.radius = 100.0;
    

    
         newverfileStringlist =  [[NSMutableArray alloc] init];
         oldverfileStringlist =  [[NSMutableArray alloc] init];
         requireStrlist =  [[NSMutableArray alloc] init];
        conn = [[SocketConnector alloc] initWithIF:self];
        if (conn == nil) {
            
        }
        

        [conn Connect:@"112.175.141.175" port:33102];
        
   
    return self;
}

- (int) OnConnected {
    
    processing = [[UILabel alloc] initWithFrame:CGRectMake(0, -10, self.progressView.frame.size.width, 8)];
    processing.font = [UIFont fontWithName:@"Copperplate-Bold" size:8.0];
    processing.text = @"";
    processing.textAlignment = NSTextAlignmentCenter;
    
    
    
    [self.progressView addSubview:processing];
    
    NSLog(@"Connected...");
    //로그인 절차밟기
    [NSTimer scheduledTimerWithTimeInterval:0 target:self selector:@selector(RequestStart) userInfo:nil repeats:NO];
    //[self Request:1 gtr:@"gfxlogon" tr:@"usrlogon"];
    return 0;
}

- (void)RequestStart {
    NSFileManager *fm;

    fm = [NSFileManager defaultManager];

    NSString *filePath, *verfileName;
    
    filePath = [NSString stringWithFormat:@"%@/%@", [self dataFilePath ],@"GBMTS"];
    
    
    if ([fm changeCurrentDirectoryPath:filePath] == NO){
        // 폴더 이동 못함
        if ([fm createDirectoryAtPath:filePath withIntermediateDirectories:YES attributes:nil error:NULL] == NO){
            //  newDir 폴더 생성 실패
            NSLog(@"DirCreate Fail..");
        } else {
            // newDir 폴더 생성 성공
            NSLog(@"DirCreate Success..");
            [fm changeCurrentDirectoryPath:filePath] ;
        }
    } else {
        // 폴더 이동함
        
    }
    
    
    //    [fm changeCurrentDirectoryPath:[self dataFilePath ]];
    verfileName =  @"WyVerfile.txt";//[NSString stringWithFormat:@"file%@%@", [self dataFilePath ], @"/WyVerfile_new.txt"];
    
    if ([fm fileExistsAtPath:verfileName] == YES) {
        [self Request:1 gtr:@"GBMTS\0" tr:@"WyVerfile.txt\0"];
    }else
    {
        self.progressAlert = [[UIAlertView alloc] initWithTitle:@"Please wait..."
                                                        message:@"필수파일 다운로드중입니다. 최초1회만 실행됩니다."
                                                       delegate:self cancelButtonTitle:nil
                                              otherButtonTitles:nil ];
        
        self.progressAlert.tag = 12;
        [self.progressAlert show];
        
        [self Request:1 gtr:@"GBMTS\0" tr:@"www.zip\0"];
    }
 //   filePath =[NSString stringWithFormat:@"%@/%@%@", [self dataFilePath ], recvFilePath,@"/WyVerfile.txt"];
    
   // [self Request:1 gtr:@"GBMTS\0" tr:@"WyVerfile.txt\0"];
}
@import Foundation;

- (void)TimerVerCtrl {
    NSMutableArray *rStrlist;
    [rStrlist removeAllObjects];

    if ([requireStrlist count] == 0)
    {
        
        Customclose = false;
   //    [oldverfileStringlist initWithContentsOfFile:(NSString *)
        NSMutableData* myData ;
        myData = [NSMutableData data];
        int i;
        for (i =0; i < [oldverfileStringlist count]; i++)
        {
            if ([[oldverfileStringlist objectAtIndex:i] isEqualToString:@""])
            {
                continue;
            }
            [myData appendData:[[oldverfileStringlist objectAtIndex:i] dataUsingEncoding:NSUTF8StringEncoding]];
            [myData appendData:[@"\r" dataUsingEncoding:NSUTF8StringEncoding]];
           
        }
       // [self.progressAlert dismissWithClickedButtonIndex:0 animated:YES];
         
       // NSData *data = [NSArchiver archivedDataWithRootObject:oldverfileStringlist];
        [myData writeToFile:verdirfile options:NSDataWritingFileProtectionComplete error:nil];
      //  [self arrayWithData:(NSData *)]
       // [oldverfileStringlist writeToFile: verdirfile atomically:YES];
        
        [conn Disconnect];
      //  [self.progressAlert dismissWithClickedButtonIndex:0 animated:YES];
        [self.progressAlert dismissWithClickedButtonIndex:0 animated:YES];
     //   [(WebBridgeViewController*)self.progressView.superview didFinishDrawingView];
//        if ([delegate respondsToSelector:@selector(didFinishDrawingView)])
//          [delegate performSelector:@selector(@"didFinishDrawingView")];
        [delegate performSelector:NSSelectorFromString(@"didFinishDrawingView") ];
    //    [self.progressView.superview performSelector:@selector(didFinishDrawingView)];
     //   [delegate didFinishDrawingView:(VersionCtrl*) self];
        // [(webView*) self.progressView.superview dlelelelele];
        [self.progressView removeFromSuperview];
       // [self.parentViewController init];
        //[self dismissViewControllerAnimated:YES completion:nil];
        return;
         
    }
    [rStrlist removeAllObjects];
    rStrlist =  [[requireStrlist objectAtIndex:0] componentsSeparatedByString:@";"] ;
    
    
   // worksize = 0;
  //  Pbverctrl.Max := StrtoInt64(rStrlist[4]);
  //  Pbverctrl.Position := 0;
  //  Lafilename.Caption := rStrlist[1];
    

    
   // Lacount.Caption := InttoStr(totcount-requireStrlist.count+1) + '/' + InttoStr(totcount);
   // laverctrl.Caption := '0%';
    
    if ([[rStrlist objectAtIndex:3] isEqualToString: @"!"]){
       destdir = @"";
    }
    else
    {
      // destdir = '..\'+rStrList[3] + '\';
    }
    NSString *downPath, *downName;
    downPath = [NSString stringWithFormat:@"%@%@", [rStrlist objectAtIndex:2], @"\0"];
    downName = [NSString stringWithFormat:@"%@%@", [rStrlist objectAtIndex:1], @"\0"];

    [self Request:1 gtr:downPath tr:downName];

    [rStrlist removeAllObjects];
   // [NSObject cancelPreviousPerformRequestsWithTarget:self];
}




- (void) Request:(int)gubun gtr : (NSString*)gtrcode tr : (NSString*)trcode {
    Commheader commheader;
    memset(&commheader, 0x00, sizeof(Commheader));
    int totsize;
    NSUInteger lengthOfBinary;
    void *binary;
    NSData *data;
    NSString *sendData;
    totsize = htonl(sizeof(TVerCtrl_IN));
    FileData = [NSMutableData data];
    commheader.func = '1';

    commheader.wmid = 0;
    
    memset(&VerCtrlin, 0x00, sizeof(TVerCtrl_IN));
    
   
    data = [trcode dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
    lengthOfBinary = [data length];
    binary = (void *)[data bytes]; //void => char ?
    memcpy(&VerCtrlin.file_name, binary, lengthOfBinary);
    
    
    data = [gtrcode dataUsingEncoding:0x80000000 + kCFStringEncodingDOSKorean];//NSUTF8StringEncoding
    lengthOfBinary = [data length];
    binary = (void *)[data bytes]; //void => char ?
    memcpy(&VerCtrlin.file_path, binary, lengthOfBinary);
    
    sendData = [[NSString alloc] initWithBytes:&VerCtrlin length:sizeof(TVerCtrl_IN) encoding:0x80000000 + kCFStringEncodingDOSKorean];

    
    NSString *commheaderData = [[NSString alloc] initWithBytes:&commheader length:sizeof(commheader) encoding: 0x80000000 + kCFStringEncodingEUC_KR];
    NSString *totSenddata;
    
    totSenddata = [NSString stringWithFormat:@"%@%@", commheaderData, sendData];
    [conn Send: totsize sendmsg : totSenddata];
}



- (void)dealloc {



}

+(VersionCtrl*) defaultHUD : delegate:(id)sdelegate{
    if (defaultHUD==nil)
        defaultHUD=[[VersionCtrl alloc] initWithFrame:CGRectMake(0, 0, 200, 200)  delegate:sdelegate];
   return defaultHUD;
}



-(BOOL) activityIndicatorOn {
    return activityIndicatorOn;
}

- (int) OnReceive:(NSData *)msg {
    
    Commheader commheader;
    BOOL isSearch = FALSE;
    int msglen = msg.length;
    char *binary = (char *)[msg bytes];
    int datasize;
    NSString * recvFileData, *recvFileName, *recvFilePath;
    NSString * filePath, *delfilename;
    NSMutableArray * newverStrlist, *oldverStrlist, *rStrlist;
    NSFileManager *fm;
    NSMutableData *recvNSFileData;
    @try {
        NSLog(@"receive");
        fm = [NSFileManager defaultManager];
        memcpy(&commheader, &binary[0], sizeof(Commheader));
        NSMutableData *originData = [[NSMutableData alloc] init];
        [originData appendBytes:&binary[sizeof(Commheader)] length:msglen - (sizeof(Commheader))];
        
        memset(&VerCtrlout, 0x00, sizeof(VerCtrlout));
        
        binary = (char *)[originData bytes];
        memcpy(&VerCtrlout, &binary[0], sizeof(VerCtrlout));
        NSString *strsize = [[NSString alloc] initWithBytes:&VerCtrlout.dlen length:sizeof(VerCtrlout.dlen) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        datasize = [strsize intValue];
        recvFileName = [NSString stringWithFormat:@"%s", VerCtrlout.file_name];//[[NSString alloc] initWithBytes:&VerCtrlout.file_name length:sizeof(VerCtrlout.file_name) encoding:0x80000000 + kCFStringEncodingDOSKorean];
        recvFileName = [recvFileName stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
        
        recvFilePath = [NSString stringWithFormat:@"%s", VerCtrlout.file_path];//[[NSString alloc] initWithBytes:&VerCtrlout.file_path length:sizeof(VerCtrlout.file_path) encoding:NSASCIIStringEncoding];
        recvFilePath = [recvFilePath stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
        NSMutableData *originfiledata = [[NSMutableData alloc] init];
        [originfiledata appendBytes:&VerCtrlout.data length:datasize];
        NSLog(@"receivesize :  %i", datasize);
        
        if ((VerCtrlout.rscf == 0x03) || (VerCtrlout.rscf == 0x04))
        {
            
            recvFileData = [[NSString alloc] initWithBytes:&VerCtrlout.data length:datasize encoding:0x80000000 + kCFStringEncodingDOSKorean];
            [FileData appendData:originfiledata];
            //[FileData stringByAppendingString:recvFileData];
           
            if ([recvFileName hasPrefix:@"WyVerfile.txt"])
            {
                NSMutableArray        *array        =[[NSMutableArray alloc] init];
                filePath =  [NSString stringWithFormat:@"%@/%@%@", [self dataFilePath ], recvFilePath,@"/WyVerfile_new.txt"];

               // [array addObject:recvFileData];
         
              //  [array writeToFile: filePath atomically:YES];
                BOOL flag = [originfiledata writeToFile:filePath options:NSDataWritingFileProtectionComplete error:nil];
           //     filePath =  [NSString stringWithFormat:@"%@%@", [self dataFilePath ], @"/WyVerfile_new.txt"];

               

                
    
                NSString *fileContents = [NSString stringWithContentsOfFile:filePath];
                newverfileStringlist =  [fileContents componentsSeparatedByCharactersInSet:[NSCharacterSet newlineCharacterSet]];
                filePath =  [NSString stringWithFormat:@"%@/%@%@", [self dataFilePath ], recvFilePath,@"/WyVerfile.txt"];
                fileContents = [NSString stringWithContentsOfFile:filePath];
            
                oldverfileStringlist =  [fileContents componentsSeparatedByCharactersInSet:[NSCharacterSet newlineCharacterSet]];
          //      sleep(1000);
                
                int i,j;
                for ( i = 0; i < [newverfileStringlist count]-1; i++)
                {
                    if ([[newverfileStringlist objectAtIndex:i] isEqualToString:@""])
                    {
                        
                        continue;
                    }
                    isUpdate = TRUE;
                    
                    [newverStrlist removeAllObjects];
                    newverStrlist = [[newverfileStringlist objectAtIndex:i] componentsSeparatedByString:@";"] ;
                    for ( j = 0; j < [oldverfileStringlist count] ; j++)
                    {
                        if ([[oldverfileStringlist objectAtIndex:j] isEqualToString:@""])
                        {
                            
                            continue;
                        }
                    
                    
                        [oldverStrlist removeAllObjects];
                        oldverStrlist = [[oldverfileStringlist objectAtIndex:j] componentsSeparatedByString:@";"] ;
                    
                        if ( [[newverStrlist objectAtIndex:1] isEqualToString:[oldverStrlist objectAtIndex:1]] &&[[newverStrlist objectAtIndex:3] isEqualToString:[oldverStrlist objectAtIndex:3]])
                        {
                            if ([[newverStrlist objectAtIndex:0] isEqualToString:[oldverStrlist objectAtIndex:0]])
                            {
                                isUpdate = false;
                            }
                            else
                            {
                                [oldverfileStringlist removeObjectAtIndex:j];
                                
                            }
                            break;
                            
                        }
                    }
                    if (isUpdate)
                    {//새파일인 경우 Add
                        
                       [requireStrlist addObject: [NSString stringWithFormat: [newverfileStringlist objectAtIndex:i]]];
                    }
                        
                        
                  
                    
         
                    
                }
                      
                        [newverStrlist removeAllObjects];
                        [oldverStrlist removeAllObjects];
                        
                        if ([requireStrlist count]> 0 )
                        {
                            
                            
                            [rStrlist removeAllObjects];
                            totcount = [requireStrlist count];
                            for (i =0 ; i<[requireStrlist count]; i++)
                            {
                                [rStrlist removeAllObjects];
                                rStrlist = [[requireStrlist objectAtIndex:i] componentsSeparatedByString:@";"] ;
                                verMax = verMax + [[rStrlist objectAtIndex:4] intValue];
                            }
                            [rStrlist removeAllObjects];
                            filePath =[NSString stringWithFormat:@"%@/%@%@", [self dataFilePath ],recvFilePath, @"/WyVerfile.txt"];
                            verdirfile = filePath;
                         //   [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(TimerVerCtrl) userInfo:nil repeats:NO];
                                                     //   [self performSelector:@selector(TimerVerCtrl) withObject:@"1" afterDelay:1];
                            self.progressAlert = [[UIAlertView alloc] initWithTitle:@"Please wait..."
                                                                            message:@"변경파일 다운로드 중입니다"
                                                                           delegate:self cancelButtonTitle:nil
                                                                  otherButtonTitles:nil ];
                            
                            self.progressAlert.tag = 12;
                            [self.progressAlert show];
                        }


                }else
                {
                    [self Progressing];
                    filePath = [NSString stringWithFormat:@"%@/%@", [self dataFilePath ],recvFilePath];
     
                    
                    if ([fm changeCurrentDirectoryPath:filePath] == NO){
                        // 폴더 이동 못함
                        if ([fm createDirectoryAtPath:filePath withIntermediateDirectories:YES attributes:nil error:NULL] == NO){
                            //  newDir 폴더 생성 실패
                            NSLog(@"DirCreate Fail..");
                        } else {
                            // newDir 폴더 생성 성공
                            NSLog(@"DirCreate Success..");
                            [fm changeCurrentDirectoryPath:filePath] ;
                        }
                    } else {
                        // 폴더 이동함
                       // [fm changeCurrentDirectoryPath:filePath] ;
                    }
                    
                    filePath = [NSString stringWithFormat:@"%@/%@/%@", [self dataFilePath ],recvFilePath, recvFileName];

                    [FileData writeToFile:filePath options:NSDataWritingFileProtectionComplete error:nil];
                    NSError *error = nil;
                    
                    
  
                    
//                    NSFileManager *fileManager = [NSFileManager defaultManager];
//                    
//                    if (![fileManager fileExistsAtPath:filePath]) {
//                        [fileManager createFileAtPath:filePath contents:nil attributes:nil];
//                    }
//                    filePathURL                             NSFileHandle *fileHandle = [NSFileHandle fileHandleForUpdatingURL:filePathURL error:&error];
//                    
//                    if (error) {
//                        [fileHandle closeFile];
//                        
//                    } else {
//
//                        [fileHandle truncateFileAtOffset:0];
//                        [fileHandle writeData:originData];
//                        [fileHandle closeFile];       
//                        
//                       
//                    }
                    
                    
                    
                
                }
                
                if ([recvFileName hasPrefix:@"WyVerfile.txt"])
                {
                    
                    filePath = [NSString stringWithFormat:@"%@/%@", [self dataFilePath ],recvFilePath];
                    
                    
                    if ([fm changeCurrentDirectoryPath:filePath] == NO){
                        // 폴더 이동 못함
                        if ([fm createDirectoryAtPath:filePath withIntermediateDirectories:YES attributes:nil error:NULL] == NO){
                            //  newDir 폴더 생성 실패
                            NSLog(@"DirCreate Fail..");
                        } else {
                            // newDir 폴더 생성 성공
                            NSLog(@"DirCreate Success..");
                            [fm changeCurrentDirectoryPath:filePath] ;
                        }
                    } else {
                        // 폴더 이동함
                        
                    }
                    
                    
                //    [fm changeCurrentDirectoryPath:[self dataFilePath ]];
                    delfilename =  @"WyVerfile_new.txt";//[NSString stringWithFormat:@"file%@%@", [self dataFilePath ], @"/WyVerfile_new.txt"];
           
                    if ([fm fileExistsAtPath:delfilename] == YES) {
                        if ([fm removeItemAtPath:delfilename error:NULL] == NO) {
                            NSLog(@"file remove faild..!!");
                        }
                    }
                    filePath =[NSString stringWithFormat:@"%@/%@%@", [self dataFilePath ], recvFilePath,@"/WyVerfile.txt"];
                    verdirfile = filePath;
                    [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(TimerVerCtrl) userInfo:nil repeats:NO];
                    
                }
                else if ([recvFileName isEqualToString:@"www.zip"])
                {
                    
                    [ self unzipZipFile: @""];
                    [self.progressAlert dismissWithClickedButtonIndex:0 animated:YES];
                    [self Request:1 gtr:@"GBMTS\0" tr:@"WyVerfile.txt\0"];
                
                }else
                {
                    int iindex = [recvFileName rangeOfString:@".gz"].location;
                  //  [fm changeCurrentDirectoryPath:[self dataFilePath ]];
                    
                    filePath = [NSString stringWithFormat:@"%@/%@", [self dataFilePath ],recvFilePath];
                    
                    
                    if ([fm changeCurrentDirectoryPath:filePath] == NO){
                        // 폴더 이동 못함
                        if ([fm createDirectoryAtPath:filePath withIntermediateDirectories:YES attributes:nil error:NULL] == NO){
                            //  newDir 폴더 생성 실패
                            NSLog(@"DirCreate Fail..");
                        } else {
                            // newDir 폴더 생성 성공
                            NSLog(@"DirCreate Success..");
                            [fm changeCurrentDirectoryPath:filePath] ;
                        }
                    } else {
                        // 폴더 이동함
                     //   [fm changeCurrentDirectoryPath:filePath] ;
                    }
                    
                    
                    
                    delfilename =  [recvFileName substringWithRange:NSMakeRange(0, iindex)];
                    
                 //   delfilename =  [NSString stringWithFormat:@"%@/%@", [self dataFilePath ], recvFileName];
                    
                    if ([fm fileExistsAtPath:delfilename] == YES) {
                        if ([fm removeItemAtPath:delfilename error:NULL] == NO) {
                            NSLog(@"file remove faild..!!");
                        }
                    }
                    
                    
                    
                    [self DeCompressFile :recvFileName :delfilename];
                    

                    
                    if ([fm removeItemAtPath:recvFileName error:NULL] == NO) {
                        NSLog(@"file remove faild..!!");
                    }
                   
                    if ([[oldverfileStringlist objectAtIndex:0] isEqualToString:@""])
                    {
                        oldverfileStringlist =  [[NSMutableArray alloc] init];
                    }
                
                   
                    [oldverfileStringlist addObject: [NSString stringWithFormat: [requireStrlist objectAtIndex:0]]];
                    
                    [requireStrlist removeObjectAtIndex:0];
                    
                    [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(TimerVerCtrl) userInfo:nil repeats:NO];
               
                    
                }
            
                      //  [self performSelector:@selector(TimerVerCtrl) withObject:@"1" afterDelay:1];
        }else
        {
                        if ((![recvFileName hasPrefix:@"WyVerfile.txt"])&&(![recvFileName isEqualToString:@"www.zip"]))
                        {
                               [self Progressing];
                                
                        }
                          //  recvFileData = [[NSString alloc] initWithBytes:&VerCtrlout.data length:datasize encoding:0x80000000 + kCFStringEncodingDOSKorean];
                          //  [FileData stringByAppendingString:recvFileData];
            
                           [FileData appendData:originfiledata];
                        //    FileData := FileData + Copy(VerCtrlout.data, 1, datasize);
            
         }
               
                        

                
    
            
            
            
    
    
    }
    @catch (NSException *ex) {
        NSString *name = [ex name];
        NSLog(@"Name: %@\n", name);
        NSLog(@"Reason: %@\n", [ex reason]);
    }
    
    
}

-(void)DeCompressFile:(NSString*) sourceFile: (NSString*) destFile
{
    NSError* error = nil;
    NSData *returnedData = [NSData dataWithContentsOfFile:sourceFile options:NSDataWritingFileProtectionComplete error:nil];
    if (returnedData) NSLog(@"I got the data");
    
    NSString *thirdString = [[NSString alloc] initWithData:returnedData encoding:NSUTF8StringEncoding];
    NSLog(@"thirdString is %@", thirdString);
    
    NSData* gunzippedData = [returnedData decompressedDataUsingZLib: [returnedData length]];//[returnedData gunzip:&error];
    if(!gunzippedData)
    {
        // Handle error
    }
    else
    {
        // Success use gunzippedData

        
        BOOL flag = [gunzippedData writeToFile:destFile options:NSDataWritingFileProtectionComplete error:nil];
        if (flag) NSLog(@"saving Suceess!!!");
    }
    
    
    
}

- (NSString *)dataFilePath
{
    
    // 읽고 쓰기 간으한 document디렉토리를 구한다.
   
    NSArray *paths = NSSearchPathForDirectoriesInDomains(
                                                         
                                                         NSDocumentDirectory, NSUserDomainMask, YES);
   
    // 아이폰에서는 NSSearchPathForDirectoriesInDomains로 구한 정보가
   
    // 도큐먼트 디렉토리 오직 하나임.
 
    NSString *documentsDirectory = [paths objectAtIndex:0];
    return documentsDirectory;
    
}


-(void)Progressing
{

    //worksize := worksize + StrtoInt(trim(VerCtrlout.dlen));
    NSString *sLen;
    sLen = [[NSString alloc] initWithBytes:&VerCtrlout.dlen
                        length:sizeof(VerCtrlout.dlen) encoding:0x80000000 + kCFStringEncodingDOSKorean];

    sLen = [sLen stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
   
    
    totsize = totsize + [sLen intValue];

//Pbverctrl.Position := worksize;
//Pbverctrl2.Position := totsize;

//laverctrl.Refresh;
//laverctrl.Caption := InttoStr(round((worksize / Pbverctrl.Max) * 100))+'%';
//laverctrl2.Caption := InttoStr(round(((totsize) / Pbverctrl2.Max) * 100))+'%';
    double a;
    
    a = (double)totsize/(double)verMax;
 //   bottomLabel.text = [ NSString stringWithFormat:@"버전처리중입니다. ( %i%)", (int)a];
    self.progressView.progress = a;
    processing.text = [NSString stringWithFormat:@"%.0f%%", a* 100];
}

-(void)unzipZipFile : (NSString*) unZipFileName
{
    unZipFileName = @"www.zip";
    NSString *documentsDirectory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    
    NSString *zipFilePath = [documentsDirectory stringByAppendingPathComponent:@"/GBMTS/www.zip"];
    
    NSString *output =[documentsDirectory stringByAppendingPathComponent:@"/GBMTS"];// [documentsDirectory stringByAppendingPathComponent:@"unZipDirName"];
    NSFileManager *fm;
    fm = [NSFileManager defaultManager];
    ZipArchive* za = [[ZipArchive alloc] init];
    
    if( [za UnzipOpenFile:zipFilePath] ) {
        if( [za UnzipFileTo:output overWrite:YES] != NO ) {
            //unzip data success
            //do something
      //      NSString *delfilename =  [recvFileName substringWithRange:NSMakeRange(0, iindex)];
           
            
            
            if ([fm changeCurrentDirectoryPath:output] == NO){
                // 폴더 이동 못함
            } else {
                // 폴더 이동함
                //   [fm changeCurrentDirectoryPath:filePath] ;
            }
            
            
            //   delfilename =  [NSString stringWithFormat:@"%@/%@", [self dataFilePath ], recvFileName];
            
            if ([fm fileExistsAtPath:unZipFileName] == YES) {
                if ([fm removeItemAtPath:unZipFileName error:NULL] == NO) {
                    NSLog(@"file remove faild..!!");
                }
            }
        }
        
        [za UnzipCloseFile];
    }
    
  //  [za release];
}









@end