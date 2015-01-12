// JavaScript Document

var socket;
/*웹소켓 연결 */
function ini_websockt(host){
	
	var url=url_parser(document.location.href);
	if(url.path.match('coforward.com')){
		console.log('원격서버');
		var host = "ws://codetest.coforward.com:9000/web_mts/server/server.php";
	}else{
		console.log('로컬서버');
		var host = "ws://localhost:9000/web_mts/server/server.php";
	}
	console.log(url);
		//
		
	try {
		socket = new WebSocket(host);
		console.log('WebSocket - status '+socket.readyState);
		socket.onopen= function(msg) { 
							   console.log('websocket 연결됨 : ['+this.readyState+']'+host); 
						   };
		socket.onmessage = function(msg) {   
								from_android(msg);
								
								/*
							   data=jQuery.parseJSON(msg.data);
							   console.log(data);
							   console.log('데이터 수신 : ['+msg.origin+':'+msg.timeStamp+']'); 
							   //console.log('데이터 내용 : '+msg.data); 
							   data.time=msg.timeStamp;
							  //TR처리							  
							  if(data.tran){
								   //console.log(data.tran);
								   switch (data.tran) {
									   case 'item_reflash' :
											item_reflash(data);
									   break;
									   case 'TR1000' :
											TR1000(data);
											console.log('초기화 데이터 수신함');
									   break;
								   }
							  }else if(data.func){ //func처리
							  	//console.log('func처리..');
									switch (data.func){
										case 'dept':
											dept(data);
											console.log('실시간 호가 수신함 : '+msg.timeStamp);
										break;
										case 'quot':
											quot(data);
											console.log('실시간 체결가 수신함  : '+msg.timeStamp);
										break;
									}
							  }
							  
							  */
							   
						   };
		socket.onclose=function(msg) { 
							   console.log('websocket 연결종료 : ['+this.readyState+']'); 
						   };
	}
	catch(ex){ 
		console.log(ex); 
	}
}/*End of ini_websockt()*/

/*소켓연결 확인 및 콜백 실행*/
function wait_websoket(socket, callback){
	    timeout=setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if(callback != null){
                    callback();
                }
                return;

            } else {
                console.log("wait for connection...")
                wait_websoket(socket, callback);
            }
        }, 100); // wait 5 milisecond for the connection...
}/*End of wait_websoket(socket, callback)*/
