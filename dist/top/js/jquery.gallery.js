/* ================================================================================
* Title: Jquery Function
* Date: March.30, 2016
* Macで作業するときの注意：バックスラッシュ\を入力するときはoptionを押しながらエンマーク
================================================================================ */
(function($)
{
//NailThumb
	var thumbBigContainer = $('.thumb');
	var $thumbSquare = $('ul.galleryTop_photoList');
	var $window = $(window);

	//img size check
	function sizeCheck(img, ww, wh)
	{
		var nw, nh, wph, hpw;
		//console.log(img+"L:"+ww+" H:"+wh);
		if (typeof img == 'undefined') {
			return false;
		}
		if (typeof img.naturalWidth != 'undefined')
		{
			//オリジナルサイズを取得
			nw = img.naturalWidth;
			nh = img.naturalHeight;
			wph = nw / nh;
			hpw = nh / nw;
		} else
		{
			//for IE8
			var i = new Image();
			i.src = img.src;
			nw = i.width;
			nh = i.height;
			wph = nw / nh;
			hpw = nh / nw;
		}
		var size = {};
		size.w = ww * wph;
		size.h = wh * hpw;
		//size.nw = nw;
		//size.nh = nh;
		return size;
	}//end size check

	function imgTrim($wap, $img)
	{

		var ww = $wap.width();
		$wap.css("height", ww);
		var wh = $wap.height();
		var size = sizeCheck($img[0], ww, wh);
		if (size == false) {
			return;
		}
		if (size.w < size.h)
		{
			//縦長portrait
			$img.css({
				"width": ww,
				"height": size.h,
				"margin-top": - ((size.h -wh) / 2),
				"max-width":"none"
			});
		} else if (size.w > size.h)
		{
			//横長paysage
			$img.css({
				"width": size.w,
				"height": wh,
				"margin-left": - ((size.w - ww) / 2),
				"max-width":"none"
			});
		}
	}//end imgTrim

	function thumbSquare()
	{
		var num = $thumbSquare.length;
		for (var i=0; i<num; i++)
		{
			var $this = $thumbSquare.eq(i)
			,$wap = $this.find('.thumb')
			,$img = $wap.find('img')
			,n = $wap.length;

			for (var j=0; j<n; j++)
			{
				var $i = $img.eq(j);
				$i.one('load',function()
				{
					imgTrim($wap.eq(j), $i);

				})
				.each(function()
				{
					if (this.complete || this.readyState == 'complete') $i.load();
				});
			}//end for
		}//end for
	}//end thumbSquare



  //check to see if thumbnail needs to be done...
  /*if ( thumbBigContainer.length ) {
	  thumbSquare();
	}*/
  $window.bind('load resize orientationchange', function() {
    if ( thumbBigContainer.length ) {
	  thumbSquare();
    }
  });

//---------------------------------------------------------------------
})(jQuery);