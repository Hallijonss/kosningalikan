document.addEventListener("DOMContentLoaded", function () {
    // Real party names and corresponding poll data
    const pollData = [
        { 'Samfylkingin': 18.3, 'Miðflokkurinn': 13.5, 'Sjálfstæðisflokkurinn': 11.5, 'Viðreisn': 22.0, 'Flokkur Fólksins': 12.5, 'Píratar': 6.7, 'Framsókn': 4.4, 'Sósíalistaflokkurinn': 6.4, 'Vinstri Grænir': 3, 'Lýðræðisflokkurinn': 1 },
        { 'Samfylkingin': 22.7, 'Miðflokkurinn': 12.6, 'Sjálfstæðisflokkurinn': 14.6, 'Viðreisn': 20.9, 'Flokkur Fólksins': 8.8, 'Píratar': 4.3, 'Framsókn': 5.9, 'Sósíalistaflokkurinn': 5, 'Vinstri Grænir': 3.1, 'Lýðræðisflokkurinn': 1.6 },
        { 'Samfylkingin': 20.8, 'Miðflokkurinn': 14.3, 'Sjálfstæðisflokkurinn': 16.4, 'Viðreisn': 15.4, 'Flokkur Fólksins': 10.2, 'Píratar': 5.5, 'Framsókn': 5.9, 'Sósíalistaflokkurinn': 6.2, 'Vinstri Grænir': 4, 'Lýðræðisflokkurinn': 1 },
        { 'Samfylkingin': 9.9, 'Miðflokkurinn': 5.4, 'Sjálfstæðisflokkurinn': 24.4, 'Viðreisn': 8.3, 'Flokkur Fólksins': 8.8, 'Píratar': 8.6, 'Framsókn': 17.3, 'Sósíalistaflokkurinn': 4.1, 'Vinstri Grænir': 11.5, 'Lýðræðisflokkurinn': 0 }
    ];

    // Jurisdictions and seat counts
    const jurisdictions = {
        "Reykjavík Norður": 11,
        "Reykjavík Suður": 11,
        "Suðvestur": 14,
        "Norðvestur": 7,
        "Norðaustur": 10,
        "Suður": 10
    };

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
    let seats = {}; // Track the latest seat allocation for each jurisdiction

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

        // Calculate Senate seats allocation by jurisdiction
        calculateSeatsByJurisdiction(aggregateVotes);

        // Update the seat allocation for selected parties
        updateTotalSeatsForSelectedParties();
    }

    // Function to calculate seats by jurisdiction using the selected multiplier set
    function calculateSeatsByJurisdiction(aggregateVotes) {
        // Fetch the selected multiplier set (set_1 or set_2)
        const multiplierSet = document.getElementById('multiplierSet').value;

        // Initialize seats allocation for each jurisdiction
        seats = {};
        Object.keys(jurisdictions).forEach(jurisdiction => {
            seats[jurisdiction] = {};
            partyNames.forEach(party => {
                seats[jurisdiction][party] = 0;
            });
        });

        // Read in the JSON data for multipliers
        fetch('multiplierSet.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Multiplier Data:", data);
                Object.keys(jurisdictions).forEach(jurisdiction => {
                    const seatCount = jurisdictions[jurisdiction];
                    partyNames.forEach(party => {
                        const partyData = data.find(item => item.Flokkur === party);
                        if (!partyData || !partyData[jurisdiction] || !partyData[jurisdiction][multiplierSet]) {
                            console.warn(`Multiplier not found for party "${party}", jurisdiction "${jurisdiction}", multiplier set "${multiplierSet}"`);
                            return; // Skip this iteration if data is missing
                        }
                        const multiplier = partyData[jurisdiction][multiplierSet];
                        seats[jurisdiction][party] = Math.round((aggregateVotes[party] / 100) * seatCount * multiplier);
                    });
                });
                console.log("Seats by Jurisdiction:", seats);

                // Calculate total seats for each party
                let totalSeats = {};
                partyNames.forEach(party => {
                    totalSeats[party] = 0;
                    Object.keys(jurisdictions).forEach(jurisdiction => {
                        totalSeats[party] += seats[jurisdiction][party];
                    });
                });

                // Ensure total seats allocation matches the total number of seats per jurisdiction
                let totalSeatsAllocated = Object.values(totalSeats).reduce((a, b) => a + b, 0);
                const totalJurisdictionSeats = Object.values(jurisdictions).reduce((a, b) => a + b, 0);
                let seatDifference = totalJurisdictionSeats - totalSeatsAllocated;
                if (seatDifference !== 0) {
                    for (let i = 0; i < Math.abs(seatDifference); i++) {
                        const partyIndex = i % partyNames.length;
                        totalSeats[partyNames[partyIndex]] += seatDifference > 0 ? 1 : -1;
                    }
                }
                console.log("Total Seats Allocation (Adjusted):", totalSeats);

                // Update Seat Chart with the calculated seat allocation
                seatChart.data.datasets[0].data = partyNames.map(party => totalSeats[party]);
                seatChart.update();

                console.log("Seat Chart Data:", seatChart.data.datasets[0].data);
            })
            .catch(error => {
                console.error('Error fetching or parsing the JSON file:', error);
            });
    }

    // Function to calculate total seats for selected parties
    function updateTotalSeatsForSelectedParties() {
        const selectedParties = Array.from(document.querySelectorAll('.party-checkbox:checked'))
            .map(checkbox => checkbox.value);

        let totalSeats = 0;
        selectedParties.forEach(party => {
            const index = partyNames.indexOf(party);
            if (index !== -1) {
                totalSeats += seatChart.data.datasets[0].data[index];
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

    // Event listener for multiplier set dropdown
    document.getElementById('multiplierSet').addEventListener('change', updateResults);

    // Initial calculation to set up the charts
    updateResults();
});
