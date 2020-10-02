import html2canvas from "html2canvas";

export function takeScreenShot(selector, filename) {
  const audio = document.createElement("audio");
  audio.src = "/shutter.mp3";

  if (audio.paused) {
    audio.play();
  } else {
    audio.currentTime = 0;
  }

  html2canvas(document.querySelector(selector), {
    scrollX: 0,
    scrollY: -window.scrollY,
  }).then(function (canvas) {
    const canvasData = canvas.toDataURL();
    const a = document.createElement("a");

    // download
    if (typeof a.download === "string") {
      a.href = canvasData;
      a.download = filename || "screenshot.png";
      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);
    } else {
      window.open(canvasData);
    }
  });
}
