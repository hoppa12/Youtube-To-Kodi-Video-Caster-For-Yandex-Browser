let blankHtml = `<div class="container">
       <h1> Youtube to Kodi</h1>
   <div class="elem">
   <div class="details">Please Enter Your Kodi IP Address</div>
   <input placeholder="example http://192.168"  type="text"/> 
</div>

<div class="elem">
       <div class="details">Please Enter Your Kodi Port Address</div>
       <input  type="text"/> 
   </div>

   <div class="elem">
           <button class="submit" onClick="addKodiDetails()" style="background-color:indianred;"> Click </button>
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
      document.body.removeChild(document.querySelector(".container"));
      appendHtml(blankHtml);
    }
  });

  console.log("sending message");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log(tabs[0]);

    if (tabs[0].url.includes("youtube.com/watch")) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getURL" }, function(
        response
      ) {
        fetch(response.url).catch(err => err);
      });
    }
  });
};

const addKodiDetails = () => {
  let ip = document.querySelectorAll("input")[0].value;
  let port = document.querySelectorAll("input")[1].value;
  console.log("Hrer");
  if (!ip || !port) {
    console.log("details invalid,please retry");
    document.querySelectorAll("input")[0].value = "";
    document.querySelectorAll("input")[1].value = "";
    return;
  }

  chrome.storage.sync.set({ kodiIp: ip }, res => {});
  chrome.storage.sync.set({ kodiPort: port }, res => {
    console.log(res);
    document.body.removeChild(document.querySelector(".container"));
    appendHtml(fulfilledHtml);
  });
};
