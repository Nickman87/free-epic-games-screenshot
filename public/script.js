function bufferToImageUrl(buffer) {
  // See https://gist.github.com/candycode/f18ae1767b2b0aba568e

  var arrayBufferView = new Uint8Array(buffer);
  var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(blob);

  return imageUrl;
}

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function () {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    // body: JSON.stringify({ pageToScreenshot: pageToScreenshot }),
  };

  // document.getElementById("result").textContent = "Please wait...";

  fetch("/.netlify/functions/screenshot", options)
    .then((res) => res.json())
    .then((res) => {
      if (!res.buffer)
        return (document.getElementById("result").textContent =
          "Error capturing screenshot");

      const img = document.createElement("img");
      img.src = bufferToImageUrl(res.buffer.data);
      document.getElementById("result").innerHTML = img.outerHTML;
    })
    .catch((err) => {
      console.log(err);
      document.getElementById(
        "result"
      ).textContent = `Error: ${err.toString()}`;
    });
});
