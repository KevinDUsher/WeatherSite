import {Weather} from './WeatherAPI';
import "./WeatherStyle.css";
import { compareAsc, format, addDays, getDay} from "date-fns";
import snowing from "./Images/snowing.gif";
import raining from "./Images/raining.gif";
import fog from "./Images/fog.gif";
import windy from "./Images/wind.gif";
import cloudy from "./Images/cloudy.gif";
import partlyCloudyDay from "./Images/partlyCloudyDay.gif";
import partlyCloudyNight from "./Images/partlyCloudyNight.gif";
import clearDay from "./Images/clearDay.gif";
import clearNight from "./Images/clearNight.gif";
import imageNotLoading from "./Images/imageNotLoad.gif";


export class WeatherControls{
    constructor(){
        this.weather = new Weather();
        this.dates = [];
        this.daysOfWeek = [];
        this.city = "";
    }

    async displayPage(city, date){
        let pageContainer = document.createElement("div");
        pageContainer.id = "PageContainer";
        pageContainer.appendChild(this.displayHeader());
        pageContainer.appendChild(this.displayMain());
        let middle = await this.displayMiddle(city, date);
        pageContainer.appendChild(middle)
        pageContainer.appendChild(this.displayFooter());
        document.body.appendChild(pageContainer);
        this.updateMainDisplay(city,this.dates[0]);
    }

    getIconSource(iconType){
        let src;
        switch (iconType){
            case 'snow':
                src = snowing;
            break;
            case 'rain':
                src = raining;
            break;
            case 'fog':
                src = fog;
            break;
            case 'wind':
                src = windy;
            break;
            case 'cloudy':
                src = cloudy;
            break;
            case 'partly-cloudy-day':
                src = partlyCloudyDay;
            break;
            case 'partly-cloudy-night':
                src = partlyCloudyNight;
            break;
            case 'clear-day':
                src = clearDay;
            break;
            case 'clear-night':
                src = clearNight;
            break;
            default:
                src = imageNotLoading;
        }
        return src;
    }

    displayHeader(){
        let headerContainer = document.createElement("header");
        headerContainer.classList = "HeaderContainer";
        let headerDate = document.createElement("input");
        headerDate.type = "date";
        headerDate.id = "SelectDate";
        let today = new Date();
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');
        today = `${year}-${month}-${day}`;
        headerDate.value = today;
        let headerSearch = document.createElement("input");
        headerSearch.id = "HeaderSearch";
        headerSearch.addEventListener("keydown", (event) => {
            if(event.key === 'Enter'){
                if(headerSearch.value != ""){
                    let city = headerSearch.value;
                    let date = headerDate.value;
                    document.body.innerHTML = "";
                    this.displayPage(city, date);
                }
            }
        });
        headerSearch.placeholder = "Search City";
        headerContainer.appendChild(headerDate);
        headerContainer.appendChild(headerSearch);
        return headerContainer;
    }

    displayMain(){
        let mainContainer = document.createElement("div");
        mainContainer.classList = "MainContainer";
        let mainLeftContainer = document.createElement("div");
        mainLeftContainer.classList = "MainLeftContainer";
        let mainImageContainer = document.createElement("div");
        mainImageContainer.classList = "MainImageContainer";
        let mainImage =  document.createElement("img");
        mainImage.classList = "MainImage";
        mainImageContainer.appendChild(mainImage);
        let mainCity = document.createElement("div");
        mainCity.classList = "MainCity";
        mainLeftContainer.appendChild(mainImageContainer);
        mainLeftContainer.appendChild(mainCity);
        let mainDateTime = document.createElement("div");
        mainDateTime.classList = "MainDateTime";
        let mainWeatherTemp = document.createElement("div");
        mainWeatherTemp.classList = "MainWeatherTemp";
        let mainHumidity = document.createElement("div");
        mainHumidity.classList = "MainHumidity";
        let mainDescription = document.createElement("div");
        mainDescription.classList = "MainDescription";
        let mainInfoContainer = document.createElement("div");
        mainInfoContainer.classList = "MainInfoContainer";
        mainInfoContainer.appendChild(mainDateTime);
        mainInfoContainer.appendChild(mainWeatherTemp);
        mainInfoContainer.appendChild(mainHumidity);
        mainInfoContainer.appendChild(mainDescription);
        mainContainer.appendChild(mainLeftContainer);
        mainContainer.appendChild(mainInfoContainer);
        return mainContainer;
    }

