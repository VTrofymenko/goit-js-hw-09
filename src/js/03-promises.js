import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.form'),
};

const ERROR_MESSAGE = 'Enter values > 0 !!!';
const formData = {};

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });

  return promise;
}

refs.form.addEventListener('submit', onFormSubmit);
refs.form.addEventListener('input', onInputChange);

function onInputChange(event) {
  formData[event.target.name] = +event.target.value;

  return formData;
}

function onFormSubmit(event) {
  event.preventDefault();
  let { delay, amount, step } = formData;
  if (amount > 0 && step >= 0 && delay > 0) {
    for (let i = 1; i <= amount; i += 1) {
      let position = i;
      const promise = createPromise(position, delay);
      delay += step;
      promise
        .then(({ position, delay }) => {
          Notiflix.Notify.success(
            `Fulfilled promise ${position} in ${delay}ms`
          );
        })
        .catch(({ position, delay }) => {
          Notiflix.Notify.failure(`Rejected promise ${position} in ${delay}ms`);
        });
    }
  } else {
    Notiflix.Notify.failure(ERROR_MESSAGE);
  }
}
