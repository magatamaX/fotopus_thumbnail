/* ================================================================================
* Title: Jquery Function
* Date: Feb.28, 2013
* Macで作業するときの注意：バックスラッシュ\を入力するときはoptionを押しながらエンマーク
================================================================================ */
(function($)
{
//---------------------------------------------------------------------
$(function()
{
	//mobile
	$.EX.mobileWidth = 774;
	$.EX.mobileFlag = false;

//	f = 0;
//	$.EX.init(f);
	//login flag
	$.ajax({type:'GET', url:'/api/login/judge'
		,success:function(f)
		{
			//load function
			$.EX.init(f);
		}
	});
	var slide = $('#slider');
	if(slide[0]) $.EX.visualSlider(slide);
	$.EX.mobileMenu();
	$.EX.topCont();

	//window open
	function MM_openBrWindow(theURL,winName,features) {
		window.open(theURL,winName,features);
	}
	//現在のURLをCookieに記録
	$.cookie('nowUrl', '/', { expires: 0, path: '/', domain: ''});
	//htmlのheader,footer,menu
	$.EX.pageHtml();
//-----------------------------------------------------------------
});
//---------------------------------------------------------------------
$.EX =
{
//-----------------------------------------------------------------
init: function(f)
{
	var $window = $(window);
	var dom = $('.fotopus-menu');

	//login form
	var pcHeader = $('#log_status_pc');
	var mHeader = $('#log_status_sp');
	var formId = 'nlogin_form';
	var status;
	var host = document.location.host;
	var url = ('https:' == document.location.protocol ? 'https://' : 'http://') + host + document.location.pathname;
	if (document.location.search) url += escape(document.location.search);
	var output = '<div id="'+formId+'"><iframe id="framelogin" src="/user/login/frame_login_jump.php?tt=ow&ret_url='+url+'" scrolling="no" frameborder="0"></iframe></div>';

	//ie判定
	var ie = (function(){
	var undef, v = 3, div = document.createElement('div');

	while (
    div.innerHTML = '',
    div.getElementsByTagName('i')[0]
	);

	return v> 4 ? v : undef;
	}());

	if (($window.width() <= $.EX.mobileWidth) && (jQuery.support.opacity))
	{//mobile
		mHeader.append(output);
		status = $('#'+formId);
		if (f == 0) mHeader.next(status).hide();//20130521藤井追加
		$.EX.mobileFlag = true;
	}
	else
	{//pc
		pcHeader.append(output);
		status = $('#'+formId);
		pcHeader.children(status).show();//20130521藤井追加
		$.EX.mobileFlag = false;
	}

	$window.bind('resize orientationchange', function()
	{
		if (($window.width() <= $.EX.mobileWidth) && (jQuery.support.opacity))
		{//mobile
			mHeader.append(status);
			if (f == 0) mHeader.next(status).hide();//20130521藤井追加
			$.EX.mobileFlag = true;
		}
		else
		{//pc
			pcHeader.append(status);
			pcHeader.children(status).show();//20130521藤井追加
			$.EX.mobileFlag = false;
		}
	});

	//mobile login button
	var mLoginBt = dom.find('#loginBtn');
	var mLoginForm = mLoginBt.find('#login');
	var actionPath = 'https://' + host;
	if(f==0)
	{
		actionPath += '/user/login/before_login_park.php';
		mLoginForm.append('<input type="hidden" name="new_ret_url" value="'+ location.href +'">');
		mLoginBt.find('span').removeClass("F_icon-logout").addClass("F_icon-login");
		mLoginBt.find('span').text("ログイン");
		mHeader.attr({style:"display:none"});
	}
	else
	{
		mLoginBt.find('span').removeClass("F_icon-login").addClass("F_icon-logout");
		mLoginBt.find('span').text("ログアウト");
		actionPath += '/user/login/logout_jump.php';
		mLoginForm.append('<input type="hidden" name="logout" value="1">');
		mHeader.attr({style:"display:block"});
	}
	mLoginBt.click(function()
	{
		mLoginForm.attr('action', actionPath).submit();
	});

	//pulldown menu
	var pulldown = $('#navigation');
	var current = 'current';

	//fotopusNav
	var fTarget = pulldown.find('#fotopusNav_fotopusMenuList');
	pulldown.find('#fotopusNav_fotopusMenu').click(function()
	{
		$(this).find('dl').addClass(current);
		fTarget.show();
	})
	.mouseleave(function()
	{
		$(this).find('dl').removeClass(current);
		fTarget.hide();
	});

	//photoSearch genre
	var gTarget = pulldown.find('#photoSearch_genreList');
	pulldown.find('#photoSearch_genre').click(function()
	{
		$(this).find('dl').addClass(current);
		gTarget.show();
	})
	.mouseleave(function()
	{
		$(this).find('dl').removeClass(current);
		gTarget.hide();
	});

	//photoSearch dictionary
	var dTarget = pulldown.find('#photoSearch_dictionaryList');
	pulldown.find('#photoSearch_dictionary').click(function()
	{
		$(this).find('dl').addClass(current);
		dTarget.show();
	})
	.mouseleave(function()
	{
		$(this).find('dl').removeClass(current);
		dTarget.hide();
	});
}
//-----------------------------------------------------------------
,
pageHtml:function(){
//	var mobilemenu = $('#menuHtmlMobile');
//	$('#headerHtml').load('/common/include/header01.html');
	$('#footerHtml').load('/common/include/footer03.html');
//	$('#menuHtmlPC').load('/common/include/headerMenu01.html');
//	if(mobilemenu){
//		mobilemenu.load('/common/include/header01_mobile.html',function(){
//		$.EX.mobileMenu();
//		});
//	}
}
//-----------------------------------------------------------------
,
mobileMenu: function()
{
	//mobile menu
	var target = $('#menu');
	var trigger = $('header').find('.menuBtn, .close').find('a');
	var subMenu = target.find('.subMenu');
	var menuPos = 40;
	var menuFlag = false;
	target.fadeOut(0);

	// change fotopusMQ if...
	// モーバイルメニューを出すのが 800px
	// 出なくなった時に変えてください。
	var menuTimer = false,
			fotopusMQ = 800;

	trigger.click(function()
	{/* menu */
		var posH = 0;
		if(menuFlag)
		{
			posH = menuPos;
		}
		target.stop(true, false).animate(
		{
			 opacity: 'toggle'
			,top : posH
		}
		,{
			 duration: 400
			,complete: function()
			{
				menuFlag = !menuFlag;
			}
		});
	});

	subMenu.click(function(e)
	{/* sub menu */
		e.preventDefault();
		$(this).toggleClass('subClose').next().slideToggle('fast', 'swing');
	});

	// 2016/05/26 added
	// 修正：メニューが開いたまま
	// ブラウザーウィンドウを大きくした時に
	// メニューがでてしまう
	$(window).bind('resize orientationchange', function() {
		var newWindowWidth = window.innerWidth;

    if ( menuTimer !== false) {
      clearTimeout(menuTimer);
    }
    menuTimer = setTimeout(function() {
    	if ( newWindowWidth > fotopusMQ && menuFlag == true ) {
    		target.css({
    			'display': 'none',
    			'top': menuPos
    		});
    		menuFlag = false;
    	}
    }, 20);

  });

}
//-----------------------------------------------------------------
,
visualSlider: function(slide)
{
	//visualSlider
	//var dom = $('#sliderContainer');
	var targetParent = slide;
	targetParent.after('<ul id="sliderNav"><li><a href="#item0" class="current"></a></li></ul>');
	var triggerParent = $('#sliderNav');
	var target = targetParent.find('li');
	var sizeObj = target.find('a.bnr_01').find('img');//スライドのサイズを計る基準画像
	var photo = target.eq(0);
	var firstImg = photo.find('img');
	var banner = target.not(':first');
	var current = 'current';
	var zIndex = 1000;
	var posH = 0;//1枚目の巨大画像の縦位置
	var now = -1;
	var next = 0;
	var moveDuration = 4000;
	var moveDurationDef = moveDuration;
	var queue = true;
	var loadFlag = false;
	var playFlag = true;
	var loadTimer;

	//var timer;

	//指定日にスライドの表示非表示
	var today = new Date(); //今の日時
	//var startDay;//開始日時
	//var endDay;//終了日時
	var defTime = ' 00:00:00';
	function banHide($this)
	{
		$this.addClass('empty').hide();
		banner = banner.not($this)
	}

	banner.each(function(i)
	{
		var $this = $(this);
		if($this.attr('class'))
		{
			var a = $this.attr('class').split('-');
			if(a[0]=='start')
			{
				//var startDay = new Date(a[1]+'/'+a[2]+'/'+a[3]+defTime);//'2013/1/1 00:00:00'
				if(today < new Date(a[1]+'/'+a[2]+'/'+a[3]+defTime)) banHide($this);
			}
			else
			{
				//endDay = new Date(a[1]+'/'+a[2]+'/'+a[3]+defTime);//'2013/1/1 00:00:00'
				if(today > new Date(a[1]+'/'+a[2]+'/'+a[3]+defTime)) banHide($this);
			}
			//期間内であれば表示
//			if(today < startDay || today > endDay)
//			{//表示
//				//console.log('表示');
//				$this.addClass('empty').hide();
//				banner = banner.not($this)
//			}
		}
	});
	target = targetParent.find('li:not(.empty)');
	var maxNum = target.length;
	var bannerNum = banner.length;

	target.css({opacity: 0});
	maxNum--;

	//配列をシャッフル
	var int_a = [];
	var int_b = [];
	//0～maxの数字を全部配列に入れる
	for (var i=0; i<= bannerNum; i++)
	{
		int_a[i] = i;
	}
	var j = 0;
	var a_length = int_a.length;
	while (a_length)
	{
		var int_r = Math.floor(Math.random()*(bannerNum-j));
		//乱発生した整数を配列int_bに順番に入れ、int_aから削除する
		int_b[j] = int_a.splice(int_r, 1);
		j++;
		//配列int_a内の数字が一つずつ減っていく
		a_length = int_a.length;
	}
	//ここで配列int_bがシャッフルされた
	//int_bの頭から必要な分を取り出す
	targetParent.append(photo);

	for (var k = 0; k <bannerNum; k++)
	{
		var id = 'item'+ Number(k+1);
		var dom = banner.eq(int_b[k]).attr('id', id);
		targetParent.append(dom);
		triggerParent.append('<li><a href="#'+id+'"></a></li>');
	}
	//変数に入れ直す
	target = targetParent.find('li:not(.empty)');

	//var targetRatio = 1.2;


	//SAKUHIN.xmlの読み込み
	//$.ajax({type:'GET', dataType:'html', url:'/top/SAKUHIN.xml'
	$.ajax({type:'GET', dataType:'html', url:'/ranking/Hd/SAKUHIN_gold00.xml'
		,success:function(xml)
		{
			var dom = $(xml).find('img:first');
			firstImg.attr('src', dom.attr('url'));
			firstImg.attr('alt', dom.attr('ti'));
			firstImg.parent().attr('href', dom.attr('link'));
			firstImg.load(function()
			{
				//$this = $(this);
				//firstImg[0].ratio = $this.height() / $this.width();
				loadFlag = true;
			});
		}
	});

	var trigger = triggerParent.find('a');
	trigger.click(function(e)
	{
		e.preventDefault();
		clearTimeout(timer);
		now = Number(this.hash.replace('#item', '') - 1);
		nextItem()
		//timer_set(1);
	});

	function nextItem()
	{
		++zIndex;
		if(now==maxNum) now = -1;
		next = now+1;
		if(now<0)
		{
			posH = -firstImg[0].defPosH;
			if($.EX.mobileFlag) moveDuration = 7000;
			else  moveDuration = 14000;
			queue = false;
		}
		else
		{
			posH = 0;
			moveDuration = moveDurationDef;
			queue = true;
		}
		timer = setTimeout(nextItem, moveDuration);

		trigger.removeClass(current).eq(next).addClass(current);
		target.stop(true, false).eq(next).css({opacity: 0, 'z-index': zIndex}).animate(
		{
			opacity: 1
		}
		,{
			 duration: 1000
			,queue: queue
		})
		.css({top: posH}).animate(
		{
			 top: 0
		}
		,{
			 duration: moveDuration
			,easing: 'linear'
//				,complete: function()
//				{
//					now = next;
//					if(playFlag) nextItem();
//				}
		});
		now = next;
	}
	target.not(':first').hover(function(e)
	{
		clearTimeout(timer);
	}
	,
	function(e)
	{
		timer = setTimeout(nextItem, 800);
	});


	//function timer_set(time) { timer = setTimeout(nextItem, time); }
	var $window = $(window);
	//$(window).bind('load',function() { timer_set(0); });
	function reSize()
	{
//		var w = sizeObj.width() * 3;
		var h = firstImg.height();
		var targetH = sizeObj.height();
		targetParent.height(targetH);

//		if(firstImg[0].ratio>targetRatio)
//		{
//			firstImg.width(w*0.6);
//			firstImg.height(w*targetRatio*0.6);
//			h = firstImg.height();
//		}
		firstImg[0].defPosH = h - targetH;
	}
	function loaded()
	{
		clearTimeout(loadTimer);
		if(loadFlag)
		{
			target.find('img').show();//.css('display','inline');
			reSize();
			nextItem();
		}
		else
		{
			loadTimer = setTimeout(loaded, 500);
		}
	};
	$window.bind('load', function(){ loadTimer = setTimeout(loaded, 500); });
	$window.bind('resize orientationchange', function(){ reSize(); });
}
//-----------------------------------------------------------------
,
topCont: function()
{
	//タブ切り替え
	var $tab = $('#tabs');
	var cName = 'toptab';
	var cookie = $.cookie(cName);
	if(cookie!=null)
	{//クッキーでタブ表示を記録
		$tab.tabs({selected: cookie });
	}
	else
	{
		$tab.tabs();
	}
	$tab.find('>ul').find('li').each(function(i)
	{
		$(this).click(function()
		{
			$.cookie(cName, i, {path: "/"});
		});
	})

	// Hover states on the static widgets
	$( "#dialog-link, #icons li" ).hover(
		function() {
			$( this ).addClass( "ui-state-hover" );
		},
		function() {
			$( this ).removeClass( "ui-state-hover" );
		}
	);

	//ジャンルサブ
	$('.genreSub').click(function(){
		$('.genre').slideToggle('slow', 'swing');
		$('.genreSub').toggleClass('genreSubClose');
	});
	$('.genreClose').click(function(){
		$('.genre').slideUp("slow");
		$('.genreSub').removeClass("genreSubClose");
	});

	//scroll pane
	var scroll = $('#info');
	if(scroll.get(0)){
	$('#info').find('.scroll_area').jScrollPane({autoReinitialise: true});
	}


}
//-----------------------------------------------------------------
};
//---------------------------------------------------------------------
})(jQuery);



//insert gtm tag 2018.2.8
//******************************************************************************
(function(){
  var script = document.createElement('script');
  script.src = '/shr/js/gtm.js';
  document.body.appendChild(script);
})();




// フッター　自動で年を変える
//******************************************************************************
copyrightYear();
function copyrightYear() {
	var thisDate = new Date();
	var thisYear = thisDate.getFullYear();
	var replaceText = $('#copyright, footer address');
	replaceText.text(function(i, txt) {return txt.replace(/\d+/, thisYear)});
}