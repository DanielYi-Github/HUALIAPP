import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  ImageBackground,
  Platform
} from 'react-native';
import { Container, connectStyle} from 'native-base';

import Flake from './Animation/Flake';
import Lantern from './Animation/Lantern';
import { WebView } from 'react-native-webview';

let source = (Platform.OS === 'android' ? 'file:///android_asset/' : '') + `Static.bundle/index.html`;
const { width, height } = Dimensions.get('window');

class MainPageBackground extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
      flex  :0,
      imFlex :1,
     };
   }

  render() {
    let heightObject = {};
    if (this.props.height) {
      heightObject.height = this.props.height;
    } else {
      if (typeof this.props.height !== "undefined") {
        heightObject.height = 0;
      }else{
        heightObject.height = 0;
      }
    }

    // 確定是不是全屏顯示
    let content = null;
    if (this.props.style.MainPageBackground.height == height) {
      heightObject.height = height;
      content = (
        <ImageBackground
          style={{ flex: 1, resizeMode: "cover" }}
          source={ this.props.style.MainPageBackground.source }
        >
          {/*
          <WebView
            ref                             ={ref => (this.webViewRef = ref)}
            // onMessage                       ={this.onMessage}
            originWhitelist                 ={['*']}
            allowFileAccess                 ={true}
            source                          ={{uri: source}}
            javaScriptEnabled               ={true}
            decelerationRate                ='normal'
            scrollEnabled                   ={true}
            useWebKit                       ={true}
            mediaPlaybackRequiresUserAction ={true}
            mixedContentMode                ="compatibility"
            allowingReadAccessToURL         ="*"
            style={{
              flex: 1, 
              backgroundColor: 'rgba(1,9,58,0)'
            }}
            // onLoadEnd={() => this.setState({ loading: false })}
          >
          </WebView> 
          */}
        </ImageBackground>
        
        

        /*
        <WebView
          source={{ html: FixTinyText}}
          style={{
            flex: 1, 
            backgroundColor: 'rgba(1,9,58,1)'
          }}
        >
          {
            [...Array(50)].map((_, index) => 
              <Flake
                x={Math.random() * width}               // x-coordinate
                y={Math.random() * height}              // y-coordinate
                radius={Math.random() * 4 - 1}          // radius
                density={Math.random() * 10}   // density
                key={index}
              />
            )
          }
        </WebView>  
          */
        
        /*
        <ImageBackground
          style={{ flex: 1, resizeMode: "cover" }}
          source={this.props.style.MainPageBackground.source}
        >
          {
            [...Array(10)].map((_, index) => 
              <Lantern
                x={Math.random() * width}               // x-coordinate
                y={Math.random() * height}              // y-coordinate
                radius={Math.random() * 4 + 1}          // radius
                density={Math.random() * 10}   // density
                key={index}
              />
            )
          }
        </ImageBackground>
        */
        // 
      );
    }

    return (
      <Container style={[this.props.style.MainPageBackground, heightObject]} >
        {content}
      </Container>
    );

  }
}

export default connectStyle( 'Component.MainPageBackground', {} )(MainPageBackground);

// 聖誕節顯示聖誕樹的圖示
/**
 *
 const FixTinyText = `
 <html>
   <head>
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <style>
       * {
         padding: 0;
         margin: 0;
         background: hsl(232, 100%, 12%);
       }
       main {
         position: relative;
         height: 100vh;
         background: hsl(232, 100%, 12%);
       }
       p {
         position: absolute;
         left: 50%;
         top: 50%;
         background: hsl(var(--hue, 343), 99%, 50%);
         width: 4vmin;
         height: 4vmin;
         transform: translate(var(--x), var(--y)) scale(var(--s));
         mix-blend-mode: screen;
         border-radius: 50%;
       }

       * {
         margin: 0;
         box-sizing: border-box;
       }

       svg {
         opacity: 0;
         position: absolute;
         width: 1px;
         height: 1px;
       }

       body {
         background: hsl(232, 100%, 12%);
         height: 100vh;
         overflow: hidden;
       }
     </style>
   </head>
   
   <body>
     <main>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
       <p></p>
     </main>
     <svg viewBox="0 -20 300 300">
       <defs>
         <filter id="drawn">
           <feTurbulence baseFrequency="0.1325" numOctaves="8" />
           <feDisplacementMap in="SourceGraphic" scale="10" />
         </filter>
       </defs>
     </svg>
     <script type="text/javascript">
       const baubles = document.querySelectorAll("main > p");
       const maxX = 60;
       const maxY = ${Platform.OS === "ios" ? 95: 85};

       baubles.forEach((bauble, i) => {
         const y = Math.pow(i / baubles.length, 0.5) * maxY * 2 - maxY;
         const x =
           Math.pow((maxX * i) / baubles.length, 0.5) *
           5.5 *
           Math.random() *
           (i % 2 === 0 ? 1 : -1);

         bauble.style.setProperty("--x", \`\${x}vmin\`);
         bauble.style.setProperty("--y", \`\${y}vmin\`);
         bauble.style.setProperty("--s", Math.random() * 0.875 + 0.125);
         bauble.style.setProperty("--hue", Math.random() * 360);

         bauble.animate(
           { opacity: [1, 1, 0] },
           {
             duration: 2000 + Math.random() * 3000,
             iterations: Infinity,
             direction: "alternate",
             delay: Math.random() * -16000,
             easing: "ease-in"
           }
         );
       });

       if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
         document
           .getAnimations()
           .forEach((animation) => {
             animation.pause();
           });
       }
     </script>
   </body>
 </html>`;
 
 */
