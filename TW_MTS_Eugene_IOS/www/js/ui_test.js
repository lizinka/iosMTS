// JavaScript Document
jQuery(function(){
	ini_app();
});

/*공통설정*/
var exchange_prefix='web_mts'
var item_catagory_caption={'currencies':'통화','bonds':'채권','index':'지수','agriculture':'농산물','metals':'원자재','energy':'에너지','option':'지수옵션','etc':'기타'};
var month_code={'01':'F','02':'G','03':'H','04':'J','05':'K','06':'M','07':'N','08':'Q','09':'U','10':'V','11':'X','12':'Z','F':'01','G':'02','H':'03','J':'04','K':'05','M':'06','N':'07','Q':'08','U':'09','V':'10','X':'11','Z':'12'};

/*앱 초기화 실행*/
function ini_app(){
	ini_websockt();
	ini_test();
	
	ini_login()/*로그인 기능 처리*/
	ini_item_search()/*종목검색 관련 초기화*/
	ini_group();/*관심그룹 관련 초기화*/
	ini_item_list();
	ini_item();
	ini_layer();
	ini_footer();

	/*페이지 이동관련 초기화*/
	jQuery('#app').on('tap','a:not([data-role="back"])',function(){return ini_page(this,navigation_page);});
	jQuery('#app section[data-role="page"]').on('pagebeforehide',function(){hide_footer()})
}/*End of ini_app()*/

window.android_os={};
window.android_os.setMessage=function(msg){	console.log('msg to android : '+msg);};
/*데이터 전송테스트*/
function ini_test(){
	console.log('===ini_test()===');
	jQuery('#btn_test').on('tap',function(){test_console()})
}/*End of ini_test()*/
	
	function test_console(){
		console.log('==test_console()==');
		var msg={pageId:jQuery('#test_page_id').val(),
				 itemCd:jQuery('#test_item').val(),
				 type:jQuery('#test_data_type').val()};
		console.log(msg);
		send_android(msg)
		msg=JSON.stringify(msg);
		jQuery('#recive_data_div').append('<p class="send">'+msg+'</p>');
		
	}/*End of test_console()*/



/*안드로이드로 메세지 전달*/
function send_android(msg){
	msg=JSON.stringify(msg);
	window.android_os.setMessage(msg);
	wait_websoket(socket, function(){socket.send(msg)});	
}/*send_android(msg)*/

/*안드로이드로 부터 받은 메세지 처리*/
function from_android(msg){
	/*테스트 코드 적용*/
	var page_id=jQuery.mobile.activePage.attr('id');
	if(page_id=='TEST'){
		jQuery('#recive_data_div').append('<p class="recive">'+msg.data+'</p>');
		return false;
	}
	
	data=jQuery.parseJSON(msg.data);
	console.log(JSON.stringify(data));
	console.log('데이터 수신 : ['+msg.origin+':'+msg.timeStamp+']');
	switch (data.pageId){
		case '#LOGIN':
			longin_process(data);
		break;
		case'#ITEM_LIST':
			item_list_table(data);
		break;
		
		case '#ITEM_SEARCH': // 검색결과 표시
			search_result_ex(data);
		break;
		
		case '#ITEM_ASKING': // 호가 데이터 처리
			console.log('#ITEM_ASKING');
			if(data.type=='existing'){
				ini_asking(data);
			}else if(data.type=='real'){
				item_asking_real(data);
			}
		break;
		
		case '#ITEM_CONCLUDE':
			if(data.type=='existing'){
				ini_conclude(data);
			}else if(data.type=='real'){
				item_conclude_real(data);
			}
		break;
		
		case '#ITEM_DAILY':
			if(data.type=='existing'){
				ini_daily(data);
			}else if(data.type=='real'){
				item_daily_real(data);
			}
		break;
		
		case '#ITEM_CHART':
			if(data.type=='existing'){
				ini_chart(data);
			}else if(data.type=='real'){
				item_daily_real(data);
			}
		break;
	}
}/*from_android(msg)*/

function ini_login(){
	jQuery('#app').on('submit','#login_form',function(){return ini_login_process(this)})
}


	function ini_login_process(form){
		jQuery.mobile.loading('show');
		var login_id=jQuery(form).find('#login_id').val();
		var login_pass=jQuery(form).find('#login_pw').val();
		var real_time=jQuery(form).find('#check_realtime').is(':checked');
		console.log(login_id+' / '+login_pass+' / '+real_time);
		var check_exchange_data=check_exchange();
		var login_data={pageId:"#LOGIN",id:login_id,pass:login_pass,exchage:check_exchange_data}
		
		send_android(login_data);
		//load_js('js/futures_data.js',ini_item_code);
		return false;
	}//End of login_process(form)

		//저장된 거래소의 변경날짜 확인
		function check_exchange(){
			var data=get_local_json(exchange_prefix+'_exchange');
			console.log(data);
			var check_data={};
			for(key in data){
				var exchange_data=get_local_json(exchange_prefix+'_'+key);
				check_data[key]=exchange_data.date;
			}
			return check_data;
		}//End of chek_exchange()
	
	//로그인 처리 
	function longin_process(data){
		console.log('==longin_process(data)==');
		console.log(data);
		ini_item_code(data)
	}//End of login_process(data)

	//거래소및 종목코드 저장 처리
	function ini_item_code(data){
		console.log('===ini_item_code()===');
		var exchange=data.body.exchange;
		console.log(exchange);
		var exchange_data={}
		//거래소별 정보 저장
		for(key in exchange){
			ex_key=exchange_prefix+'_'+key;
			exchange_data[key]=exchange[key].caption;
			ex_data=JSON.stringify(exchange[key]);
			var save_obj={};
			save_obj[ex_key]=ex_data;
			local.save(save_obj);
		}
		console.log(exchange_data);
		//거래소 기본정보 저장
		exchange_data=JSON.stringify(exchange_data);
		var exchange_total=exchange_prefix+'_exchange'
		var save_exchange={}
		save_exchange[exchange_total]=exchange_data;
		local.save(save_exchange);
		var group_data=get_local_json('group');
		var navi_page='#ITEM_LIST';
		if(obj.size(group_data)>0){
			navi_page='#ITEM_SEARCH';	
		}
		navigation_page(navi_page,true);
	}//End of ini_item_code()


