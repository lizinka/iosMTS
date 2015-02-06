//
//  ViewHUD.h
//  M-FXMargin
//
//  Created by jay lee on 2015. 1. 12..
//
//

#ifndef M_FXMargin_ViewHUD_h
#define M_FXMargin_ViewHUD_h


#endif

#import <UIKit/UIKit.h>
#import "SocketConnector.h"
#import "StructLayout.h"
//#import "UCZProgressView.h"



id delegate;

/**
 A HUD that mimics the native one used in iOS (when you press volume up or down
 on the iPhone for instance) and also provides some more features (some more animations
 + activity indicator support included.)
 */

@interface VersionCtrl : UIViewController
{
  //  UCZProgressView *progressView;
    NSTimer* displayTimer;
    BOOL activityIndicatorOn;
    UIActivityIndicatorView* activityIndicator;
    SocketConnector *conn;
    TVerCtrl_IN VerCtrlin  ;
    TVerCtrl_OUT VerCtrlout  ;
    int totcount ;

    BOOL isExist, isUpdate ;
    BOOL Customclose ;
    NSString *totData ;
    NSMutableData *FileData ;
    NSString *destdir ;
    int revsize, verMax, totsize;
    NSMutableArray * newverfileStringlist, *oldverfileStringlist, *requireStrlist;
    NSURL *filePathURL;
    NSString *verdirfile;
    id delegate;
    UILabel *processing;
}

+(VersionCtrl*) defaultHUD: delegate:(id)aDelegate;


@property (nonatomic, retain) UIProgressView *progressView;
@property (nonatomic, retain) UIAlertView *progressAlert;



@end
