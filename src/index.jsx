import Post from './post';
import './styles/styles.css';
import json from './assets/json';
import logo from './assets/webpack.png'; // logo is string, path to image file
import * as $ from 'jquery';
import './babel';

import React from 'react';
import { render } from 'react-dom';

const post = new Post( json.title, logo );

console.log( 'Post to String:', post.toString() );



const App = () => (
    <div className="container">
        <h1>Webpack Cource</h1>
        <hr/>
        <div className="logo"></div>
        <hr/>
        <pre></pre>
    </div>
);

render(<App/>, document.getElementById('root'));


$('pre').addClass('code').html(post.toString());