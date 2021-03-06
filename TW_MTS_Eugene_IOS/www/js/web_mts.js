// JavaScript Document
jQuery(function(){
	ini_app();
});

/*공통설정*/
var mts_prefix='web_mts'
var item_catagory_caption={'currency':'통화','interest':'채권','index':'지수','commodity':'농산물','metals':'금속','energy':'에너지','single stock':'지수옵션','etc comodity':'기타 농산물', 'other':'기타'}
var month_code={'01':'F','02':'G','03':'H','04':'J','05':'K','06':'M','07':'N','08':'Q','09':'U','10':'V','11':'X','12':'Z'};
var month_number={'F':1,'G':2,'H':3,'J':4,'K':5,'M':6,'N':7,'Q':8,'U':9,'V':10,'X':11,'Z':12};
var app_type='web';
var page_height='100%';
var all_menu_height=500;
var option_tr_cnt=10;
var dialog_option_tr_cnt=10;
var dialog_height='90%';
var dialog_article='70%';
var chart_Hight='70%';
var header_height=48;
var PixelRatio=1;
/*앱 초기화 실행*/
function ini_app(){
	//app 플랫폼 체크
	if (navigator.userAgent.match('Android') != null){ 
		app_type='android';
	}else if(navigator.userAgent.match('iPhone') != null){ 
		app_type='ios';	
	}
	
	if(app_type=='android'){ //실행 환경이 안드로이드일 경우 
		alert=function(msg){
			var page_id=jQuery.mobile.activePage.attr('id');
			msg_json={pageId:'#'+page_id,type:'alert',msg:msg}
			var send_meg=JSON.stringify(msg_json);
			window.android_os.reqAlert(send_meg);	
		}
		
		confirm=function(msg){
			var page_id=jQuery.mobile.activePage.attr('id');
			msg_json={pageId:'#'+page_id,type:'confirm',msg:msg}
			var send_meg=JSON.stringify(msg_json);
			window.android_os.reqAlert(send_meg);	
		}	
		PixelRatio=window.devicePixelRatio;
	}//End of if(app_type=='android')
	
	
	if(app_type=='ios'){// 실생 환경이 ios인 경우
		PixelRatio=1;
	}//End of if(app_type=='ios')
	
		
	if(app_type=='web'){ //실행 환경이 웹 일경우 
		ini_websockt();
		window.android_os={};
		window.android_os.setMessage=function(msg){	console.log('msg to native : '+msg);};
		window.android_os.ReqLogin=function(msg){console.log('login to native : '+msg);};
		window.android_os.ReqRealCancel=function(){return false;}
	}//End of if(app_type=='web');
	
		
	ini_test();
	ini_login()/*로그인 기능 처리*/
	ini_setting()/*설정창 관련*/
	//ini_item_search()/*종목검색 관련 초기화*/
	ini_item_select()/*종목아이템 선택*/
	//ini_group();/*관심그룹 관련 초기화*/
	ini_item_list();
	ini_item();
	ini_layer();
	ini_dialog();
	ini_footer();

	/*페이지 이동관련 초기화*/
	jQuery('#app').on('tap','a:not([data-rel="back"],[href="#HELP"],[data-rel="dialog"],[href^="tel"])', function(){return ini_page(this,navigation_page);});
	
	/*스크롤 감지 페이지 초기화*/
	$(window).on('scrollstop',function(){
		active_id=jQuery.mobile.activePage.attr('id');
		if($(document).height() > $(window).height()){
			if($(window).scrollTop() == $(document).height() - $(window).height()){
			  switch('#'+active_id){
			 	case '#BOARD_LIST':
					board_more();
				break;
			  }
			}
		}
	});//End of $(window).scroll(function()
	
	jQuery('#app').on('pagebeforeshow','section[data-role="page"]',
			function(){
				jQuery.mobile.loading('hide'); 
				jQuery('div.bg_layer').remove(); 			
			}
	);
	
	jQuery('#app').on('pageshow','section[data-role="page"]',function(){show_layer_help_before('auto');});
	jQuery('#app').on('tap','button.btn_close_loading',function(){jQuery.mobile.loading('hide');});
																						
	    page_height=jQuery(window).height();
		header_height=35;	
	var footer_height=58; 
	var commen_height=30
	var table_margin=10;
	var thead_height=60;
	var tbody_height=page_height-(header_height+footer_height+commen_height+thead_height);
	var tr_height=27;
	var dialog_header=30
	 
	all_menu_height=page_height-(header_height+footer_height);	
	dialog_height=page_height-header_height;
	dialog_article=dialog_height-dialog_header;
	chart_Hight=(page_height-(header_height+55))*PixelRatio;
	option_tr_cnt=parseInt(tbody_height/tr_height);
	dialog_option_tr_cnt=parseInt((dialog_article-thead_height)/tr_height);
	
	/*테마적용*/
	var setting_data=get_local_json('web_mts_SETTING');
	console.log(setting_data);
	if(obj.has_key(setting_data,'theme')){
		jQuery('#app').attr('data-theme',setting_data.theme);
	}

}/*End of ini_app()*/

/*테스트 모드*/
function ini_test(){
	console.log('===ini_test()===');
	set_test_mode()
	jQuery('#btn_test_localstorage').on('tap',function(){test_local()});
	jQuery('#btn_console_close').on('tap',function(){toggle_console()});
	jQuery('#btn_test_del_exchange').on('tap',function(){del_local_exchange()});
	jQuery('#btn_test_del_group').on('tap',function(){del_local_group()});
	jQuery('#btn_test_del_menu').on('tap',function(){del_local_menu()})
	jQuery('#btn_test').on('tap',function(){test_console()});
	jQuery('#btn_notification_test').on('tap',function(){test_notification_test()});
}/*End of ini_test()*/
	
	function set_test_mode(){
		jQuery('#app').attr('data-mode','test');
		toggle_console();
	}//End of set_test_mode()
	
	function test_local(){
		console.log('로컬스토리지 :'+local.test())	
	}//End of test_local()
	
	function toggle_console(){
		var state=jQuery('#app').attr('data-console');
		if(state!='OFF'){
			jQuery('#app').attr('data-console','OFF');
			jQuery('#btn_console_close').html('열기');
		}else{
			console.log=function(msg){jQuery('#console div').append('<p class="send">'+msg+'</p>');}
			jQuery('#app').attr('data-console','ON');
			jQuery('#btn_console_close').html('닫기');
		}
	}//End of toggle_console()
	
	function del_local_exchange(){
		console.log('==del_exchange==');
		var key=mts_prefix+'_exchange';
		var exchange_info=get_local_json(key);
		for(exchange in exchange_info){
			var ex_key=mts_prefix+'_'+exchange;
			local.del(ex_key);
		}
		local.del(key);
		console.log('종목정보가 삭제됨');
	}//End of del_local_exchange()
	
	function del_local_group(){
		console.log('==del_local_group==');
		var group_info=get_local_json('group');
		for(key in group_info){local.del(key);}
		local.del('group');
		console.log('그룹 정보가 삭제됨');
	}//End of End of del_local_exchange();
	
	function del_local_menu(){
		console.log('==del_local_menu()==');
		local.del('shortcut');
		console.log('하단메뉴정보가 삭제됨');
	}
	
	function test_console(){
		console.log('==test_console()==');
		switch (jQuery('#test_page_id').val()){
			case '#LOGIN':
				var check_exchange_data=check_exchange();
				var msg={pageId:jQuery('#test_page_id').val(),
						 exchage:check_exchange_data,
						 type:"existing"}
			break;
			
			default:
				var msg={pageId:jQuery('#test_page_id').val(),
						 itemCd:jQuery('#test_item').val(),
				 		 type:jQuery('#test_data_type').val()};
			break;
		}
		console.log(msg);
		send_native(msg)
		msg=JSON.stringify(msg);
		jQuery('#recive_data_div').append('<p class="send">'+msg+'</p>');
		
	}/*End of test_console()*/

	function test_notification_test(){
		console.log('==test_notification_test()==');
		var type=jQuery('#notification_select').val();
		var msg=jQuery('#notification_text').val();
		if(type=='alert'){
			alert(msg);
		}else if(type=='confirm'){
			confirm(msg);
		}
		var page_id=jQuery.mobile.activePage.attr('id');
		jQuery('#preview_notification_data').html('{pageId:#'+page_id+',type:'+type+',msg:'+msg+'}');
	}//End of test_notification_test();
	
/*네이티브로 메세지 전달*/
function send_native(msg, no_loading_icon){
	console.log('==send_native(msg)==/'+app_type);
	console.log(msg);
	if(!no_loading_icon){
		jQuery.mobile.loading('show');
	}
	msg=JSON.stringify(msg);
	
	switch (app_type){
		case 'android':
			window.android_os.setMessage(msg);
		break;
		case 'ios':
			window.location = "jscall://" + "setMessage//" + msg
		break;
		case 'web':
			wait_websoket(socket, function(){socket.send(msg)});
		break
	}
}/*send_native(msg)*/

/*리얼타임 취소*/
function cancel_real_data(){
	console.log('==cancel_real_data()==');
	switch (app_type){
		case 'android':
			window.android_os.ReqRealCancel('---');
		break;
		case 'ios':
			window.location = "jscall://" + "ReqRealCancel//" + "---";
		break;
		case 'web':
			return false;
		break
	}
}/*cancel_real_data()*/

//로그인
function before_login(msg){
	console.log('==before_login==');
	msg=JSON.stringify(msg);
	
	switch (app_type){
		case 'android':
			window.android_os.ReqLogin(msg);
		break;
		case 'ios':
			window.location = "jscall://" + "ReqLogin//" + msg;
		break;
		case 'web':
			wait_websoket(socket, function(){socket.send(msg)});
		break
	}
}


/*안드로이드로 부터 받은 메세지 처리*/
function from_android(msg){
	console.log('==form_android==');
	/*테스트 코드 적용*/
	if(app_type=="web"){
		console.log('웹소켓 데이터 수신 : ['+msg.origin+':'+msg.timeStamp+']');
		msg=msg.data
	}
	console.log(msg.length);
	console.log(msg);	
	data=jQuery.parseJSON(msg);
	console.log(data);
	var page_id=jQuery.mobile.activePage.attr('id');
	
	if(page_id=='TEST'){
		jQuery('#recive_data_div').append('<p class="recive">'+msg+'</p>');
		return false;
	}
	
	switch (data.pageId){
		case '#NEWWORK':
			if(type=='close'){
			
			}else if(type=='connect'){
			
			}
		break;
		case '#LOGIN':
			if(data.type=='login'){
				longin_process(data); 
			}else if(data.type=='existing'){
				ini_item_code(data)
			}
		break;
		case'#ITEM_LIST':
			if(data.type=='existing'){
				item_list_table(data);
			}else if(data.type=='more'){
				item_extend_check(data);
			}
			
		break;
		
		case '#ITEM_SEARCH': // 검색결과 표시
			search_result_ex(data);
		break;
		
		case '#ITEM_ASKING': // 호가 데이터 처리
			if(data.type=='existing'){
				ini_asking(data);
			}else if(data.type=='real'){
				item_asking_real(data);
			}else if(data.type=='more'){
				//item_info_ex(data);
				dialog_item_info(data);
			}
		break;
		
		case '#ITEM_CONCLUDE':
			if(data.type=='existing'){
				ini_conclude(data);
			}else if(data.type=='real'){
				item_conclude_real(data);
			}else if(data.type=='more'){
				//item_info_ex(data);
				dialog_item_info(data);
			}
		break;
		
		case '#ITEM_DAILY':
			if(data.type=='existing'){
				ini_daily(data);
			}else if(data.type=='real'){
				item_daily_real(data);
			}else if(data.type=='more'){
				//item_info_ex(data);
				dialog_item_info(data);
			}
		break;
		
		case '#ITEM_CHART':
			if(data.type=='existing'){
				ini_chart(data);
			}else if(data.type=='real'){
				item_chart_real(data);
			}
		break;
		
		case '#ITEM_OPTION':
			if(data.type=='existing'||data.type=='more'){
				ini_option(data);
			}else if(data.type=='real'){
				option_real(data);
			}
		break;
		
		case '#BOARD_LIST':
			ini_board_list(data);
		break;
		
		case '#BOARD_VIEW':
			if(data.type=='existing'){
				ini_board_view(data);
			}
		break;
		
		case '#NOTICE_LIST':
			ini_board_list(data);
		break;
		
		case '#NOTICE_VIEW':
			if(data.type=='existing'){
				ini_board_view(data);
			}
		break;
	}
}/*from_android(msg)*/


/**
* 로그인 기능 초기화
*
*/
function ini_login(){
	console.log('==ini_login==')
	$( window ).resize(function(){jQuery('#LOGIN').toggleClass('active_input');}); 
	
	if(local.get('mts_id')){
		jQuery('#LOGIN #login_id').val(local.get('mts_id'));
	}
	
	jQuery('#LOGIN').on('pagebeforeshow', function(){set_login_type()});
	jQuery('#LOGIN').on('pagehide', function(){login_class()});
	jQuery('#app').on('tap','#LOGIN button.btn_history_back', function(){window.history.go(1);});
	jQuery('#app').on('tap','#LOGIN button.btn_colose_app',function(){close_app();})
	jQuery('#app').on('tap','#CLOSE button.btn_history_back', function(){window.history.back();});
	jQuery('#app').on('tap','#CLOSE button.btn_colose_app',function(){close_app();})
	
	jQuery('#LOGIN article[data-role="content"]').css('height',$(window).height());
	jQuery('#CLOSE article[data-role="content"]').css('height',$(window).height());
	
	jQuery('#app').on('change','#check_realtime',function(){toggle_real_time(this)});
	jQuery('#app').on('submit','#login_form',function(){return ini_login_process(this)});
	set_login_type()
}

	function close_app(){
		console.log('==close_app()==')
		switch (app_type){
			case 'android':
				window.android_os.closeApp('app_close');
			break;
			case 'ios':
				window.location = "jscall://" + "closeApp//" + "msg";
			break;
			case 'web':
				alert('app_close');
			break
		}
	}//End of close_app()
	
	function toggle_real_time(input){
		console.log('==toggle_real_time(input)==');
		var check=jQuery(input).is(':checked');
		if(check){
			jQuery('#app').attr('data-real',true);
			alert('실시간 데이터를 수신합니다. \n접속 환경에 따라 추가적인 데이터 요금이 발생 할 수 있습니다.');
		}else{
			jQuery('#app').attr('data-real',false);
			alert('기존 데이터만 수신합니다. \n실시간으로 변화되는 데이터는 표시되지 않습니다.');
		}
	}//End of toggle_real_time(input)

	function set_login_type(){
		jQuery('#LOGIN article[data-role="content"]').css('height',$(window).height());
		var data=get_local_json('web_mts_SETTING');
		if(data.login=='inner'){
			jQuery('#LOGIN label[for="login_id"]').text('사원번호');
			jQuery('#LOGIN input#login_id').attr('placeholder','사원번호를 입력하세요');
		}else{
			jQuery('#LOGIN label[for="login_id"]').text('아이디');
			jQuery('#LOGIN input#login_id').attr('placeholder','아이디를 입력하세요');
		}
	}


	function ini_login_process(form){
		console.log('==ini_login_process(form)==');
		jQuery('#LOGIN').attr('data-ani','play');
		var login_id=jQuery(form).find('#login_id').val();
		if(login_id==''){
			alert('아이디를 입력하세요');
			return false;
		}
		var login_pass=jQuery(form).find('#login_pw').val();
		if(login_pass==''){
			alert('비밀번호를 입력하세요');
			return false;
		}
		var save_id_check=jQuery('#LOGIN input#save_id_check').is(':checked');
		if(save_id_check){
			local.save({'mts_id':login_id})
		}else{
			local.del('mts_id');
		}
		
		var setting=get_local_json('web_mts_SETTING');
		if(setting.login=='inner'){
			//login_id='@'+login_id;
			var login_type='S';
		}else{
			var login_type='C';
		}
		
		var login_data={pageId:"#LOGIN",loginType:login_type,id:login_id,pass:login_pass,type:'login'}
		console.log(login_data);
		before_login(login_data);
		//load_js('js/futures_data.js',ini_item_code);
		return false;
	}//End of login_process(form)

	function login_class(){
		var login_check=jQuery('#LOGIN').attr('data-login');
		if(login_check=='true'){
			jQuery('#LOGIN').addClass('login_ok');
		}else{
			jQuery('#LOGIN').removeClass('login_ok');
		}
	}

		//저장된 거래소의 변경날짜 확인
		function check_exchange(){
			var data=get_local_json(mts_prefix+'_exchange');
			console.log(data);
			var check_data={};
			for(key in data){
				var exchange_data=get_local_json(mts_prefix+'_'+key);
				check_data[key]=exchange_data.date;
			}
			return check_data;
		}//End of chek_exchange()
	
	//로그인 처리 
	function longin_process(data){
		console.log('==longin_process(data)==');
		if(data.state=='false'){
			alert(data.msg);
			jQuery('#LOGIN').attr('data-ani','pause');
			jQuery('#LOGIN').attr('data-login','false');
		}else{
			var key=mts_prefix+'_tel';
			var tel_obj={};
				tel_obj[key]=data.tel;
			local.save(tel_obj);
			jQuery('#LOGIN').attr('data-login','true');
			var real_time=jQuery('#login_form').find('#check_realtime').is(':checked');
			jQuery('#app').attr('data-realtime',real_time);
			var check_exchange_data=check_exchange();
			var login_data={pageId:"#LOGIN",exchage:check_exchange_data,type:'existing'}
			send_native(login_data, true);
		}
	}//End of login_process(data)

	//거래소및 종목코드 저장 처리
	function ini_item_code(data){
		console.log('===ini_item_code()===');
		var exchange=data.body.exchange;
		var option=data.body.option;
		var exchange_data={}
		//거래소별 정보 저장
		for(key in exchange){
			exchange[key].option_category=new Array();
			var cnt=1;
			if(obj.has_key(option,key)){
				var option_data=option[key];
				cnt=option_data.length;
				for(i=0;i<option_data.length;i++){	
					for(category in exchange[key].category){
						option_category_check=false;
						for(item_code in exchange[key].category[category]){
							exchange[key].category[category][item_code].futures=true;
							var ex_temp=exchange[key].category[category][item_code].expiration;
							exchange[key].category[category][item_code].expiration=jQuery.grep(ex_temp, function(exp_date){return exp_date<99999999});
							if(option_data[i]==item_code){
								exchange[key].category[category][item_code].option=true;
								option_category_check=true;
							}
							
						}//아이템 코드 반복
						if(option_category_check==true){
							if(jQuery.inArray(category,exchange[key].option_category)<1){
								exchange[key].option_category.push(category);
							}
						}
					}//category 반복
				}//거래소별 옵션 반복
	
			}else{
				for(category in exchange[key].category){
					for(item_code in exchange[key].category[category]){
						exchange[key].category[category][item_code].futures=true;
					}//아이템 코드 반복
				}//category 반복
			}
							
			ex_key=mts_prefix+'_'+key;
			exchange_data[key]=exchange[key].caption;
			ex_data=JSON.stringify(exchange[key]);
			var save_obj={};
			save_obj[ex_key]=ex_data;
			local.save(save_obj);
		}
		//거래소 기본정보 저장
		exchange_data=JSON.stringify(exchange_data);
		var exchange_total=mts_prefix+'_exchange'
		var save_exchange={}
		save_exchange[exchange_total]=exchange_data;
		local.save(save_exchange);
		var group_data=get_local_json('group');
		
		var navi_page='#ITEM_SELECT';
		if(obj.size(group_data)>0){
			navi_page='#ITEM_LIST';	
		}
		var navi_data={'pageId':navi_page};
		navigation_page(navi_data,true);
	}//End of ini_item_code()

/*설정 페이지 초기화*/
function ini_setting(){
	jQuery('#SETTING').on('pagebeforeshow', function(){setting_check()});
	jQuery('#SETTING').on('change','select#setting_login', function(){login_type_alret(this)});
	jQuery('#SETTING').on('change','select#setting_theme', 
							function(){
								var theme=jQuery(this).val();
								jQuery('#app').attr('data-theme',theme);
							});
	jQuery('#SETTING').on('tap','button#save_setting', function(){setting_save()});
}//End of ini_setting()

	/*기존 설정 표시*/
	function setting_check(){
		console.log('==setting_check()==');
		var data=get_local_json('web_mts_SETTING');
		console.log(data);
		jQuery('#SETTING select#setting_login').val(data.login);
		jQuery('#SETTING select#setting_theme').val(data.theme);
		if(data.login=='inner'){
			jQuery('#setting_item_login .setting_desc').text('사원번호로 로그인 합니다.');
		}else{
			jQuery('#setting_item_login .setting_desc').text('회원 아이디로 로그인 합니다.');
		}
	}
	/*로그인 타입 변경 경고창*/
	function login_type_alret(type){
		var check=jQuery(type).val();
		if(check=='inner'){
			alert('[사원용]은 내부 업무용입니다. \n일반고객은 로그인 형식을 \n[고객용]으로 설정하시기 바랍니다.');
			jQuery('#setting_item_login .setting_desc').text('사원번호로 로그인 합니다.');
		}else{
			jQuery('#setting_item_login .setting_desc').text('회원 아이디로 로그인 합니다.');
		}
	}//End of login_type_alret(type)
	
	function setting_save(){
		console.log('==setting_save()==');
		var setting_data={
			'login': jQuery('#SETTING select#setting_login').val(),
			'theme': jQuery('#SETTING select#setting_theme').val()
		}
		console.log(setting_data);
		var save_string=JSON.stringify(setting_data);
		var save_obj={'web_mts_SETTING':save_string};
		local.save(save_obj);
		alert('설정을 저장하였습니다.');
		window.history.back();
	}//End of setting_save();


/*페이지 코드데이터 지정*/
function ini_page(triger, callback){
	console.log('==ini_page(triger, callback)==');
	jQuery.mobile.loading('show');
	var footer=jQuery('#app footer[data-role="footer"]');
	var all_menu=footer.find('div.all_menu');
	if(footer.hasClass('open')){
		//footer.empty();
		all_menu.css('height',0);
		footer.removeClass('open');
	}
	
	var page_id=jQuery(triger).attr('href');
		
	var code=jQuery(triger).attr('data-code');
	var item_type=jQuery(triger).attr('data-type');
	if(jQuery(page_id).length>0){
		if(code){
			jQuery(page_id).attr('data-code',code);
		}
	}
	var navi_data={'pageId':page_id,'type':item_type,'code':code};	
	var server_page=['#ITEM_ASKING','#ITEM_CONCLUDE','#ITEM_DAILY','#ITEM_OPTION','#ITEM_CHART','#BOARD_LIST','#BOARD_VIEW','#NOTICE_LIST','#NOTICE_VIEW','#SCHEDULE'];
	
	if(parseInt(jQuery.inArray(page_id,server_page))>-1){
		console.log('=='+item_type+'==');
		switch (item_type){		
			case 'option':
				var msg={pageId:page_id,itemCd:code,itemType:item_type,serverCode:code,cnt:option_tr_cnt,type:'existing'};
			break;
			case 'option_item':
				var exercise=jQuery(triger).attr('data-exercise');
				var option_type=jQuery(triger).attr('data-option_type');
				var server_code=jQuery(triger).attr('data-server_code');
				var msg={pageId:page_id,itemCd:code,itemType:item_type,serverCode:server_code,optionExe:exercise,optionType:option_type,type:'existing'};
				
			break;
			case 'board_list':
				var msg={pageId:page_id,itemType:item_type,nrec:10,type:'existing'};
			break;
			case 'notice_list':
				var msg={pageId:'#NOTICE_LIST',itemType:item_type,nrec:10,type:'existing'};
			break;
			
			case 'board_view':
				var view_seqn=Number(jQuery(triger).attr('data-seqn'));
				var view_subg=Number(jQuery(triger).attr('data-subg'));
				var view_gubn=Number(jQuery(triger).attr('data-gubn'));
				var view_kymd=Number(jQuery(triger).attr('data-kymd'));
				var view_khms=Number(jQuery(triger).attr('data-khms'));
				var msg={pageId:page_id,seqn:view_seqn,subg:view_subg,gubn:view_gubn,kymd:view_kymd,khms:view_khms,itemType:item_type,type:'existing'};
			break;
			
			case 'notice_view':
				var view_seqn=Number(jQuery(triger).attr('data-seqn'));
				var view_subg=Number(jQuery(triger).attr('data-subg'));
				var view_gubn=Number(jQuery(triger).attr('data-gubn'));
				var view_kymd=Number(jQuery(triger).attr('data-kymd'));
				var view_khms=Number(jQuery(triger).attr('data-khms'));
				var view_title=jQuery(triger).find('span.title').text();;
				jQuery('#BOARD_VIEW .view_title h2').html(view_title);
				var msg={pageId:'#NOTICE_VIEW',seqn:view_seqn,subg:view_subg,gubn:view_gubn,kymd:view_kymd,khms:view_khms,itemType:item_type,type:'existing'};
			break;
			
			default:
				var msg={pageId:page_id,itemCd:code,itemType:item_type,serverCode:code,type:'existing'};
			break
		}
		send_native(msg);
		return false;
	}else{
		callback(navi_data,true);
	}
};//End of ini_page(triger, callback);

	var navigation_page=function(data,change_page){
		var navi_id=data.pageId;
		console.log('==navigation_page=='+navi_id);
		//로딩표시 생략
		var page_id=data.pageId;
		var active_id=jQuery.mobile.activePage.attr('id');
		if(page_id){
			var out_check=page_id.substring(0,1);
		}
		if(page_id=='#NOTICE_LIST'){page_id='#BOARD_LIST';}
		if(page_id=='#NOTICE_VIEW'){page_id='#BOARD_VIEW';}		
		jQuery(page_id+'>footer').empty();
		
		footer_menu=get_template('footer_menu');
		var menu_code=local.get('shortcut');
		if(menu_code){
			footer_menu.find('ul.shortcut_menu').html(menu_code);
		}
		
		var shortcut=jQuery(footer_menu.find('ul.shortcut_menu'));
		shortcut.find('a').removeClass('act');
		switch (data.pageId){
			case '#BOARD_LIST':
				shortcut.find('a[href="#BOARD_LIST"]:not([data-type="notice_list"])').addClass('act');
			break;
			case '#BOARD_VIEW':
				shortcut.find('a[href="#BOARD_LIST"]:not([data-type="notice_list"])').addClass('act');
			break;
			case '#NOTICE_LIST':
				shortcut.find('a[data-type="notice_list"]').addClass('act');
			break;
			case '#NOTICE_VIEW':
				shortcut.find('a[data-type="notice_list"]').addClass('act');
			break;
			case '#ITEM_SELECT':
				shortcut.find('a[href="#ITEM_SELECT"]').addClass('act');
			break;
			case '#ITEM_LIST':
				var list_code=jQuery('#ITEM_LIST select.interest_select').val();
				console.log(list_code);
				var target=shortcut.find('a[href="#ITEM_LIST"][data-code="'+list_code+'"]');
				console.log(target);
				if(target.length>0){
					target.addClass('act');
				}else{
					shortcut.find('a[href="#ITEM_LIST"]:not([data-code])').addClass('act');
				}
			break;
			default:
					shortcut.find('a[href="#ITEM_ASKING"][data-code="'+data.itemCd+'"]').addClass('act');
			break;
		}
		
		jQuery(page_id+'>footer').removeClass('open');
		jQuery(page_id+'>footer').append(footer_menu).trigger('create');
		ini_footer_menu(page_id);
		
		if('#'+active_id==page_id||out_check!='#'){
			jQuery.mobile.loading('hide');
			var real_page=['#ITEM_ASKING', '#ITEM_CONCLUDE', '#ITEM_DAILY', '#ITEM_CHART'];
			if(jQuery.inArray(page_id,real_page)>-1){
				request_item_real_data();
			}
			return false;
		}
		
		if(change_page==true){
			jQuery.mobile.changePage(page_id);
		}
	}//End of navigation_page(page_id);

	
	function reset_page_attr(page_id,attr){
		console.log('==reset_page_attr()=='+page_id);
		//var page_id=jQuery.mobile.activePage.attr('id');
		var reset_attr=['code','caption','search','type','server_code','option_type','exercise','zdiv','cpos','strk'];

		for(var i=0;i<reset_attr.length;i++){
			var temp_attr=false;
			if(attr){
				if(attr==reset_attr[i]){
					temp_attr='data-'+attr;
				}
			}else{
				temp_attr='data-'+reset_attr[i];
			}
			if(temp_attr){
				jQuery(page_id).removeAttr(temp_attr);
			}
		}
	}//End of reset_page_attr();


