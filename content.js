chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getFavicon") {
    const linkElements = [...document.getElementsByTagName("link")];
    const iconLink = linkElements.find(link =>
      link.getAttribute("rel").toLowerCase().includes("icon")
    );
    sendResponse(iconLink ? iconLink.href : null);
  }
});