/*페이지 코드데이터 지정*/
function ini_page(triger, callback){
	console.log('==ini_page(triger, callback)==');
	jQuery.mobile.loading('show');
	var page_id=jQuery(triger).attr('href');
	var code=jQuery(triger).attr('data-code');
	console.log(page_id+' / '+code);
	if(jQuery(page_id).length>0){
		if(code){
			jQuery(page_id).attr('data-code',code);
		}
	}
	var server_page=['#ITEM_ASKING','#ITEM_CONCLUDE','#ITEM_DAILY','#ITEM_CHART','#ITEM_OPTION','#BOARD_LIST','#BOARD_VIEW','#SCHEDULE'];
	if(parseInt(jQuery.inArray(page_id,server_page))>-1){		
		var msg={pageId:page_id,itemCd:code,type:'existing'};
		send_android(msg);
		return false;
	}else{
		callback(page_id);
	}
};//End of ini_page(triger, callback);

	var navigation_page=function(page_id,change_page){
		console.log('==navigation_page=='+page_id);
		jQuery(page_id+'>footer').empty();
		footer_menu=get_template('footer_menu');
		//shortcut메뉴 생성
		var shortcut_data=get_local_json('shortcut');
		console.log(shortcut_data);
		var shortcut_cnt=0;
		for(href in shortcut_data){
			var shortcut_item=shortcut_data[href];
			var caption=shortcut_item.caption;
			var code=shortcut_item.code;
			shortcut_cnt++
			footer_menu.find('.shortcut_menu li:nth-child('+shortcut_cnt+') a').attr('href',href);
			if(code){
				footer_menu.find('.shortcut_menu li:nth-child('+shortcut_cnt+') a').attr('data-code',code);
			}
			footer_menu.find('.shortcut_menu li:nth-child('+shortcut_cnt+') a').html(caption);
			//console.log(link_test);	
		}
		
		if(change_page==true){
			jQuery.mobile.changePage(page_id);
		}
		
		//관심그룹 메뉴 생성
		var group_data=get_local_json('group');
		var group_menu_html='';
		for(code in group_data){
			group_menu_html+='<h2><a href="#GROUP_ITEM" data-code="'+code+'">'+group_data[code]+'</a></h2>';
			
				var item_data=get_local_json(code);
				var item_list_html='';
				for(item_code in item_data){
					item_list_html+='<li><a href="#ITEM_ASKING" data-code="'+item_code+'">'+item_data[item_code]+'</a></li>';
				}
				if(obj.size(item_data)>0){
					item_list_html='<ul>'+item_list_html+'</ul>';
				}else{
					item_list_html='';
				}
			
			group_menu_html+=item_list_html;
		}
		
		jQuery(group_menu_html).insertAfter(footer_menu.find('h1:has(a[href="#GROUP_LIST"])')).trigger('create');
		jQuery(page_id+'>footer').removeClass('open');
		jQuery(page_id+'>footer').append(footer_menu).trigger('create');
		ini_footer_menu(page_id);
		//jQuery.mobile.changePage(page_id);
	}//End of navigation_page(page_id);

	
	function reset_page_attr(attr){
		console.log('==reset_page_attr()=='+attr);
		var page_id=jQuery.mobile.activePage.attr('id');
		var reset_attr=['code','caption','search'];

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
				jQuery('#'+page_id).removeAttr(temp_attr);
			}
		}
	}//End of reset_page_attr();
	
