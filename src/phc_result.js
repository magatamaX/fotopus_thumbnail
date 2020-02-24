import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './phc_result/Modal';

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
      images: [],
      isLoaded: false,
      currentIndex: 0,
      isOpen: false,
    }

    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  // マウントされるとき
  componentWillMount () {

    // JSONパス
    const initJsonPath = path.resolve(__dirname, 'city/json/phc_result.json');

    // JSONデータ読み込み
    request.get(initJsonPath)
      .accept('application/json')
      .end( ( err, res ) => {
        this.loadedJSON( err, res );
      });
  }

  // データを読み込んだとき
  loadedJSON ( err, res ) {
    if ( err ) {
      console.error('データ読み込みに失敗しました。' + err.message);
      return
    }

    console.log('🚙', res);

    // JSON NGもしくは写真が０のとき
    if ( res.body.result === "NG") {
      console.error('データを取得できませんでした。err_cd:' + res.body.err_cd + ', message:' + res.body.err_msg );
      return
    }

    // ステート更新
    this.setState({
      images: res.body,
      isLoaded: true,
    });
  }

  componentDidUpdate ( prevProps, prevState ) {
    if ( prevState.isLoaded === false && this.state.isLoaded === true ) {
      this.props.loadFunc('#imageList');
    }
  }

  handleImageOnError(e) {
    e.target.src = ''
  }

  handleOpenModal(index) {
    return () => {
      this.setState({
        currentIndex: index,
        isOpen: true,
      })
    }
  }

  handleCloseModal() {
    this.setState({
      currentIndex: 0,
      isOpen: false,
    })
  }

  prevent(e) {
    e.preventDefault();
  }

  // 描画処理
  render () {

    console.log('💳', this.state);

    if ( this.state.images.length === 0 ) {
      return (
        <div className={`arrange-contents`}>
          <div className="loader"><div className="loading"></div></div>
        </div>
      )
    }

    const initItems = this.state.images.map( ( item, index ) => {

      return (
        <div key={item.id} className={`arrange-item`}>
          <div onClick={this.handleOpenModal(index)}>
            <img src={`/city/images/${item.id}.jpg`} alt={item.title} onError={this.handleImageOnError} style={{pointerEvents: `none`}} />
            <div className="photo-info" style={{ bottom: 0}}>
              <p dangerouslySetInnerHTML={{__html: item.title}}></p>
              <br />
              <p className="nickname">ニックネーム：<span dangerouslySetInnerHTML={{__html: item.name}}></span></p>
            </div>
          </div>
        </div>
      )
           
    })

    return (
      <React.Fragment>
        <div>
          <div className="arrange-contents">
            <div id="imageList">
              {initItems}
            </div>
            {this.state.moreItems}
          </div>
        </div>
        <Modal {...this.state} onClose={this.handleCloseModal} />
      </React.Fragment>
    )

  }

}

const targetElement = document.getElementById('js-phcResultRoot');
if ( targetElement ) {
  let dataset;
  if ( targetElement.dataset ) dataset = JSON.parse(JSON.stringify(targetElement.dataset));
  ReactDOM.render(
    <ImageList
      loadFunc={
        ( target, callback = () => {} )=>{
          triggerArrangeImage( target, () => {
            callback();
          });  
        }
      }
    />,
    targetElement
  );
}
