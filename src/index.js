import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
const path = require('path');

class Gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      currentPage: 0,
      itemsPerPage: {
        pc: 7,
        sp: 3,
      },
      totalPages: {
        pc: 0,
        sp: 0,
      }
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
      items: [res.body],
      totalPages: {
        pc: Math.ceil(res.body.img.length / 8),
        sp: Math.ceil(res.body.img.length / 4),
      }
    })

  }

  onPageChange( index ) {
    console.log( index );
    this.setState({
      currentPage: index,
    })
  }

  render () {

    if ( !this.state.items ) {
      return <div className='App'>
        現在読み込み中</div>
    }

    const photoList = this.state.items.map( e => {

      if ( e.result === 'NG') {

        return <div className="NG">
          <p>エラーです</p>
          <p>{e.err_cd}</p>
          <p>{e.err_msg}</p>
        </div>

      } else {

        const items_list_count = this.state.itemsPerPage.pc;
        console.log(items_list_count);

        let items_count = 0;
        let page = 0;
        let items_list = [];
        let items_list_row = [];

        for ( let i=0; i <= e.img.length; i++ ) {

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

          return <li className="thumb" data-index={index} data-seq={images.seq}>
            <a href={images.pageurl} target="_blank">
              <img src={images.thumblarge} alt={images.title} />
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

        const page_list_count  = parseInt(this.state.totalPages.pc);

        let list_count = 0;
        let list_row = [];

        for ( let i=0; i < page_list_count; i++ ) {

          list_row[list_count] = i;
          list_count++;

        }

console.log(list_row)
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
            console.log(isCurrent)
          }

          return <a disabled={isDisabled} style={isCurrent} name={index} href='javascript:void(0)' onClick={ page => this.onPageChange( index ) }>{index+1}</a>
        })

        return hrefList

      }


    })

    return (
      <div>
        <p className="gallery_pager clearfix">{pagination}</p>
        <ul className='galleryTop_photoList'>{photoList}</ul>
        <p className="gallery_pagerBottom">{pagination}</p>
      </div>
    )

  }

}

ReactDOM.render(
  <Gallery />,
  document.getElementById('gallery')
);