/*종목선택 초기화*/
function ini_item_select(){
	console.log('==ini_item_select()==');
	jQuery('#ITEM_SELECT').on('pagebeforeshow',function(){ini_select_item()});
	jQuery('#ITEM_SELECT select.select_item_type').on('change',function(){ini_select_item()});
	jQuery('#ITEM_SELECT select.select_category').on('change',function(){ini_select_item()});
	jQuery('#app').on('tap','#item_select_table button, #dialog_item_select_table button',function(e){e.stopPropagation();e.stopImmediatePropagation();item_selected(this);});
	jQuery('#app').on('change','#item_select_table select, #dialog_item_select_table select',function(e){e.stopPropagation();e.stopImmediatePropagation();item_selected(this);});
}//End of ini_item_select();
	
	function ini_select_item(){
		console.log('==select_by_type()==');
		var sel_type=jQuery('#ITEM_SELECT select.select_item_type').val();
		var sel_category=jQuery('#ITEM_SELECT select.select_category').val();
		var item_tr_html=item_tr(sel_type,sel_category);
		jQuery('#item_select_table tbody').html(item_tr_html).trigger('create');	
	}//End of ini_select_item();
	
	function item_tr(sel_type,sel_category){
		console.log(sel_type+'/'+sel_category);
		var exchange_data=get_local_json(mts_prefix+'_exchange');		
		var tr_cnt=0;
		var item_tr='';
		for(ex_item in exchange_data){
			ex_data=get_local_json(mts_prefix+'_'+ex_item);
			console.log(ex_data);
			ex_name='<span class="exchange">'+ex_data.caption+'</span>';
			ex_category=ex_data.category;
			
			if(obj.has_key(ex_category,sel_category)){
				cat_data=ex_category[sel_category];
				for(item_data in cat_data){
					item_info=cat_data[item_data];
					if(item_info[sel_type]){
						var link_href='#ITEM_ASKING';
						if(sel_type=='option'){
							item_data='O'+item_data;
							link_href='#ITEM_OPTION';
						}
						
						
						var item_code_span='<span class="item_code">'+item_data+'</span>';
						
						var expiration=item_info.expiration;
						var btn_exp_0='';
						if(expiration[0]){
							var date_code=date_to_code(expiration[0]);
							var date_striong=btn_date(expiration[0]);
							var item_code=item_data+date_code;
							btn_exp_0='<button type="button" data-code="'+item_code+'">'+date_code+'<span>'+date_striong+'</span></button>';
							var item_caption_span='<button data-code="'+item_code+'" data-type="'+sel_type+'" class="item_caption">'+item_info.caption+'</button>';
						}
						var btn_exp_1='';
						if(expiration[1]){
							var date_code=date_to_code(expiration[1]);
							var date_striong=btn_date(expiration[1]);
							var item_code=item_data+date_code;
							btn_exp_1='<button type="button" data-code="'+item_code+'">'+date_code+'<span>'+date_striong+'</span></button>';
						}
						var select_exp='';
						if(expiration.length>2){
							var optin_item='';
							for(i=0;i<expiration.length;i++){
								var date_code=date_to_code(expiration[i]);
								
								var date_string=expiration[i]+'';
								var year=date_string.substring(0,4);
								var month=date_string.substring(4,6);
								
								var item_code=item_data+date_code;
								optin_item+='<option value="'+item_code+'">'+year+'년 '+month+'월물</option>';
							}
							select_exp='<select class="item_select">'+optin_item+'</select>'
						}
						tr_cnt++;
						item_tr+='<tr><td class="item_caption">'+ex_name+item_code_span+item_caption_span+'</td><td class="btn_td"><div data-role="controlgroup" data-type="horizontal">'+btn_exp_0+btn_exp_1+select_exp+'</div></td></tr>'
					}//End of for(item_data in cat_data){
				}
				
			
			}else{
				console.log('==해당 카테고리 없음==')
				continue;
			}
		}//거래소 반복
		
		return item_tr;
	}//End of item_tr();
	
	
	function btn_date(date){
		var date_string=date+'';
		var year=date_string.substring(2,4);
		var month=date_string.substring(4,6);
		return year+'/'+month;
	}
	
	function date_to_code(date){
		var date_string=date+'';
		var year=date_string.substring(2,4);
		var month=date_string.substring(4,6);
		var code=month_code[month]+year;
		return code;
	}
	
	function item_selected(btn){
		console.log('==item_selected(btn)==');
		var page_id=jQuery.mobile.activePage.attr('id');
		console.log(page_id);
		
		var act_btn=jQuery(btn);
		var item_code=act_btn.val();
		if(!item_code){var item_code=act_btn.attr('data-code');}
		if(!item_code){return false;}
		var item_caption=act_btn.parents('tr').find('button.item_caption').text();
		
		switch ('#'+page_id){
			case '#ITEM_SELECT': //선택페이지
				var item_type=jQuery('#ITEM_SELECT select.select_item_type').val();
				if(item_type=='futures'){
					var page_id="#ITEM_ASKING";
				}else{
					var page_id="#ITEM_OPTION";
				}
				var msg={pageId:page_id,itemCd:item_code,itemType:item_type,serverCode:item_code,cnt:option_tr_cnt,type:'existing'};
				send_native(msg);
			break;
			
			case '#ITEM_LIST': //관심그룹 리스트 
				var group_code=jQuery('#ITEM_LIST select.interest_select').val();
				if(group_code==false){
					alert('관심 그룹이 없습니다. \n 관심그룹을 생성하세요.')
					return false;
				}		
				var item_type=jQuery('#dialog_item_select select.select_item_type').val();
				if(item_type=='futures'){
					var group_data=get_local_json('group');
					var group_name=group_data[group_code];
					var item_data=get_local_json(group_code);
					
					item_data[item_code]={};
					item_data[item_code].caption=item_caption;
					item_data[item_code].itemType=item_type;
					item_data[item_code].serverCode=item_code;
					
					alert('['+item_caption+']을\n['+group_name+'] 관심그룹에 등록했습니다.');
					
					var save_string=JSON.stringify(item_data);
					var save_obj={};
					save_obj[group_code]=save_string;
					local.save(save_obj);
				}else{
					var msg={pageId:'#ITEM_OPTION',itemCd:item_code,itemType:'option',serverCode:item_code,cnt:dialog_option_tr_cnt,type:'existing'};
					send_native(msg);
				}
			break;
			
			default:
				var item_type=jQuery('#'+page_id+' select.select_item_type').val();
				console.log(item_type);
				if(item_type=='futures'){
					var page_id="#"+page_id;
				}else{
					var page_id="#ITEM_OPTION";
				}
				var msg={pageId:page_id,itemCd:item_code,itemType:item_type,serverCode:item_code,cnt:option_tr_cnt,type:'existing'};
				send_native(msg);
				jQuery(page_id+' .btn_dialog').removeClass('open');
				jQuery(page_id+' .page_dialog').remove();
			break;
			
		}
	}//End of item_selected(btn)
	
/*종목검색 페이지 초기화*/
function ini_item_search(){
	console.log('==ini_item_search()==');
	jQuery('#ITEM_SEARCH select.search_item_type').on('change',function(){search_item_type()});
	jQuery('#ITEM_SEARCH select.search_exchange').on('change',function(){category_by_exchange()});
	jQuery('#item_search_div').on('change','input',function(){search_item_check(this)});
	jQuery('#search_menu').slideUp(0);
	var tel_number=local.get(mts_prefix+'_tel');
	jQuery('#search_menu .search_result_tel').attr('href','tel:'+tel_number);

	jQuery('#ITEM_SEARCH').on('pagebeforeshow',function(){
		jQuery('#ITEM_SEARCH select.search_exchange option').remove();
		var item_option=get_template('exchange_option');
		jQuery('#ITEM_SEARCH select.search_exchange').append(item_option).trigger('create');
	});
	jQuery('#ITEM_SEARCH').on('pagehide',function(){
		console.log('#ITEM_SEARCH colse');
		jQuery('#ITEM_SEARCH select.search_item_type option[value="futures"]').attr('selected','selected');
		jQuery('#ITEM_SEARCH span.search_item_type').html('선물');
		jQuery('#ITEM_SEARCH select.search_exchange option[value="all"]').attr('selected','selected');
		jQuery('#ITEM_SEARCH span.search_exchange').html('전체');
		search_item_level01(false,'remove');
	});
}//End of ini_item_search()
	var search_exchange={};
	
	function search_item_type(){
		var type=jQuery('#ITEM_SEARCH select.search_item_type').val();
		jQuery('#ITEM_SEARCH').attr('data-type',type);
		search_result('remove');
		jQuery('#item_search_div').removeClass('complate');
		var exchange=jQuery('#ITEM_SEARCH select.search_exchange').val();
		jQuery('#ITEM_SEARCH select.search_exchange option[value="false"]').attr('selected','selected');
		jQuery('#ITEM_SEARCH span.search_exchange').html('거래소선택');
		jQuery('#item_search_div .step_01').removeClass('selected');
		jQuery('#item_search_div .step_02').removeClass('selected');
		jQuery('#item_search_div .step_03').removeClass('selected');
	}//End of search_item_type()
	
	function category_by_exchange(){
		console.log('==category_by_exchange()==');
		reset_page_attr('#ITEM_SEARCH');
		search_result('remove');
		jQuery('#item_search_div').removeClass('complate');
		var exchange=jQuery('#ITEM_SEARCH select.search_exchange').val();
		if(exchange=='all'){
			jQuery('#item_search_div .step_01 li').slideDown(300);
		}else{
			jQuery('#search_desc').slideUp(300);
			jQuery('#item_search_div').slideDown(300);
			jQuery('#item_search_div .step_01 li').slideUp(0);
			search_exchange=get_local_json(mts_prefix+'_'+exchange);
			var ex_category=search_exchange.category;
			for(var key in ex_category){
				var category_id='#item_category_'+key;
				jQuery(category_id).slideDown(300);
			}
		}
		jQuery('#item_search_div .step_01').removeClass('selected');
		jQuery('#item_search_div .step_02 ul li').remove();
		jQuery('#item_search_div .step_03 ul li').remove();
	}

	function search_item_check(input){
		console.log('==search_item_check(label)==');
		var step_div=jQuery(input).parents('div.search_step');
			jQuery(step_div).find('li').addClass('no_check_item');
			jQuery(step_div).find('li').removeClass('check_item');
		
		var check_item=jQuery(input).parents('li');
			jQuery(check_item).removeClass('no_check_item');
			jQuery(check_item).addClass('check_item');
		
		var reset_type=false;
		if(step_div.hasClass('selected')){
			reset_type='remove';
		}else{
			step_div.find('li.no_check_item').slideUp(300);
			reset_type='add';
		}
		switch (jQuery(input).attr('name')){
			case 'item_search_step01':
				search_item_level01(input,reset_type);
			break;
			case 'item_search_step02':
				search_item_level02(input,reset_type);
			break;
			case 'item_search_step03':
				search_item_level03(input,reset_type);
			break;
		}
	}//End of search_item_check(input);
	
	function search_item_level01(input,type){
		console.log('==search_item_level01('+input+','+type+')==');
		reset_page_attr('#ITEM_SEARCH');
		var step_div=jQuery('#item_search_div .step_01');
		if(type=='add'){
			step_div.addClass('selected');
			var search_item=template_search_item_level2(jQuery(input).val());
			jQuery('#item_search_div .step_02 ul').append(search_item).trigger('create').slideDown(300);
		}else if(type=='remove'){
			jQuery('#item_search_div .step_02 ul li').remove();
			jQuery('#item_search_div div.search_step').removeClass('selected');
			category_by_exchange()
			//jQuery('#item_search_div').removeClass('complate');
			search_result(type)
		}
	}//search_item_level01(input,type);
	
	function search_item_level02(input,type){
		console.log('==search_item_level02('+input+','+type+')==')
		console.log(input);
		reset_page_attr('#ITEM_SEARCH');
		var step_div=jQuery('#item_search_div .step_02');
		if(type=='add'){
			var search_item=template_search_item_level3(input);
			jQuery('#item_search_div .step_03 ul').append(search_item).trigger('create').slideDown(300);
			step_div.addClass('selected');
		}else if(type=='remove'){
			step_div.removeClass('selected');
			jQuery('#item_search_div .step_03 li').remove();
			jQuery('#item_search_div .step_02 li').slideDown(300);
			//jQuery('#item_search_div').removeClass('complate');
			search_result(type)
		}
	}//search_item_level02(input,type)
	
	function search_item_level03(input,type){
		console.log('==search_item_level03(input,type)==');
		var step_div=jQuery('#item_search_div .step_03');
		if(type=='add'){
			search_result(type);
			step_div.addClass('selected');
		}else if(type=='remove'){
			reset_page_attr('#ITEM_SEARCH');
			search_result(type);
			step_div.removeClass('selected');
			jQuery('#item_search_div .step_03 li').slideDown(300);
			
		}
	}//End of preview_search_item(reset_type)s;

	function search_result(type){
		console.log('==search_result('+type+')==');
		if(type=='remove'){
			jQuery('#search_result_article').slideUp(300);
			jQuery('#search_result_article table tr').remove();
			jQuery('#item_search_div').removeClass('complate');
			jQuery('#ITEM_SEARCH').removeAttr('data-code');
		}else if(type=='add'){
			
			var item_type=jQuery('#ITEM_SEARCH select.search_item_type').val();
			var catagory=jQuery('input[name="item_search_step01"]:checked').val();
			var item_code=jQuery('input[name="item_search_step02"]:checked').val();
			var expiration=jQuery('input[name="item_search_step03"]:checked').val();
			var expiration_id=jQuery('input[name="item_search_step03"]:checked').attr('id');
			var expiration_caption=jQuery('label[for="'+expiration_id+'"] span').html()
			
			var code=item_code+expiration;
			if(item_type=='option'){
				code='O'+code;
				var send_msg={pageId:'#ITEM_SEARCH',itemCd:code,serverCode:code,itemType:item_type,type:'existing'};
			}else{
				var send_msg={pageId:'#ITEM_SEARCH',itemCd:code,serverCode:code,itemType:item_type,type:'existing'};
				
			}
			console.log(send_msg);
			send_native(send_msg);
			jQuery('#item_search_div').addClass('complate');
		}
	}//End of search_result(catgory,code)
	
	function search_result_ex(data){
		console.log('==search_result_ex(data)==');
		var commen_data=data.commen;
		console.log(commen_data);

		jQuery('#ITEM_SEARCH').attr('data-code',commen_data.itemCd);
		jQuery('#ITEM_SEARCH').attr('data-caption',commen_data.itemCaption);
		jQuery('#ITEM_SEARCH').attr('data-type',commen_data.itemType);
		jQuery('#ITEM_SEARCH').attr('data-server_code',commen_data.serverCode);
		jQuery('#ITEM_SEARCH').attr('data-zdiv',commen_data.zdiv);
		jQuery('#ITEM_SEARCH').attr('data-cpos',commen_data.cpos);
		
		var type=jQuery('#ITEM_SEARCH select.search_item_type').val();
					
		if(type=='option'){
			var result_tr=jQuery('<tr id="'+commen_data.itemCd+'" data-code="'+commen_data.itemCd+'" data-type="option_base"><td class="itemType option">option</td><td class="itemCd" colspan="3">'+commen_data.itemCd+'<span class="item_caption">'+commen_data.itemCaption+'</span><a href="#ITEM_OPTION" data-code="'+commen_data.itemCd+'">행사가 리스트</a></td></tr>');
			
			jQuery('#search_result_article table').append(result_tr).trigger('create');
			jQuery('#search_result_article').slideDown(300);
			jQuery('#search_menu').slideUp(0);
						
		}else if(type=='futures'){
			jQuery('#search_menu a.search_result_link').attr('href','#ITEM_ASKING');
			jQuery('#search_menu a.search_result_link').attr('data-type','futures');
			jQuery('#search_menu a.search_result_link').html('시세 보기');
			
			var result_tr=template_item_list(commen_data);
			jQuery('#search_result_article table').append(result_tr).trigger('create');
			jQuery('#search_result_article').slideDown(300);
			jQuery('#search_menu').slideDown(300);
		}
		
		jQuery('#search_menu a.search_result_link').attr('data-code',data.itemCd);
		jQuery.mobile.loading('hide');
	}/*End of search_result_ex(data)*/	
	
