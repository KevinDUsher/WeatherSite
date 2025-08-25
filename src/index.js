import { WeatherControls } from './WeatherDisplay';


let today = new Date();
let year = today.getFullYear();
let month = String(today.getMonth() + 1).padStart(2, '0');
let day = String(today.getDate()).padStart(2, '0');
today = `${year}-${month}-${day}`;
const weather = new WeatherControls();
weather
  .displayPage("Detroit", today)  // note the leading zero month/day
  .then(node => document.body.appendChild(node))
  .catch(console.error);
