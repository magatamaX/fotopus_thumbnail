(function($) {

  $.fn.arrangeImage = function(options, callback) {
    var el = $(this);
    el.addClass('arrange');

    var ops = $.extend({
      imageNum: 4,
      imageNumTablet: 3,
      area: 1140,
      marginRight: 3,
      marginBottom: -4,
      minWidth: 78,
      maxHeight: 600,
      parentContainer: 'arrange-contents',
      itemName: 'arrange-item',
      rowName: 'arrange-row',
      window: 'no change',
      reset: false,
      loaderName: 'loader',
      loader: '<div class="loader"><div class="loading"></div></div>'
    }, options);

    function imageAspect(el) {

      var element = $(el),
          // この画像が埋まるコンテントの幅をとります。
          contentWidth = element.width(),
          imageNum;

      // タブレットの時はデスクトップとは違う枚数
      if ( _ua.Tablet === true ) {
        imageNum = ops.imageNumTablet;
        ops.marginRight = 10;
        ops.marginBottom = 0;
      }
      else {
        imageNum = ops.imageNum;
      }


      // 画像を設定した値に合わせて行にいれます。
      var items = element.children('.' + ops.itemName);

      // もし画像にペアレントエレメントがない場合
      if ( element.children('.' + ops.itemName).length === 0 ) {
        items = element.children('img');
      }

      // 画像が何枚か判定
      if ( items.length === 0 ) {
        return false;
      }
      else if ( items.length <= 2 ) {
        element.append(ops.loader);
        element.attr('data-item-count', items.length);
      }
      else {
        $('.' + ops.parentContainer).append(ops.loader);
        element.css({'opacity': 0, 'height': 0});
        element.append(ops.loader);
      }

      // 行にアイテムを振り分けて行きます
      var itemsNum = items.length,
          itemsWrapper = '<div class="' + ops.rowName + '"></div>';

      // 偶数の場合
      if ( imageNum % 2 === 0 ) {
        // 写真が1枚残る場合
        if ( itemsNum % imageNum === 1 ) {
          for ( var i = 0; i < (itemsNum - imageNum * 2 + 1); i += imageNum ) {
              items.slice(i, i + imageNum).wrapAll(itemsWrapper);
          }
          items.slice((itemsNum - imageNum - 1), itemsNum).wrapAll(itemsWrapper);
        }
        // 写真が2枚残る場合
        else if ( itemsNum % imageNum === 2 ) {
          for ( var p = 0; p < (itemsNum - imageNum * 2 + 2); p += imageNum ) {
              items.slice(p, p + imageNum).wrapAll(itemsWrapper);
          }
          items.slice((itemsNum - imageNum - 2), itemsNum).wrapAll(itemsWrapper);
        }
        else {
          for ( var o = 0; o < itemsNum; o += imageNum ) {
            items.slice(o, o + imageNum).wrapAll(itemsWrapper);
          }
        }
      }
      // 奇数の場合
      else {
        // 写真が1枚残る場合
        if ( itemsNum % imageNum === 1 ) {
          for ( var j = 0; j < (itemsNum - (imageNum + 1)); j += imageNum ) {
            items.slice(j, j + imageNum).wrapAll(itemsWrapper);
          }
          items.slice((itemsNum - (imageNum + 1)), itemsNum).wrapAll(itemsWrapper);
        }
        // 写真が2枚残る場合
        else if ( itemsNum % imageNum === 2 ) {
          for ( var h = 0; h < (itemsNum - (imageNum + 2)); h += imageNum ) {
            items.slice(h, h + imageNum).wrapAll(itemsWrapper);
          }
          items.slice((itemsNum - (imageNum + 2)), itemsNum).wrapAll(itemsWrapper);
        }
        // 写真が2枚以上残る場合
        else if ( itemsNum % imageNum !== 0 && itemsNum % imageNum !== 1 && itemsNum % imageNum !== 2 ) {
          for ( var k = 0; k < itemsNum; k += imageNum ) {
            items.slice(k, k + imageNum).wrapAll(itemsWrapper);
          }
        }
        else {
          for ( var l = 0; l < itemsNum; l += imageNum ) {
            items.slice(l, l + imageNum).wrapAll(itemsWrapper);
          }
        }
      }

    //   if ( element.find('a') ) {
    //     windowPopup(element.find('a'));
    //   }

      // 画像を .arrange-row のdivにいれます。
      var row = element.find('.' + ops.rowName),
          rows = _rows(row),
          rowDoneCount = 0;


      var applyAspectRatio = function(rowElement) {

        var thisRow = $(rowElement),
            childElement = thisRow.children();

        thisRow.css({opacity: 0, 'height': 0});
        // もしこのページにスクロールありの時は
        if ( thisRow.children('.' + ops.itemName).length !== childElement.length ) {
          // 画像/チャイルドエレメントを .arrange-item のdivにいれます。
          $.each(childElement, function() {
            $(this).wrap('<div class="' + ops.itemName + '"></div>');
          });
        }

        var thisImg = thisRow.find('img'),
            imageIndex = 0;

        //画像がロードチェック
        thisImg.one('load', function() {

          imageIndex += 1;

          // 画像の読み込みが終わったらアスペクト比スタート
          if ( imageIndex === thisImg.length && this.naturalHeight !== 0 ) {

            $.when(startRatio()).done(function() {

              rowDoneCount += 1;

            });

            if ( rowDoneCount === rows.length ) {

              element.find('.' + ops.loaderName ).remove();
              for ( var n = 0; n < rows.length; n++ ) {
                  rows[n].css({
                    opacity: 1,
                    'height': 'auto',
                    'margin-bottom': ops.marginBottom + 'px'
                  });

                  rows[n].children('.' + ops.itemName).css('opacity', '1');
              }
              element.animate({
                'opacity': 1
              }, 1000);
              element.css('height', 'auto');
              // アスペクト比完了後に次のfunctionを呼ぶ場合
              if ( callback ) {
                return callback();
              }
              else {
                return callback = null;
              }

            }

          }
        }).each(function() {
          if ( this.complete ) $(this).load();
        });

        // // 画像がロードチェック
        // thisImg.on('load', function() {
        //
        //   imageIndex += 1;
        //
        //   if ( this.naturalHeight === 0) {
        //     this.trigger('load');
        //   }
        //   // 画像の読み込みが終わったらアスペクト比スタート
        //   if ( imageIndex === thisImg.length && this.naturalHeight !== 0 ) {
        //
        //     $.when(startRatio()).done(function() {
        //
        //       rowDoneCount += 1;
        //
        //     });
        //
        //     if ( rowDoneCount === rows.length ) {
        //
        //       element.css({'opacity': 0}).find('.' + ops.loaderName ).remove();
        //       for ( var n = 0; n < rows.length; n++ ) {
        //           rows[n].css({
        //             opacity: 1,
        //             'height': 'auto',
        //             'margin-bottom': ops.marginBottom + 'px'
        //           });
        //       }
        //       element.animate({
        //         'opacity': 1
        //       }, 1000);
        //       // アスペクト比完了後に次のfunctionを呼ぶ場合
        //       if ( callback ) {
        //         return callback();
        //       }
        //       else {
        //         return callback = null;
        //       }
        //
        //     }
        //
        //   }
        // });



        // アスペクト比スタート
        function startRatio(fillerWidth) {

          var maxHeight = 0,
              imagesWidth = 0,
              imageRatio = 0,
              totalImgWidth = 0;

          // 行ごとに画像の一番高い値を探します。
          thisRow.find('img').each(function() {
            var thisHeight = $(this).height();
            if ( thisHeight > maxHeight ) {
              maxHeight = thisHeight;
            }

            return maxHeight;
          });

          // 画像に一番高い画像の値をつけます
          thisImg.height(maxHeight);

          // 行に入っている画像をあわせた幅をとる
          $.each(thisImg, function() {
            imagesWidth += $(this).width();
          });

          // margin をいれた縦横のアスペクト比
          var marginValue = ops.marginRight,
              imgLength = thisImg.length,
              marginRatio = (marginValue / ops.area),
              addedWidth = marginRatio * imgLength, // ロジックとしては(imgLength - 1)ですが。。。
              newContentWidth = contentWidth + (contentWidth * addedWidth),
              marginVP = marginRatio * 100,
              itemCount = element.data('item-count');

          if ( _oldBrowser.ie8 === true ) {
            marginVP *= 0.7;
          }

          var imageWidthRatio = newContentWidth / contentWidth;

          imagesWidth *= imageWidthRatio;
          // maxHeight *= imageWidthRatio;

          imageRatio = contentWidth / imagesWidth;
          // 行ごとの画像を合わせたアスペクト比
          var newMaxHeight = maxHeight * imageRatio;

          // 1枚/2枚だけの場合
          if ( itemCount ) {
            newMaxHeight = newMaxHeight * ( itemCount / 3 );
          }

          if ( newMaxHeight > ops.maxHeight ) {
            newMaxHeight = 600;
          }

          // コンテントの幅に画像のアスペクト比と margin ぶんを
          // かけて高さの値を出します。
          // 最後に画像に決まった高さを指定。
          thisImg.height(newMaxHeight);

          $.each(thisImg, function(i) {
            var imgW = (this.clientWidth / contentWidth) * 100;
            // $(this).width(this.clientWidth)
            //   .animate({
            //     opacity: 1
            //   });
            // $(this).parents('.' + ops.itemName)
            //   .height(this.clientHeight)
            //   .width(this.clientWidth);
            $(this).parents('.' + ops.itemName).css({
              width: imgW + '%',
              height: 'auto',
              'margin-right': marginVP + '%',
              'background-color': '#eeeeee'
            });

            totalImgWidth += imgW;

            $(this).css({width: '100%', height: 'auto', opacity: 1});

            // 横幅が78px以内のものにクラスをつける
            if ( $(this).width() <= ops.minWidth ) {
              $(this).parents('.' + ops.itemName).addClass(ops.itemName + '-no-photo-info');
            }

            // last-child エレメントにクラスをつける
            if ( i === thisImg.length - 1 ) {
              $(this).parents('.' + ops.itemName).addClass(ops.itemName + '-last').css('margin-right', 0);
            }
            else {
              $(this).parents('.' + ops.itemName).removeClass(ops.itemName + '-last');
            }

          });


          if ( totalImgWidth < 98 ) {
            fillerWidth = 100 - totalImgWidth - marginVP;
          }
          else {
            fillerWidth = null;
          }

          // rowIndex = thisRow.index();

          return fillerWidth;
        } // startRatio

      }; // applyAspectRatio


      // アスペクト比実行
      $.each(rows, function() {
        applyAspectRatio(this);
      });

    } // imageAspect

    /* ------------------------------------------------- */

    // imageAspect 実行
    // モーバイル時のは無し
    if ( _ua.Mobile === true ) {
      $.each(el, function() {

        var thisMobileContent = $(this),
            imgMobile = thisMobileContent.find('img'),
            imgMobileNumber = imgMobile.length,
            imgMobileCount = 0;

        thisMobileContent.addClass('mobile-layout');

        if ( imgMobile.length !== 0 ) {
          imgMobile.css({'background-color': '#eeeeee'});
          $('.' + ops.loaderName).remove();
          $('.' + ops.itemName).css({
              'width': 'auto',
              'height': 'auto',
              'opacity': '1'
          });
        }

        imgMobile.on('load', function() {
          imgMobileCount += 1;
          if ( this.naturalHeight  === 0 ) {
            this.trigger('load');
          }
          if ( imgMobileCount === imgMobileNumber ) {
            thisMobileContent.find('.' + ops.loaderName).remove();
            // アスペクト比完了後に次のfunctionを呼ぶ場合
            if ( callback ) {
                return callback();
            }
            else {
              return callback = null;
            }
          }
        });


      });
      // return false;
    }
    else {
      $.each(el, function() {
        imageAspect(this);
      });
    }

    // ウィンドウ resize
    $(window).on('resize orientationchange', function() {
      if ( $(window).innerWidth() <= 420 ) {
        $.each(el, function() {
          $(this).addClass('below-breakpoint');
        });
      }
      else {
        $.each(el, function() {
          $(this).removeClass('below-breakpoint');
        });
      }

    });

    /* ------------------------------------------------- */
  } // $.fn.arrangeImage


  // エレメントを array に入れる function
  function _rows(elements) {
    var $elements = $(elements),
        rows = [];

    $elements.each(function() {
      var $this = $(this);

      rows.push($this);
    });
    return rows;
  }

  // 別ウィンドウ
  // var sameWindow;
  // var windowPopup = function(targetLink) {
  //   $(targetLink).on('click', function() {
  //     if( (sameWindow) && (!sameWindow.closed) ){   //サブウインドウが開かれているか？
  //       sameWindow.close();                     //サブウインドウを閉じる
  //     }
  //     sameWindow = window.open(this.href, 'sameWindow');
  //     sameWindow.blur();
  //     window.focus();
  //     window.blur();
  //     sameWindow.focus();
  //     return false;
  //   });
  // };


})(jQuery);

// User agent 判定
var _ua = (function(u){
  return {
    Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) || u.indexOf("ipad") != -1 || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1) || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1) || u.indexOf("kindle") != -1 || u.indexOf("silk") != -1 || u.indexOf("playbook") != -1,
    Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1) || u.indexOf("iphone") != -1 || u.indexOf("ipod") != -1 || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1) || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1) || u.indexOf("blackberry") != -1
  }
})(window.navigator.userAgent.toLowerCase());

// ie8 判定
var _oldBrowser = (function() {
  return {
    ie8:$('html').hasClass('lt-ie9')
  }
})();

function triggerArrangeImage () {
    $('#imgLists').arrangeImage({
        imageNum: 4,
        marginBottom: 0,
    }); 
}