/*관심그룹 리스트*/
function ini_item_list(){
	//표시할때 실행
	jQuery('#ITEM_LIST').on('pagebeforeshow',function(){
		console.log('==#ITEM_LIST pagebeforeshow==')		
		//기본 형태 확인
		var list_type=local.get(mts_prefix+'_list_type');
		if(list_type){
			jQuery('#ITEM_LIST #item_list_table').attr('data-type',list_type);
			jQuery('#ITEM_LIST .btn_interest_table').removeClass('active');
			jQuery('#ITEM_LIST .btn_interest_card').removeClass('active');
			jQuery('#ITEM_LIST .btn_interest_'+list_type).addClass('active');
		}
		jQuery('#ITEM_LIST select.interest_select option').remove();
		var item_option=get_template('group_item_option');
		var current_option=jQuery(item_option[0]);
		
		//기본 코드 확인
		var code=jQuery('#ITEM_LIST').attr('data-code');
		
		if(code){
			for(var i=0;i<item_option.length;i++){
				if(jQuery(item_option[i]).attr('value')==code){
					var current_option=jQuery(item_option[i]);	
				}
			}
		}		
		current_option.attr('selected','selected');
		var code=current_option.attr('value');
		jQuery('#ITEM_LIST').attr('data-code',code);
		
		var item_text=current_option.html();
		jQuery('#ITEM_LIST span.interest_select').html(item_text);
		jQuery('#ITEM_LIST select.interest_select').append(item_option).trigger('create');
		reset_item_list_table();	
	});
	
	//나갈때 실행
	jQuery('#ITEM_LIST').on('pagehide',function(){
		console.log('==#ITEM_LIST hide==');
		cancel_real_data();
	});
	
	
	jQuery('#ITEM_LIST .btn_interest_table').on('tap',function(){
		jQuery('#item_list_table').attr('data-type','table');
		var save_obj={};
		save_obj[mts_prefix+'_list_type']='table';
		local.save(save_obj);
		jQuery('#ITEM_LIST .btn_interest_table').addClass('active');
		jQuery('#ITEM_LIST .btn_interest_card').removeClass('active');
		set_group_code();
	});
	jQuery('#ITEM_LIST .btn_interest_card').on('tap',function(){
		jQuery('#item_list_table').attr('data-type','card');
		var save_obj={};
		save_obj[mts_prefix+'_list_type']='card';
		local.save(save_obj);
		jQuery('#ITEM_LIST .btn_interest_card').addClass('active');
		jQuery('#ITEM_LIST .btn_interest_table').removeClass('active');
		set_group_code();
	});
	jQuery('#ITEM_LIST').on('tap','table[data-type="card"] td.itemCd,table[data-type="card"] td.curr,table[data-type="card"] td div.vol_chart_div',function(){item_card_extend_before(this)});
	jQuery('#ITEM_LIST').on('tap','table[data-type="table"] tbody td:not(.function)',function(){item_panel_extend_before(this)});
	jQuery('#item_list_panel').on('panelclose', function(){item_panel_reset()});
	
	jQuery('#ITEM_LIST').on('swipe','#item_list_table[data-type="card"] tr',function(e){item_edit_card(e,this)})
	
	jQuery('#ITEM_LIST').on('tap','button.del_item',function(e){
		event.stopImmediatePropagation();
		del_list_item(this)});
	jQuery('#ITEM_LIST').on('tap','button.cancel_item',function(e){
		event.stopImmediatePropagation();
		cancel_item_select(this)});
	
	jQuery('#item_list_table[data-type="table"]').swipe({
		swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData){
					item_edit_table(direction,this);
		},
		swipeRight:function(event, direction, distance, duration, fingerCount, fingerData){
					item_edit_table(direction,this);
		}
	});	
	
	jQuery('#ITEM_LIST').on('change','select.interest_select',function(){list_select_group(this);});
	jQuery('#ITEM_LIST').on('tap','#no_item_list_desc button', function(){list_group_del()})
	jQuery('#ITEM_LIST').on('tap','button#btn_del_all_item', 
			function(){
					var group_select=jQuery('#ITEM_LIST select.interest_select')
					var group_id=group_select.val();
					var group_name=jQuery('#ITEM_LIST select.interest_select option[value="'+group_id+'"]').text();
					console.log(group_id+'/'+group_name);
					var group_data=get_local_json(group_id);
					if(obj.size(group_data)<1){
						alert('등록된 관심종목이 없습니다.');
						return false;
					}else{
						local.del(group_id);
						alert('['+group_name+']의 관심종목을 모두 삭제하였습니다.');
						reset_item_list_table();
					}
					jQuery('#edit_group_div').slideUp(300);
			});
	jQuery('#ITEM_LIST').on('tap','button#btn_del_group', 
			function(){
				list_group_del();
				jQuery('#edit_group_div').slideUp(300);
			
			});		
}//End of ini_item_list()
	
	function list_select_group(group){
		console.log('==list_select_group('+jQuery(group).val()+')==');
		if(jQuery(group).val()=='NEW'){
			show_layer_group();		
		}else{
			jQuery('#ITEM_LIST').attr('data-code',jQuery(group).val());
			reset_item_list_table();
		}
	}//End of list_select_group()
	
	
	function list_group_del(){
		var group_select=jQuery('#ITEM_LIST select.interest_select')
		var group_id=group_select.val();
		console.log('==list_group_del('+group_id+')==');
		del_group_name(group_id);
		
		var new_option=template_group_option();
		group_select.empty();
		group_select.append(new_option).trigger('create');
		var code=jQuery(new_option[0]).attr('value');
		var name=jQuery(new_option[0]).text();
		console.log(code+'/'+name);
		jQuery('#ITEM_LIST span.interest_select').html(name);
		jQuery('#ITEM_LIST').attr('data-code',code);
		reset_item_list_table();
		
		//하단 메뉴 삭제
		jQuery('#ITEM_LIST .all_menu_group a[data-code="'+group_id+'"]').parent('h2').remove();	
		if(jQuery('#ITEM_LIST  .all_menu_group h2').length<1){
			console.log('그룹 모두 지움');
			jQuery('#ITEM_LIST  .all_menu_group').append('<p>등록된 관심그룹과 종목이 없습니다.</p>');
		}
	}//End of list_group_del();
	
	//관심그룹 아이템 편집 - 카드
	function item_edit_card(e,card){
		console.log('==item_edit_card(card)==')
		var card=jQuery(card);
		if(card.hasClass('extend')){return false;}
		var swipe_start=e.swipestart.coords[0];
		var swipe_end=e.swipestop.coords[1];
		if(swipe_start<swipe_end){
			card.addClass('selected');
			jQuery('#edit_group_div').slideDown(300);
		}else{
			card.removeClass('selected');
			jQuery('#edit_group_div').slideUp(300);
		}
		card.removeClass('extend');
	}//End of ini_item_list();
	
	//카드형식에서 아이템 삭제하기
	function del_list_item(btn){
		console.log('==del_list_item(btn)==');
		
		var card=jQuery(btn).parents('tr');
		card.removeClass('selected');
			
		//관심종목 코드 삭제
		var group_key=jQuery('#ITEM_LIST').attr('data-code')
		var group_data=get_local_json(group_key);
		console.log(group_data);
		var code=card.attr('data-code');
		delete group_data[code];
		
		console.log(group_data);
		var save_string=JSON.stringify(group_data);
		var save_obj={}
		save_obj[group_key]=save_string;
		local.save(save_obj);
		
		card.slideUp(400,function(){
				card.remove(); 
				if(jQuery('#item_list_table tbody tr').length<1){
					reset_item_list_table();}
		});
		
		//하단 메뉴 삭제
		jQuery('#ITEM_LIST .all_menu_group a[data-code="'+code+'"]').parent('li').remove();
		
	}//End of del_list_item(btn);
	
	function cancel_item_select(btn){
		var card=jQuery(btn).parents('tr');
		card.removeClass('selected');
	}//End of cancel_item_select(btn)
	
	function item_edit_table(direction,table){
		console.log('==item_edit_table(direction,table)==')
		if(jQuery('#item_list_panel').hasClass('ui-panel-open')){return false;}
		
		var table=jQuery(table);
		if(direction=='right'){
			table.addClass('selected');
			jQuery('#edit_group_div').slideDown(300);
		}else if(direction=='left'){
			table.removeClass('selected');
			jQuery('#edit_group_div').slideUp(300);
		}
	}//End of item_edit_table(e,table)
	
	
	//관심그룹코드 등록
	function set_group_code(){
		var code=jQuery('#ITEM_LIST select.interest_select').val();
		jQuery('#ITEM_LIST').attr('data-code',code);
		reset_item_list_table();
	}
	
	//관심그룹 리스갱신
	function reset_item_list_table(){
		var code=jQuery('#ITEM_LIST').attr('data-code');
		console.log('==reset_item_list_table('+code+')==')
		jQuery('#item_list_table tbody tr').remove();
		jQuery('#item_list_table_div').slideUp(300);
		
		var item_data={}
		if(code=='false'){
			jQuery('#no_group_select_desc').slideDown(300);
			jQuery('#no_item_list_desc').slideUp(0);
			return false;
		}else{
			jQuery('#no_group_select_desc').slideUp(300);
			item_data=get_local_json(code);
			jQuery('#item_list_table')
		}
		
		if(obj.size(item_data)<1){	
			jQuery('#item_list_table').slideUp(0);
			jQuery('#no_item_list_desc').slideDown(0);
		}else{
			
			var data_body=new Array();
			
			for(item_code in item_data){	
				var check_code=item_code;
				if(item_data[item_code].itemType=='option_item'){
					var check_code_temp=item_code.substr(1,item_code.length);
					var check_code_array=check_code_temp.split('_');
					check_code=check_code_array[0]
				}
				var item_check=item_search(check_code);
			
				if(item_check){//아이템 검색확인
					if(item_data[item_code].itemType=='option_item'){
						if(item_check.option){		
						data_body.push({itemCd:item_code,itemType:item_data[item_code].itemType,serverCode:item_data[item_code].serverCode,optionType:item_data[item_code].optionType,optionExe:item_data[item_code].optionExe,type:'existing'});
						}else{//End of item_check.option
							delete item_data[item_code];	
						}
					}else{
						data_body.push({itemCd:item_code,itemType:item_data[item_code].itemType,serverCode:item_data[item_code].serverCode,type:'existing'});
					}
				
				}else{//종목 코드가 없으면 관심종목에서 삭제함
					console.log('아이템 삭제함');
					delete item_data[item_code];
				}//End of if(item_check)
				
			}//End of for(item_code in item_data);
			var send_msg={pageId:'#ITEM_LIST',type:'existing',data:data_body};
			send_native(send_msg);
			item_list_real_request();
		}
		
		jQuery('#item_list_table_div').slideDown(300);
		jQuery.mobile.loading('hide');
	}//End of reset_item_list_table();
	
	function item_list_real_request(){
		var data_real=new Array();
		var code=jQuery('#ITEM_LIST').attr('data-code');
		var item_data=get_local_json(code);
		console.log(item_data);
		for(item_code in item_data){
			if(item_data[item_code].itemType=='option_item'){
				data_real.push({itemCd:item_code,
								itemType:item_data[item_code].itemType,
								serverCode:item_data[item_code].serverCode,
								optionType:item_data[item_code].optionType,
								optionExe:item_data[item_code].optionExe,
								quote:true,depth:false,
								type:'real'});
			}else{
				data_real.push({itemCd:item_code,itemType:item_data[item_code].itemType,serverCode:item_data[item_code].serverCode,quote:true,depth:false,type:'real'});
			}
		}
		var real_msg={pageId:'#ITEM_LIST',type:'real',data:data_real};
		send_native(real_msg,true);
	}//End of item_list_real_request();
	
	//아이템 리스트 항목 처리
	function item_list_table(data){
		var item_data=data.body;
		var data_body=new Array();
		for(var i=0;i<item_data.length;i++){
			var item_tr=template_item_list(item_data[i]);
			jQuery('#item_list_table tbody').append(item_tr).trigger('creat');
		}
		jQuery('#item_list_table').slideDown(0);
		jQuery('#no_item_list_desc').slideUp(0);
		
	}//End of item_list_table(data)
	
	
	//아이템 확장 체크
	function item_extend_check(data){
		console.log('==item_extend_check(data)==');
		var type=jQuery('#item_list_table').attr('data-type');
		if(type=='card'){
			item_card_extend_data(data);
		}else if(type=='table'){
			item_panel_extend_data(data);
		}
		
	}//End of item_extend_check(data)
	
	//아이템 카드 확장
	function item_card_extend_before(card_label){
		var card=jQuery(card_label).parents('tr');
		if(card.hasClass('selected')){return false;}
			
		var code=card.attr('data-code');
		if(card.hasClass('extend')){
			card.find('.table_type01').remove();
			card.find('.item_more_info_menu').remove();
			card.toggleClass('extend');
			item_list_real_request();
		}else{
			var code=card.attr('data-code');
			var item_type=card.attr('data-type');
			var item_serverCode=card.attr('data-server_code');
			
			if(item_type=='option_item'){
				var option_type=card.attr('data-option_type');
				var option_exercise=card.attr('data-exercise');
				send_msg={pageId:'#ITEM_LIST',itemCd:code,serverCode:item_serverCode,itemType:item_type,optionType:option_type,optionExe:option_exercise,type:'more'}
				}else{
					send_msg={pageId:'#ITEM_LIST',itemCd:code,serverCode:item_serverCode,itemType:item_type,type:'more'}
			}
			send_native(send_msg);
		}
	
	}//End of item_card_extend_before
	
	function item_card_extend_data(data){
		console.log('==item_card_extend_data(data)==');
		console.log(data);
		var card=jQuery('#ITEM_LIST tr[data-code="'+data.itemCd+'"]');
		var menu=get_template('item_more_menu');
			menu.find('a.item_more_link').attr('href','#ITEM_ASKING');
			menu.find('a.item_more_link').html('시세');
			menu.find('a').attr('data-code',data.itemCd);
			menu.find('a').attr('data-type',data.itemType);
			if(data.itemType=='option_item'){
				menu.find('a').attr('data-option_type',data.optionType);
				menu.find('a').attr('data-exercise',data.optionExe);
			}
			menu.find('a').attr('data-server_code',data.serverCode);	

		var asking=template_item_more_asking(data);
		var conclue=template_item_more_conclude(data);
					
		card.find('.item_more_info table').remove();
		card.find('.item_more_info').append(asking).trigger('create');
		card.find('.item_more_info').append(conclue).trigger('create');			
		
		card.find('.item_more_info').append(menu).trigger('create');
		card.toggleClass('extend');
		
		var card_pos=card.offset();
			console.log(card_pos);
		jQuery('html, body').animate({scrollTop : card_pos.top-60}, 300);
		
		jQuery.mobile.loading('hide');
	}//End of item_card_extend(card_label)
	
		
	//아이템 추가정보 패널 초기화
	function item_panel_reset(){
		console.log('=panel_close=');
		var panel=jQuery('#item_list_panel');
		panel.find('h1').html('--');
		panel.find('div.more_info').empty();
	}//End of item_panel_reset();
	
	//아이템 추가정보 패널 확장	
	function item_panel_extend_before(item_label){
		var tr=jQuery(item_label).parents('tr');
		var code=tr.attr('data-code');
		var item_type=tr.attr('data-type');
		var item_serverCode=tr.attr('data-server_code');
		if(item_type=='option_item'){
			var option_type=tr.attr('data-option_type');
			var option_exercise=tr.attr('data-exercise');
			send_msg={pageId:'#ITEM_LIST',itemCd:code,serverCode:item_serverCode,itemType:item_type,optionType:option_type,optionExe:option_exercise,type:'more'}
		}else{
			send_msg={pageId:'#ITEM_LIST',itemCd:code,serverCode:item_serverCode,itemType:item_type,type:'more'}
		}
		send_native(send_msg);
	}//End of item_panel_extend(item_label)
	
	function item_panel_extend_data(data){
		console.log('==item_panel_extend_data(data)==');
		var panel=jQuery('#item_list_panel');
		jQuery('#item_list_panel h1').html(data.itemCd);
		
		var item_data=item_search(data.itemCd);
		var asking=template_item_more_asking(data);
		var conclue=template_item_more_conclude(data);
			panel.find('div.more_info').append(asking).trigger('create');
			panel.find('div.more_info').append(conclue).trigger('create')
		
		var menu=get_template('item_more_menu');
			menu.find('a.item_more_link').attr('href','#ITEM_ASKING');
			menu.find('a.item_more_link').html('시세');
			menu.find('a').attr('data-code',data.itemCd);
			menu.find('a').attr('data-type',data.itemType);
			if(data.itemType=='option_item'){
				menu.find('a').attr('data-option_type',data.optionType);
				menu.find('a').attr('data-exercise',data.optionExe);
			}
			menu.find('a').attr('data-server_code',data.serverCode);

			panel.find('div.more_info').append(asking).trigger('create');
			panel.find('div.more_info').append(conclue).trigger('create');
			panel.find('div.more_info').append(menu).trigger('create');
		
		jQuery('#item_list_panel').panel('toggle');
		jQuery.mobile.loading('hide');
		item_list_real_request();
	}//End of item_panel_extend_data(data);
	
	function item_list_real(data){
		console.log('==item_list_real(data)==');
		//if(jQuery('#app').attr('real')!='true'){return false;}
		var card=jQuery('#item_list_table tr[data-server_code="'+data.commen.serverCode+'"]');
		var card_zdiv=card.attr('data-zdiv');
		var card_cpos=card.attr('data-cpos');	
		var price_option={zdiv:card_zdiv,cpos:card_cpos};	
			card.find('td.curr').html(format_price(data.commen.LastPrice,price_option));
			card.find('span.Diff').html(format_price(data.commen.Diff,price_option));
			card.find('span.UpDwnRatio').html(jQuery.number(data.commen.Rate,2));
			card.find('span.Volume').html(jQuery.number(data.commen.TotalVolume,0))
				
		if(data.commen.Diff>0){
			card.removeClass('even');
			card.removeClass('down');
			card.addClass('up');
			tr_class="up";
		}else if(data.commen.Diff>0){
			card.removeClass('even');
			card.removeClass('up');
			card.addClass('down');
		}
		
		var char_open=parseInt(((data.OpenPrice-data.LowPrice)/(data.HighPrice-data.LowPrice)*100));
		var char_last=parseInt(((data.LastPrice-data.LowPrice)/(data.HighPrice-data.LowPrice)*100));
		var char_size=parseInt((Math.abs(char_open-char_last)));
		if(char_open<=char_last){
			char_left=char_open;
		}else{
			char_left=char_last;
		}
		
		card.find('div.vol_chart_vol').css('left',char_left+'%');
		card.find('div.vol_chart_vol').css('width',char_size+'%');
	}//End of item_list_real(data)

