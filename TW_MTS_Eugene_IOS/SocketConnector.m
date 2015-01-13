//
//  SocketConnector.m
//  SocketClient
//
//  Created by jay lee on 10. 8. 3..
//  Copyright (주)윈웨이시스템 2010. All rights reserved.
// 

#import "SocketConnector.h"
#import <CFNetwork/CFNetwork.h>
#include <sys/socket.h>
#include <netinet/in.h>


@implementation SocketConnector

- (id) init {
	
	host = nil;
	port = 0;
	instream = nil;
	outstream = nil;
	return self;	
}
- (id) initWithIF:(id)aif {
    host = nil;
    port = 0;
    instream = nil;
    outstream = nil;
	rcvif = aif;
	return self;
}

- (void) Connect:(NSString*)ip port:(int)remoteport {
	dataSize = 0;
	totData=[[NSMutableData alloc] init];

	//host = CFSTR([ip UTF8String]);
	host = CFStringCreateWithCString(kCFAllocatorDefault, [ip UTF8String], NSUnicodeStringEncoding);	
	//int size = [host length];
	port = remoteport;
	
	CFReadStreamRef		readStream = NULL;
	CFWriteStreamRef	writeStream = NULL;
	
	CFStreamCreatePairWithSocketToHost(kCFAllocatorDefault, host, port,  &readStream, &writeStream);
	
	instream = (__bridge NSInputStream*)readStream;
	outstream =(__bridge NSOutputStream*)writeStream;
	
	[instream setDelegate:self];
	[instream scheduleInRunLoop:[NSRunLoop currentRunLoop] forMode:NSRunLoopCommonModes];
	[instream open];
	[outstream open];
	
	CFRelease(readStream);
	CFRelease(writeStream);
/*

	CFSocketContext context = { 0, self, NULL, NULL, NULL};
	CFSocketRef client = CFSocketCreate(NULL, PF_INET, SOCK_STREAM, IPPROTO_TCP, kCFSocketConnectCallBack, (CFSocketCallBack)MyCallBack, &context);
	CFDataRef addressData;
	
	struct sockaddr_in theName;
	struct hostent *hp;
	theName.sin_port = hosts(port);
	theName.sin_family = AF_INET;
	
	strcpy(theName.sin_addr.s_addr, "61.74.231.65");
	addressData = CFDataCreate(NULL, (UInt8*)&theName, (CFIndex)sizeof(struct sockaddr_in));
	

	CFSocketConnectToAddress(client, addressData, 1);
	CFRunLoopSourceRef sourceRef = CFSocketCreateRunLoopSource(kCFAllocatorDefault, client, 0);
	CFRunLoopAddSource(CFRunLoopGetCurrent(), sourceRef, kCFRunLoopCommonModes);
	CFRunLoopRun();
*/
}

- (void)Send:(int)tsize sendmsg : (NSString*)msg {
	
	if (outstream == nil)
		return;
	
	if ([outstream streamStatus] == NSStreamStatusOpen ||
		[outstream streamStatus] == NSStreamStatusReading ||
		[outstream streamStatus] == NSStreamStatusWriting) {
		
		
		uint8_t *convertedData = (uint8_t *)[msg cStringUsingEncoding:0x80000000 + kCFStringEncodingEUC_KR];
		
		int convertSize = (NSUInteger)[msg lengthOfBytesUsingEncoding:0x80000000 + kCFStringEncodingEUC_KR];
		
		uint8_t *sendData = (uint8_t *)malloc(sizeof(int) + convertSize);
		memset(sendData, 0x00, sizeof(int) + convertSize);
		memcpy(sendData, &tsize, sizeof(int));

		memcpy(&sendData[sizeof(int)], convertedData, convertSize);
		[outstream write:sendData maxLength: sizeof(int) + convertSize];
        free(sendData);
	}
}

