
//***** 통신, 리얼, 그리드 Header *****//

/*
typedef struct _Commheader
{
	int      msgl;
	Byte     msgf;
	char     func;
	uint16_t wmid;
} Commheader;
*/

typedef struct _Commheader
{
	Byte     msgf;
	char     func;
	uint16_t wmid;
} Commheader;

typedef struct _TrCommheader
{
	char svcp[16];
	char svcc[16];
	Byte msgk;
	Byte actf;
	Byte chkf;
	Byte lang;
	char fill[4];
} TrCommheader;

typedef struct _TrLedgeheader
{
	char wktp;
	char scrn[8];
	char usid[12];
	char utyp;
	char brok[16];
	char clnt[16];
	char aunt;
	char orgn[16];
	char yhpf;
	char ipad[15];
	char loip[15];
	char tlog;
	char rcod[6];
	char rmsg[70];
	char fill[21];
	
} TrLedgeheader;

typedef struct _RealCommheader
{
	char func;
	char flag;
	char ftype;
	char mlen[3];
} RealCommheader;

typedef struct _RealQuote
{
	char code[16];
	char pind;
	char bidp[9];
	char askp[9];
	char last[9];
	char diff[10]; //char sign포함
	char rate[3];
	char open[9];
	char high[9];
	char lowp[9];
	char time[6];
	char tday[8];
	char bday[8];
	char sprd[9];
	char pipc[9];
	char prat[10];
} RealQuote;

typedef struct _Querydata
{
	uint16_t xywin;
	char func;
	int  certflag;
	int  certoutflag;
	int  usetrheader;
	int  dlen;
	char trgroup[16];
	char trcode[16];
} Querydata;

typedef struct _GridInOut
{
	char ikey;      // key action
	char sdir;      // sort direction  1:asc, 2:desc
	char aflg;      // add action to top or bottom  0:replace, 1:top, 2:bottom
	char xpos;      // continuos status   0x40:default, 0x01:PgUp ScrUp enable, 0x02:PgDn ScrDn enable, 0x04:no local sorting
	char nrow[4];   // # of rows 
	char save[70];  // grid inout save field
} GridInOut;

typedef struct _BroadHeader
{
	Byte mtyp;     
	char styp;
	char mlen[4];
	
} BroadHeader;

//***** 화면 layout *****//

//로그인헤더
typedef struct _LoginIN
{
	char usid[16];
	char pswd[12];
	char stype;
	char optn[10];
	char ipad[15];
} LoginIN;

typedef struct _LoginOUT
{   
	Byte sign;
	Byte cmsk;
	Byte smsk;
	Byte auth;
	char usid[16];
	char usnm[30];
	char scrn[8];
	char perm[16];
	char svtm[14];
	char svip[15];
	char rmsg[70];
	char aflg;
	char brco[16];
	char clno[16];
	char acut;
	char orco[16];
	char scrg[100];
	char calf;
	char cadn[256];
	char casn[10];
	char capw;
	char cass;
	char rsvb[16];
	char gcnt[4];
} LoginOUT;

//계좌조회
typedef struct _Xo015101_IN
{
	char usid[8];  // UserID
	
} Xo015101_IN;
/*
typedef struct _Xo015101_OUT
{
	char rcod[6];   // 메시지코드
	char rmsg[70];  // 메시지
	
} Xo015101_OUT;
*/
typedef struct _Xo015101_OCCUR
{
	char acno[20];  // 계좌번호
	char acnm[50];  // 계좌명
	char acgb;      // 위임계좌구분 0:자기, 1:위임
	
} Xo015101_OCCUR;

//시세조회
typedef struct _Xibo5007_IN
{
	char code[16]; //코드리스트
	
} Xibo5007_IN;

typedef struct _Xibo5007_OUT
{
	char askp[15];   //매도가
	char bidp[15];   //매수가
	char open[15];   //시가
	char high[15];   //고가
	char lowp[15];   //저가
	char last[15];   //현재가
	char diff[15];   //전일대비
	char rate[15];   //전일대	비율(%)
	char tday[15];   //거래일
	char time[15];   //체결시간
	char hitm[15];   //고가시간
	char lotm[15];   //저가시간
	char bday[15];   //영업일
	char sprd[15];   //스프레드
	char bidi[15];   //매수이자
	char aski[15];   //매도이자 
	char pipc[15];   //환산가치
	char pind;       //소수점자릿수
} Xibo5007_OUT;

//멀티시세
typedef struct _Xibo5008_IN
{
	char gubn;       // 0:all, 1:tradable
	char flag;       // H:Himawari, F:FXCM
	char code[16]; //코드리스트
} Xibo5008_IN;

typedef struct _Xibo5008_OCCUR
{
	char code[16];   //종목
	char askp[15];   //매도가
	char bidp[15];   //매수가
	char open[15];   //시가
	char high[15];   //고가
	char lowp[15];   //저가
	char last[15];   //현재가
	char diff[15];   //전일대비
	char rate[15];   //전일대	비율(%)
	char tday[15];   //거래일
	char time[15];   //체결시간
	char bday[15];   //영업일
	char sprd[15];   //스프레드
	char bidi[15];   //매수이자
	char aski[15];   //매도이자 
	char pipc[15];   //환산가치
	char pind;       //소수점자릿수
} Xibo5008_OCCUR;




