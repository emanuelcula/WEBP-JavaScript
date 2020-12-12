var xhrLineChart = false;
var xhrBarChart = false;

//Farbe für Grafik
Chart.defaults.global.defaultFontColor = 'white';


//Update Weltweit Grafik wenn eine Auswahl geändert wird
$('#ww_type, #ww_timeframe, #ww_country1, #ww_country2, #ww_country3').on('change', function() {
    drawLineChart($('#ww_type').val(), $('#ww_timeframe').val(), $('#ww_country1').val(), $('#ww_country2').val(), $('#ww_country3').val());
});

//Zeichnen der  Weltweit Grafik wenn die Seite lädt
drawLineChart($('#ww_type').val(), $('#ww_timeframe').val(), $('#ww_country1').val(), $('#ww_country2').val(), $('#ww_country3').val());

//Update Schweizer Grafik wenn eine Auswahl geändert wird
$('#ct_timeframe, input[name="ct_cases"], input[name="ct_recovered"], input[name="ct_deaths"]').on('change', function() {
    drawBarChart($('#ct_timeframe').val(), $('input[name="ct_cases"]').prop('checked'), $('input[name="ct_recovered"]').prop('checked'), $('input[name="ct_deaths"]').prop('checked'));
});

//Zeichnen der Schweizer Grafik wenn die Seite lädt
drawBarChart($('#ct_timeframe').val(), $('input[name="ct_cases"]').prop('checked'), $('input[name="ct_recovered"]').prop('checked'), $('input[name="ct_deaths"]').prop('checked'));



// Funktion für das Zeichnen der Schweizer Grafik
function drawBarChart(timeframe, infected, recovered, deaths)
console.log(drawLineChart)
{

    //AJAX Call zur API für alle Monate oder einen Monat
    xhrBarChart = $.get('https://disease.sh/v3/covid-19/historical/Switzerland?lastdays=' + (timeframe == 1 ? 'all' : '1'), function(data) {

        //formatieren der daten
        data = processDataBarChart(data, infected, recovered, deaths, timeframe);

        //Titel setzten
        $('#ct_title').text(data.title);

        if (data.total_infected)
            $('#ct_infected_val').show().find('span').text(data.total_infected);
        else
            $('#ct_infected_val').hide();

        if (data.total_recovered)
            $('#ct_recovered_val').show().find('span').text(data.total_recovered);
        else
            $('#ct_recovered_val').hide();

        if (data.total_deaths)
            $('#ct_deaths_val').show().find('span').text(data.total_deaths);
        else
            $('#ct_deaths_val').hide();

        //Zeichnen der Grafik mit chart.js
        $('#countryChart').html('<canvas />');
        var ctx = $('#countryChart canvas');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: data.dataSets
            },
            options: {
                responsive: true,
                legend: {
                    position: "top"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });
}

//Funktion für das Zeichnen der Weltweiten Grafik
function drawLineChart(type, timeframe, country1, country2, country3)
{

    //AJAX Call zur API für verschiedene Länder und alle Monate oder einen Monat
    xhrLineChart = $.get('https://disease.sh/v3/covid-19/historical/' + country1 + ',' + country2 + ',' + country3 + '?lastdays=' + (timeframe == 1 ? 'all' : '30'), function(data) {

        //formatieren der Daten
        data = processDataLineChart(data, type);

        //Titel setzten
        let title = '';

        if (type == 'cases') title = 'Infektionen';
        if (type == 'recovered') title = 'Erholte';
        if (type == 'deaths') title = 'Verstorbene';

        $('#ww_title').text(title);

        //Zeichnen der Grafik mit chart.js
        $('#worldwideChart').html('<canvas />');
        var ctx = $('#worldwideChart canvas');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.dataSets
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: data.max,
                            min: 0,
                            stepSize: data.stepSize
                        }
                    }]
                }
            }
        });
    });
}

//Funktion die Daten der API für chartjs formatiert (weltweit)
function processDataLineChart(data, type)
{
    //return für das Darstellen der Daten
    let returnVar = {
        dataSets : [
            {
                label: data[0].country,
                data: [],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.1)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 0,
                pointRadius: 0
            },
            {
                label: data[1].country,
                data: [],
                backgroundColor: [
                    'rgba(255, 255, 0, 0.1)',

                ],
                borderColor: [
                    'rgba(255, 255, 0, 1)',

                ],
                borderWidth: 1,
                pointRadius: 0
            },
            {
                label: data[2].country,
                data: [],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.1)',

                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                ],
                borderWidth: 1,
                pointRadius: 0
            }
        ],
        labels : [],
        max : 0,
        stepSize : 0
    }

    //verarbeiten der Daten für Land 1
    for (var date in data[0].timeline[type])
    {
        //Wert von Daten einlesen und in Variable schreiben
        let val = data[0].timeline[type][date];

        //Daten zum Graph hinzufügen
        returnVar.dataSets[0].data.push(val);

        //Datum an die x-Achse anfügen und an europäische Schreibweise anpassen
        date = date.split('/');
        returnVar.labels.push(date[1] + '/' + date[0] + '/' + date[2]);

        //max. Wert für die y-Achse setzten
        if (returnVar.max < val)
            returnVar.max = val;
    }

    //verarbeiten der Daten für Land 2
    for (var date in data[1].timeline[type])
    {
         //Wert von Daten einlesen und in Variable schreiben
        let val = data[1].timeline[type][date];

        //Daten zum Graph hinzufügen
        returnVar.dataSets[1].data.push(val);

        //max. Wert für die y-Achse setzten
        if (returnVar.max < val)
            returnVar.max = val;
    }

    //verarbeiten der Daten für Land 3
    for (var date in data[2].timeline[type])
    {
        //Wert von Daten einlesen und in Variable schreiben
        let val = data[2].timeline[type][date];

        //Daten zum Graph hinzufügen
        returnVar.dataSets[2].data.push(val);

        //max. Wert für die y-Achse setzten
        if (returnVar.max < val)
            returnVar.max = val;
    }

    return returnVar;
}