/*아이템별 보기 초기화*/
function ini_item(){
	jQuery('#ITEM_CHART').on('pageshow',function(){draw_chart()});
	/*
	jQuery('#ITEM_ASKING').on('pagebeforehide',function(){cancel_item_real_data('#ITEM_ASKING')});
	jQuery('#ITEM_CONCLUDE').on('pagebeforehide',function(){cancel_item_real_data('#ITEM_CONCLUDE')});
	jQuery('#ITEM_DAILY').on('pagebeforehide',function(){cancel_item_real_data('#ITEM_DAILY')});
	*/
	jQuery('#ITEM_CHART').on('pagebeforehide',function(){send_native({pageId:'#CHART_CLOSE',type:'close'},true);});
	
	jQuery('#ITEM_ASKING, #ITEM_CONCLUDE, #ITEM_DAILY, #ITEM_CHART').on('pageshow',function(){request_item_real_data()});
	
	
	jQuery('#ITEM_CHART input[name="chart_set"]').on('change',function(){ini_chart_set(this);});
	jQuery('#ITEM_CHART select#chart_set_min_number').on('tap',function(){
						jQuery('#ITEM_CHART input[name="chart_set"]').removeAttr('checked');
						jQuery('#ITEM_CHART .ui-radio label.ui-radio-on').removeClass('ui-radio-on');
						jQuery('#ITEM_CHART .ui-radio label[for="chart_set_min"]').addClass('ui-radio-on');
						jQuery('#ITEM_CHART input#chart_set_min').attr('checked','checked');	
						jQuery('#ITEM_CHART .ui-select').addClass('active');
					});	
	jQuery('#ITEM_CHART select#chart_set_min_number').on('change',function(){
					 	console.log(jQuery(this).val());
						if(jQuery(this).val()!='false'){
							draw_chart();
						}
					});
					
	jQuery('#ITEM_CHART #btn_chart_draw').on('tap',function(){draw_chart()});
	
	jQuery('#ITEM_OPTION article[data-role="content"]').swipe({
		
		swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData){
					option_table_swipe('put');
		},
		swipeRight:function(event, direction, distance, duration, fingerCount, fingerData){
					option_table_swipe('call');
		},
		
		swipeUp:function(event, direction, distance, duration, fingerCount, fingerData){
					option_price_more('down');
		},
		swipeDown:function(event, direction, distance, duration, fingerCount, fingerData){
					option_price_more('up');
		}
	});	
}
	
	/*차트 설정 입력*/
	function ini_chart_set(input){
		console.log('==ini_chart_set()==');
		var set_value=jQuery(input).val();
		if(set_value!='min'){
			jQuery('#ITEM_CHART .ui-select').removeClass('active');
		}
		draw_chart()
	}//End of ini_chart_set();
	
	function draw_chart(setting){
		console.log('==draw_chart()==');
		var chart_type=jQuery('#ITEM_CHART input[name="chart_set"]:checked').val();
		if(!chart_type){chart_type='min';}
		var cahrt_value=jQuery('#ITEM_CHART #chart_set_min_number').val();
		
		console.log(chart_type+'===='+cahrt_value);
		var code=jQuery('#ITEM_CHART').attr('data-code');
		var item_type=jQuery('#ITEM_CHART').attr('data-type');
		var server_code=jQuery('#ITEM_CHART').attr('data-server_code');
		var item_zdiv=jQuery(data.pageId).attr('data-zdiv');
		var item_cpos=jQuery(data.pageId).attr('data-cpos');
		var chart_setting=get_local_json('web_mts_CHART_STETTING');
		if(obj.size(chart_setting)<1){
			var moving_averrage_value=new Array();
			moving_averrage_value[0]={value:5}
			moving_averrage_value[1]={value:20}
			moving_averrage_value[2]={value:60}
			
			/*
			chart_setting={
				'MA':{
					'check':true,
					'item':moving_averrage_value
				},
				'거래량':{'check':true},
			}
			*/
			chart_setting={};
			save_string=JSON.stringify(chart_setting);
			save_obj={'web_mts_CHART_STETTING':save_string}
			local.save(save_obj);
		}
		
		//차트 설정 있음
		var chart_data={pageId:'#ITEM_CHART',itemCd:code,itemType:item_type,serverCode:server_code,zdiv:item_zdiv,cpos:item_cpos,chartType:chart_type,chartValue:cahrt_value,chartHight:chart_Hight,chartSetting:chart_setting,type:'chart'};
		
		console.log(setting);
		if(setting==true){
			chart_data.newDraw=false;
		}else{
			chart_data.newDraw=true;
		}
		send_native(chart_data,true);	
	}//End of draw_chart()
	
	function set_chart_data(){
		var moving_averrage_value=[];
		var moving_averrage_value_item=jQuery('#setting_moving_averrage div.moveing_averrage_item input[type="number"]');
		for(var i=0;i<moving_averrage_value_item.length;i++){
			moving_averrage_value[i]={value:jQuery(moving_averrage_value_item[i]).val()}
		}
		
		console.log(moving_averrage_value);
		data={
			//'transparent_cant':{'check':jQuery('#dialog_chart_setting #transparent_cant').is(':checked')},
			//'log_chart':{'check':jQuery('#dialog_chart_setting #log_chart').is(':checked')},
			'매물대':{
				'check':jQuery('#dialog_chart_setting #put_bar').is(':checked'),
				'value':jQuery('#dialog_chart_setting #put_bar_number').val()
			},
			'MA':{
				'check':jQuery('#dialog_chart_setting #moving_averrage').is(':checked'),
				'item':moving_averrage_value
			},
			'BollingerBand':{
				'check':jQuery('#dialog_chart_setting #bollinger_band').is(':checked'),
				'term':jQuery('#dialog_chart_setting #bollinger_band_term').val(),
				'multiplier':jQuery('#dialog_chart_setting #bollinger_band_term').val()
			},
			'일목균형표':{
				'check':jQuery('#dialog_chart_setting #day_barance').is(':checked'),
				'transition':jQuery('#dialog_chart_setting #day_barance_transition').val(),
				'base':jQuery('#dialog_chart_setting #day_barance_base').val(),
				'before_2':jQuery('#dialog_chart_setting #day_barance_before_2').val()
			},
			'Envelope':{
				'check':jQuery('#dialog_chart_setting #envelop').is(':checked'),
				'term':jQuery('#dialog_chart_setting #envelop_term').val(),
				'precent':jQuery('#dialog_chart_setting #envelop_precent').val()
			},
			'거래량':{'check':jQuery('#dialog_chart_setting #trading_volume').is(':checked')},
			'OBV':{'check':jQuery('#dialog_chart_setting #obv').is(':checked')},
			'MACD':{
				'check':jQuery('#dialog_chart_setting #macd').is(':checked'),
				'short':jQuery('#dialog_chart_setting #macd_short').val(),
				'long':jQuery('#dialog_chart_setting #macd_long').val(),
				'signal':jQuery('#dialog_chart_setting #macd_signal').val()
				},
			'StochasticFast':{
				'check':jQuery('#dialog_chart_setting #stochastic_fast').is(':checked'),
				'trem':jQuery('#dialog_chart_setting #stochastic_fast_trem').val(),
				'd':jQuery('#dialog_chart_setting #stochastic_fast_d').val()
			},
			'StochasticSlow':{
				'check':jQuery('#dialog_chart_setting #stochastic_slow').is(':checked'),
				'trem':jQuery('#dialog_chart_setting #stochastic_slow_trem').val(),
				'k':jQuery('#dialog_chart_setting #stochastic_slow_k').val(),
				'd':jQuery('#dialog_chart_setting #stochastic_slow_d').val()
			},
			'RSI':{
				'check':jQuery('#dialog_chart_setting #rsi').is(':checked'),
				'term':jQuery('#dialog_chart_setting #rsi_term').val(),
				'signal':jQuery('#dialog_chart_setting #rsi_signal').val()
			},
			'DMI':{
				'check':jQuery('#dialog_chart_setting #dmi').is(':checked'),
				'term':jQuery('#dialog_chart_setting #dmi_term').val()
			},
			'TRIX':{
				'check':jQuery('#dialog_chart_setting #trix').is(':checked'),
				'trem':jQuery('#dialog_chart_setting #trix_trem').val(),
				'signal':jQuery('#dialog_chart_setting #trix_signal').val()
			},
			'CCI':{'check':jQuery('#dialog_chart_setting #cci').is(':checked')}
		}
		console.log(data);
		save_string=JSON.stringify(data);
		save_obj={'web_mts_CHART_STETTING':save_string}
		local.save(save_obj);
		alert('차트 설정을 저장하였습니다.');
		
		ini_dialog_chart(jQuery('#ITEM_CHART button[data-dialog="chart_setting"]' ));
	}//End of set_chart_data()
	
	
	/*아이템 상세 정보 보기*/	
	function toggle_item_info(){
		console.log('==toggle_item_info()==');
		var page_id=jQuery.mobile.activePage.attr('id');
		
		var item_code=jQuery('#'+page_id).attr('data-code');
		var item_type=jQuery('#'+page_id).attr('data-type');
		
		if(!item_code){item_code='ESZ14'};
		if(!item_type){item_type='futures'};
		
		console.log(item_code);
		if(item_type.substr(0,1)=='o'){
			item_code=item_code.substr(1,item_code.length);
		}
		console.log(item_code);
		var server_code=item_code.substr(0,item_code.length-3);
		console.log(server_code);
		
		var desc_code=jQuery('#'+page_id+' item_desc_div').attr('data-code');
		if(desc_code==server_code){
			jQuery('#'+page_id+' .item_desc_div').slideToggle(300);
		}else{
			var dec_msg={pageId:'#'+page_id,itemCd:item_code,itemType:item_type,serverCode:server_code,type:'more'};
			send_native(dec_msg);
		}
	}//End of toggle_item_info();
	
	function item_info_ex(data){
		console.log('==item_info_ex()==');
		var page_id=jQuery.mobile.activePage.attr('id');
		jQuery('#'+page_id+' .item_desc_div dl').remove();
		jQuery('#'+page_id+' .item_desc_div').attr('data-code',data.serverCode);
		var info_content=template_item_info(data);
		jQuery('#'+page_id+' .item_desc_div').prepend(info_content).trigger('creat');
		jQuery.mobile.loading('hide');
		jQuery('#'+page_id+' .item_desc_div').slideToggle(300);
	}//End of item_info_ex()
	
	
	//아이템별 실시간 요청
	function request_item_real_data(){
		console.log('==request_item_real_data==');
		var real_check=jQuery('#app').attr('data-real');
		console.log(real_check);
		
		if(real_check=='false'){
			console.log('리얼데이터 안받음..')
			return false;
		}
		var active_id=jQuery.mobile.activePage.attr('id');
			active_id='#'+active_id;	
		var quote_check=true;
		var depth_check=false;	
		switch (active_id){
			case '#ITEM_ASKING':
				depth_check=true;
			break;
		}
			
		var code=jQuery(active_id).attr('data-code');
		var item_type=jQuery(active_id).attr('data-type');
		var server_code=jQuery(active_id).attr('data-server_code');
		if(item_type=='option_item'){
			var exercise=jQuery(active_id).attr('data-exercise');
			var option_type=jQuery(active_id).attr('data-option_type');
			var request_message={pageId:active_id,itemCd:code,itemType:item_type,serverCode:server_code,optionExe:exercise,quote:quote_check,depth:depth_check,optionType:option_type,type:'real'};
		}else{
			var request_message={pageId:active_id,itemCd:code,itemType:item_type,serverCode:code,quote:quote_check,depth:depth_check,type:'real'};
		}
		console.log(request_message);		
		send_native(request_message,true);
	}//End of request_item_real_data(code)
	
	function cancel_item_real_data(page_id){
		console.log('==cancel_item_real_data("'+page_id+'")==');
		cancel_real_data();
	}//End of cancel_item_real_data()
	
	//아이템별 보기 상단 공통
	function item_commen(data){
		console.log('==item_commen(data)==');
		
		if(data.pageId=='#ITEM_CONCLUDE'&&data.type=='real'){
			var active_id='#'+jQuery.mobile.activePage.attr('id');
		}else{
			var active_id=data.pageId;
		}
		var commen_header=['#ITEM_ASKING','#ITEM_CONCLUDE','#ITEM_DAILY','#ITEM_OPTION','#ITEM_CHART'];
		if(parseInt(jQuery.inArray(active_id,commen_header))<0){
			return false;
		}
		
		reset_page_attr(active_id);
		
		var commen=data.commen		
		if(commen.Diff>0){
			jQuery(active_id).removeClass('even');
			jQuery(active_id).removeClass('down');
			jQuery(active_id).addClass('up');
		}else if(commen.Diff<0){
			jQuery(active_id).removeClass('even');
			jQuery(active_id).removeClass('up');
			jQuery(active_id).addClass('down');
		}
		
		jQuery(active_id).attr('data-code',commen.itemCd);
		jQuery(active_id).attr('data-server_code',commen.serverCode);
		jQuery(active_id).attr('data-type',commen.itemType);
		
		var item_caption=commen.itemCaption;
		var item_caption_attr=commen.itemCaption;
		var option_key={'call':'<span class="option_type call">C</span>','put':'<span class="option_type put">P</span>'}
		var option_attr={'call':' C ','put':' P '}
		if(data.optionType){item_caption+=option_key[data.optionType]; item_caption_attr=item_caption_attr+=option_attr[data.optionType];}
		if(data.optionExe){item_caption+=data.optionExe;  item_caption_attr=item_caption_attr+=data.optionExe;}
		
		jQuery(active_id).attr('data-caption',item_caption_attr);
		jQuery(active_id).attr('data-zdiv',commen.zdiv);
		jQuery(active_id).attr('data-cpos',commen.cpos);
		if(obj.has_key(data,'strk')){
			jQuery(active_id).attr('data-strk',data.strk);
		}
		var price_option={zdiv:commen.zdiv,cpos:commen.cpos};
		
		//공통링크
		jQuery(active_id+' .item_commen_navi a').attr('data-code',commen.itemCd);
		jQuery(active_id+' .item_commen_navi a').attr('data-server_code',commen.serverCode);
		jQuery(active_id+' .item_commen_navi a').attr('data-type',commen.itemType);
		
		//옵션 행사가 링크
		var option_code=commen.itemCd.split('_');
		jQuery(active_id+' .item_commen_navi li.option_item_only a').attr('data-code',option_code[0]);
		jQuery(active_id+' .item_commen_navi li.option_item_only a').attr('data-server_code',option_code[0]);
		jQuery(active_id+' .item_commen_navi li.option_item_only a').attr('data-type','option');
		
		//공통기능
		jQuery(active_id+' .item_commen_func a').attr('data-code',commen.itemCd);
		jQuery(active_id+' .item_commen_func a').attr('data-type',commen.itemType);
		
		//옵션 행사가 기능
		if(active_id=='#ITEM_OPTION'){
			var base_code_temp=commen.itemCd.substr(1,commen.itemCd.length);
			var base_code=base_code_temp.split('_');
			
			jQuery(active_id+' a.btn_base_futures').attr('data-code',base_code[0]);
			jQuery(active_id+' a.btn_base_futures').attr('data-server_code',base_code[0]);
			jQuery(active_id+' a.btn_base_futures').attr('data-type','futures') 
		}
		
		
	
		
		if(data.itemType=='option_item'){
			if(obj.has_key(data,'optionType')){
				jQuery(data.pageId).attr('data-option_type',data.optionType);
				jQuery(data.pageId+' .item_commen_navi a').attr('data-option_type',data.optionType);
			}
			if(obj.has_key(data,'optionExe')){
				jQuery(data.pageId).attr('data-exercise',data.optionExe);
				jQuery(data.pageId+' .item_commen_navi a').attr('data-exercise',data.optionExe);
			}
		}else{
			jQuery(active_id+' .item_commen_navi a').removeAttr('data-option_type');
			jQuery(active_id+' .item_commen_navi a').removeAttr('data-exercise');
		}
		
		
		jQuery(active_id+' .itemCaption').html(item_caption);
		jQuery(active_id+' .itemCd').html(commen.itemCd);
		jQuery(active_id+' .item_commen_div span.Curr').html(format_price(commen.LastPrice,price_option));
		jQuery(active_id+' .item_commen_div span.Diff').html(format_price(Math.abs(Number(commen.Diff)),price_option));
		jQuery(active_id+' .item_commen_div span.UpDwnRatio').html(jQuery.number(commen.Rate,2));
		jQuery(active_id+' .item_commen_div span.vol').html(jQuery.number(commen.TotalVolume,0));
		
		jQuery(active_id+' .item_commen_div .btn_item_commen_info').attr('data-code',data.itemCd);
		
		//호가 테이블 처리
		if(active_id=='#ITEM_ASKING'){				
			jQuery('#item_asking_table td.concolude').removeClass('concolude');
			var last_prc=format_price(commen.LastPrice,price_option);
			console.log('==item_asking_conclude(data):'+last_prc);
			console.log(jQuery('#item_asking_table td[data-pre="'+last_prc+'"]'));
			jQuery('#item_asking_table td.concolude').removeClass('concolude');
			jQuery('#item_asking_table td[data-pre="'+last_prc+'"]').addClass('concolude');
			jQuery('#item_asking_table').attr('data-last_prc',last_prc);
		}
	}//End of item_commen(code)
	
	
	//호가 기존 데이터 및 공통영역 처리
	function ini_asking(data){
		console.log('==ini_asking(data)==');
		//테이블 처리
		asking_table(data);
		
		// 공통영역처리
		item_commen(data); 
		
		//페이지 이동
		navigation_page(data,true)
	}//End of ini_asking()
	
	function item_asking_real(data){
		if(obj.has_key(data,'commen')){
			item_commen(data); 
		}else{
			var code=jQuery('#ITEM_ASKING').attr('data-code');
			asking_table(data);
		}
	}
	
	
	//호가 테이블 처리
	function asking_table(data){
		console.log('asking_table(data)');
		var time_data=date_format(data.body.Time,':','time');
		jQuery('#item_asking_table thead th.Time').html(time_data);
		/*side정보 처리*/
		if(obj.has_key(data,'commen')){
			var commen=data.commen;	
			var price_option={zdiv:commen.zdiv,cpos:commen.cpos};
			
			jQuery('#item_asking_table .side_open').removeClass('up down');
			if(commen.SettlementPrice<commen.OpenPrice){jQuery('#item_asking_table .side_open').addClass('up');}
			if(commen.SettlementPrice>commen.OpenPrice){jQuery('#item_asking_table .side_open').addClass('down');}
			jQuery('#item_asking_table .side_open').html(format_price(commen.OpenPrice,price_option));
			
			jQuery('#item_asking_table .side_high').removeClass('up down');
			if(commen.SettlementPrice<commen.HighPrice){jQuery('#item_asking_table .side_high').addClass('up');}
			if(commen.SettlementPrice>commen.HighPrice){jQuery('#item_asking_table .side_high').addClass('down');}
			jQuery('#item_asking_table .side_high').html(format_price(commen.HighPrice,price_option));
			
			jQuery('#item_asking_table .side_low').removeClass('up down');
			if(commen.SettlementPrice<commen.LowPrice){jQuery('#item_asking_table .side_low').addClass('up');}
			if(commen.SettlementPrice>commen.LowPrice){jQuery('#item_asking_table .side_low').addClass('down');}
			jQuery('#item_asking_table .side_low').html(format_price(commen.LowPrice,price_option));
			
			jQuery('#item_asking_table .side_last').removeClass('up down');
			if(commen.SettlementPrice<commen.LastPrice){jQuery('#item_asking_table .side_last').addClass('up');}
			if(commen.SettlementPrice>commen.LastPrice){jQuery('#item_asking_table .side_last').addClass('down');}
			jQuery('#item_asking_table .side_last').html(format_price(commen.LastPrice,price_option));
			
			jQuery('#item_asking_table .side_settlement').html(format_price(commen.SettlementPrice,price_option));
			jQuery('#item_asking_table').attr('data-settlement',commen.SettlementPrice);
		}
		
		
		if(obj.has_key(data,'info')){
			var info=data.info;
			
			var prefix='o'
			if(data.itemType=='futures'){prefix='f'}
			jQuery('#item_asking_table .trust_margin').html(jQuery.number(info[prefix+'_trust_margin'],0));
			jQuery('#item_asking_table .last_trade').html(date_format(info[prefix+'_last_trade'],'-','date'));
			jQuery('#item_asking_table .curr_cd').html(info[prefix+'_curr_cd']);
			jQuery('#item_asking_table .tick_size').html(info[prefix+'_tick_size']);
			jQuery('#item_asking_table .tick_value').html(info[prefix+'_tick_value']);			
		}
		
		var settlement=jQuery('#item_asking_table').attr('data-settlement');
		var last_prc=jQuery('#item_asking_table').attr('data-last_prc');
		var sell_data=data.body.Sell;
		var sell_tr=jQuery('#item_asking_table tbody.tbody_sell tr');
		var sell_total_cnt=0;
		var sell_total_qut=0;
		var cnt_sell_data=sell_data.length;
		for(var i=0;i<sell_tr.length;i++){
			var cnt_td=jQuery(sell_tr[i]).find('td.Cnt');
			var qut_td_span=jQuery(sell_tr[i]).find('td.Qut  span.number');
			var prc_td=jQuery(sell_tr[i]).find('td.Prc');
			cnt_sell_data--
			jQuery(cnt_td).html(sell_data[cnt_sell_data].Cnt);
			jQuery(qut_td_span).html(jQuery.number(sell_data[cnt_sell_data].Qut,0));
			jQuery(prc_td).removeClass('up down');
			if(settlement<sell_data[cnt_sell_data].Prc){jQuery(prc_td).addClass('up')}
			if(settlement>sell_data[cnt_sell_data].Prc){jQuery(prc_td).addClass('down')}
			jQuery(prc_td).removeClass('concolude');
			if(last_prc==format_price(sell_data[cnt_sell_data].Prc,price_option)){jQuery(prc_td).addClass('concolude');}
			jQuery(prc_td).attr('data-pre',format_price(sell_data[cnt_sell_data].Prc,price_option));
			jQuery(prc_td).html(format_price(sell_data[cnt_sell_data].Prc,price_option));
			sell_total_cnt+=sell_data[cnt_sell_data].Cnt;
			sell_total_qut+=sell_data[cnt_sell_data].Qut;
		}
		jQuery('#item_asking_table tfoot td.sell_total_cnt').html(jQuery.number(sell_total_cnt,0));
		jQuery('#item_asking_table tfoot td.sell_total_qut').html(jQuery.number(sell_total_qut,0));
		
		for(var i=0;i<sell_tr.length;i++){
			var vol_span=jQuery(sell_tr[i]).find('span.ask_vol');
			var span_width=(sell_data[i].Qut/sell_total_qut)*100
			vol_span.css('width',span_width+'%');
		}
			
		var buy_data=data.body.Buy;
		var buy_tr=jQuery('#item_asking_table tbody.tbody_buy tr');
		var buy_total_cnt=0;
		var buy_total_qut=0;
		for(var i=0;i<buy_tr.length;i++){
			var cnt_td=jQuery(buy_tr[i]).find('td.Cnt');
			var qut_td_span=jQuery(buy_tr[i]).find('td.Qut span.number');
			var prc_td=jQuery(buy_tr[i]).find('td.Prc');
			
			jQuery(cnt_td).html(jQuery.number(buy_data[i].Cnt,0));
			jQuery(qut_td_span).html(jQuery.number(buy_data[i].Qut,0));
			jQuery(prc_td).removeClass('up down');
			if(settlement<buy_data[i].Prc){jQuery(prc_td).addClass('up')}
			if(settlement>buy_data[i].Prc){jQuery(prc_td).addClass('down')}
			jQuery(prc_td).removeClass('concolude');
			if(last_prc==format_price(buy_data[i].Prc,price_option)){jQuery(prc_td).addClass('concolude');}
			jQuery(prc_td).attr('data-pre', format_price(buy_data[i].Prc,price_option));
			jQuery(prc_td).html(format_price(buy_data[i].Prc,price_option));
			buy_total_cnt+=buy_data[i].Cnt;
			buy_total_qut+=buy_data[i].Qut;
		}
		jQuery('#item_asking_table tfoot td.buy_total_cnt').html(jQuery.number(buy_total_cnt,0));
		jQuery('#item_asking_table tfoot td.buy_total_qut').html(jQuery.number(buy_total_qut,0));
		
		for(var i=0;i<buy_tr.length;i++){
			var vol_span=jQuery(buy_tr[i]).find('span.ask_vol');
			var span_width=(buy_data[i].Qut/buy_total_qut)*100
			vol_span.css('width',span_width+'%');
		}
		var sell_total_gap=buy_total_qut-sell_total_qut;
		if(sell_total_gap>0){
			jQuery('#item_asking_table .sell_total_gap').removeClass('sell');
			jQuery('#item_asking_table .sell_total_gap').addClass('buy');
		}else{
			jQuery('#item_asking_table .sell_total_gap').removeClass('buy');
			jQuery('#item_asking_table .sell_total_gap').addClass('sell');
		}
		jQuery('#item_asking_table .sell_total_gap').html(jQuery.number(Math.abs(sell_total_gap),0));
	}//End of asking_table(data);


	//체결 데이터 처리
	function ini_conclude(data){
		// 공통영역처리
		item_commen(data); 
		//테이블 처리
		jQuery('#item_conclude_table tbody tr').remove();
		conclude_table(data);
		//페이지 이동
		navigation_page(data,true)
	}//End of ini_conclude(data)
		
		function item_conclude_real(data){
			var active_id=jQuery.mobile.activePage.attr('id');
			console.log('==item_conclude_real(data)=='+active_id);
			switch (active_id){
				case 'ITEM_LIST':
					item_list_real(data);
				break;				
				case 'ITEM_CONCLUDE':
					item_commen(data);
					var conclud_tr_data={}
						conclud_tr_data.body=new Array();
						conclud_tr_data.body[0]={};
						conclud_tr_data.body[0].Time=data.commen.time;
						conclud_tr_data.body[0].Curr=data.commen.LastPrice;
						conclud_tr_data.body[0].Diff=data.commen.Diff;
						conclud_tr_data.body[0].Rate=data.commen.Rate;
						conclud_tr_data.body[0].TotalVolume=data.commen.LastVolume;
					conclude_table(conclud_tr_data);
				break;
				case 'ITEM_DAILY':
					item_commen(data);
					item_daily_real(data)
				break;
				default:
					item_commen(data);
				break;
			}	
		}//item_conclude_real(data);
	
		//체결 테이블 처리
		function conclude_table(data){
			var tr_cnt=30; // 화면에 유지할 정보의 개수
			var tr_data=data.body;
			for(var i=(tr_data.length-1);i>-1;i--){
				var tr=template_conclude_tr(tr_data[i]);
				jQuery('#item_conclude_table tbody').prepend(tr);
			}
			
			var old_tr=jQuery('#item_conclude_table tbody tr');
			for(var i=tr_cnt;i<old_tr.length;i++){
				jQuery(old_tr[i]).remove();
			}
		}//End of conclude_table(data)
	
	//일자별 데이터 처리
	function ini_daily(data){
		// 공통영역처리
		item_commen(data); 
		
		//테이블 처리
		jQuery('#item_daily_table tbody tr').remove();
		daily_table(data);
		//페이지 이동
		navigation_page(data,true);
	}//End of ini_daily(data)
		
		function item_daily_real(data){
			var active_id=jQuery.mobile.activePage.attr('id');
				active_id='#'+active_id;	
			var zdiv=jQuery(active_id).attr('data-zdiv');
			var cpos=jQuery(active_id).attr('data-cpos');
				
			var daily_data={}
				daily_data.body=new Array();
				daily_data.body[0]={};
				daily_data.body[0].Time=data.commen.time;
				daily_data.body[0].Last=data.commen.LastPrice;
				daily_data.body[0].High=data.commen.HighPrice;
				daily_data.body[0].Low=data.commen.LowPrice;
				daily_data.body[0].Diff=data.commen.Diff;
				daily_data.body[0].Rate=data.commen.Rate;
				daily_data.body[0].TotalVolume=data.commen.TotalVolume;
			
			var check_date=date_format(daily_data.body[0].Time,'-','date');
			var check_tr=jQuery('#item_daily_table tr[data-date="'+check_date+'"]').length;
			if(check_tr>0){
				jQuery('#item_daily_table tr[data-date="'+check_date+'"] td.Date').html(check_date);
				jQuery('#item_daily_table tr[data-date="'+check_date+'"] td.Last').html(format_price(daily_data.body[0].Last));
				jQuery('#item_daily_table tr[data-date="'+check_date+'"] td.High').html(format_price(daily_data.body[0].High));
				jQuery('#item_daily_table tr[data-date="'+check_date+'"] td.Low').html(format_price(daily_data.body[0].Low));
				jQuery('#item_daily_table tr[data-date="'+check_date+'"] td.Diff span:first-child').html(format_price(daily_data.body[0].Diff));
				jQuery('#item_daily_table tr[data-date="'+check_date+'"] td.Diff span.Rate').html(daily_data.body[0].Rate);
				jQuery('#item_daily_table tr[data-date="'+check_date+'"] td.TotalVolume').html(jQuery.number(daily_data.body[0].TotalVolume));
				
			}else{
				daily_table(daily_data);
			}
		}//item_daily_real(data);


		//일자별 테이블 처리
		function daily_table(data){
			var tr_cnt=15; // 화면에 유지할 정보의 개수
			var tr_data=data.body;
			for(var i=(tr_data.length-1);i>-1;i--){
				var tr=template_daily_tr(tr_data[i]);
				jQuery('#item_daily_table tbody').prepend(tr);
			}
			
			var old_tr=jQuery('#item_daily_table tbody tr');
			for(var i=tr_cnt;i<old_tr.length;i++){
				jQuery(old_tr[i]).remove();
			}
		}//End of daily_table(data)
		
	function ini_chart(data){
		// 공통영역처리
		item_commen(data); 
		//페이지 이동
		navigation_page(data,true);
	}//ini_chart(data);
	
	//Option 페이지 초기화
	function ini_option(data){
		console.log('==ini_option(data)==');
		var act_id=jQuery.mobile.activePage.attr('id');
		if(act_id=='ITEM_LIST'){
			if(data.type=='existing'){
				dialog_item_option(data);
			}
			if(data.type=='more'){
				dialog_option_table(data)
			}
		}else{
			item_commen(data); 
			option_table(data);
		}
	}//ini_option(data)
	
	
	//option table 표시전환
	function option_table_swipe(type){
		console.log('==option_table_swipe('+type+')==')
		var active_table=jQuery('#app .item_option_table[data-active="true"]')[0];
		var active_id=jQuery(active_table).attr('id');
		console.log(active_id);
		
		if(type=='call'&&active_id=='item_option_table_both'){
			jQuery('#item_option_table_both').css('display','none').attr('data-active','false');
			jQuery('#item_option_table_put').css('display','none').attr('data-active','false');
			jQuery('#item_option_table_call').css('display','table').attr('data-active','true');
		}
		if(type=='call'&&active_id=='item_option_table_put'){
			jQuery('#item_option_table_both').css('display','table').attr('data-active','true');
			jQuery('#item_option_table_put').css('display','none').attr('data-active','false');
			jQuery('#item_option_table_call').css('display','none').attr('data-active','false');
		}
		if(type=='put'&&active_id=='item_option_table_both'){
			jQuery('#item_option_table_both').css('display','none').attr('data-active','false');
			jQuery('#item_option_table_put').css('display','table').attr('data-active','true');
			jQuery('#item_option_table_call').css('display','none').attr('data-active','false');
		}
		if(type=='put'&&active_id=='item_option_table_call'){
			jQuery('#item_option_table_both').css('display','table').attr('data-active','true');
			jQuery('#item_option_table_put').css('display','none').attr('data-active','false');
			jQuery('#item_option_table_call').css('display','none').attr('data-active','false');
		}
		
		/*
		var act_type=jQuery('#item_option_table').attr('data-display');
		if(type=='call'){
			if(act_type=='call'){return false;}
			if(act_type=='both'){
				jQuery('#item_option_table .call_opt').attr('colspan',3);
				jQuery('#item_option_table').attr('data-display','call');
			}
			if(act_type=='put'){
				jQuery('#item_option_table .put_opt').attr('colspan',2);
				jQuery('#item_option_table .call_opt').attr('colspan',2);
				jQuery('#item_option_table').attr('data-display','both');
			}
		}
		if(type=='put'){
			if(act_type=='put'){return false;}
			if(act_type=='both'){
				jQuery('#item_option_table .put_opt').attr('colspan',3);
				jQuery('#item_option_table').attr('data-display','put');
			}
			if(act_type=='call'){
				jQuery('#item_option_table .put_opt').attr('colspan',2);
				jQuery('#item_option_table .call_opt').attr('colspan',2);
				jQuery('#item_option_table').attr('data-display','both');
			}
		}
		*/
	}//End of option_table_swipe(type)
	
	
	//Option 실시간 처리
	function option_real(data){
		console.log('==option_real(data)==');
		
		var active_id=jQuery.mobile.activePage.attr('id');
			active_id='#'+active_id;	
		var zdiv=jQuery(active_id).attr('data-zdiv');
		var cpos=jQuery(active_id).attr('data-cpos');
			
		for(exercise in data.body){
			var target_tr=jQuery('#item_option_table tbody tr[data-exercise="'+exercise+'"]');
			    target_tr.attr('data-call',data.body[exercise].Call.State);
				target_tr.attr('data-put',data.body[exercise].Put.State); 
				target_tr.find('td:nth-child(1)').html(format_price(data.body[exercise].Call.Diff));
				target_tr.find('td:nth-child(2) a').html(format_price(data.body[exercise].Call.Price));
				target_tr.find('td:nth-child(4) a').html(format_price(data.body[exercise].Put.Price));
				target_tr.find('td:nth-child(5)').html(format_price(data.body[exercise].Put.Diff));
			
		}
	}//ini_option(data)
		
	function option_price_more(dir,dialog){
		console.log('==option_price_more('+dir+','+dialog+')==');
		
		if(dialog==true){
			console.log('==리스트 옵션 테이블임..==');
			var item_code=jQuery('#dialog_option_item_table').attr('data-code');
			var item_server_code=jQuery('#dialog_option_item_table').attr('data-server_code');
			if(dir=='up'){
				item_strk=Number(jQuery('#dialog_option_item_table tbody tr:first-child').attr('data-exercise'));
			}else if(dir=='down'){
				item_strk=Number(jQuery('#dialog_option_item_table tbody tr:last-child').attr('data-exercise'));
			}

			more_msg={pageId:"#ITEM_OPTION",itemCd:item_code,itemType:"option",serverCode:item_server_code,strk:item_strk,direction:dir,cnt:dialog_option_tr_cnt,type:"more"};
		}else{
			var item_code=jQuery('#ITEM_OPTION').attr('data-code');
			var item_server_code=jQuery('#ITEM_OPTION').attr('data-server_code');
			if(dir=='up'){
				item_strk=Number(jQuery('#item_option_table_both tbody tr:first-child').attr('data-exercise'));
			}else if(dir=='down'){
				item_strk=Number(jQuery('#item_option_table_both tbody tr:last-child').attr('data-exercise'));
			}
			
			more_msg={pageId:"#ITEM_OPTION",itemCd:item_code,itemType:"option",serverCode:item_server_code,strk:item_strk,direction:dir,cnt:option_tr_cnt,type:"more"};
		}
		send_native(more_msg);
	
	}//End of option_price_more(dir)
	
		
		//옵션 테이블 처리
		function option_table(data){
			/*
			if(data.type=='existing'){
				
			}
			*/
			
			var active_id=jQuery.mobile.activePage.attr('id');
				active_id='#'+active_id;	
			
			var code=data.itemCd;
			var tr_data_temp=data['body'];
			var item_zdiv=jQuery('#ITEM_OPTION').attr('data-zdiv');
			var item_cpos=jQuery('#ITEM_OPTION').attr('data-cpos');
			var price_option={zdiv:item_zdiv,cpos:item_cpos}	
			var tr_cnt=obj.size(tr_data_temp);
			if(tr_cnt<1){
				alert('더 이상 행사가가 없습니다.');
				jQuery.mobile.loading('hide');
				return false;
			}
			
			var tr_data=[];
			for (var prc in tr_data_temp) {
			  tr_data.push([prc, tr_data_temp[prc]]);
			}
			tr_data.sort()
			
			jQuery('#item_option_table_both tbody tr').remove();
			jQuery('#item_option_table_call tbody tr').remove();
			jQuery('#item_option_table_put tbody tr').remove();
			
			for(i=(tr_data.length-1);i>-1;i--){
				var key=tr_data[i][0];
				var call=tr_data[i][1]['Call'];
				var put=tr_data[i][1]['Put'];
				var atmf_tr=''
				
				if(call.ATMF==1){
					atmf_tr='class="tr_atmf"';
				}
				
				jQuery('#item_option_table_both tbody').append('<tr '+atmf_tr+' data-call="'+call.State+'" data-put="'+put.State+'" data-exercise="'+key+'"><td class="call_data Diff">'+format_price(Math.abs(call.Diff),price_option)+'</td><td class="call_data price"><a href="#ITEM_ASKING" data-code="'+code+'"data-type="option_item" data-exercise="'+key+'" data-option_type="call" data-server_code="'+call.Code+'">'+format_price(call.Price,price_option)+'</a></td><th>'+format_price(key,price_option)+'</th><td  class="put_data  price"><a href="#ITEM_ASKING" data-code="'+code+'" data-type="option_item" data-exercise="'+key+'"  data-option_type="put" data-server_code="'+put.Code+'">'+format_price(put.Price,price_option)+'</a></td><td class="put_data Diff">'+format_price(Math.abs(put.Diff),price_option)+'</td></tr>').trigger('creat');
				
				jQuery('#item_option_table_call tbody').append('<tr '+atmf_tr+' data-call="'+call.State+'" data-put="'+put.State+'" data-exercise="'+key+'"><td class="call_data call_vol">'+jQuery.number(call.TotalVolume)+'</td><td class="call_data Diff">'+format_price(Math.abs(call.Diff),price_option)+'</td><td class="call_data price"><a href="#ITEM_ASKING" data-code="'+code+'"data-type="option_item" data-exercise="'+key+'" data-option_type="call" data-server_code="'+call.Code+'">'+format_price(call.Price,price_option)+'</a></td><th>'+format_price(key,price_option)+'</th></tr>').trigger('creat');
				
				jQuery('#item_option_table_put tbody').append('<tr '+atmf_tr+' data-call="'+call.State+'" data-put="'+put.State+'" data-exercise="'+key+'"><th>'+format_price(key,price_option)+'</th><td  class="put_data  price"><a href="#ITEM_ASKING" data-code="'+code+'" data-type="option_item" data-exercise="'+key+'"  data-option_type="put" data-server_code="'+put.Code+'">'+format_price(put.Price,price_option)+'</a></td><td class="put_data Diff">'+format_price(Math.abs(put.Diff),price_option)+'</td><td class="put_data put_vol">'+jQuery.number(put.TotalVolume)+'</td></tr>').trigger('creat');
				
			}			
			if(data.type=='existing'){
				navigation_page(data,true);
			}
			jQuery.mobile.loading('hide');
		}//End of option_table(data);		
		
	function ini_board_list(data){
		console.log('==ini_board_list(data)==');
		console.log(data);
		data.pageId
		var board_title={'#BOARD_LIST':'EDAILY News','#NOTICE_LIST':'공지사항'};
		var list_type={'#BOARD_LIST':'board_list','#NOTICE_LIST':'notice_list'};
		var list_category={'#BOARD_LIST':'subg_str','#NOTICE_LIST':'gubn_str'};
		var view_name={'#BOARD_LIST':'#BOARD_VIEW','#NOTICE_LIST':'#NOTICE_VIEW'};
		var type_name={'#BOARD_LIST':'board_view','#NOTICE_LIST':'notice_view'};
		//jQuery('#board_list thead th').html(board_title[data.key.gubn]);
		
		jQuery('#BOARD_LIST').attr('data-type',list_type[data.pageId]);
		
		jQuery('#BOARD_LIST header h1').html(board_title[data.pageId]);
		
		if(data.type=='existing'){
			jQuery('#board_list tbody tr').remove();
		}
		/*속성적용*/
		var board_key=data.key;
		for(attr in board_key){
			console.log(attr+':'+board_key[attr]);
			jQuery('#BOARD_LIST').attr('data-'+attr,board_key[attr]);
		}
		
		var list=data.body;
		for(i=0;i<list.length;i++){
			var string_date_temp=list[i].kymd+' '+list[i].khms;
			var string_date=date_format(string_date_temp,'-','date');
			var srting_time=date_format(string_date_temp,':','time');
			var title_string='<span class="title">'+decodeURIComponent(list[i].title)+'</span>';
			
			var title_category='';
			if(list[i][list_category[data.pageId]]){
				title_category='<span class="category">'+list[i][list_category[data.pageId]]+'</span>';
			}
			
			var item_tr=jQuery('<tr><td class="board_tite"><a href="'+view_name[data.pageId]+'" data-seqn="'+list[i].seqn+'" data-subg="'+list[i].subg+'" data-gubn="'+list[i].gubn+'" data-kymd="'+list[i].kymd+'" data-khms="'+list[i].khms+'" data-type="'+type_name[data.pageId]+'">'+title_category+title_string+'</a><span class="board_date">'+string_date+'</span><span class="board_time">'+srting_time+'</span></td></tr>');
			jQuery('#board_list tbody').append(item_tr);
		}
		navigation_page(data,true);
	}//End of ini_board_list(data)
		
	/*게시판 보기*/
	function ini_board_view(data){
		console.log('==ini_board_view(data)==');
		if(data.pageId=='#NOTICE_VIEW'){
			var header_title='공지사항';
			//var content_title=jQuery('#BOARD_VIEW .view_title h2').html();
			//var content_title=decodeURIComponent(data.title.title);
			var content_html=decodeURIComponent(data.body.text).replace(/\n/g, '<br />');
			content_html=content_html.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ');
			//var date_string=date_format(data.body.date,'-','date');
			//var time_string=date_format(data.body.date,':','date');
			var author='유진투자선물';
		}else{
			var header_title=data.title.subg_str;
			var content_title=decodeURIComponent(data.title.title);
			var content_html=decodeURIComponent(data.body.text);
			var date_string=date_format(data.body.date,'-','date');
			var time_string=date_format(data.body.date,':','time');
			var author=data.title.gubn_str;
			
			jQuery('#BOARD_VIEW .view_title h2').html(content_title);
		}
		jQuery('#BOARD_VIEW header h1').html(header_title);
		jQuery('#BOARD_VIEW .view_author').html(author);
		jQuery('#BOARD_VIEW .view_data').html(date_string);
		jQuery('#BOARD_VIEW .view_time').html(time_string);
		jQuery('#BOARD_VIEW .view_content').html(content_html);
		navigation_page(data,true);
	}//End of ini_board_view(data)
	
	/*게시판 리스트 더 보기*/
	function board_more(){
		console.log('==board_more()==');
		
		var board_subg=Number(jQuery('#BOARD_LIST').attr('data-subg'));
		var board_gubn=Number(jQuery('#BOARD_LIST').attr('data-gubn'));
		var board_seqn=Number(jQuery('#BOARD_LIST').attr('data-seqn'));
		var board_kymd=Number(jQuery('#BOARD_LIST').attr('data-kymd'));
		var board_khms=Number(jQuery('#BOARD_LIST').attr('data-khms'));
		
		var list_type=jQuery('#BOARD_LIST').attr('data-type');
		var page_id={'board_list':'#BOARD_LIST','notice_list':'#NOTICE_LIST'};
		
		var more_msg={pageId:page_id[list_type],itemType:list_type,subg:board_subg,gubn:board_gubn,seqn:board_seqn,kymd:board_kymd,khms:board_khms,nrec:10,type:"more"};
		
		send_native(more_msg);
	}//End of board_more()