//틱 layout
typedef struct _Xibg1204_IN
{
	char code[16]; // 종목코드
	char nday[3];  // 몇일간
	char tick[3];  // 몇틱
	char dcnt[5];  // Count 
	char dsdt[16]; // 시작일
	char dedt[16]; // 마지막일
	
} Xibg1204_IN;

typedef struct _Xibg1204_OUT
{
	char code[16]; // 종목코드
	char pind;     // 소수점 자릿수
	char nrec[5];  // count
	
} Xibg1204_OUT;

typedef struct _Xibg1204_OCCUR
{
	char tday[8];  // 거래일
	char time[6];  // 체결시간
	char open[9];  // 시가
	char high[9];  // 고가
	char lowp[9];  // 저가
	char last[9];  // 현재가
	char mqty[12]; // 체결수량
	char bidp[9];  // 매수 
	char askp[9];  // 매도
} Xibg1204_OCCUR;

//분 layout
typedef struct _Xibg1202_IN
{
	char code[16]; // 종목코드
	char nday[3];  // 몇일간
	char nsec[5];  // 몇분
	char dcnt[5];  // Count 
	char dsdt[16]; // 시작일
	char dedt[16]; // 마지막일
	char flag;     // Open/High/Low  1:BAB, 2:BBB, 3:AAB, 4:AAA, 5:MAB, 6:MMM
	char gubn;     // 0:일반조회, 1:과거조회
} Xibg1202_IN;

typedef struct _Xibg1202_OUT
{
	char code[16]; // 종목코드
	char pind;     // 소수점 자릿수
	char nrec[5];  // count
} Xibg1202_OUT;

typedef struct _Xibg1202_OCCUR
{
	char tday[8];  // 거래일
	char time[6];  // 체결시간
	char open[9];  // 시가
	char high[9];  // 고가 
	char lowp[9];  // 저가
	char last[9];  // 현재가
	char mqty[12]; // 체결수량
} Xibg1202_OCCUR;

//일주월 layout
typedef struct _Xibg1203_IN
{
	char code[16]; // 종목코드
	char dtgb;     // 0:일, 1:주, 2:월
	char dcnt[5];  // Count 
	char dsdt[16];  // 시작일
	char dedt[16];  // 마지막일
	
} Xibg1203_IN;

typedef struct _Xibg1203_OUT
{
	char code[16]; // 종목코드
	char pind;     // 소수점 자릿수
	char nrec[5];  // count
} Xibg1203_OUT;

typedef struct _Xibg1203_OCCUR
{
	char tday[8];  // 거래일(영업일)
	char time[6];  // 체결시간
	char open[9];  // 시가
	char high[9];  // 고가 
	char lowp[9];  // 저가
	char last[9];  // 현재가
	char mqty[12]; // 거래량
} Xibg1203_OCCUR;

//신규주문, 청산주문
typedef struct _Xo200101_IN
{
	char acno[20]; // 계좌번호 
	char pswd[8];  // 비밀번호
	char code[8]; // 종목코드 
	char mdms;     // 매도매수
	char type;     // 주문유형
	char jmgb;     // 주문구분
	char jqty[7];  // 주무수량
	char jprc[12]; // 주문가격 
	char sprc[12]; // STOP가격
	char date[8];  // 유효일자
	char tsec[2];  // 거래유형
	char psno[13]; // 청산포지션번호
} Xo200101_IN;

typedef struct _Xo200101_OUT
{
	char jmno[7];  // 주문번호
} Xo200101_OUT;

//정정/취소주문
typedef struct _Xo200201_IN
{
	char acno[20]; // 계좌번호 
	char pswd[8];  // 비밀번호
	char jcgb;     // 정정/취소구분 
	char ojno[7];  // 원주문번호
	char code[8];  // 종목코드
	char type;     // 주문유형
	char jqty[7];  // 주무수량
	char jprc[12]; // 주문가격 
	char sprc[12]; // STOP가격
	
} Xo200201_IN;

typedef struct _Xo200201_OUT
{
	char jmno[7];  // 주문번호
} Xo200201_OUT;

//체결내역
typedef struct _Xo420301_IN
{
	char acno[20]; // 계좌번호
	char pswd[8];  // 비밀번호
	char code[7];  // 종목코드
	char frdt[8];  // 조회일자
	
} Xo420301_IN;

typedef struct _Xo420301_OUT
{
	char bqty[7];  // 매입수량합계
	char sqty[7];  // 매도수량합계
	char tqty[7];  // 수량합계
} Xo420301_OUT;