    updateMainDisplay(city,date){
        let mainImg = document.getElementsByClassName("MainImage")[0];
        let mainCity = document.getElementsByClassName("MainCity")[0];
        console.log(mainCity);
        let mainWeatherTemp = document.getElementsByClassName("MainWeatherTemp")[0];
        let mainHumidity = document.getElementsByClassName("MainHumidity")[0];
        let mainDescription = document.getElementsByClassName("MainDescription")[0];
        let mainDateTime = document.getElementsByClassName("MainDateTime")[0];
        mainImg.src = this.getIconSource(date.icon);
        mainCity.innerHTML = city;
        mainWeatherTemp.innerHTML = "Temperature: " + date.temp + "°F";
        mainHumidity.innerHTML = "Humidity: " + date.humidity;
        mainDescription.innerHTML = date.description;
        mainDateTime.innerHTML = date.datetime; 
    }

    setDaysOfWeek(){
        this.daysOfWeek.length = 0;
        for(let i = 0; i < this.dates.length; i++)
        {
            this.daysOfWeek.push(format(new Date(this.dates[i].datetime  + "T00:00:00"), "EEEE"));
        }
    }

    displayDaysOfWeek(){
        const DaysOfWeek = document.createElement("div");
        DaysOfWeek.classList = "DaysOfWeekContainer";
        for(let i = 0; i < this.daysOfWeek.length; i++){
            let button = document.createElement("button");
            button.classList = "DaysOfWeekButton";
            button.innerHTML = this.daysOfWeek[i];
            if(i == 0){
                button.style.borderBottomWidth = '0';
            }
            button.addEventListener("click", (e) => {
                let element = document.getElementById("DateDisplay");
                if(element){
                    element.innerHTML = "";
                }
                let buttons = document.getElementsByClassName("DaysOfWeekButton");
                for(let x = 0; x < buttons.length; x++){
                    buttons[x].style.removeProperty('border-bottom');
                }
                const el = e.currentTarget;
                el.style.borderBottomWidth = '0';
                this.displayHours(this.dates[i]);
                this.updateMainDisplay(this.city,this.dates[i])
            });
            DaysOfWeek.appendChild(button);
        }
        return DaysOfWeek;
    }

    async displayMiddle(city, date){
        let middleDisplay = document.createElement("div");
        middleDisplay.classList = "MiddleContainer";
        let middleDays = await this.loadDays(city, date);
        middleDisplay.appendChild(this.displayDaysOfWeek());
        middleDisplay.appendChild(middleDays);
        return middleDisplay;
    }

    addSeven(inputDate){
        const date = new Date(inputDate);
        const newDate = addDays(date, 7);
        return format(newDate, 'yyyy-MM-dd');
    }

    async loadDays(city, date){
        const dates = await this.weather.WeatherDataDate(city, date, this.addSeven(date));
        this.dates = dates;
        this.city = city;
        this.setDaysOfWeek();
        console.log(this.dates);
        return this.displayHours(this.dates[0]);
    }

    displayHours(dateData){
        let datesDisplay;
        if(document.getElementById("DateDisplay"))
        {
            datesDisplay = document.getElementById("DateDisplay");
        }
        else{
            datesDisplay = document.createElement('div');
            datesDisplay.id = "DateDisplay";
        }
        for(let i = 0; i < dateData.hours.length ; i++ ){
            let hourDisplay = document.createElement("div");
            hourDisplay.classList = "HourDisplay";
            let imgContainer = document.createElement("div");
            imgContainer.classList = 'ImageContainer';
            let img = document.createElement('img');
            img.classList = 'HourIcon';
            img.src = this.getIconSource(dateData.hours[i].icon);
            imgContainer.appendChild(img);
            let temp = document.createElement('div');
            temp.classList = 'HourTemperature';
            temp.innerHTML = "Temperature: " + dateData.hours[i].temp + "°F";
            let hourWeather = document.createElement('div');
            hourWeather.classList = 'HourWeather';
            hourWeather.innerHTML = dateData.hours[i].conditions;
            let hourTime = document.createElement('div');
            hourTime.classList = 'HourHour';
            hourTime.innerHTML = dateData.hours[i].datetime;
            hourDisplay.appendChild(imgContainer);
            hourDisplay.appendChild(temp);
            hourDisplay.appendChild(hourWeather);
            hourDisplay.appendChild(hourTime);
            datesDisplay.appendChild(hourDisplay);
        }
        return datesDisplay;
    }

    displayFooter(){
        let footer = document.createElement("div");
        footer.classList = "Footer";
        footer.innerHTML = "CopyRight Stuff";
        return footer;
    }

};