/*레이어 기능 초기화*/
function ini_layer(){
	ini_group_layer();
	ini_search_layer();
	
	jQuery('#app').on('tap','.btn_layer_interest',function(){show_layer_group();});
	jQuery('#app').on('tap','.btn_layer_search',function(){show_layer_search();});
	jQuery('#app').on('tap','.btn_close_layer',function(event){
			event.stopImmediatePropagation();
			item_layer_remove_before()});
	
	jQuery('#app').on('tap','a[href="#HELP"]',function(){show_layer_help_before(); return false;});
	jQuery('#app').on('tap','.btn_layer_before',function(){slide_layer_content('before');});
	jQuery('#app').on('tap','.btn_layer_next',function(){slide_layer_content('next');});
	jQuery('#app').on('change','input#help_check',function(){show_help_check(this)})
	
	
	/*
	jQuery('#GROUP_LAYER').on('pagebeforeshow',function(){jQuery('#GROUP_LAYER .bg_layer').animate({opacity: 1,height:'100%'},300);});
	jQuery('#SEARCH_LAYER').on('pagebeforeshow',function(){jQuery('#SEARCH_LAYER .bg_layer').animate({opacity: 1,height:'100%'},300);});

	jQuery('#GROUP_LAYER').on('pagebeforeshow',function(){show_layer_group();});
	jQuery('#SEARCH_LAYER').on('pagebeforeshow',function(){show_layer_search();});
	*/
}//End of ini_layer()
	
	/*최초 실행시 도움말 페이지 활성화*/
	function show_help_check(check){
		console.log('==show_help_check(check)==');
		if(jQuery(check).is(':checked')){
			local.save({help_display:'off'});
		}else{
			local.save({help_display:'on'});
		}
	}//End of show_help_check(page)

	/*도움말 레이어 활성*/
	function show_layer_help_before(type){
		var page_id=jQuery.mobile.activePage.attr('id');
		console.log('==show_layer_help_before('+page_id+')==');
		if(page_id=='LOGIN'){return false;}
		if(type=='auto'&&local.get('help_display')=='off'){return false;}
		
		var active_id=jQuery.mobile.activePage.attr('id');
		
		var footer=jQuery('#'+active_id+' footer[data-role="footer"]');	
		if(footer.hasClass('open')){
			footer.removeClass('open');
			var all_menu=jQuery('#'+active_id+' div.all_menu');
			all_menu.animate({'height':0+'px'},300,function(){show_layer_help()});
					
		}else{
			show_layer_help();
		}
	}//End of show_hlep_layer();

	function show_layer_help(type){
		var page_id=jQuery.mobile.activePage.attr('id');
		console.log('==show_hlep_layer('+page_id+')==');
		var layer=template_layer_help(type);	
		var content_div=layer.find('div.help_content');
		for(i=0;i<content_div.length;i++){
			jQuery(content_div[i]).attr('data-order',i)
		}
		var layer_height=jQuery(window).height();
		layer.css('height',layer_height);
		layer.find('button.btn_layer_before').css('display','none');
		
		jQuery('#'+page_id).append(layer).trigger('create');
		
		layer.animate({opacity: 1,height:layer_height},300);
		jQuery.mobile.loading('hide');
	}


	/*슬라이드 이동*/
	function slide_layer_content(dir){
		console.log('==slide_layer_content('+dir+')==');
		var act_content=jQuery('#layer_help div.help_content.act');
		var act_order=act_content.attr('data-order');
		var content_div=jQuery('#layer_help div.help_content');
		if(dir=='before'){
			var new_order=Number(act_order)-1;
			if(new_order<1){
				jQuery('#layer_help .btn_layer_before').css('display','none');
			}
			jQuery('#layer_help .btn_layer_next').css('display','block');
			act_content.removeClass('act');
			act_content.addClass('next');
			jQuery('#layer_help div.help_content[data-order="'+new_order+'"]').removeClass('before');
			jQuery('#layer_help div.help_content[data-order="'+new_order+'"]').addClass('act');
		}else if(dir=='next'){
			var new_order=Number(act_order)+1;
			if(new_order>=content_div.length-1){
				jQuery('#layer_help .btn_layer_next').css('display','none');
			}
			jQuery('#layer_help .btn_layer_before').css('display','block');
			act_content.removeClass('act');
			act_content.addClass('before');
			jQuery('#layer_help div.help_content[data-order="'+new_order+'"]').removeClass('next');
			jQuery('#layer_help div.help_content[data-order="'+new_order+'"]').addClass('act');
		}
		var check_type=jQuery('#layer_help div.help_content[data-order="'+new_order+'"]').attr('data-type');
		
		var active_id=jQuery.mobile.activePage.attr('id');
		var footer=jQuery('#'+active_id+' footer[data-role="footer"]');
		var all_menu=jQuery('#'+active_id+' div.all_menu');
		
		if(check_type=='footer_menu'){
			/*
			var page_height=jQuery(window).height();
			var header_height=jQuery.mobile.activePage.find('header[data-role="header"]').outerHeight(false);
			var shotcut_height=jQuery.mobile.activePage.find('.shortcut_menu_div').outerHeight(false);
			var open_height=page_height-header_height-shotcut_height;
			*/
			all_menu.animate({height:all_menu_height+'px'},300);
			footer.addClass('open');
		}else{
			all_menu.animate({'height':0+'px'},300);
			footer.removeClass('open');
		}
	}//End of slide_layer_content(dir)
		
	function send_chart_msg(){
		console.log('==send_chart_msg()==');
		var layer=jQuery('#layer_chart');
		var item_code=layer.attr('data-code');
		var item_type=layer.attr('data-type');
		var server_code=layer.attr('data-server_code');
		
		var chart_type=jQuery(layer).find('input[name="chart_set"]').val();
		console.log(chart_type);
		var chart_value=jQuery(layer).find('#chart_set_min_number').val();
		
		send_msg={pageId:'#ITEM_CHART',itemCd:item_code,serverCode:server_code,itemType:item_type,chartType:chart_type,chartValue:chart_value,type:'chart'}
		//console.log(send_msg);
		send_native(send_msg);
	}//End of send_chart_msg()
	
			
	//관심그룹 레이어 열기
	function show_layer_group(){
		console.log('==show_layer_group()==');
		var layer=get_template('layer_group');
		/*
		var group_option=get_template('group_item_option');
		var first_group_code=jQuery(group_option[0]).attr('value');
		layer.find('#layer_group .select_box_group option').remove();
		layer.find('#layer_group .select_box_group').append(group_option).trigger('create');
		
		var item_option=template_group_item_option(first_group_code);
		layer.find('#layer_group_item_select_02 option').remove();
		layer.find('#layer_group_item_select_02').append(item_option).trigger('create');
		*/
		jQuery.mobile.activePage.append(layer).trigger('create');
		
		layer.animate({opacity: 1,height:'100%'},300);
	}//End of show_layer_group();
	
	//종목검색 레이어 열기
	function show_layer_search(){
		console.log('==show_layer_search()==');
		var layer=get_template('layer_search');
		
		var group_option=get_template('group_item_option');
		var first_group_code=jQuery(group_option[0]).attr('value');
		layer.find('#layer_search .select_box_group option').remove();
		layer.find('#layer_search .select_box_group').append(group_option).trigger('create');
		
		var item_option=template_group_item_option(first_group_code);
		layer.find('#layer_group_item_select_02 option').remove();
		layer.find('#layer_group_item_select_02').append(item_option).trigger('create');
		
		jQuery.mobile.activePage.append(layer).trigger('create');
		layer.animate({opacity: 1,height:'100%'},300);
	}//End of show_layer_search()


	/*관심그룹 레이어 초기화*/
	function ini_group_layer(){
		
		jQuery('#app').on('tap','#layer_group .btn_layer_reg_group_name',function(){layer_group_reg()});
		jQuery('#app').on('tap','#btn_close_group_layer',function(){
										var code=jQuery('#ITEM_LIST').attr('data-code');
										console.log(code);
										jQuery('#ITEM_LIST select.interest_select option').removeAttr('selected');
										var before_option=jQuery('#ITEM_LIST select.interest_select option[value="'+code+'"]');
										before_option.attr('selected','selected');
										jQuery('#ITEM_LIST span.interest_select').text(before_option.text());
										reset_item_list_table();
										item_layer_remove_before()
							});
	}//End of ini_group_layer();
	
	
	/*종목 레이어 삭제*/
	function item_layer_remove_before(){
		console.log('==item_layer_remove()==');
		
		var active_id=jQuery.mobile.activePage.attr('id');
		jQuery('#'+active_id).css('overflow-y','auto');
		var footer=jQuery('#'+active_id+' footer[data-role="footer"]');	
		if(footer.hasClass('open')){
			footer.removeClass('open');
			var all_menu=jQuery('#'+active_id+' div.all_menu');
			all_menu.animate({'height':0+'px'},300,function(){item_layer_remove();});
		}else{
			setTimeout(function(){item_layer_remove()},300);
		}
	}//End of item_layer_remove()
	
	function item_layer_remove(){
		var layer=jQuery.mobile.activePage.find('.bg_layer');
		layer.animate({opacity: 0,height:'0%'},300,function(){layer.remove();});
	}//End of item_layer_remove()
	
	/*종목별 페이지 종목 코드 변경*/
	function layer_item_code_change(){
		console.log('==layer_item_code_change()==');
		
		var option=jQuery('#layer_group_item_select_02 option:selected');
		var item_code=jQuery('#layer_group_item_select_02').val();  
		var item_type=option.attr('data-type');
		var item_serverCode=option.attr('data-server_code');
			
		var page_id=jQuery.mobile.activePage.attr('id');
		
		var msg={pageId:'#'+page_id,itemCd:item_code,itemType:item_type,serverCode:item_serverCode,type:'existing'};
		send_native(msg);
		
		var real=jQuery('#app').attr('data-real');
		if(real=='true'){
			var msg={pageId:'#'+page_id,itemCd:item_code,itemType:item_type,serverCode:item_serverCode,type:'real'};
			send_native(msg);
		}
		
		item_layer_remove();
	}//End of layer_item_code_change()
	
	/*관심그룹 등록처리*/
	function layer_group_reg(){
		var page_id=jQuery.mobile.activePage.attr('id');
		console.log('==layer_group_reg('+page_id+')==');
		var group_name=jQuery('#layer_reg_group_name').val();
		var group_code=save_group_name(group_name);

		if(group_code){
			if(page_id=='ITEM_LIST'){			
				var new_option=template_group_option();
				jQuery('#ITEM_LIST select.interest_select').empty();
				jQuery('#ITEM_LIST select.interest_select').append(new_option).trigger('create');
				jQuery('#ITEM_LIST span.interest_select').html(group_name);
				jQuery('#ITEM_LIST').attr('data-code',group_code);
				reset_item_list_table();
			}else{
				jQuery('#dialog_item_group .no_group_desc').remove();
				var group_ul=template_dialog_item_ul(group_code);
				jQuery('#dialog_item_group div.dialog_group_content').append(group_ul);
			}
			jQuery('#layer_reg_group_name').val('');
			item_layer_remove_before();
		}else{
			return false
		}
	}//End of layer_group_reg()
	
	function layer_group_item_option_change(){
		console.log('==layer_group_item_option_change()==');
		var code=jQuery('#layer_group_select_02').val()
		console.log(code);
		var item_option=template_group_item_option(code);
		var first_item=jQuery(item_option[0]).html();
		console.log(first_item);
		jQuery('#layer_group_item_select_02 option').remove();
		jQuery('#layer_group_item_select_02-button span.select_box_item').html(first_item);
		jQuery('#layer_group_item_select_02').append(item_option).trigger('create');
	}//End of layer_group_item_option_change()
	
	function layer_group_item_reg(){
		console.log('==layer_group_item_reg()==');
		var group_code=jQuery('#layer_group #layer_group_select_01').val();
		if(group_code=='false'){
			alert('등록할 관심그룹을 선택하거나 \n 생성하세요.');			
		}else{
			var result=save_group_item(group_code);
			alert('['+result.item_caption+']을\n['+result.group_name+'] 관심그룹에 등록했습니다.');
			item_layer_remove();
		}
	}//End of layer_group_item_reg()

	/*관심그룹 등록*/
	function save_group_item(group_code){
		console.log('==save_group_item('+group_code+')==');
		
		var item_code=jQuery.mobile.activePage.attr('data-code');
		var item_caption=jQuery.mobile.activePage.attr('data-caption');
		var item_type=jQuery.mobile.activePage.attr('data-type');
		var item_server_code=jQuery.mobile.activePage.attr('data-server_code');
		
		var group_data=get_local_json('group');
		var group_name=group_data[group_code];
		var item_data=get_local_json(group_code);
		var check_item=obj.has_key(item_data,item_code);
		
		if(check_item){
			return false;
		}
		
		item_data[item_code]={};
		item_data[item_code].caption=item_caption;
		if(item_type=='option_item'){
			item_data[item_code].optionType=jQuery.mobile.activePage.attr('data-option_type');
			item_data[item_code].optionExe=jQuery.mobile.activePage.attr('data-exercise');
		}
		item_data[item_code].itemType=item_type;
		item_data[item_code].serverCode=item_server_code;
		
		var save_string=JSON.stringify(item_data);
		var save_obj={};
		save_obj[group_code]=save_string;
		local.save(save_obj);
		
		var result={};
		result.group_name=group_name;
		result.item_code=item_code;
		result.item_caption=item_caption;
		
		return result; 
	}//End of save_group_item(group_code,item_code)
	
	
	function ini_search_layer(){
		jQuery('#app').on('change','#layer_search input[name="layer_search_type"]',function(){
			var layer_type=jQuery('input[name="layer_search_type"]:checked').val();
			console.log(layer_type)
			if(layer_type=='code'){
				jQuery('#layer_search .type_01').slideDown(300);
				jQuery('#layer_search .type_02').slideUp(300);	
			}else if(layer_type=='item'){
				jQuery('#layer_search .type_01').slideUp(300);
				jQuery('#layer_search .type_02').slideDown(300);
			}
		});
		jQuery('#app').on('change','#layer_search select#layer_search_fdm',function(){layer_search_step01()});
		jQuery('#app').on('change','#layer_search select#layer_seach_step_01',function(){layer_search_step02()});
		jQuery('#app').on('change','#layer_search select#layer_seach_step_02',function(){layer_search_step03()});
		jQuery('#app').on('change','#layer_search select#layer_seach_step_03',function(){layer_search_code()});	
		jQuery('#app').on('tap','#layer_search .type_02 .btn_layer_ok',function(){layer_item_code_change()});
		jQuery('#app').on('change','#layer_group_select_02',function(){layer_group_item_option_change()});
		
		jQuery('#app').on('tap','#layer_search .type_01 .btn_layer_ok',function(){layer_item_change()});
		jQuery('#app').on('tap','#layer_search .type_02 .btn_layer_ok',function(){layer_item_code_change()});
	}//End of ini_search_layer()

		function layer_search_step01(){
			jQuery('#layer_seach_step_01 option').remove();
			jQuery('#layer_seach_step_01-button span').html('카테고리 선택');
			var exchange_temp=jQuery('#layer_search select#layer_search_fdm').val();
			console.log(exchange_temp);
			var exchange=mts_prefix+'_'+exchange_temp;
			
			exchange_data=get_local_json(exchange);
			
			var category=exchange_data.category;
			var step01_option_code='<option value="false" selected="selected">카테고리 선택</option>';
			for(key in category){
				temp_code='<option value="'+key+'">'+item_catagory_caption[key]+'</option>';
				step01_option_code=step01_option_code+temp_code;
			}
			var step01_option=jQuery(step01_option_code);
			jQuery('#layer_seach_step_01').append(step01_option).trigger('create');
			jQuery('#layer_seach_step_div').slideDown(300);
		}//End of layer_search_step01();
		
		function layer_search_step02(){
			jQuery('#layer_seach_step_02 option').remove();
			jQuery('#layer_seach_step_02-button span').html('종목 선택');
			var exchange_temp=jQuery('#layer_search select#layer_search_fdm').val();
			var exchange=mts_prefix+'_'+exchange_temp;
			exchange_data=get_local_json(exchange);
			var category=exchange_data.category;
			var category_code=jQuery('#layer_search select#layer_seach_step_01').val();
			var item_data=category[category_code];
			
			var step02_option_code='<option value="false" selected="selected">종목 선택</option>';
			for(key in item_data){
				temp_code='<option value="'+key+'">'+item_data[key].caption+'</option>';
				step02_option_code=step02_option_code+temp_code;
			}
			var step02_option=jQuery(step02_option_code);
			jQuery('#layer_seach_step_02').append(step02_option).trigger('create');
		}//End of layer_search_step02();
	
		function layer_search_step03(){
			jQuery('#layer_seach_step_03 option').remove();
			jQuery('#layer_seach_step_03-button span').html('월물 선택');
			var exchange_temp=jQuery('#layer_search select#layer_search_fdm').val();
			var exchange=mts_prefix+'_'+exchange_temp;
			exchange_data=get_local_json(exchange);
			var category=exchange_data.category;
			var category_code=jQuery('#layer_search select#layer_seach_step_01').val();
			var item_code=jQuery('#layer_search select#layer_seach_step_02').val();
			if(item_code==false){return false;}
			var item_expiration=category[category_code][item_code].expiration;
			var step03_option_code='<option value="false" selected="selected">월물 선택</option>';
			for(var i=0;i<item_expiration.length;i++){
				console.log(item_expiration[i].toString());
				var year=item_expiration[i].toString().substring(0,4);
				var code_year=item_expiration[i].toString().substring(2,4);
				var month=item_expiration[i].toString().substring(4,6);
				var m_code=month_code[month]+code_year;
				temp_code='<option value="'+m_code+'">'+year+'년 '+month+'월</option>';
				step03_option_code=step03_option_code+temp_code;
			}
			var step03_option=jQuery(step03_option_code);
			jQuery('#layer_seach_step_03').append(step03_option).trigger('create');
			/*jQuery('#layer_seach_step_div_03').slideDown(300);*/
		}//End of layer_search_step02();
		
		function layer_search_code(){
			var search_type=jQuery('#layer_search select#layer_search_type').val();
			var item_code=jQuery('#layer_search select#layer_seach_step_02').val();
			var date_code=jQuery('#layer_search select#layer_seach_step_03').val();
			var type_string='';
			console.log(search_type);
			if(search_type=='option'){
				type_string='O';
			}
			var code=type_string+item_code+date_code;
			var search_code=jQuery('#layer_search input#layer_search_code').val(code);
		}//End of layer_search_code()
		
		function layer_item_change(){
			console.log('==layer_item_change()==');
			var item_type=jQuery('#layer_search select#layer_search_type').val();
			console.log(item_type);
			if(item_type=='futures'){
				var page_id=jQuery.mobile.activePage.attr('id');
				var search_code=jQuery('#layer_search input#layer_search_code').val();
				
				var msg={pageId:'#'+page_id,itemCd:search_code,itemType:item_type,serverCode:search_code,type:'existing'};
				console.log(msg);
				send_native(msg);
			
				var real=jQuery('#app').attr('data-real');
				if(real=='true'){
					var msg={pageId:'#'+page_id,itemCd:search_code,itemType:item_type,serverCode:search_code,type:'real'};
					console.log(msg);
					send_native(msg);
				}
				
				item_layer_remove();
			}else if(item_type=='option'){
				var search_code=jQuery('#layer_search input#layer_search_code').val();
				var temp_link=jQuery('<a href="#ITEM_OPTION" data-code="'+search_code+'">행사가 리스트</a>');
				item_layer_remove();
				ini_page(temp_link);
				
			}
		}//End of layer_item_change();
		
/*dialog 초기화*/		
function ini_dialog(){
	console.log('==ini_dialog==');
	//종목검색 dialog
	jQuery('#app').on('tap','button[data-dialog="item_select"]',function(){ini_dialog_item_select(this)});
	jQuery('#app').on('change','#dialog_item_select .select_item_type, #dialog_item_select .select_category',function(){dialog_item_select()});

	//종목정보 dialog
	jQuery('#app').on('tap','button[data-dialog="item_info"]',function(){ini_dialog_item_info(this)});
	
	//관심종목 dialog
	jQuery('#app').on('tap','button[data-dialog="item_group"]',function(){ini_dialog_item_group(this)});
	jQuery('#app').on('tap','#dialog_item_group button.btn_make_group',function(){show_layer_group();});
	jQuery('#app').on('tap','#dialog_item_group button.btn_del_group',
						function(){
							var code=jQuery(this).attr('data-code');
							console.log(code);
							jQuery('#dialog_group_list li[data-group="'+code+'"]').remove();
							del_group_name(code);
						});
	
	jQuery('#app').on('tap','#dialog_item_group button.btn_reg_item',
						function(){
							var code=jQuery(this).attr('data-code');
							console.log(code);
							var result=save_group_item(code);
							if(result){
								alert('['+result.item_caption+']을\n['+result.group_name+'] 관심그룹에 등록했습니다.');
								var item_li=template_dialog_item_li(code,result.item_code);
								console.log(item_li);
								var target_ul=jQuery('#dialog_item_group ul[data-group="'+code+'"]');
								target_ul.find('li.no_item_desc').remove();
								target_ul.append(item_li);
							}else{
								alert('이미 등록된 종목입니다.');
							}
						});
	jQuery('#app').on('tap','#dialog_item_group button.btn_group_item',
					function(){
						console.log(this);
						var item_code=jQuery(this).attr('data-code');
						var server_code=jQuery(this).attr('data-server_code');
						var item_type=jQuery(this).attr('data-type');
						var page_id=jQuery.mobile.activePage.attr('id');
						var msg={'pageId':'#'+page_id,'itemCd':item_code,'serverCode':server_code,'itemType':item_type,'type':'existing'}
						send_native(msg);
						jQuery('#'+page_id+' .btn_dialog').removeClass('open');
						jQuery('#'+page_id+' .page_dialog').remove();
					});
	jQuery('#app').on('tap','#dialog_item_group button.btn_del_item',
					function(){
						var code=jQuery(this).attr('data-code');
						var item_code=jQuery(this).attr('data-item');						
						var group_data=get_local_json(code);
						delete group_data[item_code];
						var save_string=JSON.stringify(group_data);
						var save_obj={}
						save_obj[code]=save_string;
						local.save(save_obj);
						jQuery(this).parent('li').remove();
					});
					
	//차트 설정 
	jQuery('#app').on('tap','button[data-dialog="chart_setting"]',function(){ini_dialog_chart(this)});	
	jQuery('#app').on('change','#dialog_chart_setting input[type="checkbox"]',
						function(){
							var check_id=jQuery(this).attr('id');
							console.log(check_id);
							if(jQuery(this).is(':checked')){
								jQuery('#setting_'+check_id).slideDown(100).removeClass('hidden');
								if(check_id=='moving_averrage'){
									jQuery('#dialog_chart_setting button.btn_add_ma').slideDown(100).removeClass('hidden');
								}
							}else{
								jQuery('#setting_'+check_id).slideUp(100);
								if(check_id=='moving_averrage'){
									jQuery('#dialog_chart_setting button.btn_add_ma').slideUp(100);
								}
								if(check_id=='moving_averrage'){
									jQuery('#dialog_chart_setting button.btn_add_ma').slideUp(100).addClass('hidden');
								}
							}
						});
	jQuery('#app').on('tap','#btn_chart_setting_ok', function(){set_chart_data();});	
	jQuery('#app').on('tap','#dialog_chart_setting button.btn_add_ma', function(){chart_add_ma_item();});
	jQuery('#app').on('tap','#dialog_chart_setting button.btn_remove_ma', function(){chart_remove_ma_item(this);});	
	jQuery('#app').on('tap','#dialog_item_select_option button.close_dialog',
					function(){
						console.log('==close_dialog==');
						jQuery('#dialog_item_select_option').slideUp(300,function(){this.remove();})
					});
	jQuery('#app').on('tap','#dialog_option_item_table a[data-rel="dialog"]',
					function(){
						console.log(this);
						var group_code=jQuery('#ITEM_LIST select.interest_select').val()
						if(group_code==false){
							alert('관심 그룹이 없습니다. \n 관심그룹을 생성하세요.')
							return false;
						}
						var group_data=get_local_json('group');
						var group_name=group_data[group_code];
						var item_data=get_local_json(group_code);
						var item_caption=jQuery('#dialog_item_select_option header h2 span').text();
						var option_type=jQuery(this).attr('data-option_type');
						var type_string={call:' C ',put:' p '}
						var exercise=jQuery(this).attr('data-exercise');
						item_caption=item_caption+type_string[option_type]+exercise;
						
						item_data[jQuery(this).attr('data-server_code')]={};
						item_data[jQuery(this).attr('data-server_code')].caption=item_caption;
						item_data[jQuery(this).attr('data-server_code')].itemType=jQuery(this).attr('data-type');
						item_data[jQuery(this).attr('data-server_code')].serverCode=jQuery(this).attr('data-server_code');
						item_data[jQuery(this).attr('data-server_code')].optionExe=jQuery(this).attr('data-exercise');
						item_data[jQuery(this).attr('data-server_code')].optionType=jQuery(this).attr('data-option_type');
						console.log(item_data);
						alert('['+item_caption+']을\n['+group_name+'] 관심그룹에 등록했습니다.');
						var save_string=JSON.stringify(item_data);
						var save_obj={};
						save_obj[group_code]=save_string;
						local.save(save_obj);
						
						return false;
					});								
					
}//End of ini_dialog()

