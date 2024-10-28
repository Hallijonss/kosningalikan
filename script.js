document.addEventListener("DOMContentLoaded", function () {
    // Real party names and corresponding poll data
    const pollData = [
        { 'Samfylkingin': 24.8, 'Miðflokkurinn': 15.1, 'Sjálfstæðisflokkurinn': 15.6, 'Viðreisn': 14.1, 'Flokkur Fólksins': 10.8, 'Píratar': 6.1, 'Framsókn': 6.2, 'Sósíalistaflokkurinn': 4.2, 'Vinstri Grænir': 2.3, 'Lýðræðisflokkurinn': 0.9 },
        { 'Samfylkingin': 22.2, 'Miðflokkurinn': 15.9, 'Sjálfstæðisflokkurinn': 13.9, 'Viðreisn': 16.2, 'Flokkur Fólksins': 9.3, 'Píratar': 4.5, 'Framsókn': 6.9, 'Sósíalistaflokkurinn': 4, 'Vinstri Grænir': 3.8, 'Lýðræðisflokkurinn': 1.6 },
        { 'Samfylkingin': 26.4, 'Miðflokkurinn': 16, 'Sjálfstæðisflokkurinn': 17.1, 'Viðreisn': 10.1, 'Flokkur Fólksins': 6.7, 'Píratar': 7.8, 'Framsókn': 7, 'Sósíalistaflokkurinn': 5.7, 'Vinstri Grænir': 3.4, 'Lýðræðisflokkurinn': 0 },
        { 'Samfylkingin': 9.9, 'Miðflokkurinn': 5.4, 'Sjálfstæðisflokkurinn': 24.4, 'Viðreisn': 8.3, 'Flokkur Fólksins': 8.8, 'Píratar': 8.6, 'Framsókn': 17.3, 'Sósíalistaflokkurinn': 4.1, 'Vinstri Grænir': 11.5, 'Lýðræðisflokkurinn': 0 }
    ];

    // Party names
    const partyNames = ['Samfylkingin', 'Miðflokkurinn', 'Sjálfstæðisflokkurinn', 'Viðreisn', 'Flokkur Fólksins', 'Píratar', 'Framsókn', 'Sósíalistaflokkurinn', 'Vinstri Grænir', 'Lýðræðisflokkurinn'];

    // Party colors
    const partyColors = {
        'Samfylkingin': '#ee1b08',
        'Miðflokkurinn': '#082570',
        'Sjálfstæðisflokkurinn': '#080893',
        'Viðreisn': '#ff7f00',
        'Flokkur Fólksins': '#ffcc44',
        'Píratar': '#a020f0',
        'Framsókn': '#008000',
        'Sósíalistaflokkurinn': '#ff0000',
        'Vinstri Grænir': '#00a86b',
        'Lýðræðisflokkurinn': '#808080'
    };

    // Setting up charts
    const pollChartContext = document.getElementById("pollChart").getContext("2d");
    const seatChartContext = document.getElementById("seatChart").getContext("2d");

    let pollChart, seatChart;
    let seats = []; // Track the latest seat allocation for use in the checkbox feature

    function setupCharts() {
        // Setting up the Aggregate Vote Percentage Chart (Bar Chart)
        pollChart = new Chart(pollChartContext, {
            type: 'bar',
            data: {
                labels: partyNames,
                datasets: [{
                    data: Array(partyNames.length).fill(0), // Empty data initially
                    backgroundColor: partyNames.map(party => partyColors[party])
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45, // Rotate labels slightly to prevent overlap
                            minRotation: 45,  // Ensure they stay at 45 degrees
                            align: 'center',  // Center the text labels
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 35 // Limit y-axis to 35%
                    }
                },
                plugins: {
                    legend: {
                        display: false // Disable the legend to prevent "undefined"
                    }
                }
            }
        });
        

        // Setting up the Senate Seats Allocation Chart (Pie Chart)
        seatChart = new Chart(seatChartContext, {
            type: 'pie',
            data: {
                labels: partyNames,
                datasets: [{
                    data: Array(partyNames.length).fill(0), // Empty data initially
                    backgroundColor: partyNames.map(party => partyColors[party])
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Adjust chart to fit better
                plugins: {
                    legend: {
                        display: true // Remove legend from pie chart
                    },
                    datalabels: {
                        display: false // Disable data labels in the pie chart
                    }
                }
            }
        });
    }

    // Function to update results based on selected weights
    function updateResults() {
        // Fetch the weights from the dropdown inputs
        const weights = [
            parseInt(document.getElementById("poll1").value, 10),
            parseInt(document.getElementById("poll2").value, 10),
            parseInt(document.getElementById("poll3").value, 10),
            parseInt(document.getElementById("poll4").value, 10)
        ];

        console.log("Weights:", weights);

        // Initialize aggregateVotes for each party with 0
        let aggregateVotes = {};
        partyNames.forEach(party => {
            aggregateVotes[party] = 0;
        });
        let totalWeight = 0;

        // Calculate weighted sums for each party
        pollData.forEach((poll, index) => {
            const weight = weights[index];
            if (weight > 0) {
                totalWeight += weight;
                partyNames.forEach(party => {
                    if (poll[party] !== undefined) {
                        aggregateVotes[party] += poll[party] * weight;
                    } else {
                        console.warn(`Party "${party}" not found in poll ${index + 1}`);
                    }
                });
            }
        });

        console.log("Aggregate Votes Before Normalization:", aggregateVotes);

        // Normalize the aggregated votes to get percentages if totalWeight > 0
        if (totalWeight > 0) {
            partyNames.forEach(party => {
                aggregateVotes[party] = parseFloat((aggregateVotes[party] / totalWeight).toFixed(2));
            });
        }

        console.log("Aggregate Votes After Normalization:", aggregateVotes);

        // Update Poll Chart with the aggregated vote percentages for each party
        pollChart.data.datasets[0].data = partyNames.map(party => aggregateVotes[party]);
        pollChart.update();

        console.log("Poll Chart Data:", pollChart.data.datasets[0].data);

        // Calculate Senate seats allocation
        const totalSeats = 63;
        seats = partyNames.map(party => Math.round((aggregateVotes[party] / 100) * totalSeats));

        console.log("Initial Seat Allocation:", seats);

        // Adjust seat allocation to ensure it totals 63
        let seatDifference = totalSeats - seats.reduce((a, b) => a + b, 0);
        if (seatDifference !== 0) {
            for (let i = 0; i < Math.abs(seatDifference); i++) {
                const index = i % seats.length;
                seats[index] += seatDifference > 0 ? 1 : -1;
            }
        }

        console.log("Adjusted Seat Allocation:", seats);

        // Update Seat Chart with the calculated seat allocation
        seatChart.data.datasets[0].data = seats;
        seatChart.update();

        console.log("Seat Chart Data:", seatChart.data.datasets[0].data);

        // Update the seat allocation for selected parties
        updateTotalSeatsForSelectedParties();
    }

    // Function to calculate total seats for selected parties
    function updateTotalSeatsForSelectedParties() {
        const selectedParties = Array.from(document.querySelectorAll('.party-checkbox:checked'))
            .map(checkbox => checkbox.value);

        let totalSeats = 0;
        selectedParties.forEach(party => {
            const index = partyNames.indexOf(party);
            if (index !== -1) {
                totalSeats += seats[index];
            }
        });

        document.getElementById("total-seats").textContent = totalSeats;
    }

    // Event listeners for party checkboxes
    document.querySelectorAll('.party-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalSeatsForSelectedParties);
    });

    // Initialize the charts and calculations
    setupCharts();

    // Event listeners for poll weight dropdowns
    document.querySelectorAll('.poll-weight').forEach(select => {
        select.addEventListener('change', updateResults);
    });

    // Initial calculation to set up the charts
    updateResults();
});

