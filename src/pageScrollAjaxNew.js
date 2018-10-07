import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

// SuperAgentの利用を宣言
import request from 'superagent';

// path
const path = require('path');

// 最初に呼び出す枚数
const init_set_num = 100;
// 以降の呼び出し枚数
const more_set_num = 50;

// JSONパス設定
const initJsonPath = path.resolve(__dirname, 'api/photos/new/start/0/limit/' + init_set_num + '/');


// サムネイルコンポーネント
class ImageList extends React.Component {

  constructor(props) {
    super(props);
    // ステート初期化
    this.state = {
      // init
      init_result: '',
      init_err_cd: '',
      init_err_msg: '',
      init_img: [],
      init_length: 0,
      init_load: false,
      init_load_count: 0,

      // more
      more_result: '',
      more_err_cd: '',
      more_err_msg: '',
      more_img: [],
      more_load: false,
      more_load_count: 0,

      more_first_num: init_set_num,

      moreCount: 0,
      moreButton: true,
    }

    console.log(props)
  }

  // マウントされるとき
  componentWillMount () {

    // JSONデータ読み込み
    request.get(initJsonPath)
      .accept('application/json')
      .end( ( err, res ) => {
        this.loadedJSON( err, res, 'init' )
      })
  }

  // 追加リクエストのとき
  moreLoadRequest (num) {

    const morePath = path.resolve(__dirname, 'api/photos/new/start/'+ num +'/limit/' + more_set_num + '/');
    console.log(morePath);

    request.get(morePath)
    .accept('application/json')
    .end( ( err, res ) => {
      this.loadedJSON( err, res, 'more' )
      this.setState({
        more_first_num: num + more_set_num,
      })
    })    
  }

  // データを読み込んだとき
  loadedJSON ( err, res, type ) {
    if ( err ) {
      console.log('データ読み込みに失敗しました。')
      return
    }

    console.log(res.body);

    if ( type === 'init' ) {
      // ステート更新
      this.setState({
          init_result: res.body.result,
          init_err_cd: res.body.err_cd,
          init_err_msg: res.body.err_msg,
          init_img: res.body.img,
          init_length: res.body.img.length,
          
          init_load: true,
      })
    } else if ( type === 'more' ) {
        this.setState({
          more_result: res.body.result,
          more_err_cd: res.body.err_cd,
          more_err_msg: res.body.err_msg,
          more_img: res.body.img,
          more_length: res.body.img.length,
          
          more_load: true,
          more_load_count: this.state.more_load_count + 1,
      })    
    }


    console.log(this.state);
    // windowSize取得後デバイス判定の上、最大表示数を決定
    
  }


  onImageLoad(count) {

    this.setState({
      init_load_count: count + 1,
    })

    if ( count + 1 == this.state.init_length ) {
      console.log('すべてロードされました。')
      // this.setState({
      //   init_load: true,
      // })
    }

  }

  componentDidUpdate ( prevProps, prevState ) {
    if ( prevState.init_load === false && this.state.init_load === true ) {
      console.log('all loaded!')
      this.props.loadFunc();
    }

    // if ( prevState.more_load_count !== this.state.more_load_count ) {
    //   console.log('all loaded!')
    //   this.props.loadFunc();
    // }
  }

  onClickMoreButton ( count ) {
    console.log(count)
    this.setState({
      moreCount: count + 1,
      // moreButton: !this.state.moreButton,
    })
    this.moreLoadRequest(this.state.more_first_num)
  }

  // 描画処理
  render () {

    if ( !this.state.init_img ) {
      return <div className='App'>Now Loading...</div>
    }

    const arrangeItem = this.state.init_img.map( ( item, index ) => {

      return (
        <div key={item.cd} className={`arrange-item`}>
          <a href={item.pageurl}>
            <img onLoad={e => this.onImageLoad(this.state.init_load_count)} src={item.thumbnail} alt={item.img_alt} />
          </a>
        </div>
      )
           
    })

    const moreItem = this.state.more_img.map( ( item, index ) => {

      return (
        <div key={item.cd} className={`arrange-item`}>
          <a href={item.pageurl}>
            <img src={item.thumbnail} alt={item.img_alt} />
          </a>
        </div>
      )
           
    })

    return (
      <div>
        <div className="arrange-contents">
          <div id="imgLists">
            {arrangeItem}
            {moreItem}
          </div>
        </div>
        <div className="moreButton section-inner type_03 text_01">
          { (this.state.moreButton) ? (
            <p>
              <a href="javascript:void(0)" className="button" onClick={e => this.onClickMoreButton(this.state.moreCount)}>もっとみる（？？枚）</a>
            </p>
          ):(
            ''
          )}
        </div>
      </div>
    )

  }

}

ReactDOM.render(
  <ImageList loadFunc={()=>{triggerArrangeImage()}} />,
  document.getElementById('js-pageScrollAjax')
);
