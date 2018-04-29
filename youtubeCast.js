chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let vidId = window.location.href.match(/v=\w+/)[0].replace("v=", "");

  let url = "http://192.168.0.143:8080/jsonrpc?request=";
  url += encodeURIComponent(
    `{"jsonrpc":"2.0","id":"1","method":"Player.Open","params":{"item":{"file":"plugin://plugin.video.youtube/?action=play_video&videoid=${vidId}"}}}`
  );

  sendResponse({ url: url });
});
