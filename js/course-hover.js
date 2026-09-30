document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".coruse-card");

  cards.forEach((card) => {
    const button = card.querySelector(".course-button");
    const video = card.querySelector(".course-hover-video");
    if (!button || !video) return;

    const start = async () => {
      if (window.matchMedia("(hover: none)").matches) return;
      card.classList.add("video-on");
      try {
        video.currentTime = 0;
        await video.play();
      } catch (e) {
        console.log(e);
      }
    };

    const stop = () => {
      card.classList.remove("video-on");
      video.pause();
      video.currentTime = 0;
    };

    button.addEventListener("mouseenter", start);
    button.addEventListener("mouseleave", stop);
    button.addEventListener("focus", start);
    button.addEventListener("blur", stop);
  });
});