/*종목검색 페이지 초기화*/
function ini_item_search(){
	jQuery('#ITEM_SEARCH select.search_exchange').on('change',function(){category_by_exchange()});
	jQuery('#item_search_div').on('change','input',function(){search_item_check(this)});

	jQuery('#ITEM_SEARCH').on('pagebeforeshow',function(){
		jQuery('#ITEM_SEARCH select.search_exchange option').remove();
		var item_option=get_template('exchange_option');
		console.log(item_option);
		jQuery('#ITEM_SEARCH select.search_exchange').append(item_option).trigger('create');
	});
	jQuery('#ITEM_SEARCH').on('pagebeforehide',function(){
		console.log('hide_page');
		jQuery('#ITEM_SEARCH select.search_exchange option[value="false"]').attr('selected','selected');
	});
}//End of ini_item_search()
	var search_exchange={};
	function category_by_exchange(){
		reset_page_attr();
		search_result('remove');
		jQuery('#item_search_div').removeClass('complate');
		var exchange=jQuery('#ITEM_SEARCH select.search_exchange').val();
		if(exchange=='false'){
			var base_option_content=jQuery('#ITEM_SEARCH span.search_exchange').html();
			var exchange=jQuery('#ITEM_SEARCH select.search_exchange option:contains('+base_option_content+')').attr('value');
		}
		if(exchange=='false'){
			jQuery('#search_desc').slideDown(300);
			jQuery('#item_search_div').slideUp(300);
		}else{
			jQuery('#search_desc').slideUp(300);
			jQuery('#item_search_div').slideDown(300);
			jQuery('#item_search_div .step_01 li').slideUp(0);
			search_exchange=get_local_json(exchange_prefix+'_'+exchange);
			var ex_category=search_exchange.category;
			console.log(ex_category);
			for(var key in ex_category){
				var category_id='#item_category_'+key;
				jQuery(category_id).slideDown(300);
			}
			jQuery('#item_search_div .step_01').removeClass('selected');
			jQuery('#item_search_div .step_02 ul li').remove();
			jQuery('#item_search_div .step_03 ul li').remove();
		}
	}

	function search_item_check(input){
		console.log('==search_item_check(label)==');
		console.log(input);
		console.log(jQuery(input).is(':checked'));
		var step_div=jQuery(input).parents('div.search_step');
		console.log(step_div);	
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
		console.log(reset_type);
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
		console.log('==search_item_list_reset(level,type)==');
		console.log(input+'/'+type)
		reset_page_attr();
		var step_div=jQuery('#item_search_div .step_01');
		if(type=='add'){
			step_div.addClass('selected');
			var item_data=search_exchange.category[jQuery(input).val()];
			var search_item=template_search_item_level2(item_data);
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
		reset_page_attr();
		var step_div=jQuery('#item_search_div .step_02');
		if(type=='add'){
			var catgory=jQuery('input[name="item_search_step01"]:checked').val();
			var code=jQuery(input).val();
			console.log(catgory+'/'+code);
			var expiration=search_exchange.category[catgory][code].expiration;
			var search_item=template_search_item_level3(expiration);
			console.log(search_item);
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
			reset_page_attr();
			search_result(type);
			step_div.removeClass('selected');
			jQuery('#item_search_div .step_03 li').slideDown(300);
			
		}
	}//End of preview_search_item(reset_type);

	function search_result(type){
		if(type=='remove'){
			jQuery('#search_result_article').slideUp(300);
			jQuery('#search_result_article table tr').remove();
			jQuery('#item_search_div').removeClass('complate');
			jQuery('#ITEM_SEARCH').removeAttr('data-code');
		}else if(type=='add'){
			
			var catagory=jQuery('input[name="item_search_step01"]:checked').val();
			var item_code=jQuery('input[name="item_search_step02"]:checked').val();
			var expiration=jQuery('input[name="item_search_step03"]:checked').val();
			var expiration_id=jQuery('input[name="item_search_step03"]:checked').attr('id');
			var expiration_caption=jQuery('label[for="'+expiration_id+'"] span').html()
			var caption=search_exchange.category[catagory][item_code].caption;
			var code=item_code+expiration;
			console.log(code+' / '+caption+' / '+expiration_caption);
			
			var send_msg={pageId:'#ITEM_SEARCH',itemCd:code,type:'existing'};
			send_android(send_msg);
			
			jQuery('#item_search_div').addClass('complate');
			jQuery.mobile.loading('show');
		}
	}//End of search_result(catgory,code)
	
	function search_result_ex(data){
		console.log(data);
		var result_tr=template_item_list(data);
		jQuery('#ITEM_SEARCH').attr('data-code',data.itemCd);
		jQuery('#ITEM_SEARCH').attr('data-caption',data.itemCaption);
		jQuery('#search_result_article table').append(result_tr).trigger('create');
		jQuery('#search_result_article').slideDown(300);
		jQuery('#search_menu a[href="#ITEM_ASKING"]').attr('data-code',data.itemCd);
		jQuery.mobile.loading('hide');
	}/*End of search_result_ex(data)*/	
	
/*관심그룹 리스트*/
function ini_item_list(){
	jQuery('#ITEM_LIST').on('pagebeforeshow',function(){
		var code=jQuery('#ITEM_LIST').attr('data-code');
		console.log(code);
		jQuery('#ITEM_LIST select.interest_select option').remove();
		var item_option=get_template('group_item_option');
		if(code){
			for(var i=0;i<item_option.length;i++){
				if(jQuery(item_option[i]).attr('value')==code){
					var current_option=jQuery(item_option[i]);	
				}
			}
		}else{
			var current_option=jQuery(item_option[0]);
		}
		console.log(current_option);
		
		current_option.attr('selected','selected');
		var code=current_option.attr('value');
		var item_text=current_option.html();
		jQuery('#ITEM_LIST span.interest_select').html(item_text);
		jQuery('#ITEM_LIST select.interest_select').append(item_option).trigger('create');
		reset_item_list_table();	
	});
	
	jQuery('#ITEM_LIST .btn_interest_table').on('tap',function(){
		jQuery('#item_list_table').attr('data-type','table');
		set_group_code();
	});
	jQuery('#ITEM_LIST .btn_interest_card').on('tap',function(){
		jQuery('#item_list_table').attr('data-type','card');
		set_group_code();
	});
	jQuery('#ITEM_LIST').on('tap','table[data-type="card"] td.itemCd',function(){item_card_extend(this)});
	jQuery('#ITEM_LIST').on('tap','table[data-type="table"] td.itemCd',function(){item_panel_extend(this)});
	jQuery('#item_list_panel').on('panelclose', function(){item_panel_reset()});
}//End of ini_item_list()
	
	//관심그룹코드 등록
	function set_group_code(){
		var code=jQuery('#ITEM_LIST select.interest_select').val();
		jQuery('#ITEM_LIST').attr('data-code',code);
		reset_item_list_table();
	}
	
	//관심그룹 리스갱신
	function reset_item_list_table(){
		console.log('==reset_item_list_table()==')
		jQuery('#item_list_table tbody tr').remove();
		jQuery('#item_list_table_div').slideUp(300);
		var code=jQuery('#ITEM_LIST').attr('data-code');
		console.log(code);
		var item_data={}
		if(!code){
			jQuery('#no_group_select_desc').slideDown(300);
			return false;
		}else{
			jQuery('#no_group_select_desc').slideUp(300);
			item_data=get_local_json(code);
			jQuery('#item_list_table')
			console.log(item_data);		
		}
		
		if(obj.size(item_data)<1){	
			jQuery('#item_list_table').slideUp(0);
			jQuery('#no_item_list_desc').slideDown(0);
		}else{
			var itemCd_array=new Array();
			for(item_code in item_data){
				itemCd_array.push(item_code);
			}
			var send_msg={pageId:'#ITEM_LIST',itemCd:itemCd_array,type:'existing'}
			send_android(send_msg);
		}
		jQuery('#item_list_table_div').slideDown(300);
	}//End of reset_item_list_table();
	
	//아이템 리스트 항목 처리
	function item_list_table(data){
		var item_data=data.body;
		for(var i=0;i<item_data.length;i++){
			var item_tr=template_item_list(item_data[i]);
			jQuery('#item_list_table tbody').append(item_tr).trigger('creat');
		}
		jQuery('#item_list_table').slideDown(0);
		jQuery('#no_item_list_desc').slideUp(0);
	}//End of item_list_table(data)
	
	
	
	//아이템 카드 확장
	function item_card_extend(card_label){
		var card=jQuery(card_label).parents('tr');
		console.log(card);
		var code=card.attr('data-code');
		if(card.hasClass('extend')){
			card.find('.table_type01').remove();
			card.find('.item_more_info_menu').remove();
		}else{
			var asking=get_template('item_more_asking');
				asking.attr('data-code',code);
			var conclue=get_template('item_more_conclude');
				conclue.attr('data-code',code);
			var menu=get_template('item_more_menu');
				menu.find('a').attr('data-code',code);	
			
			card.find('.item_more_info').append(asking).trigger('create');
			card.find('.item_more_info').append(conclue).trigger('create');
			card.find('.item_more_info').append(menu).trigger('create');
		}
		
		card.toggleClass('extend');
	}//End of item_card_extend(card_label)
	
	//아이템 추가정보 패널 초기화
	function item_panel_reset(){
		console.log('=panel_close=');
		var panel=jQuery('#item_list_panel');
		panel.find('h1').html('--');
		panel.find('div.more_info').empty();
	}//End of item_panel_reset();
	
	//아이템 추가정보 패널 확장	
	function item_panel_extend(item_label){
		var tr=jQuery(item_label).parents('tr');
		var code=tr.attr('data-code');
		var panel=jQuery('#item_list_panel');
		
		jQuery('#item_list_panel h1').html(code);
		var asking=get_template('item_more_asking');
			asking.attr('data-code',code);
		var conclue=get_template('item_more_conclude');
			conclue.attr('data-code',code);
		var menu=get_template('item_more_menu');
			menu.find('a').attr('data-code',code);
		
		panel.find('div.more_info').append(asking).trigger('create');
		panel.find('div.more_info').append(conclue).trigger('create');
		panel.find('div.more_info').append(menu).trigger('create');
		
		jQuery('#item_list_panel').panel('toggle');
	}//End of item_panel_extend(item_label)

/*아이템별 보기 초기화*/
function ini_item(){
	//jQuery('#ITEM_ASKING').on('pagebeforeshow',function(){ini_asking()});
	jQuery('#ITEM_ASKING').on('pageshow',function(){real_asking()});
	jQuery('#app').on('tap','.btn_item_commen_info',function(){toggle_item_info();});
	jQuery('#app').on('tap','.btn_item_commen_info_close',function(){toggle_item_info();});
}
		
	function toggle_item_info(){
		console.log('==toggle_item_info()==');
		jQuery.mobile.activePage.find('.item_desc_div').slideToggle(300);
	}
	
	//아이템별 보기 상단 공통
	function item_commen(data){
		reset_page_attr();
		if(data.OpenPrice>=data.SettlementPrice){
			jQuery(data.pageId).removeClass('down');
			jQuery(data.pageId).addClass('up');
		}else{
			jQuery(data.pageId).removeClass('up');
			jQuery(data.pageId).addClass('down');
		}
		jQuery(data.pageId).attr('data-code',data.itemCd);
		jQuery(data.pageId).attr('data-caption',data.itemCaption);
		
		jQuery(data.pageId+' .item_commen_div .itemCaption').html(data.itemCaption);
		jQuery(data.pageId+' .item_commen_div .itemCd').html(data.itemCd);
		jQuery(data.pageId+' .item_commen_div .Curr').html(jQuery.number(data.LastPrice,2));
		jQuery(data.pageId+' .item_commen_div .Diff').html(jQuery.number(data.Diff,2));
		jQuery(data.pageId+' .item_commen_div .UpDwnRatio').html(jQuery.number(data.Rate,2));
		
		jQuery(data.pageId+' .item_commen_div .item_commen_navi a').attr('data-code',data.itemCd);
		jQuery(data.pageId+' .item_commen_div .btn_item_commen_info').attr('data-code',data.itemCd);
	}//End of item_commen(code)
	
	//호가 기존 데이터 및 공통영역 처리
	function ini_asking(data){
		console.log('==ini_asking(data)==');
		console.log(data);
		// 공통영역처리
		var commen_data=data.commen;
		item_commen(commen_data); 
		
		//테이블 처리
		asking_table(data);
		//페이지 이동
		navigation_page(data.pageId,true)
	}//End of ini_asking()
	
	//실시간 데이터 처리
	function real_asking(){
		var code=jQuery('#ITEM_ASKING').attr('data-code');
	}//End of real_asking()
	
	//호가 테이블 처리
	function asking_table(data){
		console.log('asking_table(data)');
		console.log(data);
		
		var time_data=data.body.Time;
		jQuery('#item_asking_table thead th.Time').html(time_data);
		
		var sell_data=data.body.Sell;
		var sell_tr=jQuery('#item_asking_table tbody.tbody_sell tr');
		
		for(var i=0;i<sell_tr.length;i++){
			var cnt_td=jQuery(sell_tr[i]).find('td.Cnt');
			var qut_td=jQuery(sell_tr[i]).find('td.Qut');
			var prc_td=jQuery(sell_tr[i]).find('td.Prc');
			
			jQuery(cnt_td).html(sell_data[i].Cnt);
			jQuery(qut_td).html(sell_data[i].Qut);
			jQuery(prc_td).html(jQuery.number(sell_data[i].Prc,2));
		}
			
		var buy_data=data.body.Buy;
		var buy_tr=jQuery('#item_asking_table tbody.tbody_buy tr');
		for(var i=0;i<buy_tr.length;i++){
			var cnt_td=jQuery(buy_tr[i]).find('td.Cnt');
			var qut_td=jQuery(buy_tr[i]).find('td.Qut');
			var prc_td=jQuery(buy_tr[i]).find('td.Prc');
			
			jQuery(cnt_td).html(sell_data[i].Cnt);
			jQuery(qut_td).html(sell_data[i].Qut);
			jQuery(prc_td).html(jQuery.number(sell_data[i].Prc,2));		}
	}//End of asking_table(data);

	//체결 데이터 처리
	function ini_conclude(data){
		// 공통영역처리
		var commen_data=data.commen;
		item_commen(commen_data); 
		//테이블 처리
		jQuery('#item_conclude_table tbody tr').remove();
		conclude_table(data);
		//페이지 이동
		navigation_page(data.pageId,true)
	}//End of ini_conclude(data)
	
	
		//체결 테이블 처리
		function conclude_table(data){
			var tr_cnt=7; // 화면에 유지할 정보의 개수
			var tr_data=data.body;
			for(var i=0;i<tr_data.length;i++){
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
		var commen_data=data.commen;
		item_commen(commen_data); 
		
		//테이블 처리
		jQuery('#item_daily_table tbody tr').remove();
		daily_table(data);
		//페이지 이동
		navigation_page(data.pageId,true);
	}//End of ini_daily(data)

		//일자별 테이블 처리
		function daily_table(data){
			var tr_cnt=7; // 화면에 유지할 정보의 개수
			var tr_data=data.body;
			for(var i=0;i<tr_data.length;i++){
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
		var commen_data=data.commen;
		item_commen(commen_data); 
		//차트 처리
		//페이지 이동
		navigation_page(data.pageId,true);
	}

/*레이어 기능 초기화*/
function ini_layer(){
	ini_group_layer();
	ini_search_layer();
	
	jQuery('#app').on('tap','.btn_layer_interest',function(){show_layer_group();});
	jQuery('#app').on('tap','.btn_layer_search',function(){show_layer_search();})
	jQuery('#app').on('tap','.btn_close_layer',function(){item_layer_remove()});
	
	//임시..
	jQuery('#GROUP_LAYER').on('pagebeforeshow',function(){jQuery('#GROUP_LAYER .bg_layer').animate({opacity: 1,height:'100%'},300);});
	jQuery('#SEARCH_LAYER').on('pagebeforeshow',function(){jQuery('#SEARCH_LAYER .bg_layer').animate({opacity: 1,height:'100%'},300);});

	jQuery('#GROUP_LAYER').on('pagebeforeshow',function(){show_layer_group();});
	jQuery('#SEARCH_LAYER').on('pagebeforeshow',function(){show_layer_search();});
	
}//End of ini_layer()
			
	//관심그룹 레이어 열기
	function show_layer_group(){
		console.log('==show_layer_group()==');
		var layer=get_template('layer_group');
		
		var group_option=get_template('group_item_option');
		var first_group_code=jQuery(group_option[0]).attr('value');
		layer.find('#layer_group .select_box_group option').remove();
		layer.find('#layer_group .select_box_group').append(group_option).trigger('create');
		
		var item_option=template_group_item_option(first_group_code);
		layer.find('#layer_group_item_select_02 option').remove();
		layer.find('#layer_group_item_select_02').append(item_option).trigger('create');
		
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
		jQuery('#app').on('change','#layer_group input[name="layer_reg_group_type"]',function(){
			var layer_type=jQuery('input[name="layer_reg_group_type"]:checked').val();
			console.log(layer_type)
			if(layer_type=='reg'){
				jQuery('#layer_group .type_01').slideDown(300);
				jQuery('#layer_group .type_02').slideUp(300);	
			}else if(layer_type=='search'){
				jQuery('#layer_group .type_01').slideUp(300);
				jQuery('#layer_group .type_02').slideDown(300);
			}
			
		});
		
		jQuery('#app').on('change','#layer_group_select_02',function(){layer_group_item_option_change()});
		jQuery('#app').on('change','#layer_group_item_select_02',function(){set_search_code(this);});		
		jQuery('#app').on('tap','#layer_group .btn_layer_reg_group_name',function(){layer_group_reg()});
		jQuery('#app').on('tap','#layer_group .type_01 .btn_layer_ok',function(){layer_group_item_reg()});
		jQuery('#app').on('tap','#layer_group .type_02 .btn_layer_ok',function(){layer_item_code_change()});
	}//End of ini_group_layer();
	
	
	/*종목 레이어 삭제*/
	function item_layer_remove(){
		console.log('==item_layer_remove()==');
		var layer=jQuery.mobile.activePage.find('.bg_layer');
		layer.animate({opacity: 0,height:'0%'},300,function(){layer.remove();});
	}//End of item_layer_remove()
	
	/*검색코드의 등록*/
	function set_search_code(input){
		var item_code=jQuery(input).val(); 
		jQuery.mobile.activePage.attr('data-search',item_code);
	}//End of set_search_code(input)
	
	/*종목별 페이지 종목 코드 변경*/
	function layer_item_code_change(){
		console.log('==layer_item_code_change()==');
		
		var page_id=jQuery.mobile.activePage.attr('id');
		//layer_item_code_change
		var item_code=jQuery.mobile.activePage.attr('data-search');
		
		var msg={pageId:'#'+page_id,itemCd:item_code,type:'existing'};
		send_android(msg);
		
		item_layer_remove();
	}//End of layer_item_code_change()
	
	/*관심그룹 등록처리*/
	function layer_group_reg(){
		console.log('==layer_group_reg==');
		var group_name=jQuery('#layer_reg_group_name').val();
		var group_code=save_group_name(group_name);
		if(group_code){
			var group_option=get_template('group_item_option');
			jQuery(group_option[group_option.length-1]).attr('selected','selected');
			jQuery('#layer_group select.select_box_group option').remove();
			jQuery('#layer_group select.select_box_group').append(group_option).trigger('create');
			jQuery('#layer_group_select_01-button span.select_box_group').html(group_name);	
		}
		jQuery('#layer_reg_group_name').val('');
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
		var result=save_group_item(group_code);
		alert('['+result.item_caption+']을 ['+result.group_name+'] 관심그룹에 등록했습니다.');
		item_layer_remove();
	}//End of layer_group_item_reg()

	function save_group_item(group_code){
		console.log('==save_group_item(group_code,item_code)==');
		var item_code=jQuery.mobile.activePage.attr('data-code');
		var item_caption=jQuery.mobile.activePage.attr('data-caption');
		var group_data=get_local_json('group');
		var group_name=group_data[group_code];
		var item_data=get_local_json(group_code);
		
		item_data[item_code]=item_caption;
		
		var save_string=JSON.stringify(item_data);
		var save_obj={};
		save_obj[group_code]=save_string;
		local.save(save_obj);
		
		var result={};
		result.group_name=group_name;
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
		jQuery('#app').on('change','#layer_group_item_select_02',function(){set_search_code(this);});
		
		jQuery('#app').on('tap','#layer_search .type_01 .btn_layer_ok',function(){layer_item_code_change()});
		jQuery('#app').on('tap','#layer_search .type_02 .btn_layer_ok',function(){layer_item_code_change()});
	}//End of ini_search_layer()

		function layer_search_step01(){
			jQuery('#layer_seach_step_01 option').remove();
			jQuery('#layer_seach_step_01-button span').html('카테고리 선택');
			var exchange_temp=jQuery('#layer_search select#layer_search_fdm').val();
			console.log(exchange_temp);
			var exchange=exchange_prefix+'_'+exchange_temp;
			
			exchange_data=get_local_json(exchange);
			
			var category=exchange_data.category;
			var step01_option_code='<option value="false" selected="selected">카테고리 선택</option>';
			for(key in category){
				temp_code='<option value="'+key+'">'+item_catagory_caption[key]+'</option>';
				step01_option_code=step01_option_code+temp_code;
			}
			var step01_option=jQuery(step01_option_code);
			jQuery('#layer_seach_step_01').append(step01_option).trigger('create');
			jQuery('#layer_seach_step_div_01').slideDown(300);
			jQuery('#layer_seach_step_div_02').slideUp(300);
			jQuery('#layer_seach_step_div_03').slideUp(300);
		}//End of layer_search_step01();
		
		function layer_search_step02(){
			jQuery('#layer_seach_step_02 option').remove();
			jQuery('#layer_seach_step_02-button span').html('종목 선택');
			var exchange_temp=jQuery('#layer_search select#layer_search_fdm').val();
			var exchange=exchange_prefix+'_'+exchange_temp;
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
			jQuery('#layer_seach_step_div_02').slideDown(300);
			jQuery('#layer_seach_step_div_03').slideUp(300);
		}//End of layer_search_step02();
	
		function layer_search_step03(){
			jQuery('#layer_seach_step_03 option').remove();
			jQuery('#layer_seach_step_03-button span').html('월물 선택');
			var exchange_temp=jQuery('#layer_search select#layer_search_fdm').val();
			var exchange=exchange_prefix+'_'+exchange_temp;
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
				var month=item_expiration[i].toString().substring(4,7);
				var m_code=month_code[month]+code_year;
				console.log(year+'/'+month+'/'+m_code);
				temp_code='<option value="'+m_code+'">'+year+'년도 '+month+'월</option>';
				step03_option_code=step03_option_code+temp_code;
			}
			var step03_option=jQuery(step03_option_code);
			jQuery('#layer_seach_step_03').append(step03_option).trigger('create');
			jQuery('#layer_seach_step_div_03').slideDown(300);
		}//End of layer_search_step02();
		
		function layer_search_code(){
			var item_code=jQuery('#layer_search select#layer_seach_step_02').val();
			var date_code=jQuery('#layer_search select#layer_seach_step_03').val();
			var code=item_code+date_code;
			var search_code=jQuery('#layer_search input#layer_search_code').val(code);
			set_search_code(jQuery('#layer_search input#layer_search_code'));
		}//End of layer_search_code()
		
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
	function del_group_name(){
		var code=jQuery.mobile.activePage.attr('data-code');	
		var group_data=get_local_json('group');
		var group_name=group_data[code];
		var del_ok=confirm('['+group_name+']를 삭제하시겠습니까?');
		console.log(del_ok);
		if(del_ok==true){
			obj.del_key(group_data,code);
			var save_string=JSON.stringify(group_data);
			var save_obj={'group':save_string}
			local.save(save_obj);
			alert('['+group_name+']를 삭제 하였습니다.');
			window.history.back();
		}
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
		var page_height=jQuery(window).height();
		var header_height=jQuery.mobile.activePage.find('header[data-role="header"]').outerHeight(false);
		var shotcut_height=jQuery.mobile.activePage.find('.shortcut_menu_div').outerHeight(false);
		console.log(page_height+'-'+header_height+'-'+shotcut_height);
		
		var open_height=page_height-header_height-shotcut_height;
		var footer=jQuery.mobile.activePage.find('footer[data-role="footer"]');
		var active_id=jQuery.mobile.activePage.attr('id');
		var all_menu=jQuery('#'+active_id+' div.all_menu');
		if(footer.hasClass('open')){
			all_menu.animate({'height':0+'px','padding-top':0+'px'},300);
			footer.removeClass('open');
		}else{
			all_menu.animate({height:open_height+'px','padding-top':25+'px'},300);
			footer.addClass('open');
		}
	}//End of toggle_footer_menu()

	function ini_footer_menu(page_id){
		console.log('==ini_footer_menu()==');
		//var active_id=jQuery.mobile.activePage.attr('id');
		active_id=page_id;
		console.log(active_id);
		jQuery(active_id+' .all_menu a').draggable({helper: "clone"});
		jQuery(active_id+' .shortcut_menu li').droppable({
			drop:function(e,ui){
				console.log(e.target);
				console.log(ui.draggable);
				var new_item=jQuery(ui.draggable).clone()
				new_item.removeClass('ui-draggable');
				new_item.addClass('ui-btn');
				jQuery(e.target).html(new_item);
				save_shortcut(page_id);
			}
		});
	}//ini_footer_menu(page_id)
	
	function save_shortcut(page_id){
		console.log('==save_shortcut('+page_id+')==');
		var shortcut_link=jQuery(page_id+'>footer .shortcut_menu_div a');
		console.log(shortcut_link);
		var shortcut_data={};
		for(i=0;i<shortcut_link.length;i++){
			var key=jQuery(shortcut_link[i]).attr('href')
			var link_caption=jQuery(shortcut_link[i]).html();
			var link_code=jQuery(shortcut_link[i]).attr('data-code');
			console.log(key+'/'+link_caption+'/'+link_code);
			
			shortcut_data[key]={caption:link_caption,code:link_code}
		}
		shortcut_data=JSON.stringify(shortcut_data);
		var save_obj={shortcut:shortcut_data};
		local.save(save_obj);
	}//save_shortcut(page_id)

	function hide_footer(){
		console.log('==hide_footer()==');
	}

/**
*종목검색
*/
//종목의 일자 반환
function item_code_export(item_code){
	var return_data={};
	var code=item_code.substr(0,(item_code.length-3));
	var month_temp=item_code.substr((item_code.length-3),1);
	var month=month_code[month_temp];
	var year_temp=item_code.substr((item_code.length-2),2);
	var year='20'+year_temp;
	var date_text=year+'년 '+month+'월';
	
	return_data['code']=code;
	return_data['year']=year;
	return_data['month']=month;
	return return_data;
}//End of item_code_export(item_code);

function item_search(item_code){
	var temp_data=item_code_export(item_code);
	
	var date_text=temp_data.year+'년 '+temp_data.month+'월';
	var code=temp_data.code;
	
	var exchange=get_local_json(exchange_prefix+'_exchange');
	var exchange_name='';
	var category_name='';
	//거래소 반복
	for(key in exchange){
		exchange_name=exchange[key];
		var exchange_key=exchange_prefix+'_'+key;
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
	}
}//End of get_template(part)
	
	var template_footer_menu=function(){
		var content=local.get('footer_menu');
		if(content){
			console.log('local에 저장된 메뉴');
			return jQuery(content);
		}else{
			return jQuery('<div class="shortcut_menu_div" data-role="navbar"><ul class="shortcut_menu"><li><a href="#ITEM_SEARCH">종목검색</a></li><li><a href="#GROUP_LIST">관심종목</a></li><li><a href="#BOARD_LIST" data-code="">투자정보</a></li><li><a href="#BOARD_LIST" data-code="">공지사항</a></li><li><a href="tel:000-0000-0000">전화주문</a></li></ul></div><div class="all_menu"><h1><a href="tel:000-0000-0000">바로 전화주문</a></h1><h1><a href="#ITEM_SEARCH">종목검색</a></h1><h1><a href="#GROUP_LIST">관심종목</a></h1><h1><a href="#BOARD_LIST" data-code="">투자정보</a></h1><ul><li><a  href="#BOARD_LIST" data-code="">이슈리포트</a></li><li><a  href="#BOARD_LIST" data-code="">Daily News</a></li><li><a  href="#BOARD_LIST" data-code="">시황</a></li><li><a  href="#BOARD_LIST" data-code="">해외일정</a></li></ul><h1><a href= href="#BOARD_LIST" data-code="">공지사항</a></h1></div>'); 	
		}
	}
	
	var template_exchange_option=function(){
		option_text='<option value="false" selected="selected">거래소선택</option>';
		var exchange=get_local_json(exchange_prefix+'_exchange');
		console.log(exchange);
		for(key in exchange){
			option_text+='<option value="'+key+'">'+exchange[key]+'</option>';
		}
		return jQuery(option_text);	
	}
	
	var template_search_item_level2=function(item_data){
		var list_text='';
		var cnt=0;
		for(key in item_data){
			cnt++;
			list_text+='<li><input type="radio" name="item_search_step02" id="step02_'+cnt+'" value="'+key+'" /><label for="step02_'+cnt+'">'+key+'<span>'+item_data[key].caption+'</span></label></li>';
		}
		return jQuery(list_text);
	}
	
	var template_search_item_level3=function(expiration){
		console.log(expiration);
		var list_text='';
		var cnt=0;
		for(i=0;i<expiration.length;i++){
			var date_string=expiration[i]+'';
			var year=date_string.substring(2,4);
			var month=date_string.substring(4,6);
			console.log(year+' / '+month+' / '+month_code[month]);
			var code=month_code[month]+year;
			list_text+='<li><input type="radio" name="item_search_step03" id="step03_'+i+'" value="'+code+'" /><label for="step03_'+i+'">'+code+'<span>'+year+'/'+month+'</span></label></li>';
		}
		return jQuery(list_text);
	}
	
	var template_item_list=function(data){
		console.log(data);
		var tr_class="even"	
		if(data.OpenPrice>=data.SettlementPrice){
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
		console.log(char_open+'/'+char_last+'/'+char_size);
		
		
		return jQuery('<tr id="'+data.itemCd+'" class="'+tr_class+'" data-code="'+data.itemCd+'"><td class="itemCd">'+data.itemCd+'<span class="item_caption">'+data.itemCaption+'</span></td><td class="curr">'+jQuery.number(data.LastPrice,2)+'</td><td><span class="Diff">'+jQuery.number(data.Diff,2)+'</span><span class="UpDwnRatio">'+jQuery.number(data.Rate,2)+'</span></td><td><div class="vol_chart_div"><div class="vol_chart_bar"></div><div class="vol_chart_vol" style="left:'+char_left+'%;width:'+char_size+'%;"></div></div><span class="Volume">'+jQuery.number(data.TotalVolume)+'</span></td><td class="item_more_info"></td></tr>');
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
			option_text='<option value="false">관심그룹이 없음<option>';
		}
		return jQuery(option_text);
	}//template_group_option();
	
	
	var template_group_item_option=function(group_code){
		var option_text='';
		var item_data=get_local_json(group_code);
		if(obj.size(item_data)>0){
			for(code in item_data){
				option_text+='<option value="'+code+'">'+item_data[code]+'</option>';
			}
		}else{
			option_text='<option value="false">등록된 종목이 없음<option>';
		}
		return jQuery(option_text);
	}//End of template_group_option=function(group_code);
	
	var template_item_more_asking=function(){
		return jQuery('<table class="item_more_info_asking table_type01" data-code=""><thead><tr><th>매도</th><th>1651</th><th>매수</th></tr></thead><tfoot><tr><td>480</td><td>83</td><td>563</td></tr></tfoot><tbody class="tboay_sell"><tr><td>141</td><td>0.9277</td><td rowspan="3"></td></tr><tr><td>80</td><td>0.9276</td></tr><tr><td>13</td><td>0.9275</td></tr></tbody><tbody class="tboay_buy"><tr><td>1</td><td>0.9274</td><td>20</td></tr><tr><td>1</td><td>0.9274</td><td>106</td></tr><tr><td>1</td><td>0.9274</td><td>135</td></tr></tbody></table>');
	}//End of template_more_asking()
	
	var template_item_more_conclude=function(){
		return jQuery('<table class="item_more_info_conclude table_type01" data-code=""><thead><tr><th>시간</th><th>체결가</th><th>체결</th></tr></thead><tbody><tr><td>01:49:00</td><td>1999.00</td><td>1</td></tr><tr><td>01:48:51</td><td>1998.75</td><td>1</td></tr><tr><td>01:48:39</td><td>1998.00</td><td>2</td></tr><tr><td>01:48:17</td><td>1998.75</td><td>1</td></tr><tr><td>01:48:00</td><td>1998.00</td><td>1</td></tr><tr><td>01:47:57</td><td>1999.00</td><td>1</td></tr><tr><td>01:47:57</td><td>1999.00</td><td>1</td></tr></tbody></table>');
	}//End of template_item_more_conclude()
	
	var template_item_more_menu=function(){
		return jQuery('<div class="item_more_info_menu" data-role="navbar"><ul><li><a href="#ITEM_ASKING" data-code="">현재가</a></li><li><a href="#ITEM_CHART" data-code="">차트</a></li><li><a href="tel:00-000-0000" data-code="">바로주문</a></li></ul></div>');
	}//End of template_item_more_menu()


	var template_layer_group=function(){
		var group_option=template_group_option();
		var layer=jQuery('<div class="bg_layer"><section id="layer_group" class="layer_section"><header><h1>관심그룹</h1><div class="layer_type_div" data-role="controlgroup" data-type="horizontal"><input type="radio" name="layer_reg_group_type" id="layer_reg_group_type_01" value="reg" checked="checked" /><label for="layer_reg_group_type_01">등록하기</label><input type="radio" name="layer_reg_group_type" id="layer_reg_group_type_02" value="search" /><label for="layer_reg_group_type_02">종목찾기</label></div></header> <div class="layer_content type_01"><h2>새 관심그룹 만들기</h2><div class="layer_reg_group_name_div" data-role="controlgroup" data-type="horizontal"><input type="text" data-wrapper-class="controlgroup-textinput ui-btn" id="layer_reg_group_name" placeholder="그룹 이름을 입력하세요" /><button type="button" class="btn_layer_reg_group_name">만들기</button></div><h2>등록할 그룹 선택</h2><select id="layer_group_select_01" class="select_box_group"></select> <button type="button" class="btn_layer_ok">등록</button></div><div class="layer_content type_02"><h2>관심그룹 선택</h2><select id="layer_group_select_02" class="select_box_group"><option value="1">그룹명_01</option><option value="2">그룹명_02</option></select><h2>관심그룹 선택</h2><select id="layer_group_item_select_02" class="select_box_item"> <option>관심그룹을 선택하세요</option> </select> <button type="button" class="btn_layer_ok">확인</button></div><footer><p>편집은 관심그룹 페이지를 이용하세요</p><a href="#GROUP_LIST">관심그룹 으로 이동</a> </footer><button type="button" class="btn_close_layer">닫기</button></section></div>');
		
		layer.find('#layer_group_select_01').append(group_option).trigger('create');
		return layer;	
	}//End of template_layer_group();
	
	
	var template_layer_search=function(){
		var exchange_option=template_exchange_option();
		var layer=jQuery('<div class="bg_layer"><section id="layer_search" class="layer_section"><header><h1>종목검색</h1><div class="layer_type_div" data-role="controlgroup" data-type="horizontal"><input type="radio" name="layer_search_type" id="layer_search_type_01" value="code" checked="checked" /><label for="layer_search_type_01">코드로 찾기</label><input type="radio" name="layer_search_type" id="layer_search_type_02" value="item" /><label for="layer_search_type_02">관심종목 찾기</label></div></header><div class="layer_content type_01"><h2><label for="layer_search_fdm">거래소</label></h2><select id="layer_search_fdm" class="selectbox_fdm"></select><div id="layer_seach_step_div_01" class="layer_seach_step_div"><h2><label for="layer_seach_step_01">카테고리</lable></h2><select id="layer_seach_step_01"><option value="false">카테고리 선택</option></select></div><div id="layer_seach_step_div_02" class="layer_seach_step_div"><h2><label for="layer_seach_step_02">종목</lable></h2><select id="layer_seach_step_02"><option value="false">종목 선택</option></select></div><div id="layer_seach_step_div_03" class="layer_seach_step_div"><h2><label for="layer_seach_step_03">월물</lable></h2><select id="layer_seach_step_03"><option value="flase">월물선택</option></select></div><h2><label for="layer_search_code">종목코드</label></h2><input type="text" id="layer_search_code" placeholder="종목코드를 입력하세요" data-wrapper-class="ui-btn" /><button type="button" class="btn_layer_ok">확인</button></div><div class="layer_content type_02"><h2>관심그룹 선택</h2><select id="layer_group_select_02" class="select_box_group"><option value="1">그룹명_01</option><option value="2">그룹명_02</option></select><h2>관심그룹 선택</h2><select id="layer_group_item_select_02" class="select_box_item"><option value="1">종목명</option><option value="2">종목명</option></select><button type="button" class="btn_layer_ok">확인</button></div><footer><p>세부검색은 검색페이지를 이용하세요</p><a href="#ITEM_SEARCH">검색페이지로 이동</a></footer><button type="button" class="btn_close_layer">닫기</button></section></div>');
	
		layer.find('#layer_search_fdm').append(exchange_option).trigger('create');
		return layer;
	
	}//End of template_layer_search();
	
	var template_conclude_tr=function(data){
		
		return jQuery('<tr><td class="Time">'+data.Time+'</td><td class="Curr">'+jQuery.number(data.Curr,2)+'</td><td class="Diff">'+data.Diff+'</td><td class="UpDwnRatio">'+data.Rate+'</td></tr>');
	}//End of template_conclude_tr()
	
	var template_daily_tr=function(data){
		return jQuery('<tr><td class="Date">'+data.Date+'</td><td class="Last">'+jQuery.number(data.Last,2)+'</td><td class="High">'+jQuery.number(data.High,2)+'</td><td class="Low">'+jQuery.number(data.Low,2)+'</td><td class="Diff">'+data.Diff+'</td><td class="Rate">'+data.Rate+'</td></tr>');
	}//End of template_daily_tr();
	
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



	
