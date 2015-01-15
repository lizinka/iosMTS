//
//  AKDataLoader.m
//  AKChartdemo
//
//  Created by Alan Kim on 5/5/14.
//  Copyright (c) 2014 Alan Kim. All rights reserved.
//

#import "AKDataLoader.h"

@implementation AKDataLoader


float LoadFloat(char*& ptr)
{
    char test[4];
    test[3] = *(char*)ptr++;
    test[2] = *(char*)ptr++;
    test[1] = *(char*)ptr++;
    test[0] = *(char*)ptr++;
    
    return *(float*)test;
}

int LoadInt(char*& ptr)
{
    char test[4];
    test[3] = *(char*)ptr++;
    test[2] = *(char*)ptr++;
    test[1] = *(char*)ptr++;
    test[0] = *(char*)ptr++;
    
    return *(int*)test;
}


- (void) LoadAndSend: (int)PriceID :(NSString*)strName
{
    NSString *filePath = [[NSBundle mainBundle] pathForResource:strName ofType:@"dat"];
    myData = [NSData dataWithContentsOfFile:filePath];
    if (myData)
    {
        nLen = [myData length];
        pPos = (char*)[myData bytes];
        pPosEnd = pPos+nLen;
        
        int n=0;
        
        while( pPos < pPosEnd )
        {
            float c, o, h, l, v;
            int d, t;
            
            c = LoadFloat(pPos);
            o = LoadFloat(pPos);
            h = LoadFloat(pPos);
            l = LoadFloat(pPos);
            v = LoadFloat(pPos);
            
            d = LoadInt(pPos);
            t = LoadInt(pPos);
            
            //[self.akchart PriceAdd:@"code" :@"name" :EAK_PEROID_DAY :1 :EAK_DECIMAL_0];
            
            [self.akchart PriceAppendData:PriceID];
            [self.akchart PriceUpdateData:PriceID:EAK_DATA_CLOSE:c];
            [self.akchart PriceUpdateData:PriceID:EAK_DATA_OPEN:o];
            [self.akchart PriceUpdateData:PriceID:EAK_DATA_HIGH:h];
            [self.akchart PriceUpdateData:PriceID:EAK_DATA_LOW:l];
            [self.akchart PriceUpdateData:PriceID:EAK_DATA_VOLUME:v];
            [self.akchart PriceUpdateDateTime:PriceID:d:t];
            
            n++;
            //if( n>500 )
            //    break;
        }
        
        [self.akchart PriceUpdateEnd:PriceID];
    }
}


- (void) Load: (int)PriceID :(NSString*)strName
{
    NSString *filePath = [[NSBundle mainBundle] pathForResource:strName ofType:@"dat"];
    myData = [NSData dataWithContentsOfFile:filePath];
    _PriceID = PriceID;
    
    if (myData)
    {
        nLen = [myData length];
        pPos = (char*)[myData bytes];
        pPosEnd = pPos+nLen;
        
        DataCnt = (nLen/28);
        CurrentStart = DataCnt;
    }
}

- (void) Send:(int)nStart :(int)nEnd
{
    if (myData)
    {
        char* pPos1 = pPos+nStart*4*7;
        char* pPos2 = pPos+nEnd*4*7;
        
        while( pPos1 < pPos2 )
        {
            float c, o, h, l, v;
            int d, t;
            
            c = LoadFloat(pPos1);
            o = LoadFloat(pPos1);
            h = LoadFloat(pPos1);
            l = LoadFloat(pPos1);
            v = LoadFloat(pPos1);
            
            d = LoadInt(pPos1);
            t = LoadInt(pPos1);
            
            [self.akchart PriceAppendData:_PriceID];
            [self.akchart PriceUpdateData:_PriceID:EAK_DATA_CLOSE:c];
            [self.akchart PriceUpdateData:_PriceID:EAK_DATA_OPEN:o];
            [self.akchart PriceUpdateData:_PriceID:EAK_DATA_HIGH:h];
            [self.akchart PriceUpdateData:_PriceID:EAK_DATA_LOW:l];
            [self.akchart PriceUpdateData:_PriceID:EAK_DATA_VOLUME:v];
            [self.akchart PriceUpdateDateTime:_PriceID:d:t];
        }
        
        [self.akchart PriceUpdateEnd:_PriceID];
    }
}

