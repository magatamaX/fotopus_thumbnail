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
    })
    window.addEventListener('resize', () => {
      var size = this.getWindowSize()
      // console.log('your viewport size', size)
      this.onResize( size )
    })


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

    // console.log(this.state.items)

    this.setImageSize();
  }


  setImageSize () {

    const tgt = this.state.items[0].img

      var img = [], width, height, ratio
    for ( let i=0; i<tgt.length; i++) {


          img[i] = new Image()
          img[i].src = tgt[i].thumblarge
          img[i].width = img[i].width;  // 幅
          img[i].height = img[i].height; // 高さ

          if ( ( img[i].width / img[i].height ) > 1 ) {
            //横長Landscape
            tgt[i].orientation = 'ls'
          } else if ( ( img[i].width / img[i].height ) <= 1 ) {
            //縦長Portrait
            tgt[i].orientation = 'pr'
          }

    }

  }

  onPageChange( index ) {
    // console.log( index );
    this.setState({
      currentPage: index,
    })
  }

  onResize ( size ) {

    if( size.width >= 920 ){
      this.setState({
        itemsPerPage: 7,
        totalPages: Math.ceil( this.state.length / 8 ),
        itemWidth: (920 / 4) + 'px',
        itemHeight: (920 / 4) + 'px',
      })
    } else if ( size.width >= 600 && size.width < 920 ){
      this.setState({
        itemsPerPage: 7,
        totalPages: Math.ceil( this.state.length / 8 ),
        itemWidth: (size.width / 4) + 'px',
        itemHeight: (size.width / 4) + 'px',
      })
    } else if ( size.width < 600 ) {
      this.setState({
        itemsPerPage: 3,
        totalPages: Math.ceil( this.state.length / 4 ),
        itemWidth: (size.width / 2) + 'px',
        itemHeight: (size.width / 2) + 'px',
      })
    }

  }


  render () {

    if ( !this.state.items ) {
      return <div className='App'>
        現在読み込み中</div>
    }

    const photoList = this.state.items.map( ( e, index ) => {

      if ( e.result === 'NG') {

        return <div className="NG" key='result_NG'>
          <p key='err_msg'>{e.err_msg}</p>
          <p key='err_cd'>{e.err_cd}</p>
        </div>

      } else {

        const items_list_count = this.state.itemsPerPage;
        // console.log(items_list_count);

        let items_count = 0;
        let page = 0;
        let items_list = [];
        let items_list_row = [];

        for ( let i=0; i <= this.state.length ; i++ ) {

          if( items_count > items_list_count ) {

            items_count = 0;
            items_list[page] = items_list_row;
            items_list_row = [];
            page++;

          }

          items_list_row[items_count] = e.img[i];
          items_count++;

        }

        const imgList = items_list[this.state.currentPage].map( ( images, index ) => {

          const style = {
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
            "overflow": 'hidden',
          }
          const styleLs = {
            "height": '100%',
            "width": 'auto',
            "maxWidth": 'none',
            "position": 'relative',
            "left": '50%',
            "top": '0',
            "WebkitTransform": 'translateX(-50%)',
            "MsTransform": 'translateX(-50%)',
            "transform": 'translateX(-50%)',
          }
          const stylePr = {
            "width": '100%',
            "height": 'auto',
            "maxHeight": 'none',
            "position": 'relative',
            "left": '0',
            "top": '50%',
            "WebkitTransform": 'translateY(-50%)',
            "MsTransform": 'translateY(-50%)',
            "transform": 'translateY(-50%)',
          }

          return <li style={style} key={images.nickname} className="thumb" data-index={index} data-seq={images.seq}>
            <a href={images.pageurl} style={styleA} target="_blank">
            {(() => {
              if ( images.orientation == 'ls' ){
                  return <img src={images.thumblarge} alt={images.title} style={styleLs} />
                } else {
                  return <img src={images.thumblarge} alt={images.title} style={stylePr} />
                }
              })()}
            </a>
          </li>
        })

        return imgList
      }
    })

    const pagination = this.state.items.map( e => {

      if ( e.result === 'NG') {

        return

      } else {

        const page_list_count  = parseInt(this.state.totalPages);

        let list_count = 0;
        let list_row = [];

        for ( let i=0; i < page_list_count; i++ ) {

          list_row[list_count] = i;
          list_count++;

        }

        // console.log(list_row)

        const hrefList = list_row.map( ( page, index ) => {

          let isCurrent = {};
          let isDisabled = '';

          if ( index == this.state.currentPage ){
            isCurrent = {
                "fontWeight": 'bold',
                "color": '#000',
                "borderColor": '#fff'
            };
            isDisabled = 'disabled'
            // console.log(page)
          }

          return <a key={page} disabled={isDisabled} style={isCurrent} name={index} href='javascript:void(0)' onClick={ page => this.onPageChange( index ) }>{index+1}</a>
        })

        return hrefList

      }


    })

    return (
      <div key='galleryLists'>
        <p key='galleryPager' className="gallery_pager clearfix">{pagination}</p>
        <ul key='galleryImageList' className='galleryTop_photoList clearfix'>{photoList}</ul>
        <p key='galleryPagerBottom' className="gallery_pagerBottom">{pagination}</p>
      </div>
    )

  }

}

ReactDOM.render(
  <Gallery />,
  document.getElementById('gallery')
);
