import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  timerWrapper: document.querySelector('.timer'),
  itemWrapper: document.querySelectorAll('.field'),
  daysValue: document.querySelector('[data-days]'),
  hoursValue: document.querySelector('[data-hours]'),
  minutesValue: document.querySelector('[data-minutes]'),
  secondsValue: document.querySelector('[data-seconds]'),
  spanElements: document.querySelectorAll('span'),
};

const TIMER_VALUE = 1000;
let intervalId = null;
let isIntervalRuns = false;
const ALERT_MESSAGE = 'Set the time in the future!!!';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose() {
    compareTime(getSelectedDate());
  },
};

let calendar = flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener('click', countdown);
window.addEventListener('DOMContentLoaded', disableStartBtn);

function disableStartBtn() {
  return (refs.startBtn.disabled = true);
}
function enableStartBtn() {
  return (refs.startBtn.disabled = false);
}
function compareTime(timeToCompare) {
  if (isIntervalRuns) {
    return;
  }
  if (timeToCompare < getCurrentDate()) {
    disableStartBtn();
    Notiflix.Notify.failure(ALERT_MESSAGE);
    return;
  }
  enableStartBtn();
}
function getSelectedDate() {
  return calendar.selectedDates[0].getTime();
}
function getCurrentDate() {
  return Date.now();
}
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
function countdown() {
  let selectedDate = getSelectedDate();
  disableStartBtn();
  isIntervalRuns = true;

  intervalId = setInterval(() => {
    let deltaTime = selectedDate - getCurrentDate();

    if (deltaTime <= TIMER_VALUE) {
      clearInterval(intervalId);
      isIntervalRuns = false;
    }
    let { days, hours, minutes, seconds } = convertMs(deltaTime);
    refs.daysValue.textContent = days;
    refs.hoursValue.textContent = addLeadingZero(hours);
    refs.minutesValue.textContent = addLeadingZero(minutes);
    refs.secondsValue.textContent = addLeadingZero(seconds);
  }, TIMER_VALUE);
}
