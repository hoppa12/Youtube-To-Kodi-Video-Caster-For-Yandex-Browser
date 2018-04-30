let blankHtml = `<div class="container">
       <h1> Youtube to Kodi</h1>
   <div class="elem">
   <div class="details">Please Enter Your Kodi IP Address</div>
   <input placeholder="example 192.168.1.12"  type="text"/> 
</div>

<div class="elem">
       <div class="details">Please Enter Your Kodi Port Address</div>
       <input  type="number"/> 
   </div>

   <div class="elem">
           <button class="submit" style="background-color:indianred;"> Click </button>
       </div>
   </div>`;

let fulfilledHtml = `
        <div class="container">
       <h1> Plugin Active</h1>
       <button class="reset" style="background-color:indianred;"> Reset IP Details </button>
       </div>
        
        `;

chrome.storage.sync.get("kodiIp", res => {
  if (JSON.stringify(res) === "{}") {
    appendHtml(blankHtml);
  } else {
    appendHtml(fulfilledHtml);
  }
});

const appendHtml = html => {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");

  document.body.appendChild(doc.querySelector(".container"));
  document.querySelector("button").addEventListener("click", e => {
    if (e.target.classList.value === "submit") {
      addKodiDetails();
      return;
    } else {
      chrome.storage.local.remove("kodiIp", function(reso) {
        document.body.removeChild(document.querySelector(".container"));

        chrome.storage.local.remove("kodiPort", function() {
          chrome.storage.sync.remove("kodiIp", res => {
            appendHtml(blankHtml);
          });
        });
      });
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0].url.includes("youtube.com/watch")) {
       
      chrome.storage.sync.get("kodiIp", ip => {
       
        chrome.storage.sync.get("kodiPort", port => {
           
          let vidId = tabs[0].url.match(/v=\w+/)[0].replace("v=", "");
          let url = `http://${ip.kodiIp}:${port.kodiPort}/jsonrpc?request=`;
          url += encodeURIComponent(
            `{"jsonrpc":"2.0","id":"1","method":"Player.Open","params":{"item":{"file":"plugin://plugin.video.youtube/?action=play_video&videoid=${vidId}"}}}`
          );
          
          fetch(url).catch(err => err);
        });
      });
    }
  });
};

const addKodiDetails = () => {
  let ip = document.querySelectorAll("input")[0].value;
  let port = document.querySelectorAll("input")[1].value;
   
  if ( ip === "" && port ===  "") {
    
    document.querySelectorAll("input")[0].value = "";
    document.querySelectorAll("input")[1].value = "";
    return;
  }

  chrome.storage.sync.set({ kodiIp: ip }, res => {
    chrome.storage.sync.set({ kodiPort: port }, resTwo => {
      document.body.removeChild(document.querySelector(".container"));
      appendHtml(fulfilledHtml);
    });
  });
};
