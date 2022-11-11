import shaka from 'shaka-player/dist/shaka-player.ui';
import React from 'react';

/**
 * A React component for shaka-player.
 * @param {string} src
 * @param {shaka.extern.PlayerConfiguration} config
 * @param {boolean} autoPlay
 * @param {number} width
 * @param {number} height
 * @param ref
 * @returns {*}
 * @constructor
 */
function ShakaPlayer({ src, config, chromeless, className, ...rest }, ref) {
  const uiContainerRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const [player, setPlayer] = React.useState(null);
  const [ui, setUi] = React.useState(null);

  // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.
  React.useEffect( () => {
    // shaka.media.ManifestParser.registerParserByExtension("m3u8", shaka.hls.HlsParser);
    // shaka.media.ManifestParser.registerParserByMime("Application/vnd.apple.mpegurl", shaka.hls.HlsParser);
    // shaka.media.ManifestParser.registerParserByMime("application/x-mpegURL", shaka.hls.HlsParser);    
    const player = new shaka.Player(videoRef.current);
    setPlayer(player);

    let ui;
    if (!chromeless) {
      
      const ui = new shaka.ui.Overlay(
        player,
        uiContainerRef.current,
        videoRef.current
      );
      console.log('uisssss', ui)
      setUi(ui);
    }


    return () => {
      player.destroy();
      if (ui) {
        ui.destroy();
      }
    };
  }, []);

  // Keep shaka.Player.configure in sync.
  React.useEffect(() => {
    if (player && config) {
      player.configure(config);
              player
                .getNetworkingEngine()
                .registerRequestFilter(function (type, request) {
                  console.log(
                    'type',
                    type,
                    shaka.net.NetworkingEngine.RequestType.LICENSE,
                  );
                  // if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                  //   request.headers[Object.keys(headers)[0]] =
                  //     Object.values(headers)[0];
                  // }
                });
            
    }
  }, [player, config]);

  // Load the source url when we have one.
  React.useEffect(() => {
    if (player && src) {
      const licenseServer = 'https://cwip-shaka-proxy.appspot.com/cookie_auth';
      // player.configure({
      //   drm: {
      //     servers: { 'com': licenseServer }
      //   },
      //   streaming: {
      //     lowLatencyMode: true,
      //     inaccurateManifestTolerance: 0,
      //     rebufferingGoal: 0.01,
      //   }
      // });
      player.addEventListener("error", function(event) {
        console.log('event:::>> lis',event)
      });
     
      player
                .getNetworkingEngine()
                .registerRequestFilter(function (type, request) {
                  console.log(
                    'type',
                    type,
                    shaka.net.NetworkingEngine.RequestType.LICENSE,
                  );
                  if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                    request.allowCrossSiteCredentials = true;
                  }
                });
      player.load(src).then(() => {
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');
      }).catch((error)=> console.log('not loaded',error));
    }
  }, [player, src]);

  // Define a handle for easily referencing Shaka's player & ui API's.
  React.useImperativeHandle(
    ref,
    () => ({
      get player() {
        return player;
      },
      get ui() {
        return ui;
      },
      get videoElement() {
        return videoRef.current;
      }
    }),
    [player, ui]
  );

  return (
    <div ref={uiContainerRef} className={className}>
      <video
        ref={videoRef}
        style={{
          maxWidth: '100%',
          width: '100%'
        }}
        
        
        {...rest}
      />
    </div>
  );
}

export default React.forwardRef(ShakaPlayer);


// import React from 'react';
// import shaka from 'shaka-player/dist/shaka-player.ui';
// import 'shaka-player/dist/controls.css';

// /**
//  * A React component for shaka-player.
//  * @param {string} src
//  * @param {shaka.extern.PlayerConfiguration} coßnfig
//  * @param {boolean} autoPlay
//  * @param {object} headers
//  * @param {number} width
//  * @param {number} height
//  * @param ref
//  * @returns {*}
//  * @constructor
//  */
// function WebPlayer(
//   {src, config, chromeless, className, headers, ...rest},
//   ref,
// ) {
//   const uiContainerRef = React.useRef(null);
//   const videoRef = React.useRef(null);

//   const [player, setPlayer] = React.useState(null);
//   const [ui, setUi] = React.useState(null);

//   // Effect to handle component mount & mount.
//   // Not related to the src prop, this hook creates a shaka.Player instance.
//   // This should always be the first effect to run.
//   React.useEffect(() => {
//     const player = new shaka.Player(videoRef.current);
//     setPlayer(player);

//     let ui;
//     if (!chromeless) {
//       const ui = new shaka.ui.Overlay(
//         player,
//         uiContainerRef.current,
//         videoRef.current,
//       );
//       setUi(ui);
//     }

//     return () => {
//       player.destroy();
//       if (ui) {
//         ui.destroy();
//       }
//     };
//   }, []);

//   // Keep shaka.Player.configure in sync.
//   React.useEffect(() => {
//     if (player && config) {
//       console.log('here in confif', config);
//       player.configure(config);
//     }
//   }, [player, config]);

//   React.useEffect(() => {
//     if (player && headers) {
//       player
//         .getNetworkingEngine()
//         .registerRequestFilter(function (type, request) {
//           console.log(
//             'type',
//             type,
//             shaka.net.NetworkingEngine.RequestType.LICENSE,
//           );
//           if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
//             request.headers[Object.keys(headers)[0]] =
//               Object.values(headers)[0];
//           }
//         });
//     }
//   }, [player, headers]);

//   // Load the source url when we have one.
//   React.useEffect(() => {
//     if (player && src) {
//       player.load(src);
//     }
//   }, [player, src]);

//   // Define a handle for easily referencing Shaka's player & ui API's.
//   React.useImperativeHandle(
//     ref,
//     () => ({
//       get player() {
//         return player;
//       },
//       get ui() {
//         return ui;
//       },
//       get videoElement() {
//         return videoRef.current;
//       },
//     }),
//     [player, ui],
//   );
//     console.log('refereomh ', ref, videoRef)
//   return (
//     <div ref={uiContainerRef} className={className}>
//       <video
//         ref={videoRef}
//         style={{
//           maxWidth: '100%',
//           width: '100%',
//         }}
//         {...rest}
//       />
//     </div>
//   );
// }

// export default React.forwardRef(WebPlayer);