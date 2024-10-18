const ctx = document.getElementById('pollChart').getContext('2d');

// Data for the chart
const data = {
    labels: ['Sósíalistaflokkurinn', 'VG', 'Viðreisn', 'Flokkur fólksins', 'Píratar', 'Miðflokkurinn', 'Framsóknarflokkurinn', 'Samfylkingin', 'Sjálfstæðisflokkurinn'],
    datasets: [
        {
            label: 'Spálíkan 24',
            data: [0, 3, 7, 7, 2, 12, 9, 12, 11],
            backgroundColor: [
                '#ff9999', '#99ff99', '#ffff99', '#ffcc99', '#cc99ff', '#99ccff', '#66ff66', '#ff6666', '#6699ff'
            ],
            borderColor: [
                '#ff4d4d', '#4dff4d', '#ffff4d', '#ffb84d', '#b84dff', '#4db8ff', '#00e600', '#ff1a1a', '#3366ff'
            ],
            borderWidth: 1
        },
        {
            label: 'Kosningar 21',
            data: [0, 8, 5, 6, 6, 3, 13, 6, 16], // Example values for previous election
            backgroundColor: [
                'rgba(255, 153, 153, 0.4)', 'rgba(153, 255, 153, 0.4)', 'rgba(255, 255, 153, 0.4)', 
                'rgba(255, 204, 153, 0.4)', 'rgba(204, 153, 255, 0.4)', 'rgba(153, 204, 255, 0.4)',
                'rgba(102, 255, 102, 0.4)', 'rgba(255, 102, 102, 0.4)', 'rgba(102, 153, 255, 0.4)'
            ],
            borderColor: [
                'rgba(255, 77, 77, 0.6)', 'rgba(77, 255, 77, 0.6)', 'rgba(255, 255, 77, 0.6)', 
                'rgba(255, 184, 77, 0.6)', 'rgba(184, 77, 255, 0.6)', 'rgba(77, 184, 255, 0.6)',
                'rgba(0, 230, 0, 0.6)', 'rgba(255, 26, 26, 0.6)', 'rgba(51, 102, 255, 0.6)'
            ],
            borderWidth: 1,
        }
    ]
};

// Create the chart
const pollChart = new Chart(ctx, {
    type: 'bar', // Vertical bar chart (default)
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true, // Ensure the y-axis starts at zero
                max: 14, // Extend the y-axis to 2 units more than the max data point
            }
        },
        responsive: true,
        maintainAspectRatio: true, // Ensure the chart respects its aspect ratio
        plugins: {
            legend: {
                display: true, // Display the legend to distinguish between current and previous results
            },
            title: {
                display: true,
                text: 'Spálíkan fyrir kosningar',
                font: {
                    size: 18
                }
            }
        }
    }
});
