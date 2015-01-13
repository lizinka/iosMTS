//
//  SocketConnector.h
//  SocketClient
//
//  Created by jay lee on 10. 8. 3..
//  Copyright (주)윈웨이시스템 2010. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CFNetwork/CFNetwork.h>


#define COMMHEADER_SIZE 8
#define TRCOMMHEADER_SIZE 40

@protocol SocketIF
- (int ) OnReceive:(NSData *)msg;//
- (int ) OnDisconnect;
- (int ) OnConnected;
- (int ) OnError:(NSError*) err;
@end

@interface SocketConnector : NSObject <NSStreamDelegate> {

	CFStringRef		host;
	int				port;
	NSInputStream*	instream;//NSStream
	NSOutputStream*	outstream;//NSStream
	id			rcvif;
	NSMutableData      *totData;
	NSInteger   dataSize;
}

-(id) initWithIF:(id)aif;
-(void) Connect:(NSString*)ip port:(int)remoteport;
-(void) Send:(int)tsize sendmsg:(NSString*)msg;
-(void) Disconnect;
-(NSInputStream*) GetinStream;
-(void) OnOpened;
-(void) OnHasRead;
-(void) OnHasWrite;
-(void) OnError;
-(void) OnEOF;

@end

