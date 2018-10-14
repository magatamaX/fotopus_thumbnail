import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

// SuperAgentの利用を宣言
import request from 'superagent';

// path
const path = require('path');

// サムネイルコンポーネント
class ImageList extends React.Component {

  constructor(props) {
    super(props);
    // ステート初期化
    this.state = {
      // init
      init_img: [],
      init_load: false,
      // more
      moreItems: [],
      more_load_count: 0,
      next_more_first_num: 0,
      moreButton: true,
      // messages
      message: '',
    }
    // スクロールで呼び出しフラグ
    this.handleScrollFlag = false;

    // 最初に呼び出す枚数
    this.init_set_num = props.initNum ? Number(props.initNum) : 100;
    // 追加分の呼び出し枚数
    this.more_set_num = props.moreNum ? Number(props.moreNum) : 50;
    // URLクエリがあれば設定
    this.query = props.query ? props.query : '';
    // 追加分を読込を発火する位置の範囲（下からの割合）
    this.scroll_range = props.scrollRange ? Number(props.scrollRange) : 0.3;
    // ロードしてからフラグ切替までのタイムラグ
    this.flagInterval = props.flagInterval ? Number(props.flagInterval) : 300;

  }

  // マウントされるとき
  componentWillMount () {

    // JSONパス
    const initJsonPath = path.resolve(__dirname, 'api/photos/new/start/0/limit/' + this.init_set_num + '/' + this.query);

    // JSONデータ読み込み
    request.get(initJsonPath)
      .accept('application/json')
      .end( ( err, res ) => {
        this.loadedJSON( err, res, 'init' );
        this.setState({
          next_more_first_num: this.init_set_num,
        })
      });
  }

  // 追加リクエストのとき
  moreLoadRequest (num) {

    const morePath = path.resolve(__dirname, 'api/photos/new/start/'+ num +'/limit/' + this.more_set_num + '/' + this.query);

    request.get(morePath)
    .accept('application/json')
    .end( ( err, res ) => {
      this.loadedJSON( err, res, 'more', num )
    })
  }

  // データを読み込んだとき
  loadedJSON ( err, res, type, num = 0 ) {
    if ( err ) {
      console.error('データ読み込みに失敗しました。' + err.message);
      return
    }

    // JSON NGもしくは写真が０のとき
    if ( res.body.result === "NG") {
      console.error('データを取得できませんでした。err_cd:' + res.body.err_cd + ', message:' + res.body.err_msg );
      return
    } else if (  res.body.img.length === 0 ) {
      this.setState({
        message: 'No Photo left.',
      })
      return
    }

    if ( type === 'init' ) {

      // ステート更新
      this.setState({
        init_img: res.body.img,
        init_load: true,
      });

    } else if ( type === 'more' ) {

      // ステート更新
      this.setState({
        next_more_first_num: num + this.more_set_num,
        moreItems: this.state.moreItems.concat(this.moreItem(this.state.more_load_count, res.body.img)),
        more_load_count: this.state.more_load_count + 1,
      });

    }
    
  }

  moreItem (id, res) {
    return (
      <div id={`moreImgList${id}`} key={id}>
        {res.map( ( item, index ) => {
          return (
            <div key={item.cd} className={`arrange-item`}>
              { item.photo_total > 1 ? (
                <span className="arrange-item-album-icon"></span>
              ): (
                ''
              )}
              <a href={item.pageurl}>
                <img src={item.thumbnail} alt={item.img_alt} />
                <div className="photo-info">
                  <p>{item.title}</p>
                  <br />
                  <p className="nickname">ニックネーム：{item.nickname}</p>
                </div>
              </a>
            </div>
          )
        })}
      </div>
    );   
  }


  componentDidUpdate ( prevProps, prevState ) {
    if ( prevState.init_load === false && this.state.init_load === true ) {
      this.props.loadFunc('#InitImgList');
    }

    if ( prevState.more_load_count !== this.state.more_load_count ) {

      const argument = `#moreImgList${prevState.more_load_count}`

      this.props.loadFunc(argument, ()=> {
        setTimeout(()=>{
          this.handleScrollFlag = false;
        }, this.flagInterval);
      });
      
    }

    if ( prevState.moreButton === true && this.state.moreButton === false ) {
      window.addEventListener('scroll', (e) => { this.handleScroll(e)}, false);
      window.addEventListener('resize', (e) => { this.handleScroll(e)}, false);
    }
  }

  onClickMoreButton ( ) {

    this.setState({
      moreButton: false,
    });

    this.moreLoadRequest(this.state.next_more_first_num);

  }

  handleScroll (e) {

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.body.clientHeight;
    const scrollPosition = scrollTop + window.innerHeight;

    if((scrollHeight - scrollPosition) / scrollHeight <= this.scroll_range ){
      if ( !this.handleScrollFlag ) {
        this.handleScrollFlag = true;
        this.moreLoadRequest(this.state.next_more_first_num)
      }
    }
  }

  // 描画処理
  render () {

    if ( this.state.init_img.length === 0 ) {
      return (
        <div className={`arrange-contents`}>
          <div className="loader"><div className="loading"></div></div>
        </div>
      )
    }

    const initItems = this.state.init_img.map( ( item, index ) => {

      return (
        <div key={item.cd} className={`arrange-item`}>
          { item.photo_total > 1 ? (
            <span className="arrange-item-album-icon"></span>
          ): (
            ''
          )}
          <a href={item.pageurl}>
            <img src={item.thumbnail} alt={item.img_alt} />
            <div className="photo-info">
              <p>{item.title}</p>
              <br />
              <p className="nickname">ニックネーム：{item.nickname}</p>
            </div>
          </a>
        </div>
      )
           
    })

    return (
      <div>
        <div className="arrange-contents">
          <div id="InitImgList">
            {initItems}
          </div>
          {this.state.moreItems}
        </div>
        <div className="moreButton section-inner type_03 text_01">
          { (this.state.moreButton) ? (
            <p>
              <a href="javascript:void(0)" className="button" onClick={e => this.onClickMoreButton()} style={{minWidth: `200px`}}>もっと見る</a>
            </p>
          ):(
            ''
          )}
        </div>
      </div>
    )

  }

}

const targetElement = document.getElementById('js-pageScrollAjax');
if ( targetElement ) {
  let dataset;
  if ( targetElement.dataset ) dataset = JSON.parse(JSON.stringify(targetElement.dataset));
  ReactDOM.render(
    <ImageList
      loadFunc={
        ( target, callback = () => {} )=>{
          triggerArrangeImage( target );
          callback();
        }
      }
      {...dataset}
    />,
    targetElement
  );
}
