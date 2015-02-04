//
//  NSData+IDZGunzip.m
//  TW_MTS_Eugene_IOS
//
//  Created by jay lee on 2015. 1. 29..
//  Copyright (c) 2015년 winwaysystems. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <zlib.h>
#define ZCHUNKSIZE (16*1024)
NSString* const IDZGunzipErrorDomain = @"com.iosdeveloperzone.IDZGunzip";

@implementation NSData (IDZGunzip)



- (NSData *) decompressedDataUsingZLib:(NSUInteger) decompressedSize
{
    NSMutableData      *dst;
    uLongf             len;
    
    len = decompressedSize * 20 + 8192;
    dst = [[[NSMutableData allocWithZone:[self zone]] initWithLength:len] autorelease];
    switch( uncompress( [dst mutableBytes], &len, [self bytes], [self length]))
    {
        case Z_DATA_ERROR :
        [NSException raise:NSGenericException
                    format:@"Incoming ZLib data %@ was corrupted", self];
        break;
        
        case Z_MEM_ERROR :
        [NSException raise:NSMallocException
                    format:@"out of memory in decompression"];
        break;
        
        case Z_BUF_ERROR :
        return( nil);
    }
    [dst setLength:len];
    return( dst);
}


//
//
//
//- (NSData*)gunzip:(NSError *__autoreleasing *)error
//{
//    /*
//     * A minimal gzip header/trailer is 18 bytes long.
//     * See: RFC 1952 http://www.gzip.org/zlib/rfc-gzip.html
//     */
//    if(self.length < 18)
//    {
//        if(error)
//        *error = [NSError errorWithDomain:IDZGunzipErrorDomain code:Z_DATA_ERROR userInfo:nil];
//        return nil;
//    }
//    z_stream zStream;
//    memset(&zStream, 0, sizeof(zStream));
//    /*
//     * 16 is a magic number that allows inflate to handle gzip
//     * headers.
//     */
//    int iResult = inflateInit2(&zStream, 16+MAX_WBITS);
//    if(iResult != Z_OK)
//    {
//        if(error)
//        *error = [NSError errorWithDomain:IDZGunzipErrorDomain code:iResult userInfo:nil];
//        return nil;
//    }
//    /*
//     * The last four bytes of a gzipped file/buffer contain the the number
//     * of uncompressed bytes expressed as a 32-bit little endian unsigned integer.
//     * See: RFC 1952 http://www.gzip.org/zlib/rfc-gzip.html
//     */
//    
//    UInt32 nUncompressedBytes = *(UInt32*)(self.bytes + self.length - 4);
//    NSMutableData* gunzippedData = [NSMutableData dataWithLength:nUncompressedBytes];
//    NSMutableData* outstream;
//    zStream.next_in = (Bytef*)self.bytes;
//    zStream.avail_in = self.length;
//
//    Byte* bytes = (Byte*)[data bytes];
//    NSInteger len = [data length];
//    NSMutableData *decompressedData = [[NSMutableData alloc] initWithCapacity:COMPRESSION_BLOCK];
//    Byte* decompressedBytes[COMPRESSION_BLOCK];
//    
//    z_stream stream;
//    int err;
//    stream.zalloc = (alloc_func)0;
//    stream.zfree = (free_func)0;
//    stream.opaque = (voidpf)0;
//    
//    stream.next_in = bytes;
//    err = inflateInit(&stream);
//    CHECK_ERR(err, @"inflateInit");
//    
//    while (true) {
//        stream.avail_in = len - stream.total_in;
//        stream.next_out = decompressedBytes;
//        stream.avail_out = COMPRESSION_BLOCK;
//        err = inflate(&stream, Z_NO_FLUSH);
//        [decompressedData appendBytes:decompressedBytes length:(stream.total_out-[decompressedData length])];
//        if(err == Z_STREAM_END)
//        break;
//        CHECK_ERR(err, @"inflate");
//    }
//    
//    err = inflateEnd(&stream);
//    CHECK_ERR(err, @"inflateEnd");
//    
//    delete[] decompressedBytes;
//    return [decompressedData autorelease];
//    
//    //    zStream.next_out = (Bytef*)gunzippedData.bytes;
////    zStream.avail_out = gunzippedData.length;
//
//    iResult = inflate(&zStream, Z_FINISH);
//    if(iResult != Z_STREAM_END)
//    {
//        if(error)
//        *error = [NSError errorWithDomain:IDZGunzipErrorDomain code:iResult userInfo:nil];
//        gunzippedData = nil;
//    }
//    inflateEnd(&zStream);
//    return gunzippedData;
//}




