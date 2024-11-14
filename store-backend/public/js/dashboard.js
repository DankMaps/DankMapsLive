const ctx1 = document.getElementById('salesChart').getContext('2d');
const ctx2 = document.getElementById('ordersChart').getContext('2d');

// Line Chart
new Chart(ctx1, {
  type: 'line',
  data: {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Sales Value',
      data: [10000, 20000, 15000, 30000, 25000, 40000, 45000, 50000],
      borderColor: '#3f51b5',
      fill: false
    }]
  },
});

// Bar Chart
new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Total Orders',
      data: [20, 25, 30, 20, 15, 25],
      backgroundColor: '#ff5722'
    }]
  }
});
