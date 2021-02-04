(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{73:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return l})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return p})),n.d(t,"default",(function(){return s}));var r=n(2),a=n(6),i=(n(0),n(83)),l={id:"get-started",title:"Get Started",sidebar_label:"Get Started",slug:"/"},c={unversionedId:"get-started",id:"get-started",isDocsHomePage:!1,title:"Get Started",description:"Install Swiper via npm or yarn:",source:"@site/docs/get-started.md",slug:"/",permalink:"/docs/next/",editUrl:"https://github.com/joe223/tiny-swiper/blob/dev_2.0/packages/website/docs/docs/get-started.md",version:"current",sidebar_label:"Get Started",sidebar:"someSidebar",next:{title:"APIs",permalink:"/docs/next/api"}},p=[],o={rightToc:p};function s(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},o,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Install Swiper via npm or yarn:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-shell"}),"$ npm install tiny-swiper --save\n$ yarn add tiny-swiper\n")),Object(i.b)("p",null,"If you prefer CDN, just make sure constructor ",Object(i.b)("inlineCode",{parentName:"p"},"Swiper")," is defined in browser global environment."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-html"}),'<script src="https://unpkg.com/tiny-swiper@latest"><\/script>\n')),Object(i.b)("p",null,"Html code:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-html"}),'\x3c!-- Slider main container --\x3e\n<div class="swiper-container">\n    \x3c!-- Additional required wrapper --\x3e\n    <div class="swiper-wrapper">\n        \x3c!-- Slides --\x3e\n        <div class="swiper-slide">Slide 1</div>\n        <div class="swiper-slide">Slide 2</div>\n        <div class="swiper-slide">Slide 3</div>\n        ...\n    </div>\n    \x3c!-- If we need pagination --\x3e\n    <div class="swiper-pagination"></div>\n</div>\n')),Object(i.b)("p",null,"JavaScript/TypeScript code:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"import Swiper, {\n    SwiperPluginLazyload,\n    SwiperPluginPagination\n} from 'tiny-swiper'\n\nSwiper.use([ SwiperPluginLazyload, SwiperPluginPagination ])\n\nconst swiper = new Swiper(swiperContainer: HTMLElement | string, parameters?: TinySwiperParameters)\n")),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"new Swiper()")," - initialize swiper with options."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"Swiper.use()")," - Register plugin."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"swiperContainer")," - HTMLElement or string (with CSS Selector) of swiper container HTML element. Required."),Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"parameters")," - object with Swiper parameters. Optional.")),Object(i.b)("p",null,"You also can load full-featured Tiny-Swiper:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"import Swiper from 'tiny-swiper/lib/index.full.js'\n")),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-html"}),'<script src="https://unpkg.com/tiny-swiper@latest/lib/index.full.js"><\/script>\n')))}s.isMDXComponent=!0},83:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return m}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=a.a.createContext({}),s=function(e){var t=a.a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=s(e.components);return a.a.createElement(o.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,o=p(e,["components","mdxType","originalType","parentName"]),u=s(n),d=r,m=u["".concat(l,".").concat(d)]||u[d]||b[d]||i;return n?a.a.createElement(m,c(c({ref:t},o),{},{components:n})):a.a.createElement(m,c({ref:t},o))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=d;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:r,l[1]=c;for(var o=2;o<i;o++)l[o]=n[o];return a.a.createElement.apply(null,l)}return a.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);