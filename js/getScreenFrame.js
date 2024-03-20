const getScreenFrames = () => {
    return new Promise((resolve, reject) => {
      let i = 0;
      let startTime = null;
      let endTime = null;
      let timer = null;
      (function loop() {
        timer = requestAnimationFrame(loop);
        startTime = startTime === null ? new Date().getTime() : startTime;
        endTime = new Date().getTime();
        if (endTime - startTime > 1000) {
          cancelAnimationFrame(timer);
          resolve(i - 1);
          return;
        }
        i++;
      })();
    });
  };
  
  const get = () => {
    getScreenFrames().then((v) => {
      const el = document.querySelector(".fps");
      el.innerHTML = `FPS: ${v}`;
    });
  };
  get();
  setInterval(get, 1000);
  