// @flow

import * as React from 'react';
import Head from 'next/head';
import Footer from './footer';

type Props = {
  children: React.Node,
  title?: string,
}

const Layout = ({ children, title }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link href="https://fonts.googleapis.com/css?family=Catamaran:400,700" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
      <link rel="stylesheet" href="https://unpkg.com/antd@3/dist/antd.min.css" />
    </Head>
    <main>
      {children}
    </main>
    <Footer />
    <style jsx>{`
      main {
        background-image: url(static/diamond_upholstery.png);
        background-attachment: fixed;
        min-height: 100vh;
      }

      @media (min-device-pixel-ratio: 2) {
        main {
          background-image: url(static/diamond_upholstery_@2x.png);
        }
      }
    `}
    </style>
    <style global jsx>{`
      body {
        font-family: 'Catamaran', sans-serif;
      }

      p {
        font-family: 'Montserrat', sans-serif;
      }

      /* minireset.css v0.0.3 | MIT License | github.com/jgthms/minireset.css */
      html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}ul{list-style:none}button,input,select,textarea{margin:0}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}img,embed,iframe,object,audio,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0;text-align:left}
    `}
    </style>
  </div>
);

Layout.defaultProps = {
  title: 'Overwatch League Fantasy',
};


export default Layout;