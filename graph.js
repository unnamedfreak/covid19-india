const confirmedEl = document.getElementById("confirmed");
const canvas = document.getElementById('myChart');
const ctx = canvas.getContext('2d');
let myChart;

const drawChart = (labels, plots) => {
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Confirmed Cases",
                    data: plots,
                    backgroundColor: 'rgba(200, 15, 15, 0.4)',
                    borderColor: 'rgba(200, 15, 15, 0.7)',
                    borderWidth: 3,
                    lineTension: 0
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            tooltips: {
                mode: 'nearest'
            },
            resoponsive: true
        }
    });
}

const resizeCanvas = () => {
    canvas.width = window.innerWidth*0.275;
    canvas.height = 250;
    confirmedEl.height = window.innerHeight-canvas.height;
}

const main = async () => {
    const res = await fetch('https://covid-india.firebaseio.com/dailyStats.json');
    const dailyStats = await res.json();

    canvas.width = window.innerWidth*0.275;
    canvas.height = 250;
    confirmedEl.height = window.innerHeight-canvas.height;

    let dateLabels = [];
    let dataPlots = [];

    for(let key in dailyStats) {
        dateLabels.push(key);
        dataPlots.push(dailyStats[key]);
    }
    drawChart(dateLabels, dataPlots)
}

window.addEventListener("resize", () => {
    resizeCanvas();
});

main();