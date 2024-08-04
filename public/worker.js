var fileChunk = [];

self.addEventListener("message", (e) => {
  if (e.data === "download") {
    const file = new Blob(fileChunk, { type: "application/zip" });
    self.postMessage(file);
    fileChunk = [];
  } else {
    fileChunk.push(e.data);
  }
});
