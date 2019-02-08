// @flow

import * as React from "react";
import Head from "next/head";
import Footer from "./footer";
import AuthBar from "./authBar";

type Props = {
  children: React.Node,
  title?: string
};

const Layout = ({ children, title }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link
        href="https://fonts.googleapis.com/css?family=Catamaran:400,700"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/antd@3/dist/antd.min.css"
      />
    </Head>
    <div className="container">
      <header>
        <AuthBar />
      </header>
      <main>{children}</main>
    </div>
    <Footer />
    <style jsx>{`
      .container {
        background-image: url(static/diamond_upholstery.png);
        background-attachment: fixed;
      }

      header {
        height: 59px;
      }

      main {
        min-height: 100vh;
        overflow-x: hidden;
      }

      @media (min-device-pixel-ratio: 2) {
        .container {
          background-image: url(static/diamond_upholstery_@2x.png);
        }
      }
    `}</style>
    <style jsx global>{`
      @font-face {
        font-family: "BigNoodleToo";
        src: url("static/bignoodletoo.woff") format("woff");
      }

      body {
        font-family: "Catamaran", sans-serif;
      }

      p {
        font-family: "Montserrat", sans-serif;
      }

      /* minireset.css v0.0.3 | MIT License | github.com/jgthms/minireset.css */
      html,
      body,
      p,
      ol,
      ul,
      li,
      dl,
      dt,
      dd,
      blockquote,
      figure,
      fieldset,
      legend,
      textarea,
      pre,
      iframe,
      hr,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0;
        padding: 0;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-size: 100%;
        font-weight: normal;
      }
      ul {
        list-style: none;
      }
      button,
      input,
      select,
      textarea {
        margin: 0;
      }
      html {
        box-sizing: border-box;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
      img,
      embed,
      iframe,
      object,
      audio,
      video {
        height: auto;
        max-width: 100%;
      }
      iframe {
        border: 0;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      td,
      th {
        padding: 0;
        text-align: left;
      }
    `}</style>
  </>
);

Layout.defaultProps = {
  title: "Overwatch League Fantasy"
};

export default Layout;
