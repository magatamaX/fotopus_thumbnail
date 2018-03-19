import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

// SuperAgentの利用を宣言
import request from 'superagent';

// Path
const path = require('path');


// サムネイルコンポーネント
class Gallery extends React.Component {

  constructor(props) {
    super(props);
    // ステート初期化
    this.state = {
      items: null,
      length: 0,
      currentPage: 0,
      itemsPerPage: 0,
      totalPages: 0,
      itemWidth: 0,
      itemHeight: 0,
      topPartsWidth: null,
      topPartsHeight: null,
      screenMode: null,
    }
  }

  getWindowSize() {
    var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          w = e.clientWidth || g.clientWidth || w.innerWidth,
          h = e.clientHeight|| g.clientHeight || w.innerHeight;

    return {
      width: w,
      height: h
    }
  }


  // マウントされるとき
  componentWillMount () {

    // windowSize取得
    window.addEventListener('load', () => {
      var size = this.getWindowSize()
      // console.log('your viewport size', size)
      this.onResize( size )
    }, false )
    window.addEventListener('resize', () => {
      var size = this.getWindowSize()
      // console.log('your viewport size', size)
      this.onResize( size )
    }, false )


    const jsonPath = path.resolve(__dirname, 'test.json')

    // JSONデータ読み込み
    request.get(jsonPath)
      .accept('application/json')
      .end( ( err, res ) => {
        this.loadedJSON( err, res )
      })
  }

  // データを読み込んだとき
  loadedJSON ( err, res ) {
    if ( err ) {
      console.log('データ読み込みに失敗しました。')
      return
    }

    // ステート更新
    this.setState({
      items: [res.body],
      length: res.body.img.length,
    })

  }

  onPageChange( p ) {
    // console.log( index );
    this.setState({
      currentPage: p,
    })
  }

  onResize ( size ) {

    const largePC = 'largePC'
    const mediumPC = 'mediumPC'
    const SP = 'SP'

    if( size.width >= 920 ){

      if ( this.state.screenMode !== largePC ){
        this.setState({
          currentPage: 0,
          screenMode: largePC,
        })
      }

      this.setState({
        itemsPerPage: 7,
        totalPages: Math.floor( (this.state.length-1) / 8 ),
        itemWidth: (920 / 4) + 'px',
        itemHeight: (920 / 4) + 'px',
      })

    } else if ( size.width >= 600 && size.width < 920 ) {

      if ( this.state.screenMode !== mediumPC ){
        this.setState({
          currentPage: 0,
          screenMode: mediumPC,
        })
      }

      this.setState({
        itemsPerPage: 7,
        totalPages: Math.floor( (this.state.length-1) / 8 ),
        itemWidth: (size.width / 4) + 'px',
        itemHeight: (size.width / 4) + 'px',
      })

    } else if ( size.width < 600 ) {

      if ( this.state.screenMode !== SP ){
        this.setState({
          currentPage: 0,
          screenMode: SP,
        })
      }

      this.setState({
        itemsPerPage: 3,
        totalPages: Math.floor( (this.state.length-1) / 4 ),
        itemWidth: (size.width / 2) + 'px',
        itemHeight: (size.width / 2) + 'px',
      })

    }

  }

  // 描画処理
  render () {

    if ( !this.state.items ) {
      return <div className='App'>Now Loading...</div>
    }

    // 写真サムネイル
    const photoList = this.state.items.map( ( e, index ) => {

      if ( e.result === 'NG') {

        const errStyle = {
          "letter-spacing": 'normal'
        }

        return <li className="NG" key='result_NG'>
          <p style={errStyle} key='err_msg'>{e.err_msg}</p>
          <p key='err_cd'>{e.err_cd}</p>
        </li>

      } else {

        // ページ分割用Array作成
        const items_list = e.img
        const new_items_list = []

        const b = items_list.length
        const cnt = this.state.itemsPerPage + 1

        for ( let i=0; i < Math.ceil( b / cnt ); i++) {
          let j = i * cnt
          let p = items_list.slice(j, j+cnt)
          new_items_list.push(p)
        }

        // console.log(new_items_list)

        const imgList = new_items_list[this.state.currentPage].map( ( images, index ) => {

          const styleLI = {
            "overflow": 'hidden',
            "width": this.state.itemWidth,
            "height": this.state.itemHeight,
            "margin": 0,
            "boxSizing": 'border-box',
            "padding": '0.5%',
            "display": 'block',
            "float": 'left',
          }
          const styleA = {
            "display": 'block',
            "width": '100%',
            "height": '100%',
          }

          return <li style={styleLI} key={images.nickname} className="thumb" data-index={index} data-seq={images.seq}>
            <a href={images.pageurl} style={styleA} target="_blank">
              <div style={
                {
                  "backgroundImage": 'url('+images.thumblarge+')',
                  "backgroundRepeat": 'no-repeat',
                  "backgroundSize": 'cover',
                  "backgroundPosition": 'center center',
                  "width": '100%',
                  "height": '100%',
                }
              }></div>
            </a>
          </li>
        })

        return imgList
      }
    })

    // ページャー（数字部分）
    const pagination = this.state.items.map( e => {

      if ( e.result === 'NG') {

        return

      } else {

        // ページ数カウンタ
        const page_list_count = parseInt( this.state.totalPages )

        // ページリスト作成
        let list_count = 0;
        let list_row = [];

        for ( let i=0; i <= page_list_count; i++ ) {

          list_row[list_count] = i;
          list_count++;

        }

        // console.log(list_row)

        // 表示ページ抽出
        let new_list_row = []

        if ( list_row.length > 6 ){

          if ( this.state.currentPage <= list_row[2] ){
            new_list_row = list_row.slice(0,6)
          } else if ( this.state.currentPage > list_row[2] && this.state.currentPage < list_row[list_row.length-3] ) {
            new_list_row = list_row.slice(this.state.currentPage-2,this.state.currentPage+4)
          } else if ( this.state.currentPage >= list_row[list_row.length-3]) {
            new_list_row = list_row.slice(-6)
          }

        } else {
          new_list_row = list_row
        }
        // console.log(new_list_row)

        const hrefList = new_list_row.map( ( page, index ) => {

          // console.log(page,index)
          let isCurrent = {};
          let isDisabled = '';

          if ( page == this.state.currentPage ){
            isCurrent = {
                "fontWeight": 'bold',
                "color": '#000',
                "borderColor": '#fff'
            };
            isDisabled = 'disabled'
            // console.log(page)
          }

          return <a key={page} disabled={isDisabled} style={isCurrent} name={page} index={index} href='javascript:void(0)' onClick={ e => this.onPageChange( page ) }>{page+1}</a>
        })

        return <p>
          {(() => {
            if ( this.state.currentPage != 0 ){
              return <a href='javascript:void(0)' onClick={ e => this.onPageChange ( this.state.currentPage-1 ) }>前へ</a>
            }
          })()}
          {(() => {
            return hrefList
          })()}
          {(() => {
            if ( this.state.currentPage != ( this.state.totalPages ) ){
              return <a href='javascript:void(0)' onClick={ e => this.onPageChange ( this.state.currentPage+1 ) }>次へ</a>
            }
          })()}
          </p>
        }

    })

    return (
      <div key='galleryLists'>
        <div key='galleryPager' className="gallery_pager clearfix">{pagination}</div>
        <ul key='galleryImageList' className='galleryTop_photoList clearfix'>{photoList}</ul>
        <div key='galleryPagerBottom' className="gallery_pagerBottom">{pagination}</div>
      </div>
    )

  }

}

ReactDOM.render(
  <Gallery />,
  document.getElementById('gallery')
);