function ini_dialog_item_select(button){
	console.log('==ini_diglog_item_select()==');
	var page_id=jQuery.mobile.activePage.attr('id');
	if(jQuery(button).hasClass('open')){
		jQuery(button).removeClass('open');
		jQuery('#dialog_item_select_option').remove();
		jQuery('#dialog_item_select').slideUp(300,function(){this.remove(); reset_item_list_table();});
		
	}else{
		jQuery('#'+page_id+' .btn_dialog').removeClass('open');
		jQuery('#'+page_id+' .page_dialog').remove();
		jQuery(button).addClass('open');		
		var dialog_code=template_dialog_item_select();
			dialog_code.css('height',dialog_height);
			dialog_code.css('top',header_height);
			dialog_code.find('article').css ('height',dialog_height);
		var item_tr_html=item_tr('futures','currency');		
		jQuery('#'+page_id).append(dialog_code).trigger('creat');
		var dialog_code=jQuery('#dialog_item_select');
		dialog_code.find('#dialog_item_select_table tbody').html(item_tr_html).trigger('create')
		dialog_code.slideDown(300);
	}
}//End of ini_diglog_item_select()
		
		function dialog_item_select(){
			console.log('==diglog_item_select()==');
			var sel_type=jQuery('#dialog_item_select .select_item_type').val();
			var sel_category=jQuery('#dialog_item_select .select_category').val();
			var item_tr_html=item_tr(sel_type,sel_category);
			jQuery('#dialog_item_select_table tbody').html(item_tr_html).trigger('create');
				
		}//End of diglog_item_select();

		function dialog_item_option(data){
			console.log('==dialog_item_option(data)==')
			var page_id=jQuery.mobile.activePage.attr('id');
			var dialog_code=template_dialog_item_select_option(data);
				dialog_code.css('height',dialog_height);
				dialog_code.css('top',header_height);
				dialog_code.find('article').css ('height',dialog_height);
				jQuery('#'+page_id).append(dialog_code).trigger('creat');
			dialog_option_table(data);	

			jQuery('#dialog_item_select_option article').swipe({
				swipeUp:function(event, direction, distance, duration, fingerCount, fingerData){
							console.log('==swipUp==')
							option_price_more('down',true);
				},
				swipeDown:function(event, direction, distance, duration, fingerCount, fingerData){
							console.log('==swipDown==')
							option_price_more('up',true);
				}
			});	

			dialog_code.slideDown(300);
			jQuery.mobile.loading('hide');
		}//End of dialog_item_option();

		function dialog_option_table(data){
			console.log('==dialog_option_table()==');
			console.log(data);
			var table=jQuery('#dialog_option_item_table');
			table.attr('data-code',data.itemCd);
			table.attr('data-server_code',data.serverCode);
			
			var code=data.itemCd;
			var tr_data_temp=data['body'];
			var item_zdiv=data.zdiv;
			var item_cpos=data.cpos;
			var price_option={zdiv:item_zdiv,cpos:item_cpos}	
			var tr_cnt=obj.size(tr_data_temp);
			
			if(tr_cnt<1){
				alert('더 이상 행사가가 없습니다.');
				jQuery.mobile.loading('hide');
				return false;
			}
			
			var tr_data=[];
			for (var prc in tr_data_temp) {
			  tr_data.push([prc, tr_data_temp[prc]]);
			}
			tr_data.sort()
						
			jQuery('#dialog_option_item_table tbody tr').remove();
			
			for(i=(tr_data.length-1);i>-1;i--){
				var key=tr_data[i][0];
				var call=tr_data[i][1]['Call'];
				var put=tr_data[i][1]['Put'];
				var atmf_tr=''
				
				if(call.ATMF==1){
					atmf_tr='class="tr_atmf"';
				}
				
			jQuery('#dialog_option_item_table tbody').append('<tr '+atmf_tr+' data-call="'+call.State+'" data-put="'+put.State+'" data-exercise="'+key+'"><td class="call_data Diff">'+format_price(Math.abs(call.Diff),price_option)+'</td><td class="call_data price"><a data-rel="dialog" data-code="'+code+'"data-type="option_item" data-exercise="'+key+'" data-option_type="call" data-server_code="'+call.Code+'">'+format_price(call.Price,price_option)+'</a></td><th>'+format_price(key,price_option)+'</th><td  class="put_data  price"><a data-rel="dialog" data-code="'+code+'" data-type="option_item" data-exercise="'+key+'"  data-option_type="put" data-server_code="'+put.Code+'">'+format_price(put.Price,price_option)+'</a></td><td class="put_data Diff">'+format_price(Math.abs(put.Diff),price_option)+'</td></tr>').trigger('creat');
			}
			jQuery.mobile.loading('hide');
		}//End of dialog_option_table;


function ini_dialog_item_info(button){
	console.log('==ini_dialog_item_info(button)==');
	
	var page_id=jQuery.mobile.activePage.attr('id');
	if(jQuery(button).hasClass('open')){
		jQuery(button).removeClass('open');
		jQuery('#dialog_item_info').slideUp(300,function(){this.remove();});
	}else{
		jQuery('#'+page_id+' .btn_dialog').removeClass('open');
		jQuery('#'+page_id+' .page_dialog').remove();
		var item_code=jQuery('#'+page_id).attr('data-code');
		var item_type=jQuery('#'+page_id).attr('data-type');
		
		if(item_type.substr(0,1)=='o'){
			item_code_temp=item_code.substr(1,item_code.length);
			item_code_array=item_code_temp.split('_');
			item_code=item_code_array[0]
		}
		var server_code=item_code.substr(0,item_code.length-3);
		var dec_msg={pageId:'#'+page_id,itemCd:item_code,itemType:item_type,serverCode:server_code,type:'more'};
		send_native(dec_msg);	
		jQuery(button).addClass('open');
	}
}//End of ini_dialog_item_info(button)

	function dialog_item_info(data){
		var page_id=jQuery.mobile.activePage.attr('id');
		var dialog_code=template_dialog_item_info(data);
			dialog_code.css('height',dialog_height);
			dialog_code.css('top',header_height);
			dialog_code.find('article').css ('height',dialog_height);
			jQuery('#'+page_id).append(dialog_code).trigger('creat');
		dialog_code.slideDown(300);
		jQuery.mobile.loading('hide');
	}//End of dialog_item_info()

function ini_dialog_item_group(button){
	console.log('==ini_dialog_item_group(button)==');
	var page_id=jQuery.mobile.activePage.attr('id');
	if(jQuery(button).hasClass('open')){
		jQuery(button).removeClass('open');
		jQuery('#dialog_item_group').slideUp(300,function(){this.remove(),draw_chart();});
	}else{
		
		jQuery('#'+page_id+' .btn_dialog').removeClass('open');
		jQuery('#'+page_id+' .page_dialog').remove();
		var dialog_code=template_dialog_item_group();
			dialog_code.css('height',dialog_height);
			dialog_code.css('top',header_height);
			dialog_code.find('article').css ('height',dialog_height);
			jQuery('#'+page_id).append(dialog_code).trigger('creat');
		dialog_code.slideDown(300);
		jQuery(button).addClass('open');
	}	
}//End of ini_dialog_item_group(button)

function ini_dialog_chart(button){
	console.log('==ini_dialog_item_group(button)==');
	var page_id=jQuery.mobile.activePage.attr('id');
	if(jQuery(button).hasClass('open')){
		jQuery(button).removeClass('open');
		jQuery('#dialog_chart_setting').slideUp(300,function(){this.remove();});
		 draw_chart(true);
	}else{
		send_native({pageId:'#CHART_CLOSE',type:'close'},true);
		jQuery('#'+page_id+' .btn_dialog').removeClass('open');
		jQuery('#'+page_id+' .page_dialog').remove();
		var dialog_code=template_dialog_chart_setting();
			dialog_code.css('height',dialog_height);
			dialog_code.css('top',header_height);
			dialog_code.find('article').css ('height',dialog_height);
			jQuery('#'+page_id).append(dialog_code).trigger('creat');
		dialog_code.slideDown(300);
		jQuery(button).addClass('open');
	}	
}//End of ini_dialog_chart(button)

/*이동 평균선입력 항목의 추가*/
function chart_add_ma_item(){
	console.log('==chart_add_ma_item()==')
	var cnt=jQuery('#setting_moving_averrage div.moveing_averrage_item').length;
	if(cnt>8){
		alert('설정값은 9개까지 지원합니다.')
		return false;
	}
	var ma_item=jQuery('<div class="moveing_averrage_item"><label for="moving_averrage_1">설정값 <span>1</span></label><input type="number" id="moving_averrage_1"><button type="button" class="btn_remove_ma">삭제</button></div>');
	jQuery('#setting_moving_averrage').append(ma_item);	
	ma_item_numbering();
}
		
function chart_remove_ma_item(button){
	var del_id=jQuery(button).attr('data-del');
	console.log(del_id);
	jQuery('#'+del_id).parent('div').slideUp(100).remove();
	ma_item_numbering();
	return false;
}

function ma_item_numbering(){
	var ma_item=jQuery('#setting_moving_averrage div.moveing_averrage_item');
	
	for(i=0;i<ma_item.length;i++){
		var teamp_item=jQuery(ma_item[i]);
		var cnt=i+1;
		teamp_id='moving_averrage_'+cnt;
		teamp_item.find('label').attr('for',teamp_id);
		teamp_item.find('input').attr('id',teamp_id);
		teamp_item.find('label span').text(cnt);
		teamp_item.find('button').attr('data-del',teamp_id);
	}
}

		
		
		
/*관심그룹 관련 초기화*/
function ini_group(){
	jQuery('#btn_reg_group_name').on('tap',function(){reg_group_name()});
	jQuery('#btn_group_del').on('tap',function(){del_group_name()})
	jQuery('#btn_group_item_del').on('tap',function(){del_group_item()})
	
	jQuery('#GROUP_LIST').on('pagebeforeshow',function(){ini_group_list();});
	jQuery('#GROUP_ITEM').on('pagebeforeshow',function(){ini_group_item();});
	
	
}//End of ini_group();


	/*그룹이름의 등록*/
	function reg_group_name(){
		console.log('==reg_group_name()==');
		var group_name=jQuery('#reg_group_name').val();
		
		var group_code=save_group_name(group_name);
		if(group_code){
			jQuery('#group_list .no_group_item_desc').remove();		
			var group_list_item=get_template('group_list');
			group_list_item.find('a[href="#GROUP_ITEM"]').attr('data-code',group_code);
			group_list_item.find('h2').html(group_name);
			jQuery('#group_list').prepend(group_list_item);
			
			var list_cnt=Number(jQuery('#cnt_group_list_item').html());
			list_cnt++;
			jQuery('#cnt_group_list_item').html(list_cnt);
		}
		 jQuery('#reg_group_name').val('');
	}//End of reg_group_name();
	
	function get_local_json(key){
		var json_obj={}
		var json_string=local.get(key);
		if(json_string){json_obj=JSON.parse(json_string);}
		return json_obj;
	}//End of get_local_josn(key)
	
	function save_group_name(group_name){
		var group_data=get_local_json('group');
		if(!group_name){
			alert('관심그룹 명을 입력하세요');
			return false;
		}
		
		if(obj.has_value(group_data, group_name)){
			 alert('['+group_name+']은 이미 등록된 그룹 이름 입니다.');
			 return false;
		}
		
		var group_code='group_'+jQuery.now();
		group_data[group_code]=group_name;
		var save_string=JSON.stringify(group_data);
		var save_obj={'group':save_string}
		local.save(save_obj);
		return group_code;
	};
	
	/*그룹이름의 삭제*/
	function del_group_name(code){
		console.log('==del_group_name('+code+')==')
		//var code=jQuery.mobile.activePage.attr('data-code');	
		var group_data=get_local_json('group');
		var group_name=group_data[code];
		obj.del_key(group_data,code);
		var save_string=JSON.stringify(group_data);
		var save_obj={'group':save_string}
		local.save(save_obj);
		local.del(code);	
		alert('['+group_name+']를 삭제 하였습니다.');
		
		return false
	}//End of del_group_name()
	
	/*그룹리스트 페이지 초기화*/
	function ini_group_list(){
		
		console.log('==ini_group_list()==');
		//기존정보 삭제
		jQuery('#group_list').html('');
		jQuery('#cnt_group_list_item').html(0);
		//저장정보로 부터 리스트 생성
		var group_data={}
		var group_string=local.get('group');
		if(group_string){group_data=JSON.parse(group_string);}
		if(obj.size(group_data)>0){
			for(code in group_data){
				var group_list_item=get_template('group_list');
				var item_data=get_local_json(code);
				console.log(obj.size(item_data));
				group_list_item.find('a[href="#GROUP_ITEM"]').attr('data-code',code);
				group_list_item.find('h2').html(group_data[code]);
				group_list_item.find('span').html(jQuery.number(obj.size(item_data)));
				jQuery('#group_list').prepend(group_list_item);
			}
			jQuery('#cnt_group_list_item').html(obj.size(group_data));
		}else{
			var group_list_item=jQuery('<li class="no_group_item_desc">등록된 관심그룹이 없습니다.</li>')
			jQuery('#group_list').append(group_list_item);
		}
		console.log(group_data);
	}//End of ini_group_list();
	
	/*그룹 아이템 페이지 초기화*/
	function ini_group_item(){
		console.log('==ini_group_item()==');
		jQuery('#group_item_list').html('');
		jQuery('#cnt_group_item').html(0);
		jQuery('#expire_item_desc').remove();
		
		var code=jQuery('#GROUP_ITEM').attr('data-code');
		var group_data=get_local_json('group');
		var group_name=group_data[code];
		jQuery('#group_item_name').html(group_name);
		
		var item_data=get_local_json(code);
		
		var item_cnt=0;
		var expire_item='';
		var expire_item_cnt=0;
		
		if(obj.size(item_data)>0){
			for(code in item_data){
				var temp_data=item_code_export(code);
				var date_text=temp_data.year+'년 '+temp_data.month+'월';
				
				var item_info=item_search(code);
				var group_item=get_template('group_item');
				if(item_info){
					group_item.find('h3 input').val(code);
					group_item.find('h3 input').attr('id','group_item_'+code);
					group_item.find('h3 label').html(code);	
					group_item.find('h3 label').attr('for','group_item_'+code);
					group_item.find('span.group_item_catiopn').html(item_data[code]);	
					group_item.find('span.group_item_date').html(date_text);											
					jQuery('#group_item_list').append(group_item);
					item_cnt++;
				}else{
					group_item.find('h3 input').val(code);
					group_item.find('h3 input').attr('id','group_item_'+code);
					group_item.find('h3 label').html(code);	
					group_item.find('h3 label').attr('for','group_item_'+code);
					group_item.find('span.group_item_catiopn').html(item_data[code]);	
					group_item.find('span.group_item_date').html(date_text);		
					expire_item=expire_item+'<li class="expire_item">'+group_item.html()+'</li>';
					expire_item_cnt++;
				}
			}
			jQuery('#cnt_group_item').html(jQuery.number(obj.size(item_data)));
			jQuery('#group_item_list').prepend(expire_item);
			if(expire_item_cnt>0){
				jQuery('#cnt_group_item').parent('h2').append('<span id="expire_item_desc"> 중<span class="cnt_span">'+expire_item_cnt+'</span>개 종목 만료</span>');
			}
		}else{
			var group_item=jQuery('<li class="no_group_item_desc">등록된 관심 종목이 없습니다.</li>');
			jQuery('#group_item_list').append(group_item);
		}
	}//End of ini_group_item();
	
	function del_group_item(){
		console.log('del_group_item()');
		var code=jQuery('#GROUP_ITEM').attr('data-code');
		var traget_check=jQuery('#group_item_list input:checked');
		
		var del_ok=confirm('['+traget_check.length+'] 개의 종목을 관심그룹에서 제외 하시겠습니까??');
		
		var group_item=get_local_json(code);
		console.log(group_item);
		if(del_ok==true){
			for(var i=0;i<traget_check.length;i++){
				var item_code=jQuery(traget_check[i]).val();
				console.log(item_code);
				remove_li=traget_check.parents('li');
				remove_li.remove();
				delete group_item[item_code];			
			}
			var save_string=JSON.stringify(group_item);
			var save_obj={};
			save_obj[code]=save_string
			local.save(save_obj);
			alert('['+traget_check.length+'] 개의 종목을 관심그룹에서 삭제했습니다.');
			jQuery('#expire_item_desc').remove();
		}
		
		var item_cnt=jQuery('#group_item_list li').length;
		var expire_item_cnt=jQuery('#group_item_list li.expire_item_cnt').length;
		
		jQuery('#cnt_group_item').html(jQuery.number(item_cnt));
		
		if(item_cnt<1){
			var group_item=jQuery('<li class="no_group_item_desc">등록된 관심 종목이 없습니다.</li>');
			jQuery('#group_item_list').append(group_item);
		}
		
		if(expire_item_cnt>0){
			jQuery('#cnt_group_item').parent('h2').append('<span id="expire_item_desc"> 중<span class="cnt_span">'+expire_item_cnt+'</span>개 종목 만료</span>');
		}
	}//End of del_group_item()

function ini_footer(){
	console.log('==ini_footer()==');
	jQuery('#app').on('tap','.btn_footer_menu',function(){toggle_footer_menu()});
}//End of ini_footer()
	
	function toggle_footer_menu(){
		console.log('==toggle_footer_menu()==');
		var check_real=jQuery('#app').attr('data-real');
		if(check_real=='true'){
			jQuery('input[name="footer_real_check"]').attr('checked','checked');
			jQuery('label[for="footer_real_check"]').removeClass('ui-checkbox-off');
			jQuery('label[for="footer_real_check"]').addClass('ui-checkbox-on');	
		}
		jQuery('input[name="footer_real_check"]').on('change',function(e){
				console.log('==footer_real_check==');
				if(jQuery(e.target).is(':checked')){
					jQuery('#app').attr('data-real','true');
				}else{
					jQuery('#app').attr('data-real','false');
				}
		});
		
		
		var page_height=jQuery(window).height();
		var header_height=jQuery.mobile.activePage.find('header[data-role="header"]').outerHeight(false);
		var shotcut_height=jQuery.mobile.activePage.find('.shortcut_menu_div').outerHeight(false);
		
		var open_height=page_height-header_height-shotcut_height;
		var footer=jQuery.mobile.activePage.find('footer[data-role="footer"]');
		
		var active_id=jQuery.mobile.activePage.attr('id');
		var all_menu=jQuery('#'+active_id+' div.all_menu');
		if(footer.hasClass('open')){
			all_menu.animate({'height':0+'px'},300);
			footer.removeClass('open');
		}else{
			jQuery('#'+active_id+' div.all_menu_group').remove();
			//관심그룹 메뉴 생성
			var group_data=get_local_json('group');
			var group_menu_html='';
			for(code in group_data){
				group_menu_html+='<h2><a href="#ITEM_LIST" data-code="'+code+'">'+group_data[code]+'</a></h2>';
				
					var item_data=get_local_json(code);
					var item_list_html='';
					for(item_code in item_data){
						item_list_html+='<li><a href="#ITEM_ASKING" data-code="'+item_code+'" data-server_code="'+item_data[item_code].serverCode+'" data-type="'+item_data[item_code].itemType+'">'+item_data[item_code].caption+'</a></li>';
					}
					if(obj.size(item_data)>0){
						item_list_html='<ul>'+item_list_html+'</ul>';
					}else{
						item_list_html='';
					}
				
				group_menu_html+=item_list_html;
			}
			
			if(group_menu_html!=''){
				group_menu_html='<div class="all_menu_group"><h1>등록된 관심 그룹</h1>'+group_menu_html+'</div>';
			
			}else{
				group_menu_html='<div class="all_menu_group"><h1>등록된 관심 그룹</h1><p>등록된 관심그룹과 종목이 없습니다.</p></div>'
			}	
			
			all_menu.append(group_menu_html);
			
			jQuery('#'+active_id+' .all_menu_group a').draggable({
				helper: "clone",
				start:function(e,ui){
					jQuery('#app footer.open .all_menu').css('overflow','visible');
					var darg_item=ui.helper;
					if(darg_item.attr('href')=='#ITEM_ASKING'){
						console.log(darg_item.attr('href') +'/'+ darg_item.attr('data-code'));
						console.log(darg_item);
						darg_item.html(darg_item.attr('data-code'));
					}
				},
				stop:function(e,ui){
					jQuery('#app footer.open .all_menu').css('overflow-y','scroll');
				}
			});
			
			
			all_menu.animate({height:all_menu_height+'px'},300);
			footer.addClass('open');
		}
		
	}//End of toggle_footer_menu()

	function ini_footer_menu(page_id){
		console.log('==ini_footer_menu('+page_id+')==');
		//var active_id=jQuery.mobile.activePage.attr('id');
		active_id=page_id;
		jQuery(active_id+' .all_menu a').draggable({
			helper: "clone",
			start:function(e,ui){
				jQuery('#app footer.open .all_menu').css('overflow','visible');
				var darg_item=ui.helper;
				if(darg_item.attr('href')=='#ITEM_ASKING'){
					console.log(darg_item.attr('href') +'/'+ darg_item.attr('data-code'));
					console.log(darg_item);
					darg_item.html(darg_item.attr('data-code'));
				}
			},
			stop:function(e,ui){
				jQuery('#app footer.open .all_menu').css('overflow-y','scroll');
			}
		});
		jQuery(active_id+' .shortcut_menu li').droppable({
			drop:function(e,ui){
				var new_item=jQuery(ui.draggable).clone()
				new_item.removeClass('ui-draggable');
				new_item.addClass('ui-btn');
				if(new_item.attr('href')=='#ITEM_ASKING'){
					new_item.html(new_item.attr('data-code'));
				}
				jQuery(e.target).html(new_item);
				jQuery('#app footer.open .all_menu').css('overflow-y','scroll');
				save_shortcut(page_id);
			},
		});
	}//ini_footer_menu(page_id)
	
	function save_shortcut(page_id){
		console.log('==save_shortcut('+page_id+')==');
		var shortcut_code=jQuery(page_id+'>footer div.shortcut_menu_div ul.shortcut_menu').html();
		var save_obj={shortcut:shortcut_code};
		local.save(save_obj);
	}//save_shortcut(page_id)


	function hide_footer(page_id){
		console.log('==hide_footer('+page_id+')==');
		//var active_id=jQuery.mobile.activePage.attr('id');
		var footer=jQuery('#'+page_id).find('footer[data-role="footer"]');
		var all_menu=jQuery('#'+page_id+' div.all_menu');
		if(footer.hasClass('open')){
			//footer.empty();
			all_menu.css('height',0);
			footer.removeClass('open');
		}
	}

/**
*종목검색
*/
//종목의 일자 반환
function item_code_export(item_code){
	var return_data={};
	var code=item_code.substr(0,(item_code.length-3));
	var month_temp=item_code.substr((item_code.length-3),1);
	var month=month_number[month_temp];
	var year_temp=item_code.substr((item_code.length-2),2);
	var year=Number('20'+year_temp);
	var date_text=year+'년 '+month+'월';
	
	return_data['code']=code;
	return_data['year']=year;
	return_data['month']=month;
	return return_data;
}//End of item_code_export(item_code);