typedef struct _Xo420301_OCCUR
{
	char acno[20]; // 계좌번호
	char acnm[50]; // 계좌명
	char dedt[8];  // 체결일자
	char orno[7];  // 주문번호 
	char code[8];  // 종목코드
	char mdms;     // 매매구분 1:매수, 2:매도
	char type;     // 주문유형 1:시장가, 2:지정가, 3:STOP Market, 4:STOP Limit, 5:OCO, 6:FOK
	char tsec[2];  // 거래유형 11:진입, 12:청산
	char pono[13]; // 포지션번호
	char dqty[7];  // 체결수량
	char dpri[12]; // 체결가격 
	char ortm[14]; // 주문시간
	char detm[14]; // 체결시간
	char fcmd[10]; // FCM코드
	char deno[7];  // 
} Xo420301_OCCUR;

//미체결내역
typedef struct _Xo420201_IN
{
	char acno[20]; // 계좌번호
	char pswd[8];  // 비밀번호
	char code[7];  // 종목코드
	
} Xo420201_IN;

typedef struct _Xo420201_OCCUR
{
	char acno[20]; // 계좌번호
	char acnm[50]; // 계좌명
	char orno[7];  // 주문번호
	char ojno[7];  // 원주문번호
	char stat[2];  // 상태 10:주문대기, 11:주문, 20:정정대기, 21:정정, 30:취소대기, 31:취소
	char code[8];  // 종목코드
	char mdms;     // 매매구분 1:매수, 2:매도
	char type;     // 주문유형 1:시장가, 2:지정가, 3:STOP Market, 4:STOP Limit, 5:OCO, 6:FOK
	char tsec[2];  // 거래유형 11:진입, 12:청산
	char pono[13]; // 포지션번호
	char oqty[7];  // 주문수량
	char opri[12]; // 주문가격 
	char mqty[7];  // 미체결수량
	char dqty[7];  // 체결수량
	char spri[12]; // STOP가격 
	char ortm[14]; // 주문시간
	char fcmd[10]; // FCM코드
	char orst[8];  // 유효기간 0:DAY, 1:GTC, 6:일자
} Xo420201_OCCUR;

//보유포지션 및 평가손익
typedef struct _Xo420402_IN
{
	char acno[20]; // 계좌번호
	char pswd[8];  // 비밀번호
	char code[7];  // 종목코드
	
} Xo420402_IN;

typedef struct _Xo420402_OCCUR
{
	char acno[20]; // 계좌번호
	char acnm[50]; // 계좌명
	char code[8];  // 종목코드
	char orno[7];  // 체결번호
	char pono[13]; // 포지션번호
	char mdms;     // 매매구분 1:매수, 2:매도
	char pqty[7];  // 포지션수량
	char ppri[12]; // 평균가격 
	char rpri[12]; // 현재가격
	char spri[12]; // 청산STOP가격
	char lpri[12]; // 청산LIMIT가격
	char curr[3];  // 손익통화
	char evpl[18]; // 평가손익
	char excu[3];  // 환전통화
	char expl[18]; // 환전평가손익
	char cqty[7];  // 청산가능수량
	char fcmd[10]; // FCM코드
} Xo420402_OCCUR;





//틱 layout
typedef struct _Xibg3002_IN
{
    char code[16]; // 종목코드
    char dcnt[8];  // 몇일간
    char nmin[8];  // 몇틱
    char next;  // Count
    char tkey[31]; // 시작일
    char dummy[12]; // 마지막일
    
} Xibg3002_IN;

typedef struct _Xibg3002_OUT
{
    char o_code[16]; // 종목코드
    char o_nrec[8];     // 소수점 자릿수
    char o_nmin[8];  // count
    char o_next; // 종목코드
    char o_tkey[31];     // 소수점 자릿수
    char o_cDataKey[4];  // count
    char o_dummy[8];  // count
    
} Xibg3002_OUT;

typedef struct _Xibg3002_OCCUR
{
    char r_tday[8];  // 거래일
    char r_time[6];  // 체결시간
    char r_open[9];  // 시가
    char r_high[9];  // 고가
    char r_lowp[9];  // 저가
    char r_last[9];  // 현재가
    char r_tvol[12]; // 체결수량
} Xibg3002_OCCUR;



//시세조회
typedef struct _Pibo7011_IN
{
    char InboundItemCd[16]; // 종목코드

    
} Pibo7011_IN;

typedef struct _Pibo7011_OUT
{
    char r_ItemCd[16]; // 종목코드
    char r_Curr [16];     // 소수점 자릿수
    char r_Diff[15];  // count
    char r_UpDwnRatio[15]; // 종목코드
    char r_Open[15];     // 소수점 자릿수
    char r_High[15];  // count
    char r_Low[15];  // count
    char r_SellHoga[15]; // 종목코드
    char r_buyHoga [15];     // 소수점 자릿수
    char r_SellQty[15];  // count
    char r_BuyQty[15]; // 종목코드
    char r_Volume[15];     // 소수점 자릿수
    char r_SettlementPrice[15];  // count
    char r_SettlementDate[15];  // count
    char r_BusinessDate[15]; // 종목코드
    char r_MatchTime [15];     // 소수점 자릿수
    char r_ContractHigh[15];  // count
    char r_contractHighDate[15]; // 종목코드
    char r_ContractLow[15];     // 소수점 자릿수
    char r_ContractLowDate[15];  // count
    char r_LastDate[15];  // count
    
} Pibo7011_OUT;