- (void)Disconnect {
	@try {
	if(instream) {
		
		[instream setDelegate:nil];
		[instream close];
		[outstream close];
		
		[rcvif OnDisconnect];
	}
	}
	@catch (NSException *ex) {
		NSString *name = [ex name];
		NSLog(@"Name: %@\n", name);
		NSLog(@"Reason: %@\n", [ex reason]);
	}
}

- (void)stream:(NSStream *)aStream handleEvent:(NSStreamEvent)eventCode;
{
	@try {
    switch(eventCode) {
        case NSStreamEventOpenCompleted:
            [self OnOpened];
            break;
        case NSStreamEventHasBytesAvailable:
            [self OnHasRead];
            break;
        case NSStreamEventHasSpaceAvailable:
            [self OnHasWrite];
            break;
        case NSStreamEventErrorOccurred:
            [self OnError];
            break;
        case NSStreamEventEndEncountered:
            [self OnEOF];
            break;
        default:
			NSLog(@"unknown NSStreamEvent %i", eventCode);
            break;
    }
	}
	@catch (NSException *ex) {
		NSString *name = [ex name];
		NSLog(@"Name: %@\n", name);
		NSLog(@"Reason: %@\n", [ex reason]);
	}
}


-(void) OnOpened {
	
	[rcvif OnConnected];
	NSLog(@"Stream Open");
}

-(void) OnHasRead {
	
	NSInteger       bytesRead;
	uint8_t         buffer[32768];//
	NSInteger       datalen;
	
	@try {
	bytesRead =[instream read:buffer maxLength:sizeof(buffer)];//
	
	[totData appendBytes:buffer length:bytesRead];
	
	if (bytesRead == 0) {      //서버로부터 세션이 끊긴 경우
		[self Disconnect];
		return;
	}
		
	if (dataSize == 0) {
		memcpy(&datalen, &buffer[0], sizeof(NSInteger));
		dataSize = COMMHEADER_SIZE + htonl(datalen);
		
	}
	
	NSData * tmpData;
	
	while (dataSize < totData.length) {
		NSRange range = {4, dataSize-4};
		tmpData = [totData subdataWithRange:range];
		/*
		NSString *msg = [
						 [NSString alloc] 
						 initWithData:tmpData
						 encoding:0x80000000 + kCFStringEncodingDOSKorean
						 ];
		 */
		[rcvif OnReceive:tmpData]; 
		//[msg release];
		
		NSRange range2 = {dataSize, totData.length - dataSize};
		tmpData = [totData subdataWithRange:range2];
		[totData setData:tmpData];
		
		//if ((totData.length - dataSize) < 5) {
		if (totData.length < 5) {
			dataSize = 0;
			break;
		}
		//memcpy(&datalen, &buffer[totdatasize], sizeof(NSInteger));
		char *tmpbinary = (char *)[totData bytes];
		memcpy(&datalen, &tmpbinary[0], sizeof(NSInteger));
		dataSize = COMMHEADER_SIZE + htonl(datalen);
		
	}
	
	if (dataSize == totData.length) {
		NSRange range={4, dataSize-4};
		tmpData = [totData subdataWithRange:range];
		/*
		NSString *msg = [
						 [NSString alloc] 
						 initWithData:tmpData
						 encoding:0x80000000 + kCFStringEncodingDOSKorean
						 ];
		 */
		[totData setLength:0];
		dataSize = 0;
		
		[rcvif OnReceive:tmpData]; 
		//[msg release];
	}
	}
	@catch (NSException *ex) {
		NSString *name = [ex name];
		NSLog(@"Name: %@\n", name);
		NSLog(@"Reason: %@\n", [ex reason]);
	}
	
}

-(void) OnHasWrite{
}

-(void) OnError {
	
    NSError *error = instream.streamError;
    if( error ) {
		[rcvif OnError:error];
	}
}

-(void) OnEOF {
	
	NSLog(@"OnEOF....");
}

-(NSInputStream*) GetinStream
{
    return instream;
    
}

@end
