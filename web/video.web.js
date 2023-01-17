// import shaka from 'shaka-player/dist/shaka-player.ui';
// import React from 'react';

// /**
//  * A React component for shaka-player.
//  * @param {string} src
//  * @param {shaka.extern.PlayerConfiguration} config
//  * @param {boolean} autoPlay
//  * @param {number} width
//  * @param {number} height
//  * @param ref
//  * @returns {*}
//  * @constructor
//  */
// function ShakaPlayer({ src, config, chromeless, className, ...rest }, ref) {
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
//         videoRef.current
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
//       player.configure(config);
//     }
//   }, [player, config]);

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
//       }
//     }),
//     [player, ui]
//   );

//   return (
//     <div ref={uiContainerRef} className={className}>
//       <video
//         ref={videoRef}
//         style={{
//           maxWidth: '100%',
//           width: '100%'
//         }}
//         {...rest}
//       />
//     </div>
//   );
// }

// export default React.forwardRef(ShakaPlayer);


import shaka from "shaka-player/dist/shaka-player.ui";
import React from "react";
import { CustomAdsManager } from "./customAd/adsManager";

/**
 * A React component for shaka-player.
 * @param {string} src
 * @param {shaka.extern.PlayerConfiguration} config
 * @param {boolean} autoPlay
 * @param {number} width
 * @param {number} height
 * @param ref
 * @param {boolean} chromeless
 * @param {function} onLoaded
 * @returns {*}
 * @constructor
 */
var videoElement;
const eventList = [
  "firstQuartile",
  "midpoint",
  "thirdQuartile",
  "start",
  "complete",
];
function ShakaPlayer(
  { src, config, chromeless, className, onLoaded, trackingJson, ...rest },
  ref
) {
  const uiContainerRef = React.useRef(null);
  const adUiRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const [player, setPlayer] = React.useState(null);
  const [ui, setUi] = React.useState(null);

  // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.
  React.useEffect(() => {
    // videoElement = document.getElementById("video");
    shaka.Player.setAdManagerFactory(
      () =>
        new CustomAdsManager(
          adUiRef.current,
          videoRef.current,
          trackingJson,
          eventList
        )
    );

    const player = new shaka.Player(videoRef.current);
    setPlayer(player);

    let ui;
    if (!chromeless) {
      const ui = new shaka.ui.Overlay(
        player,
        uiContainerRef.current,
        videoRef.current
      );
      setUi(ui);
    }

    return () => {
      player.destroy();
      if (ui) {
        ui.destroy();
      }
    };
  }, [chromeless]);

  // Keep shaka.Player.configure in sync.
  React.useEffect(() => {
    if (player && config) {
      player.configure({
        ...config,
      });
    }
  }, [player, config]);

  // Load the source url when we have one.

  React.useEffect(() => {
    if (player && src) {
      videoRef.current.addEventListener("loadeddata", (e) => {
        console.log("loaded url", e);
        onLoaded(e);
      });
      eventList.forEach((event) => {
        videoRef.current.addEventListener(event, (e) => {
          console.log("event in player ::: ", e);
        });
      });

      player
        .load(src)
        .then(() => {})
        .catch((error) => {
          console.log("i am error", error);
        });
    }
  }, [player, src, onLoaded]);

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
      },
    }),
    [player, ui]
  );

  return (
    <div ref={uiContainerRef} className={className}>
      <video
        ref={videoRef}
        className="video-js"
        style={{
          maxWidth: "100%",
          width: "100%",
        }}
        autoPlay={true}
        {...rest}
      />
      <div
        ref={adUiRef}
        style={{
          position: "absolute",
          zIndex: 1,
          bottom: -2,
          left: "2%",
          width: "96%",
          alignSelf: "center",
          display: "none",
        }}
        id="ad-ui-outer"
      >
        <span
          id={"ad-counter"}
          style={{ color: "white", marginBottom: 2, width: "50%" }}
        ></span>
        <button id="pause" style={{ display: "none" }}>
          Pause
        </button>

        <div id="ad-ui"></div>
      </div>
      <button
        id="skipAd"
        style={{
          position: "absolute",
          zIndex: 1,
          bottom: "5%",
          alignSelf: "center",
          right: 0,
          display: "none",
        }}
        onClick={() => player.getAdManager().dismiss()}
      >
        SKIP AD
      </button>
    </div>
  );
}

export default React.forwardRef(ShakaPlayer);
