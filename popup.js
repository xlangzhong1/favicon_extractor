document.addEventListener("DOMContentLoaded", async () => {
  const favicon = document.getElementById("favicon");
  const downloadBtn = document.getElementById("download");

  const tab = await new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      resolve(tab);
    });
  });

  chrome.tabs.sendMessage(tab.id, { type: "getFavicon" }, (result) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }

    const url = new URL(tab.url);
    const rootUrl = `${url.protocol}//${url.hostname}`;

    if (result && result !== "data:,") {
      console.log("Favicon URL:", result);
      favicon.src = result;
    } else {
      console.log("Favicon URL (default):", `${rootUrl}/favicon.ico`);
      favicon.src = `${rootUrl}/favicon.ico`;
    }
  });

  downloadBtn.addEventListener("click", async () => {
    if (favicon.src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = favicon.src;

      img.onload = () => {
        console.log("Image loaded");
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 512, 512);

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "favicon_512x512.png";
        link.click();
      };
    }
  });
});