function item_search(item_code){
	console.log('==item_search('+item_code+')==')
	var temp_data=item_code_export(item_code);
	var date_text=temp_data.year+'년 '+temp_data.month+'월';
	var code=temp_data.code;
	
	var exchange=get_local_json(mts_prefix+'_exchange');
	var exchange_name='';
	var category_name='';
	//거래소 반복
	for(key in exchange){
		exchange_name=exchange[key];
		var exchange_key=mts_prefix+'_'+key;
		//console.log(exchange_key);
		var ex_data=get_local_json(exchange_key);
		var category=ex_data.category;
		//카테고리 반복
		for(c_key in category){
			category_name=c_key;
			var item_data=category[c_key];
			for(i_key in item_data){
				if(code==i_key){
					var return_data=item_data[i_key];
						return_data.exchange=exchange_name;
						return_data.category=category_name;
						return_data.date=date_text;
					return return_data;
				}
			}//for(i_key in item_data);
		}//for(c_key in category)
	}//for(key in exchange)
	return false;
}//End of item_search()


/**
*템플릿관련 영역
*/
function get_template(part){
	switch(part){
		case('footer_menu'):
			return template_footer_menu();
		break;
		case('exchange_option'):
			return template_exchange_option();
		break;
		case('group_list'):
			return template_group_list();
		break;
		case('group_item'):
			return template_group_item();
		break;
		case('group_item_option'):
			return template_group_option();
		break;
		case('item_list'):
			return template_item_list();
		break;
		case('item_more_asking'):
			return template_item_more_asking();
		break;
		case('item_more_conclude'):
			return template_item_more_conclude();
		break;
		case('item_more_menu'):
			return template_item_more_menu();
		break;
		case('layer_group'):
			return template_layer_group();
		break;
		case('layer_search'):
			return template_layer_search();
		break;
		case('layer_chart'):
			return template_layer_chart();
		break;
	}
}//End of get_template(part)
	
	var template_footer_menu=function(){
		var content=local.get('footer_menu');
		if(content){
			return jQuery(content);
		}else{
			var tel_number=local.get(mts_prefix+'_tel')
			return jQuery('<div class="footer_menu_area"><div class="btn_all_menu_div"><button type="button" class="btn_footer_menu">전체메뉴</button></div><div class="shortcut_menu_div" data-role="navbar"><ul class="shortcut_menu"><li><a href="#BOARD_LIST" data-code="1"  data-type="notice_list">공지사항</a></li><li><a href="#ITEM_SELECT">종목검색</a></li><li><a href="#ITEM_LIST">관심종목</a></li><li><a href="#BOARD_LIST" data-code="2" data-type="board_list">뉴스</a></li><li><a href="tel:'+tel_number+'">전화주문</a></li></ul></div><form id="footer_real_check" ><label for="footer_real_check">실시간 데이터</label><input name="footer_real_check" id="footer_real_check" type="checkbox"></form><div id="close_app_div"><a href="#LOGIN">종료</a></div></div><div class="all_menu"><h1><a href="tel:'+tel_number+'">전화주문</a></h1><h1><a href="#ITEM_SELECT">종목검색</a></h1><h1><a href="#ITEM_LIST">관심종목</a></h1><h1><a href="#BOARD_LIST" data-code="1" data-type="notice_list">공지사항</a></h1><h1><a href="#BOARD_LIST" data-code="2" data-type="board_list">뉴스</a></h1><h1><a href="#HELP" data-code>도움말</a></h1><h1><a href="#CLOSE"  data-rel="dialog">종료</a></h1></div>'); 	
		}
	}
	
	var template_exchange_option=function(){
		option_text='<option value="all" selected="selected">전체</option>';
		var exchange=get_local_json(mts_prefix+'_exchange');
		console.log(exchange);
		for(key in exchange){
			option_text+='<option value="'+key+'">'+exchange[key]+'</option>';
		}
		return jQuery(option_text);	
	}
	
	var template_search_item_level2=function(category){
		console.log('==template_search_item_level2('+category+')==');
		var exchange=jQuery('#search_type_div select.search_exchange').val();
		if(exchange=='all'){
			var check_excahge=get_local_json(mts_prefix+'_exchange');
		}else{
			var check_excahge=Array();
			check_excahge[exchange]=exchange;
		}
		var list_text='';
		var cnt=0;
		var type=jQuery('#ITEM_SEARCH select.search_item_type').val();
		for(ex in check_excahge){
			var ex_data=get_local_json(mts_prefix+'_'+ex);
			var catagory_data=ex_data.category[category];
			console.log(ex_data.category);
			console.log(obj.has_key(ex_data.category,category));
			if(obj.has_key(ex_data.category,category)){			
				for(code in catagory_data){
					console.log(catagory_data[code]);
					cnt++;
					if(catagory_data[code][type]){
				list_text+='<li><input type="radio" name="item_search_step02" id="step02_'+cnt+'" value="'+code+'" data-exchange="'+ex+'" /><label for="step02_'+cnt+'">'+code+'<span>'+'['+ex+']'+catagory_data[code].caption+'</span></label></li>';
					}
				}//End of for(code in catagory_data)
			}
		}//End of for(ex in check_excahge)
		
		
		return jQuery(list_text);
	}
	
	var template_search_item_level3=function(input){
		console.log('==template_search_item_level3==');
		var exchange=jQuery(input).attr('data-exchange');
		var catgory=jQuery('input[name="item_search_step01"]:checked').val();
		var code=jQuery(input).attr('value');
		var list_text='';
		var ex_data=get_local_json(mts_prefix+'_'+exchange);
		var expiration=ex_data.category[catgory][code].expiration;
		
		var cnt=0;
		for(i=0;i<expiration.length;i++){
			var date_string=expiration[i]+'';
			var year=date_string.substring(2,4);
			var month=date_string.substring(4,6);
			var code=month_code[month]+year;
			list_text+='<li><input type="radio" name="item_search_step03" id="step03_'+i+'" value="'+code+'" /><label for="step03_'+i+'">'+code+'<span>'+year+'/'+month+'</span></label></li>';
		}
		
		return jQuery(list_text);
	}
	
	var template_item_list=function(data){
		var option={zdiv:data.zdiv,cpos:data.cpos}
		
		var tr_class="even"	
	
		if(data.LastPrice>data.SettlementPrice){
			tr_class="up";
		}else{
			tr_class="down";
		}
	
		var char_open=parseInt(((data.OpenPrice-data.LowPrice)/(data.HighPrice-data.LowPrice)*100));
		var char_last=parseInt(((data.LastPrice-data.LowPrice)/(data.HighPrice-data.LowPrice)*100));
		var char_size=parseInt((Math.abs(char_open-char_last)));
		if(char_open<=char_last){
			char_left=char_open;
		}else{
			char_left=char_last;
		}
		
		var item_caption='<span class="item_caption">'+data.itemCaption+'</span>';
		var option_attr='';
		if(data.itemType=="option_item"){
			data.optionType='put';
			var option_key={'call':'<span class="option_type call">C</span>','put':'<span class="option_type put">P</span>'}
			option_attr='data-option_type="'+data.optionType+'" data-exercise="'+data.optionExe+'"';
			item_caption+=option_key[data.optionType]+'<span class="option_exe">'+data.optionExe+'<span>';
		}
		
		return jQuery('<tr id="'+data.itemCd+'" class="'+tr_class+'" data-code="'+data.itemCd+'" data-type="'+data.itemType+'" data-server_code="'+data.serverCode+'" data-zdiv="'+data.zdiv+'" data-cpos="'+data.cpos+'" '+option_attr+'><td class="function"><button type="button" class="del_item">삭제</button><button type="button" class="cancel_item">취소</button></td><td class="itemType '+data.itemType+'">'+data.itemType+'</td><td class="itemCd"><span class="itemCd_span">'+data.itemCd+'</span>'+item_caption+'</td><td class="curr">'+format_price(data.LastPrice,option)+'</td><td class="Diff_Ratio"><span class="Diff">'+format_price(data.Diff,option)+'</span><span class="UpDwnRatio">'+jQuery.number(data.Rate,2)+'</span></td><td class="vol"><div class="vol_chart_div"><div class="vol_chart_bar"></div><div class="vol_chart_vol" style="left:'+char_left+'%;width:'+char_size+'%;"></div></div><span class="Volume">'+jQuery.number(data.TotalVolume)+'</span></td><td class="item_more_info"></td></tr>');
	}
	
	var template_group_list=function(){
		 return jQuery('<li><a href="#GROUP_ITEM"><h2>관심그룹 명</h2><p>등록된 종목 : <span>00</span> 개</p></a></li>');
	}
	
	var template_group_item=function(){
		return jQuery('<li><h3><input type="checkbox" id="group_item_6AU14" value="6AU14" data-role="none"><label for="group_item_6AU14">6AU14</label></h3><p><span class="group_item_catiopn">CME 호주달러</span><span class="group_item_date">2014.09</span></p><button type="buttion" class="btn_group_item_handler">이동</button></li>');
	}
	
	var template_group_option=function(){
		//저장정보로 부터 옵션 생성 생성
		var option_text='';
		var group_data=get_local_json('group');
		if(obj.size(group_data)>0){
			for(code in group_data){
				option_text+='<option value="'+code+'">'+group_data[code]+'</option>';
			}
		}else{
			option_text='<option value="false">관심그룹 없음</option>';
		}
		option_text+='<option value="NEW">새그룹 등록</option>';
		
		return jQuery(option_text);
	}//template_group_option();
	
	
	var template_group_item_option=function(group_code){
		var option_text='';
		var item_data=get_local_json(group_code);
		if(obj.size(item_data)>0){
			for(code in item_data){
				option_text+='<option value="'+code+'" data-type="'+item_data[code].itemType+'" data-server_code="'+item_data[code].serverCode+'">'+item_data[code].caption+'</option>';
			}
		}else{
			option_text='<option value="false">등록된 종목이 없음<option>';
		}
		return jQuery(option_text);
	}//End of template_group_option=function(group_code);
	
	//리스트 더보기 호가 테이블
	var template_item_more_asking=function(more_data){
		console.log('==template_item_more_asking==');
		console.log(more_data);
		var card_id=more_data.itemCd;
		var card=jQuery('#item_list_table tr#'+card_id);
		var card_zdiv=card.attr('data-zdiv');
		var card_cpos=card.attr('data-cpos');
		var option={zdiv:card_zdiv,cpos:card_cpos}
		
		
		
		var data=more_data.body.asking;
		var active_card=jQuery()
		
		//시간
		var data_time=data.Time;
		//sell 호가
		var sell_tr='';
		var sell_cnt_total=0;
		for(var i=2;i>-1;i--){
			if(i==2){sell_frist='<td rowspan="3"></td>';}else{sell_frist='';}
			sell_tr=sell_tr+'<tr><td>'+jQuery.number(data.Sell[i].cnt,0)+'</td><td>'+format_price(data.Sell[i].Prc,option)+'</td>'+sell_frist+'</tr>';
			sell_cnt_total=sell_cnt_total+data.Sell[i].cnt;
		}
		
		
		//buy호가
		var buy_tr='';
		var buy_cnt_total=0;
		for(var i=0;i<3;i++){
			if(i==0){buy_frist='<td rowspan="3"></td>';}else{buy_frist='';}
			buy_tr=buy_tr+'<tr>'+buy_frist+'<td>'+format_price(data.Buy[i].Prc,option)+'</td><td>'+jQuery.number(data.Buy[i].cnt,0)+'</td></tr>';
			buy_cnt_total=buy_cnt_total+data.Buy[i].cnt;
		}
		
		var cap_cnt=Math.abs(buy_cnt_total-sell_cnt_total);
		cap_cnt=jQuery.number(cap_cnt,0);
		sell_cnt_total=jQuery.number(sell_cnt_total,0);
		buy_cnt_total=jQuery.number(buy_cnt_total,0);		
					
		var format_date=date_format(data_time,':','time');
		return jQuery('<table class="item_more_info_asking table_type02" data-code=""><thead><tr><th>매도</th><th>'+format_date+'</th><th>매수</th></tr></thead><tfoot><tr><td>'+sell_cnt_total+'</td><td>'+cap_cnt+'</td><td>'+buy_cnt_total+'</td></tr></tfoot><tbody class="tbody_sell">'+sell_tr+'</tbody><tbody class="tbody_buy">'+buy_tr+'</tbody></table>');
	}//End of template_more_asking()
	
	//리스트 더보기 체결 테이블
	var template_item_more_conclude=function(more_data){
		console.log('==template_item_more_conclude==');
		
		var card_id=more_data.itemCd;
		var card=jQuery('#item_list_table tr#'+card_id);
		var card_zdiv=card.attr('data-zdiv');
		var card_cpos=card.attr('data-cpos');
		var option={zdiv:card_zdiv,cpos:card_cpos}
		
		var data=more_data.body.conclude;

		var trs='';
		for(var i=0;i<7;i++){
			if(data[i]){
			var format_date=date_format(data[i].Time,'-','date');
			var format_time=date_format(data[i].Time,':','time');
			
			trs=trs+'<tr><td>'+format_time+'</td><td>'+format_price(data[i].Curr,option)+'</td><td>'+format_price(data[i].Diff,option)+'</td></tr>';
			}else{
			trs=trs+'<tr><td>--</td><td>--</td><td>--</td></tr>';
			}
		}
		return jQuery('<table class="item_more_info_conclude table_type02" data-code=""><thead><tr><th>시간</th><th>체결가</th><th>대비</th></tr></thead><tbody>'+trs+'</tbody></table>');
	}//End of template_item_more_conclude()
	
	var template_item_more_menu=function(){
		var key=mts_prefix+'_tel';
		var tel_number=local.get(key);
		return jQuery('<div class="item_more_info_menu" data-role="navbar"><ul><li><a class="item_more_link">현재가</a></li><li><a class="item_more_chart" href="#ITEM_CHART">차트</a></li><li><a class="item_more_tel" href="tel:'+tel_number+'">전화주문</a></li></ul></div>');
	}//End of template_item_more_menu()	



	var template_item_info=function(data){
		var info=data.body;
		
		//거래단위
		var csiz_info='';
		if(info.csiz){
			csiz_info='<dt>거래단위</dt><dd>'+decodeURIComponent(info.csiz)+'</dd>';
		}
		//한월
		var cmon_info='';
		if(info.cmon){
			cmon_info='<dt>한월</dt><dd>'+decodeURIComponent(info.cmon)+'</dd>';
		}
		//가격표시
		var pind_info='';
		if(pind_info){
			var pind_temp=decodeURIComponent(info.pind)
			pind_temp=pind_temp.split('[');
			var exsample_span='';
			if(pind_temp[1]){exsample_span='<span class="exsample">['+pind_temp[1]+'</span>';}
			var pind_info='<dt>가격표시</dt><dd>'+pind_temp[0]+exsample_span+'</dd>';
		}
		//틱가치
		var tval_info='';
		if(tval_info){
			tval_info='<dt>1틱의 가치</dt><dd>'+decodeURIComponent(info.tval)+'</dd>';
		}
		
		//거래시간
		var hour_info='';
		if(info.hour){
			var hour_item='';
			for(i=0;i<info.hour.length;i++){
				var hour_sting=decodeURIComponent(info.hour[i]);
				var span_class=""
				if(hour_sting.substring(0,1)=='.'){
					hour_sting=hour_sting.substring(1,hour_sting.length);
					span_class='no_label_span';
				}
				hour_item='<li><span class="no_label_span">'+hour_sting+'</span></li>';
			}
			hour_info='<dt>거래시간</dt><dd><ul>'+hour_item+'</ul></dd>';
		}
		
		//변동제한
		var plim_info='';
		console.log(info.plim.length);
		for(i=0;i<info.plim.length;i++){
			
			plim_info+=(decodeURIComponent(info.plim[i]))+' ';
		}
		if(info.plim.length>0){
			plim_info='<dt>일일 가격 변동제한</dt><dd>'+plim_info+'</dd>';
		}
		
		//만기정보
		var dat_info='';
		var sdat_info='';
		var tdat_info='';
		if(info.sdat){
			sdat_info='<span class="info_label">최종거래일</span><span class="info_content">'+decodeURIComponent(info.sdat)+'</span>;'
		}
		if(info.tdat){
			tdat_info='<span class="info_label">인수도결제일</span><span class="info_content">'+decodeURIComponent(info.tdat)+'</span>';
		}
		if(info.sdat||info.tdat){
			dat_info='<dt>만기 (현물인수인도)</dt><dd class="dd_sdat">'+sdat_info+tdat_info+'</dd>'
		}
		//손익계산
		var plca_info='';
		for(i=0;i<info.plca.length;i++){
			var plca_item=(decodeURIComponent(info.plca[i]));
			plca_info+='<li>'+plca_item+'</li>';
		}
		if(info.plca.length>0){
			plca_info='<dt>손익계산 예시</dt><dd><ul class="plca_info">'+plca_info+'</ul></dd>';
		}
		
		return jQuery('<dl class="item_desc_dl" >'+csiz_info+cmon_info+pind_info+plim_info+tval_info+hour_info+dat_info+plca_info+'</dl>');
	}
	
	
	
	var template_layer_help=function(){
		var page_id='#'+jQuery.mobile.activePage.attr('id');
		var layer_content='<div class="help_content act"><div class="help_back"><span class="pointer"></span><span class="desc">이전페이지로 <br />돌아갑니다.</span></div><div class="help_all_menu"><span class="pointer"></span><span class="desc">전체메뉴를<br />표시합니다.</span></div><div class="help_footer_menu"><span class="pointer"></span><span class="desc">주요메뉴를 <br />표시합니다.</span></div></div>';
		
		switch (page_id){
			case '#ITEM_SELECT':
				layer_content+='<div class="help_content next"><div class="help_item_selec_type"><span class="pointer"></span><span class="desc">상품구분을 선택합니다.</span></div><div class="help_item_selec_category"><span class="pointer"></span><span class="desc">상품카테고리를 선택합니다.</span></div><div class="help_item_selec_btn_date"><span class="pointer"></span><span class="desc">화면에 표시되지 않은<br />월물을 선택합니다.</span></div></div>';
			break;
			case '#ITEM_LIST':
				layer_content+='<div class="help_content next"><div class="help_group_select"><span class="pointer"></span><span class="desc">관심종목 그룹을<br /> 선택합니다.</span></div><div class="help_group_type"><span class="pointer"></span><span class="desc">관심종목 표시형태를<br /> 선택합니다.</span></div></div>';
				
				var type=jQuery('#ITEM_LIST #item_list_table').attr('data-type');
				if(type=='card'){
					layer_content+='<div class="help_content next" data-type="item_list_card"><div class="help_item_more"><span class="pointer"></span><span class="desc">종목카드를 터치하여 요약정보를 확인하고<br /> 상세페이지로 이동 할 수 있습니다.</span></div><div class="help_item_edit"><span class="pointer"></span><span class="desc">종목카드를 왼쪽으로 슬라이드<br />하면 종목을 편집 할 수 있습니다.</span></div></div>';
				}
				if(type=="table"){
					layer_content+='<div class="help_content next" data-type="item_list_table"><div class="help_item_more"><span class="pointer"></span><span class="desc">종목이름를 터치하여 요약정보를 확인하고<br /> 상세페이지로 이동 할 수 있습니다.</span></div><div class="help_item_edit"><span class="pointer"></span><span class="desc">종목테이블을 왼쪽으로 슬라이드 하여 <br />종목을 편집 할 수 있습니다. <br /> 오른쪽으로 슬라이드 하면 <br />편집모드를 종료합니다.</span></div></div>';
				}
			break;
			case '#ITEM_ASKING':
				layer_content+='<div class="help_content next"><div class="help_item_commen"><span class="pointer"></span><span class="desc">현재 종목의 요약정보를 표시합니다.</span></div><div class="help_item_menu"><span class="pointer"></span><span class="desc">종목별 메뉴입니다.<br /> 현재 종목을 유지한체 화면을 이동합니다.</span></div></div><div class="help_content next"><div class="help_item_info"><span class="pointer"></span><span class="desc">현재 종목 정보를 확인합니다.</span></div><div class="help_item_reg"><span class="pointer"></span><span class="desc">관심종목으로 지정합니다.</span></div><div class="help_item_search"><span class="pointer"></span><span class="desc">종목을 검색합니다.</span></div></div>';
			break;
			case '#ITEM_CONCLUDE':
				layer_content+='<div class="help_content next"><div class="help_item_commen"><span class="pointer"></span><span class="desc">현재 종목의 요약정보를 표시합니다.</span></div><div class="help_item_menu"><span class="pointer"></span><span class="desc">종목별 메뉴입니다.<br /> 현재 종목을 유지한체 화면을 이동합니다.</span></div></div><div class="help_content next"><div class="help_item_info"><span class="pointer"></span><span class="desc">현재 종목 정보를 확인합니다.</span></div><div class="help_item_reg"><span class="pointer"></span><span class="desc">관심종목으로 지정합니다.</span></div><div class="help_item_search"><span class="pointer"></span><span class="desc">종목을 검색합니다.</span></div></div>';
			break;
			case '#ITEM_DAILY':
				layer_content+='<div class="help_content next"><div class="help_item_commen"><span class="pointer"></span><span class="desc">현재 종목의 요약정보를 표시합니다.</span></div><div class="help_item_menu"><span class="pointer"></span><span class="desc">종목별 메뉴입니다.<br /> 현재 종목을 유지한체 화면을 이동합니다.</span></div></div><div class="help_content next"><div class="help_item_info"><span class="pointer"></span><span class="desc">현재 종목 정보를 확인합니다.</span></div><div class="help_item_reg"><span class="pointer"></span><span class="desc">관심종목으로 지정합니다.</span></div><div class="help_item_search"><span class="pointer"></span><span class="desc">종목을 검색합니다.</span></div></div>';
			break;
			case '#ITEM_OPTION':
				layer_content+='<div class="help_content next"><div class="help_option_info"><span class="pointer"></span><span class="desc">기초자산 선물정보를 표시합니다.</span></div><div class="help_item_search"><span class="pointer"></span><span class="desc">종목을 검색합니다.</span></div><div class="help_option_table"><span class="pointer"></span><span class="desc">좌, 우로 슬라이드 하여 <br />콜상세 풋상세로 전환합니다.</span></div></div>';
			break;
		}
		
		var help_check=''
		if(local.get('help_display')=='off'){help_check='checked="checked"'}
		
		layer_content+='<div class="help_content next" data-type="footer_menu"><div class="help_real"><span class="pointer"></span><span class="desc">실시간 데이터를 <br />활성/비활성 합니다.</span></div><div class="help_drag"><span class="pointer"></span><span class="desc">각 메뉴는 드레그 하여 <br />주요메뉴에 등록 할 수 있습니다.</span></div></div>';
		
		
		
		var layer_code='<div id="layer_help" class="bg_layer">'+layer_content+'<div class="help_check"><input type="checkbox" id="help_check" '+help_check+' /><label for="help_check">다음 실행시 자동으로 표시하지 않기</label></div><button type="button" class="btn_layer_before">이전</button><button type="button" class="btn_layer_next">다음</button><button type="button" class="btn_close_layer">닫기</button></div>';
		return jQuery(layer_code);
	}//End of template_layer_help();
	
	

	var template_layer_group=function(){
		/*
		var group_option=template_group_option();
		var layer=jQuery('<div class="bg_layer"><section id="layer_group" class="layer_section"><header><h1>관심그룹</h1><div class="layer_type_div" data-role="controlgroup" data-type="horizontal"><input type="radio" name="layer_reg_group_type" id="layer_reg_group_type_01" value="reg" checked="checked" /><label for="layer_reg_group_type_01">등록하기</label><input type="radio" name="layer_reg_group_type" id="layer_reg_group_type_02" value="search" /><label for="layer_reg_group_type_02">종목찾기</label></div></header> <div class="layer_content type_01"><h2>새 관심그룹 만들기</h2><div class="layer_reg_group_name_div" data-role="controlgroup" data-type="horizontal"><input type="text" data-wrapper-class="controlgroup-textinput ui-btn" id="layer_reg_group_name" placeholder="그룹 이름을 입력하세요" /><button type="button" class="btn_layer_reg_group_name">만들기</button></div><h2>등록할 그룹 선택</h2><select id="layer_group_select_01" class="select_box_group"></select> <button type="button" class="btn_layer_ok">등록</button></div><div class="layer_content type_02"><h2>관심그룹 선택</h2><select id="layer_group_select_02" class="select_box_group"></select><h2>관심그룹 선택</h2><select id="layer_group_item_select_02" class="select_box_item"> <option>관심그룹을 선택하세요</option> </select> <button type="button" class="btn_layer_ok">확인</button></div><footer><p>편집은 관심그룹 페이지를 이용하세요</p><a href="#GROUP_LIST">관심그룹 으로 이동</a> </footer><button type="button" class="btn_close_layer">닫기</button></section></div>');
		layer.find('#layer_group_select_01').append(group_option).trigger('create');
		*/
		var layer=jQuery('<div class="bg_layer"><section id="layer_group" class="layer_section"><header><h1>새 관심그룹 만들기</h1></header> 	<div class="layer_reg_group_name_div" data-role="controlgroup" data-type="horizontal"><input type="text" data-wrapper-class="controlgroup-textinput ui-btn" id="layer_reg_group_name" placeholder="그룹 이름을 입력하세요" /><button type="button" class="btn_layer_reg_group_name">만들기</button></div></section><button type="button" id="btn_close_group_layer">닫기</button></div>');
		
		return layer;	
	}//End of template_layer_group();
	
	
	var template_layer_search=function(){
		var exchange_option=template_exchange_option();
		var layer=jQuery('<div class="bg_layer"><section id="layer_search" class="layer_section"><header><h1>종목검색</h1><div class="layer_type_div" data-role="controlgroup" data-type="horizontal"><input type="radio" name="layer_search_type" id="layer_search_type_01" value="code" checked="checked" /><label for="layer_search_type_01">코드로 찾기</label><input type="radio" name="layer_search_type" id="layer_search_type_02" value="item" /><label for="layer_search_type_02">관심종목 찾기</label></div></header><div class="layer_content type_01"><h2>검색범위</h2><div class="layer_search_type" data-role="controlgroup" data-type="horizontal"><select id="layer_search_type" class="selectbox_type" "title="선물/옵션"><option value="futures">선물</option><option value="option">옵션</option></select><select id="layer_search_fdm" class="selectbox_fdm" title="거래소"></select></div><div id="layer_seach_step_div" class="layer_seach_step_div" data-role="controlgroup" data-type="horizontal"><h2>종목선택</h2><select id="layer_seach_step_01"><option value="false">카테고리 선택</option></select><select id="layer_seach_step_02"><option value="false">종목 선택</option></select><select id="layer_seach_step_03"><option value="flase">월물선택</option></select></div><input type="hidden" id="layer_search_code" placeholder="종목코드를 입력하세요" data-wrapper-class="ui-btn" /><button type="button" class="btn_layer_ok">확인</button></div><div class="layer_content type_02"><h2>관심그룹 선택</h2><select id="layer_group_select_02" class="select_box_group"><option value="1">그룹명_01</option><option value="2">그룹명_02</option></select><h2>관심그룹 선택</h2><select id="layer_group_item_select_02" class="select_box_item"><option value="1">종목명</option><option value="2">종목명</option></select><button type="button" class="btn_layer_ok">확인</button></div><footer><p>세부검색은 검색페이지를 이용하세요</p><a href="#ITEM_SELECT">검색페이지로 이동</a></footer><button type="button" class="btn_close_layer">닫기</button></section></div>');
	
		layer.find('#layer_search_fdm').append(exchange_option).trigger('create');
		return layer;
	
	}//End of template_layer_search();
	
	var template_conclude_tr=function(data){
		console.log('==template_conclude_tr==');
		console.log(data);
		var active_id=jQuery.mobile.activePage.attr('id');
			active_id='#'+active_id;	
		var zdiv=jQuery(active_id).attr('data-zdiv');
		var cpos=jQuery(active_id).attr('data-cpos');
		
		var date_sting=date_format(data.Time,'-','date');
		var time_sting=date_format(data.Time,':','time');
		
		var tr_class='even'; 
		if(data.Diff>0){
			tr_class='up';
		}else if(data.Diff<0){
			tr_class='down';
		}
		
		return jQuery('<tr class="'+tr_class+'"><td class="date">'+date_sting+'</td><td class="Time">'+time_sting+'</td><td class="Curr">'+format_price(data.Curr)+'</td><td class="Diff"><span>'+format_price(Math.abs(data.Diff))+'<span></td><td class="TotalVolume">'+data.TotalVolume+'</td></tr>');
	}//End of template_conclude_tr()
	
	var template_daily_tr=function(data){
		var active_id=jQuery.mobile.activePage.attr('id');
			active_id='#'+active_id;	
		var zdiv=jQuery(active_id).attr('data-zdiv');
		var cpos=jQuery(active_id).attr('data-cpos');
		
		var date_sting=date_format(data.Time,'-','date');
		
		var tr_class='even'; 
		if(data.Diff>0){
			tr_class='up';
		}else if(data.Diff<0){
			tr_class='down';
		}
		
		return jQuery('<tr class="'+tr_class+'" data-date="'+date_sting+'"><td class="Date">'+date_sting+'</td><td class="Curr">'+format_price(data.Last)+'</td><td class="Diff"><span>'+format_price(Math.abs(data.Diff))+'</span><span class="Rate">'+jQuery.number(data.Rate,2)+'</span></td><td class="TotalVolume">'+jQuery.number(data.TotalVolume)+'</td></tr>');
	}//End of template_daily_tr();
	
	var template_layer_lose	=function(){
		return jQuery('<div class="bg_layer"><section id="layer_chart" class="layer_section"><header><h1 class="chart_code">ESZ14<span class="chart_caption">CME S&quot;P 500 Min</span></h1><div data-role="controlgroup" data-type="horizontal"><input type="radio" id="chart_set_day" name="chart_set" value="day" checked="checked" /><label for="chart_set_day">일</label><input type="radio" id="chart_set_week" name="chart_set" value="week" /><label for="chart_set_week">주</label><input type="radio" id="chart_set_month" name="chart_set" value="month" /><label for="chart_set_month">월</label><input type="radio" id="chart_set_min" name="chart_set" value="min" /><label for="chart_set_min">분</label><div class="ui-btn" id="chart_min_div"><input type="number" id="chart_set_min_number" placeholder="분 입력" data-role="none" /></div><input type="radio" id="chart_set_tic" name="chart_set" value="tic" /><label for="chart_set_tic">틱</label><button type="button" id="btn_chart_set">확인</button></div></header><button type="button" class="btn_close_layer">닫기</button></section></div>');
	}//End of template_layer_chart();
	
	
	var template_dialog_item_select=function(){
		return jQuery('<section id="dialog_item_select" class="page_dialog"><header><h2>종목검색</h2><div data-role="controlgroup" data-type="horizontal"><select class="select_item_type"><option value="futures">선물</option><option value="option">옵션</option></select><select class="select_category"><option value="currency">통화</option><option value="interest">채권</option><option value="index">지수</option><option value="commodity">농산물</option><option value="metals">금속</option><option value="energy">에너지</option></select></div></header><article><table id="dialog_item_select_table" class="table_type01"><tbody></tbody></table></article></section>');
	}
	
	var template_dialog_item_select_option=function(data){
		var caption=data.commen.itemCaption;
		return jQuery('<section id="dialog_item_select_option" class="page_dialog"><header><h2><span>'+caption+'</span>행사가</h2><button class="close_dialog" type="button">닫기</button></header><article><table id="dialog_option_item_table" class="table_type01 item_option_table"><thead><tr><th class="call_opt call_data" colspan="2">콜옵션</th><th rowspan="2">행사가</th><th class="put_opt put_data" colspan="2">풋옵션</th></tr><tr><th class="call_data">대비</th><th class="call_data">현재가</th><th class="put_data">현재가</th><th  class="put_data">대비</th></tr></thead><tbody></tbody></table></article></section>');
	}
	
	var template_dialog_item_info=function(data){
		var content=template_item_info(data);
		
		return jQuery('<section id="dialog_item_info" class="page_dialog"><header><h2>종목정보</h2></header><article><dl class="item_desc_dl">'+content.html()+'</dl></article></section>');
	}

	var template_dialog_chart_setting=function(){
		var setting_data=get_local_json('web_mts_CHART_STETTING');
		console.log(setting_data);
		
		
		var transparent_cant='<li><input type="checkbox" id="transparent_cant" /><label for="transparent_cant">투명캔트</label></li><li>';
		
		var log_chart='<input type="checkbox" id="log_chart" /><label for="log_chart">로그차트</label></li>';
		
		//매물대
		var put_check="";
		var put_value=""
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'매물대')){ 
			if(setting_data.매물대.check){put_check='checked="checked"';
				hidden_class='';
				if(setting_data.매물대.value){put_value='value="'+setting_data.매물대.value+'"';}
			}
			
		}
		var put_bar='<li><input type="checkbox" id="put_bar" '+put_check+' /><label for="put_bar">매물대</label><div id="setting_put_bar" class="setting_chart_item'+hidden_class+'"><div><label for="put_bar_number">설정값</label><input type="number" id="put_bar_number" '+put_value+' /></div></div></li>'; 
		
		//이동평균선
		var ma_check="";
		var ma_item='<div class="moveing_averrage_item" data-cnt="1"><label for="moving_averrage_1">설정값 <span>1</span></label><input type="number" id="moving_averrage_1" /><button type="button" class="btn_remove_ma">삭제</button></div>'
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'MA')){ 
			if(setting_data.MA.check){
				ma_check='checked="checked"'
				;hidden_class='';
				ma_item='';
				for(i=0;i<setting_data.MA.item.length;i++){
					cnt=i+1;
					ma_item+='<div class="moveing_averrage_item" data-cnt="'+cnt+'"><label for="moving_averrage_'+cnt+'">설정값 <span>'+cnt+'</span></label><input type="number" id="moving_averrage_'+cnt+'" value="'+setting_data.MA.item[i].value+'" /><button type="button" class="btn_remove_ma">삭제</button></div>';
				}
			}
		}
		
		var moving_averrage='<li><input type="checkbox" id="moving_averrage" '+ma_check+' /><label for="moving_averrage">이동평균선</label><button type="button" class="btn_add_ma'+hidden_class+'">설정값 추가</button><div id="setting_moving_averrage" class="setting_chart_item'+hidden_class+'">'+ma_item+'</div></li>';
		
		
		//블린저밴드
		var boll_check="";
		var boll_term="";
		var boll_multi="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'BollingerBand')){
			if(setting_data.BollingerBand.check){boll_check='checked="checked"';
				hidden_class='';
				if(setting_data.BollingerBand.term){boll_term='value="'+setting_data.BollingerBand.term+'"';}
				if(setting_data.BollingerBand.multiplier){boll_multi='value="'+setting_data.BollingerBand.multiplier+'"';}
			}
		}
		
		var bollinger_band='<li><input type="checkbox" id="bollinger_band" '+boll_check+' /><label for="bollinger_band">볼린저밴드</label><div id="setting_bollinger_band" class="setting_chart_item'+hidden_class+'"><div><label for="bollinger_band_term">기간</label><input type="number" id="bollinger_band_term" '+boll_term+' /></div><div><label for="bollinger_band_multiplier">승수</label><input type="number" id="bollinger_band_multiplier" '+boll_multi+' /></div></div></li>';
		
		
		//일목균형표
		var day_check="";
		var day_tr="";
		var day_base="";
		var day_after="";
		var day_before_1="";
		var day_before_2="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'일목균형표')){
			if(setting_data.일목균형표.check){
				day_check='checked="checked"';
				if(setting_data.일목균형표.transition){day_tr='value="'+setting_data.일목균형표.transition+'"';}
				if(setting_data.일목균형표.base){day_base='value="'+setting_data.일목균형표.base+'"';}
				if(setting_data.일목균형표.before_2){day_before_2='value="'+setting_data.일목균형표.before_2+'"';}
				hidden_class='';
			}
		}
		
		var day_barance='<li><input type="checkbox" id="day_barance" '+day_check+' /><label for="day_barance">일목균형표</label><div id="setting_day_barance" class="setting_chart_item'+hidden_class+'"><div><label for="day_barance_base">기준</label><input type="number" id="day_barance_base" '+day_base+' /></div><div><label for="day_barance_transition">전환</label><input type="number" id="day_barance_transition" '+day_tr+' /></div><div><label for="day_barance_before_2">선행2</label><input type="number" id="day_barance_before_2" '+day_before_2+' /></div></div></li>'
		
		//envelop
		var en_check="";
		var en_term="";
		var en_precent="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'Envelope')){
			if(setting_data.Envelope.check){
				en_check='checked="checked"';
				if(setting_data.Envelope.term){en_term='value="'+setting_data.Envelope.term+'"';}
				if(setting_data.Envelope.precent){en_precent='value="'+setting_data.Envelope.precent+'"';}
			hidden_class='';
			}
		}
		var envelop='<li><input type="checkbox" id="envelop" '+en_check+' /><label for="envelop">Envelope</label><div id="setting_envelop" class="setting_chart_item'+hidden_class+'"><div><label for="envelop_term">기간</label><input type="number" id="envelop_term" '+en_term+' /></div><div><label for="envelop_precent">Percent</label><input type="number" id="envelop_precent" '+en_precent+' /></div></div></li>';
		
		
		//trading_volume
		var tv_check="";
		if(obj.has_key(setting_data,'거래량')){
			if(setting_data.거래량.check){tv_check='checked="checked"';}
		}
		var trading_volume='<li><input type="checkbox" id="trading_volume" '+tv_check+' /><label for="trading_volume">거래량</label></li>';
		
		
		//obv
		var obv='<li><input type="checkbox" id="obv" /><label for="obv">OBV</label></li>';
		
		//macd
		var macd_check="";
		var macd_long="";
		var macd_short="";
		var macd_signal="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'MACD')){
			if(setting_data.MACD.check){
				macd_check='checked="checked"';
				if(setting_data.MACD.long){macd_long='value="'+setting_data.MACD.long+'"';}
				if(setting_data.MACD.short){macd_short='value="'+setting_data.MACD.short+'"';}
				if(setting_data.MACD.signal){macd_signal='value="'+setting_data.MACD.signal+'"';}
				hidden_class='';
			}
		}
		var macd='<li><input type="checkbox" id="macd" '+macd_check+' /><label for="macd">MACD</label><div id="setting_macd" class="setting_chart_item'+hidden_class+'"><div><label for="macd_short">단기</label><input type="number" id="macd_short" '+macd_short+' /></div><div><label for="macd_long">장기</label><input type="number" id="macd_long" '+macd_long+' /></div><div><label for="macd_signal">신호</label><input type="number" id="macd_signal" '+macd_signal+' /></div></div></li>';
		
		//stochastic_fast
		var fast_check="";
		var fast_trem="";
		var fast_d="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'StochasticFast')){
			if(setting_data.StochasticFast.check){
				fast_check='checked="checked"';
				if(setting_data.StochasticFast.d){fast_d='value="'+setting_data.StochasticFast.d+'"';}
				if(setting_data.StochasticFast.trem){fast_trem='value="'+setting_data.StochasticFast.trem+'"';}
				hidden_class='';
			}	
		}
		var stochastic_fast='<li><input type="checkbox" id="stochastic_fast" '+fast_check+' /><label for="stochastic_fast">Stochastic Fast</label><div id="setting_stochastic_fast" class="setting_chart_item'+hidden_class+'"><div><label for="stochastic_fast_trem">기간</label><input type="number" id="stochastic_fast_trem" '+fast_trem+' /></div><div><label for="stochastic_fast_d">%D</label><input type="number" id="stochastic_fast_d" '+fast_d+' /></div></div></li>';
		
		//stochastic_slow
		var slow_check="";
		var slow_trem="";
		var slow_k="";
		var slow_d="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'StochasticSlow')){
			if(setting_data.StochasticSlow.check){
				slow_check='checked="checked"';
				if(setting_data.StochasticSlow.trem){slow_trem='value="'+setting_data.StochasticSlow.trem+'"';}
				if(setting_data.StochasticSlow.d){slow_d='value="'+setting_data.StochasticSlow.d+'"';}
				if(setting_data.StochasticSlow.k){slow_k='value="'+setting_data.StochasticSlow.k+'"';}
			hidden_class='';
			}
		}
		var stochastic_slow='<li><input type="checkbox" id="stochastic_slow" '+slow_check+' /><label for="stochastic_slow">Stochastic Slow</label><div id="setting_stochastic_slow" class="setting_chart_item'+hidden_class+'"><div><label for="stochastic_slow_trem">기간</label><input type="number" id="stochastic_slow_trem" '+slow_trem+' /></div><div><label for="stochastic_slow_k">%K</label><input type="number" id="stochastic_slow_k" '+slow_k+' /></div><div><label for="stochastic_slow_d">%D</label><input type="number" id="stochastic_slow_d" '+slow_d+' /></div></div></li>';
		
		//rsi
		var rsi_check="";
		var rsi_term="";
		var rsi_signal="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'RSI')){
			if(setting_data.RSI.check){
				rsi_check='checked="checked"';
				if(setting_data.RSI.term){rsi_term='value="'+setting_data.RSI.term+'"';}
				if(setting_data.RSI.signal){rsi_signal='value="'+setting_data.RSI.signal+'"';}
				hidden_class='';
			}
		}

		var rsi='<li><input type="checkbox" id="rsi" '+rsi_check+' /><label for="rsi">RSI</label><div id="setting_rsi" class="setting_chart_item'+hidden_class+'"><div><label for="rsi_term">기간</label><input type="number" id="rsi_term" '+rsi_term+' /></div><div><label for="rsi_signal">Signal</label><input type="number" id="rsi_signal" '+rsi_signal+' /></div></div></li>';
		
		//dmi
		var dmi_check="";
		var dmi_term="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'DMI')){
			if(setting_data.DMI.check){
				dmi_check='checked="checked"';
				if(setting_data.DMI.term){dmi_term='value="'+setting_data.DMI.term+'"';}
				hidden_class='';
			}
		}
		
		var dmi='<li><input type="checkbox" id="dmi" '+dmi_check+' /><label for="dmi">DMI</label><div id="setting_dmi" class="setting_chart_item'+hidden_class+'"><div><label for="dmi_term">기간</label><input type="number" id="dmi_term" '+dmi_term+' /></div></div></li>';
		
		//trix
		var trix_check="";
		var trix_trem="";
		var trix_signal="";
		var hidden_class=' hidden';
		if(obj.has_key(setting_data,'TRIX')){
			if(setting_data.TRIX.check){
				trix_check='checked="checked"';
				if(setting_data.TRIX.trem){trix_trem='value="'+setting_data.TRIX.trem+'"';}
				if(setting_data.TRIX.signal){trix_signal='value="'+setting_data.TRIX.signal+'"';}
				hidden_class='';
			}
		}
		var trix='<li><input type="checkbox" id="trix" '+trix_check+' /><label for="trix">TRIX</label><div id="setting_trix" class="setting_chart_item'+hidden_class+'"><div><label for="trix_trem">기간</label><input type="number" id="trix_trem" '+trix_trem+' /></div><div><label for="trix_signal">Signal</label><input type="number" id="trix_signal" '+trix_signal+' /></div></div></li>';
		
		//cci
		var cci='<li><input type="checkbox" id="cci" /><label for="cci">CCI</label></li>';
		
		return jQuery('<section id="dialog_chart_setting" class="page_dialog"><header><h2>차트설정</h2><button type="button" id="btn_chart_setting_ok">확인</button></header><article><ul>'+put_bar+moving_averrage+bollinger_band+day_barance+envelop+trading_volume+macd+stochastic_fast+stochastic_slow+rsi+dmi+trix+'</ul></article></section>');}



	var template_dialog_group_title=function(code,name){
		var btn_reg='<button type="button" class="btn_reg_item" data-code="'+code+'" data-role="none">현재 종목 등록</button>';
		var btn_del='<button type="button" class="btn_del_group" data-code="'+code+'" data-role="none">그룹삭제</button>';
		return '<h3 data-group="'+code+'"><span class="group_name">'+name+'</span>'+btn_reg+btn_del+'</h3>';
	}//End of template_dialog_group_li();

	var template_dialog_item_li=function(code,item_code){
	 var group=get_local_json(code);
	 var btn_change='<button class="btn_group_item" data-code="'+item_code+'" data-server_code="'+group[item_code].serverCode+'" data-type="'+group[item_code].itemType+'" data-role="none">'+group[item_code].caption+'</button>';
	 var btn_del='<button type="button" class="btn_del_item" data-code="'+code+'" data-item="'+item_code+'" data-role="none"> 종목삭제</button>';		
		return '<li data-group="'+code+'">'+btn_change+btn_del+'</li>';
	}
	
	var template_dialog_item_ul=function(code){
		var group_data=get_local_json('group');
		
		var group_title=template_dialog_group_title(code,group_data[code]);
		var item_data=get_local_json(code);
		var item_list_html='';
		
		for(item_code in item_data){
			var item_li=template_dialog_item_li(code,item_code);
			item_list_html+=item_li;
		}
		if(obj.size(item_data)<1){
			item_list_html+='<li class="no_item_desc"  data-group="'+code+'">등록된 종목이 없습니다.</li>';
		}
		group_ul_html='<ul class="dialog_group_list" data-group="'+code+'" data-role="none">'+item_list_html+'</ul>';
		var group_menu_html=group_title+group_ul_html;
		return group_menu_html;
	}
	
	var template_dialog_item_group=function(){		
		//관심그룹 메뉴 생성
			var group_data=get_local_json('group');
			var group_menu_html='';
			for(code in group_data){
				group_menu_html+=template_dialog_item_ul(code);
			}
			
			if(group_menu_html!=''){
				group_menu_html='<div class="dialog_group_content">'+group_menu_html+'</div>';
			
			}else{
				group_menu_html='<div class="dialog_group_content"><p class="no_group_desc">등록된 관심그룹과 종목이 없습니다.</p></div>'
			}	
		
		return jQuery('<section id="dialog_item_group" class="page_dialog"><header><h2>관심그룹</h2><button class="btn_make_group" type="button" data-role="none">그룹생성</button></header><article>'+group_menu_html+'</article></section>');
	}//End of template_dialog_item_group();


