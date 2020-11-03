    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            datasets: [{
                label: 'ZH',
                data: [1200, 1900, 3000, 5000, 2000, 300, 4000, 8000,],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.1)',
                    
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
                },
                {
                label: 'SH',
                data: [2000, 12000, 14658, 500, 2456, 13543, 5046, 8549,],
                backgroundColor: [
                    'rgba(255, 255, 0, 0.1)',
                 
                ],
                borderColor: [
                    'rgba(255, 255, 0, 1)',
               
                ],
                borderWidth: 1
                },
            
                {
                label: 'SG',
                data: [5000, 15631, 19543, 2154, 6548, 1235, 6517, 8016,],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.1)',
                    
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                ],
                borderWidth: 1
                }
                
            ]
            

        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 20000,
                        min: 0,
                        stepSize: 2500
                    }
                }]
            }
        }
    });