
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import WebVideo from './video.web'
const baseUrl =
  'https://e2f9de5d62b647428fb652c48267a777.mediatailor.us-west-2.amazonaws.com';
const mpd_asset_id =
  'b9ae3db57338421f986cc028c88d1f40/64c179c9a6b04128ab4105d723012382/c2fa5c88342340349588b8dc8a73f0c4';


 const toSec = timeString => {
  const arr = timeString.split(':');
  const seconds = arr[0] * 3600 + arr[1] * 60 + +arr[2];
  return seconds;
};

const WebPlayer = (props) =>{
  const ref = useRef(null)
  const [manifestUrl, setManifestUrl] = useState('');
  const [tracking_response, setTrackingResponse] = useState(null);
  const [showSkip, setSkipBtn] = useState(false);
  const [currentAdIndex, setCurrentIndex] = useState(null);

  console.log('ref', ref.current)
  useEffect(()=> {
    if(ref.current){
      // console.log('ref.current', ref.current)
    }
  }, [ref.current])

  async function handleMpdApi() {
    const baseAdUrl = `${baseUrl}/v1/session/9a39c1f787063acfe5de4814e922e22605c1572d/skipAdTest/${mpd_asset_id}/index.mpd`;
    await fetch(baseAdUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        adsParams: {
          deviceType: 'ipad',
        },
      }),
    })
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(async data => {
        console.log(data);
        const manifest_url = `${baseUrl}${data.manifestUrl}`;
        const tracking_url = `${baseUrl}${data.trackingUrl}`;
        const manifest_response = await fetch(manifest_url).then(response => {
          if (!response.ok) throw Error(response.statusText);
          return response.text();
        });
        const tracking_response = await fetch(tracking_url).then(response => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        });
        setTrackingResponse(tracking_response)
        setManifestUrl(manifest_url)
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  useEffect(()=> { 
    handleMpdApi()
  }, [])
  
  

  function onUpdate(currentTime) {
    const {avails} = tracking_response;
    // console.log('tryy ui, ', ref.current.videoElement)
    if (avails.length > 0) {
      for (var i = 0; i < avails.length; i++) {
        // if(avails[i].startTimeInSeconds < currentTime && parseInt(
        //   avails[i].startTimeInSeconds + avails[i].durationInSeconds,
        // ) > parseInt(currentTime)){
        //   console.log("constant lui sdasdda", document.getElementsByClassName("shaka-range-container shaka-seek-bar-container")[0].style)
        //   // ref.current.ui.addSeekBar = false
        //   document.getElementsByClassName("shaka-range-container shaka-seek-bar-container")[0].style.display = 'none';

        // }else {
        //   // ref.current.ui.addSeekBar = true
        //   document.getElementsByClassName("shaka-range-container shaka-seek-bar-container")[0].style.display = 'block';

        // }
        if (
          parseInt(avails[i].startTimeInSeconds) +
            toSec(avails[i].ads[0].skipOffset) ===
            parseInt(currentTime) && !showSkip
        ) {
          setSkipBtn(true)
          setCurrentIndex(i)
        } else if (
          parseInt(
            avails[i].startTimeInSeconds + avails[i].durationInSeconds,
          ) === parseInt(currentTime) && showSkip
        ) {
          setSkipBtn(false)

        }
      }
    }
  }

  function skipAd() {
    const {avails} = tracking_response;

    const adTime = avails[currentAdIndex].durationInSeconds;
    const skipTo = avails[currentAdIndex].startTimeInSeconds + adTime
    console.log('skipTo', skipTo,  avails[currentAdIndex])
    ref.current.videoElement.pause();
    ref.current.videoElement.currentTime = skipTo ;
    ref.current.videoElement.play();
  }

  if (manifestUrl === '') {
    return <View/>;
  }
  
  return (
    <View >
      <WebVideo
        chromeless={true}
        autoPlay={true}
        // src={props.source.uri} 
        src={manifestUrl}
        ref={ref}
        onTimeUpdate={e => {
          onUpdate(ref.current.videoElement.currentTime)
        }}
        controls={props.controls} /> 
        {showSkip && (
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              position: 'absolute',
              zIndex: 1,
              bottom: 100,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderColor: "white",
              borderWidth:3
            }}
            onPress={() => {
              skipAd()
            }}>
            <Text style={{color: 'white', fontSize: 18, }}>SKIP AD</Text>
          </TouchableOpacity>
        )} 
    </View>
)};

export default WebPlayer;


// import React, { useEffect, useRef, useState } from 'react';
// import { Text, View, TouchableOpacity } from 'react-native';
// import WebVideo from './video.web'

// let adDisplayContainer;
// const WebPlayer = (props) =>{
//   const ref = useRef(null)

//   function initAdServer() {
//     // console.log('window.google', new window.google)
//     console.log('videoContent', videoContent, contentRef)
//     //createAdDisplayContainer();

//     adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);
//     // Listen and respond to ads loaded and error events.
//     console.log('adsLoader', adsLoader)

//     adsLoader.addEventListener(
//       window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
//       onAdsManagerLoaded, false);
//     adsLoader.addEventListener(
//       onAdError, false);

//   }

// function createAdDisplayContainer(){
  // var  videoContent = ref.current;
  // If you're using a non-UI build, this is the div you'll need to create
  // for your layout.
  // const container = videoContent.getServerSideAdContainer();
  // adManager.initServerSide(container, video);
// }


// useEffect(()=> {
//  initAdServer()
// }, [])

  
//   return (
//     <View >
//       <WebVideo
//         chromeless={true}
//         autoPlay={true}
//         // src={props.source.uri} 
//         src={manifestUrl}
//         ref={ref}
//         onTimeUpdate={e => {
//           onUpdate(ref.current.videoElement.currentTime)
//         }}
//         controls={props.controls} /> 

//     </View>
// )};

// export default WebPlayer;