//Funktion die Daten der API für chartjs formatiert (Schweiz)
function processDataBarChart(data, infected, recovered, deaths, timeframe)
{
    let currentMonth = '';
    let dataSet = {};

    //return für das Darstellen der Daten
    let returnVar = {
        dataSets : [],
        labels : [],
        total_recovered : 0,
        total_infected : 0,
        total_deaths : 0,
        title: ''
    }

    //Werte für x-Achse erstellen
    for (var date in data.timeline.cases) {
        //jetziger Monat anzeigen
        let currentLabel = date.split('/');
        currentLabel = currentLabel[0] + '/' + currentLabel[2];

        //zu X-Achse hinzufügen
        if (returnVar.labels.indexOf(currentLabel) == '-1')
            returnVar.labels.push(currentLabel);
    }

    //verarbeiten der Daten für infected
    if (infected)
    {
        dataSet = {};
        for (var date in data.timeline.cases) {
            //Wert von den cases in Variable schreiben
            let val = data.timeline.cases[date];

            //Datum anpassen und in Variable schreiben
            let itemMonth = date.split('/');
            itemMonth = itemMonth[0] + '/' + itemMonth[2];

            //Monat in dataSet schreiben
            if (!(itemMonth in dataSet))
                dataSet[itemMonth] = 0;

            //Wert vom Monat in dataSet schreiben
            dataSet[itemMonth] = val;
        }


         //return für chartjs
         let returnData = [];

        //dataSet für chartjs konvertieren
        for (var key in dataSet)
            returnData.push(dataSet[key]);

        //return Wert für chartjs setzten
        returnVar.dataSets.push({
            label: "Infiziert",
            backgroundColor: "rgba(255, 99, 132, .6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            data: returnData
        });

        //Total Wert setzten
        returnVar.total_infected = returnData[returnData.length-1];
    }

    //verarbeiten der Daten für deaths
    if (deaths)
    {
        dataSet = {};
        for (var date in data.timeline.deaths) {
            //Wert von den deaths in Variable schreiben
            let val = data.timeline.deaths[date];

            //Datum anpassen und in Variable schreiben
            let itemMonth = date.split('/');
            itemMonth = itemMonth[0] + '/' + itemMonth[2];

            //Monat in dataSet schreiben
            if (!(itemMonth in dataSet))
                dataSet[itemMonth] = 0;

            //Wert vom Monat in dataSet schreiben
            dataSet[itemMonth] = val;
        }

        //return für chartjs
        let returnData = [];

        //dataSet für chartjs konvertieren
        for (var key in dataSet)
            returnData.push(dataSet[key]);

        //return Wert für chartjs setzten
        returnVar.dataSets.push({
            label: "Verstorben",
            backgroundColor: "rgba(0, 255, 0, .6)",
            borderColor: "rgba(0, 255, 0, 1)",
            borderWidth: 1,
            data: returnData
        });

        //Total Wert setzten
        returnVar.total_deaths = returnData[returnData.length-1];
    }

    //verarbeiten der Daten für recovered
    if (recovered)
    {
        dataSet = {};
        for (var date in data.timeline.recovered) {
            //Wert von den recovered in Variable schreiben
            let val = data.timeline.recovered[date];

            //Datum anpassen und in Variable schreiben
            let itemMonth = date.split('/');
            itemMonth = itemMonth[0] + '/' + itemMonth[2];

            //Monat in dataSet schreiben
            if (!(itemMonth in dataSet))
                dataSet[itemMonth] = 0;

            //Wert vom Monat in dataSet schreiben
            dataSet[itemMonth] = val;
        }

        //return für chartjs
        let returnData = [];

        //dataSet für chartjs konvertieren
        for (var key in dataSet)
            returnData.push(dataSet[key]);

        //return Wert für chartjs setzten
        returnVar.dataSets.push({
            label: "Erholt",
            backgroundColor: "rgba(255, 255, 0, 06)",
            borderColor: "rgba(255, 255, 0, 1)",
            borderWidth: 1,
            data: returnData
        });

        //Total Wert setzten
        returnVar.total_recovered = returnData[returnData.length-1];
    }

    //Titel für Total setzten
    returnVar.title = timeframe == 1 ? 'Total' : 'Total für ' + returnVar.labels[0];

    return returnVar;
}
