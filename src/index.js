import React from 'react';
import ReactDOM from 'react-dom';
const request = require('superagent');


ReactDOM.render(
  <div>
    <p className="gallery_pager clearfix">
      <span>1</span>
    </p>
    <ul className="galleryTop_photoList">
      <li className="thumb">
        <a>
          rrrrr
        </a>
      </li>
    </ul>
    <p className="gallery_pagerBottom">
      <span>1</span>
    </p>
  </div>,
  document.getElementById('gallery')
);
