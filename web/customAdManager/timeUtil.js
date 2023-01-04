function time_remaining(adTime) {
  return adTime + 1;
}
var currentCountDowntime = 0;
var timeinterval;

function convertTimeTot(totalSeconds) {
  const tSec = parseInt(totalSeconds);
  const minutes = Math.floor(tSec / 60);
  const seconds = tSec % 60;

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }
  const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  return result;
}

function run_clock(id, endtime) {
  function update_clock() {
    currentCountDowntime = time_remaining(currentCountDowntime);
    const spanVal = document.getElementById("ad-counter");
    spanVal.innerHTML = `${convertTimeTot(
      currentCountDowntime
    )}/${convertTimeTot(10)}
    `;
    if (currentCountDowntime === endtime) {
      currentCountDowntime = 0;
      clearInterval(timeinterval);
      paused = true;
    }
  }
  update_clock(); // run function once at first to avoid delay
  timeinterval = setInterval(update_clock, 1000);
}

var paused = true; // is the clock paused?

function pause_clock() {
  if (!paused) {
    paused = true;
    clearInterval(timeinterval); // stop the clock
  }
}

function resume_clock(endTime) {
  if (paused) {
    paused = false;
    run_clock("clockdiv", endTime);
  }
}

export { resume_clock, pause_clock, currentCountDowntime };
