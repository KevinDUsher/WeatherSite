export class Weather{
    constructor(){

    }

    async WeatherData(city){
        const key = '3HL28YWHNP6H3KRJBC46HD76N';
        const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+city+'?key='+key;
        try{
            const response = await fetch(url);
            const data = await response.json();
        } catch {
            console.error("Did not return data correctly");
        }
    }

    async WeatherDataDate(city, date1, date2){
        const key = '3HL28YWHNP6H3KRJBC46HD76N';
        const url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+city+'/'+date1+'/'+date2+'?key='+key;
        try{
            const response = await fetch(url);
            const data = await response.json();
            return data.days;
        } catch {
            console.error("Did not return data correctly");
        }
    }

};