- (void) SendInsert:(int)nStart :(int)nEnd
{
    if (myData)
    {
        char* pPos1 = pPos+nStart*4*7;
        char* pPos2 = pPos+nEnd*4*7;
        
        [self.akchart PriceInsert:_PriceID :nEnd-nStart];
        
        int nIndex = 0;
        
        while( pPos1 < pPos2 )
        {
            float c, o, h, l, v;
            int d, t;
            
            c = LoadFloat(pPos1);
            o = LoadFloat(pPos1);
            h = LoadFloat(pPos1);
            l = LoadFloat(pPos1);
            v = LoadFloat(pPos1);
            
            d = LoadInt(pPos1);
            t = LoadInt(pPos1);
            
            
            [self.akchart PriceUpdateData:_PriceID:nIndex:EAK_DATA_CLOSE:c];
            [self.akchart PriceUpdateData:_PriceID:nIndex:EAK_DATA_OPEN:o];
            [self.akchart PriceUpdateData:_PriceID:nIndex:EAK_DATA_HIGH:h];
            [self.akchart PriceUpdateData:_PriceID:nIndex:EAK_DATA_LOW:l];
            [self.akchart PriceUpdateData:_PriceID:nIndex:EAK_DATA_VOLUME:v];
            [self.akchart PriceUpdateDateTime:_PriceID:nIndex:d:t];
            
            nIndex++;
        }
        
        [self.akchart PriceUpdateEnd:_PriceID];
    }
}

- (void) SendOne
{
    if (myData)
    {
        if( pPos < pPosEnd )
        {
            float c, o, h, l, v;
            int d, t;
            
            c = LoadFloat(pPos);
            o = LoadFloat(pPos);
            h = LoadFloat(pPos);
            l = LoadFloat(pPos);
            v = LoadFloat(pPos);
            
            d = LoadInt(pPos);
            t = LoadInt(pPos);

            [self.akchart PriceRealBegin:_PriceID];
            [self.akchart PriceRealUpdateData:_PriceID :EAK_DATA_CLOSE :c];
            [self.akchart PriceRealUpdateData:_PriceID :EAK_DATA_VOLUME :v];
            [self.akchart PriceRealUpdateDateTime:_PriceID :d :t];
            [self.akchart PriceRealEnd:_PriceID];
        }
        
    }
}


- (void) SendOne:(int)nIndex
{
    if (myData)
    {
        int nn = nIndex%4;
        if( nn == 0 )
        {
            if( pPos < pPosEnd )
            {
                _c = LoadFloat(pPos);
                _o = LoadFloat(pPos);
                _h = LoadFloat(pPos);
                _l = LoadFloat(pPos);
                _v = LoadFloat(pPos);
                
                _d = LoadInt(pPos);
                _t = LoadInt(pPos);
                
                if( nIndex > 300 && nIndex < 320 )
                    return;
                [self.akchart PriceRealBegin:_PriceID];
                [self.akchart PriceRealUpdateData:_PriceID :EAK_DATA_CLOSE :_o];
                [self.akchart PriceRealUpdateData:_PriceID :EAK_DATA_VOLUME :_v];
                [self.akchart PriceRealUpdateDateTime:_PriceID :_d :_t];
                [self.akchart PriceRealEnd:_PriceID];
            }
        }
        else if( nn == 1 )
        {
            [self.akchart PriceRealBegin:_PriceID];
            [self.akchart PriceRealUpdateData:_PriceID :EAK_DATA_CLOSE :_h];
            [self.akchart PriceRealEnd:_PriceID];
        }
        else if( nn == 2 )
        {
            [self.akchart PriceRealBegin:_PriceID];
            [self.akchart PriceRealUpdateData:_PriceID :EAK_DATA_CLOSE :_l];
            [self.akchart PriceRealEnd:_PriceID];
        }
        else if( nn == 3 )
        {
            [self.akchart PriceRealBegin:_PriceID];
            [self.akchart PriceRealUpdateData:_PriceID :EAK_DATA_CLOSE :_c];
            [self.akchart PriceRealEnd:_PriceID];
        }
    }
}


@end