-(NSData*) gzipData//: (NSData*)pUncompressedData
{
    /*
     Special thanks to Robbie Hanson of Deusty Designs for sharing sample code
     showing how deflateInit2() can be used to make zlib generate a compressed
     file with gzip headers:
     
     http://deusty.blogspot.com/2007/07/gzip-compressiondecompression.html
     
     */
    NSData *pUncompressedData = self;
    if (!pUncompressedData || [pUncompressedData length] == 0)
    {
        NSLog(@"%s: Error: Can't compress an empty or null NSData object.", __func__);
        return nil;
    }
    
    /* Before we can begin compressing (aka "deflating") data using the zlib
     functions, we must initialize zlib. Normally this is done by calling the
     deflateInit() function; in this case, however, we'll use deflateInit2() so
     that the compressed data will have gzip headers. This will make it easy to
     decompress the data later using a tool like gunzip, WinZip, etc.
     
     deflateInit2() accepts many parameters, the first of which is a C struct of
     type "z_stream" defined in zlib.h. The properties of this struct are used to
     control how the compression algorithms work. z_stream is also used to
     maintain pointers to the "input" and "output" byte buffers (next_in/out) as
     well as information about how many bytes have been processed, how many are
     left to process, etc. */
    z_stream zlibStreamStruct;
    zlibStreamStruct.zalloc    = Z_NULL; // Set zalloc, zfree, and opaque to Z_NULL so
    zlibStreamStruct.zfree     = Z_NULL; // that when we call deflateInit2 they will be
    zlibStreamStruct.opaque    = Z_NULL; // updated to use default allocation functions.
    zlibStreamStruct.total_out = 0; // Total number of output bytes produced so far
    zlibStreamStruct.next_in   = (Bytef*)[pUncompressedData bytes]; // Pointer to input bytes
    zlibStreamStruct.avail_in  = [pUncompressedData length]; // Number of input bytes left to process
    
    /* Initialize the zlib deflation (i.e. compression) internals with deflateInit2().
     The parameters are as follows:
     
     z_streamp strm - Pointer to a zstream struct
     int level      - Compression level. Must be Z_DEFAULT_COMPRESSION, or between
     0 and 9: 1 gives best speed, 9 gives best compression, 0 gives
     no compression.
     int method     - Compression method. Only method supported is "Z_DEFLATED".
     int windowBits - Base two logarithm of the maximum window size (the size of
     the history buffer). It should be in the range 8..15. Add
     16 to windowBits to write a simple gzip header and trailer
     around the compressed data instead of a zlib wrapper. The
     gzip header will have no file name, no extra data, no comment,
     no modification time (set to zero), no header crc, and the
     operating system will be set to 255 (unknown).
     int memLevel   - Amount of memory allocated for internal compression state.
     1 uses minimum memory but is slow and reduces compression
     ratio; 9 uses maximum memory for optimal speed. Default value
     is 8.
     int strategy   - Used to tune the compression algorithm. Use the value
     Z_DEFAULT_STRATEGY for normal data, Z_FILTERED for data
     produced by a filter (or predictor), or Z_HUFFMAN_ONLY to
     force Huffman encoding only (no string match) */
    int initError = deflateInit2(&zlibStreamStruct, Z_DEFAULT_COMPRESSION, Z_DEFLATED, (15+16), 8, Z_DEFAULT_STRATEGY);
    if (initError != Z_OK)
    {
        NSString *errorMsg = nil;
        switch (initError)
        {
            case Z_STREAM_ERROR:
            errorMsg = @"Invalid parameter passed in to function.";
            break;
            case Z_MEM_ERROR:
            errorMsg = @"Insufficient memory.";
            break;
            case Z_VERSION_ERROR:
            errorMsg = @"The version of zlib.h and the version of the library linked do not match.";
            break;
            default:
            errorMsg = @"Unknown error code.";
            break;
        }
        NSLog(@"%s: deflateInit2() Error: \"%@\" Message: \"%s\"", __func__, errorMsg, zlibStreamStruct.msg);
    //    [errorMsg release];
        return nil;
    }
    
    // Create output memory buffer for compressed data. The zlib documentation states that
    // destination buffer size must be at least 0.1% larger than avail_in plus 12 bytes.
    NSMutableData *compressedData = [NSMutableData dataWithLength:[pUncompressedData length] * 1.01 + 12];
    
    int deflateStatus;
    do
    {
        // Store location where next byte should be put in next_out
        zlibStreamStruct.next_out = [compressedData mutableBytes] + zlibStreamStruct.total_out;
        
        // Calculate the amount of remaining free space in the output buffer
        // by subtracting the number of bytes that have been written so far
        // from the buffer's total capacity
        zlibStreamStruct.avail_out = [compressedData length] - zlibStreamStruct.total_out;
        
        /* deflate() compresses as much data as possible, and stops/returns when
         the input buffer becomes empty or the output buffer becomes full. If
         deflate() returns Z_OK, it means that there are more bytes left to
         compress in the input buffer but the output buffer is full; the output
         buffer should be expanded and deflate should be called again (i.e., the
         loop should continue to rune). If deflate() returns Z_STREAM_END, the
         end of the input stream was reached (i.e.g, all of the data has been
         compressed) and the loop should stop. */
        deflateStatus = deflate(&zlibStreamStruct, Z_FINISH);
        
    } while ( deflateStatus == Z_OK );
    
    // Check for zlib error and convert code to usable error message if appropriate
    if (deflateStatus != Z_STREAM_END)
    {
        NSString *errorMsg = nil;
        switch (deflateStatus)
        {
            case Z_ERRNO:
            errorMsg = @"Error occured while reading file.";
            break;
            case Z_STREAM_ERROR:
            errorMsg = @"The stream state was inconsistent (e.g., next_in or next_out was NULL).";
            break;
            case Z_DATA_ERROR:
            errorMsg = @"The deflate data was invalid or incomplete.";
            break;
            case Z_MEM_ERROR:
            errorMsg = @"Memory could not be allocated for processing.";
            break;
            case Z_BUF_ERROR:
            errorMsg = @"Ran out of output buffer for writing compressed bytes.";
            break;
            case Z_VERSION_ERROR:
            errorMsg = @"The version of zlib.h and the version of the library linked do not match.";
            break;
            default:
            errorMsg = @"Unknown error code.";
            break;
        }
        NSLog(@"%s: zlib error while attempting compression: \"%@\" Message: \"%s\"", __func__, errorMsg, zlibStreamStruct.msg);
//[errorMsg release];
        
        // Free data structures that were dynamically created for the stream.
        deflateEnd(&zlibStreamStruct);
        
        return nil;
    }
    // Free data structures that were dynamically created for the stream.
    deflateEnd(&zlibStreamStruct);
    [compressedData setLength: zlibStreamStruct.total_out];
    NSLog(@"%s: Compressed file from %d KB to %d KB", __func__, [pUncompressedData length]/1024, [compressedData length]/1024);
    
    return compressedData;
}



@end