/*가격 수치 규격화*/
function format_price(number,option){
	var active_id=jQuery.mobile.activePage.attr('id');
	if(!option){
		var cpos=Number(jQuery('#'+active_id).attr('data-cpos'));
		//if(!cpos){cpos=0;}
		var zdiv=Number(jQuery('#'+active_id).attr('data-zdiv'));
		//if(!zdiv){zdiv=0;}
	}else{
		var cpos=option.cpos;
		var zdiv=option.zdiv;
	}
	if(cpos==0){
		var price=jQuery.number(number,zdiv);
	}else{
		number=number+'';
		price_temp=number.split('.');
		
		var int=price_temp[0]+'';
		var int_length=int.length;
		var cpos_pos=int_length-cpos;
		var int_b=int.substring(0,cpos_pos);
		var int_a=int.substring(cpos_pos,int_length);
		var cpos_zreo='';
		
		if(Number(int_a.length)<cpos){
			console.log(int_a.length-cpos);
			for(i=0;i<(cpos-int_a.length);i++){
				cpos_zreo+='0';
			}
		}
		
		if(!price_temp[1]){price_temp[1]=0;}
		var float_temp=price_temp[1]+'';
		var float_length=float_temp.length;
		if(float_length<2){
			var float=float_temp+'0';
		}else{
			var float=float_temp.substring(0,2);
		}
		var price=int_b+'\''+cpos_zreo+int_a+'.'+float;
	}
	return price;
}//End of format_price(number);


	
/**
 * localStorage의 기록및 삭제
 */
var local={}
	local.test=function(){//지원여부 확인
		if(typeof(Storage)==="undefined"){
			var error='=localStorage를 지원하지 않음=';
			v(error);
			return false;
		}else{
			return true;
		}
	}//End of local.test;
	local.save=function(obj){//저장하기
		if(!local.test){return '=localStorage를 지원하지 않음=';}
		for(key in obj ){
			localStorage.setItem(key,obj[key]);
		}
	}//End of local.save; 
	
	local.get=function(key){//키별로 읽기
		var return_obj={};
		if(!local.test){return '=localStorage를 지원하지 않음=';}
		if(localStorage[key]){
			return localStorage[key];
		}else{
			return undefined;
		}
	}//End of local.load
	
	local.del=function(key){//키별로 지우기
		var return_obj={};
		if(!local.test){return '=localStorage를 지원하지 않음=';}
		if(localStorage[key]){
			localStorage.removeItem(key);
		}
	}//End of local.del
	local.clear=function(){//전체 지우기
		var return_obj={};
		if(!local.test){return '=localStorage를 지원하지 않음=';}
		localStorage.clear();
	}//End of local.clear	


/**
 * object관련 기능
 */
var obj={}
	/*객체의 갯수*/
	obj.size=function (object){
		var length=0;
		for(i in object){
			length++;
		}
		return length;
	}//obj_size(object);
	
	/*값의 존재여부*/
	obj.has_key=function(object,key){
		for(i in object){
			if(i==key){return true;}
		}
		return false;
	}//obj.has_key;
	
	/*값의 존재여부*/
	obj.has_value=function(object,value){
		for(i in object){
			if(object[i]==value){return true;}
		}
		return false;
	}//obj.has_value;
	
	/*특정키의 삭제*/
	obj.del_key=function(object,key){
		delete object[key];
	}//obj.has_value;


/**
*javascript 동적 로딩
*/
function load_js(url,callback){
	if(!url){return false;}
	var script=document.createElement('script');
	script.type='text/javascript'
	script.charset='utf-8';
	if(callback){
		script.onload=function(){callback();}
	}
	script.src=url
	document.getElementsByTagName('head')[0].appendChild(script);
}//End of load_js(url,callback)


/**
 * URL정보를 object로 Return함
 * @string : url - url 경로 stirng 
 * @returns : 분류된 json obejct
 */
function url_parser(url){
	try{
		var url_temp=url.split('?');
		var path_temp=url_temp[0];
		var query_temp=url_temp[1];
	}catch (e) {
		var path_temp=url;
		var query_temp=false;
	}

	var path_temp=path_temp.split('/');
	var file=path_temp.pop();
	var path=path_temp.join('/');
	if(query_temp){
		var query_array=query_temp.split('&');
		var query={};
		for(i=0;i<query_array.length;i++){
			var item=query_array[i].split('=');
			query[item[0]]=item[1];
		}
	}else{
		var query=false;
	}
	var protocol_temp=path.split(':');
	var return_data={'protocol':protocol_temp[0],'path':path,'file':file,'query':query};
	return return_data;
}//End of url_parser(url);
	

/**
*Number format
*
*/
function number_format(obj){
	var option={}
	if(obj.d){
		option['minimumIntegerDigits']=obj.d;
	}
	if(obj.f){
		option['minimumFractionDigits']=obj.f;
	}
	return new Intl.NumberFormat('en-US',option).format(obj.number)
}//End of number_format(obj);

/**
* data_format
*/
function date_format(date_string,format,return_format){
	if(return_format){
		return_format=return_format;
	}else{
		return_format='both';
	}
	var date_temp=date_string.split(' ');
	var date_str=date_temp[0];
	var time_str=date_temp[1];
	
	var yy=date_str.substr(0,4);
	var mm=date_str.substr(4,2);
	var dd=date_str.substr(6,2);
	if(time_str){
		var h=time_str.substr(0,2);
		var m=time_str.substr(2,2);
		var s=time_str.substr(4,2);
	}else{
		var h=00;
		var m=00;
		var s=00;
	}
	if(format=='ko'){
		var return_date_str=yy+'년'+mm+'월'+dd+'일';
		var return_time_str=h+'시'+m+'분'+s+'초';
	}else{
		var return_date_str=yy+format+mm+format+dd;
		var return_time_str=h+format+m+format+s;
	}
	
	
	switch (return_format){
		case 'date':
			return return_date_str;
		break;
		case 'time':
			return return_time_str
		break;
		case 'both':
			return_obj={date:return_date_str,time:return_time_str}
			return return_obj;
		break;
	}
}