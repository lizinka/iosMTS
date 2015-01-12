// JavaScript Document
jQuery.fx.interval=0.1;
$(document).bind("mobileinit", function(){
    $.mobile.loader.prototype.options.html = '<div class="bg_layer" id="loading"><div id="wave_01" class="wave"></div><div id="wave_02" class="wave"></div><div id="wave_03" class="wave"></div><div id="wave_04" class="wave"></div><div id="loading_title">유진투자선물</div><div id="loading_desc">정보를 갱신 중 입니다.</div><button type="button" class="btn_close_loading">닫기</button>';
	$.extend($.mobile , 
	{
		defaultPageTransition :'slide',
	
	});
	$.mobile.page.prototype.options.domCache = false;
});