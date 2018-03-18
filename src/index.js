import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
const path = require('path');

class PhotoList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentWillMount () {
    const jsonPath = path.resolve(__dirname, 'test.json')
    request.get(jsonPath)
      .accept('application/json')
      .end( ( err, res ) => {
        this.loadedJSON( err, res )
      })
  }

  loadedJSON ( err, res ) {
    if ( err ) {
      console.log(err)
      return
    }

    this.setState({
      items: [res.body]
    })
  }

  render () {

    if ( !this.state.items ) {
      return <div className='App'>
        現在読み込み中</div>
    }

    const options = this.state.items.map( e => {
      console.log(e)

      if ( e.result === 'NG') {

        return <div className="NG">
          <p>エラーです</p>
          <p>{e.err_cd}</p>
          <p>{e.err_msg}</p>
        </div>

      } else {

        const imgList = e.img.map( images => {
          console.log(images);

          return <li className="thumb">
            <a href={images.pageurl} target="_blank">
              <img src={images.thumblarge} alt={images.title} />
            </a>
          </li>
        })

        return imgList
      }
    })
          console.log(options)
    return (
        <ul className='galleryTop_photoList'>{options}</ul>
    )

  }

}

ReactDOM.render(
  <PhotoList />,
  document.getElementById('gallery')
);
