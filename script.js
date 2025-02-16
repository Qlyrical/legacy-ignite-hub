// Load existing payments from Firebase when the page loads
document.addEventListener('DOMContentLoaded', loadPayments);

document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get input values
    const name = document.getElementById('name').value;
    const telephone = document.getElementById('telephone').value;

    // Get selected months
    const selectedMonths = Array.from(document.querySelectorAll('#monthSelection input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    // Calculate the amount based on the number of selected months
    const amount = selectedMonths.length * 10; // Each month is 10 Cedis

    // Validate the amount
    if (amount < 10) {
        alert("The amount must be at least 10 Ghana Cedis.");
        return; // Stop the function if the amount is less than 10
    }

    // Prepare payment data
    const paymentData = { name, telephone, amount, months: selectedMonths };

    // Send payment data to the server
    fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(() => {
        // Refresh the table display
        loadPayments();
        // Clear the form
        document.getElementById('paymentForm').reset();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

// Reset button functionality
document.getElementById('resetButton').addEventListener('click', function() {
    // Clear all payment records from the display
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Reset total payments
    document.getElementById('totalPayments').innerText = '0';

    // Optionally, clear the payments from the backend (Firebase)
    fetch('http://localhost:3000/payments', {
        method: 'DELETE' // Assuming you have a DELETE endpoint to clear payments
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to reset payments');
        }
        console.log('Payments reset successfully');
    })
    .catch(error => {
        console.error('Error resetting payments:',
