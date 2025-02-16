// Load existing payments from localStorage when the page loads
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

    // Load existing payments from localStorage
    let payments = JSON.parse(localStorage.getItem('payments')) || [];

    // Check if the member already exists in the payments array
    const existingPaymentIndex = payments.findIndex(payment => payment.name === name);

    if (existingPaymentIndex > -1) {
        // If the member exists, update their payment amount
        payments[existingPaymentIndex].amount += amount;
        
        // Update the months in the existing payment
        const existingMonths = payments[existingPaymentIndex].months;
        const updatedMonths = [...new Set([...existingMonths, ...selectedMonths])]; // Combine and remove duplicates
        payments[existingPaymentIndex].months = updatedMonths;
    } else {
        // Create a new payment record
        const newPayment = {
            name: name,
            telephone: telephone,
            amount: amount,
            months: selectedMonths
        };
        payments.push(newPayment);
    }

    // Save updated payments to localStorage
    localStorage.setItem('payments', JSON.stringify(payments));

    // Refresh the table display
    displayPayments(payments);

    // Clear the form
    document.getElementById('paymentForm').reset();
});

function loadPayments() {
    const payments = JSON.parse(localStorage.getItem('payments')) || [];
    displayPayments(payments);
}

function displayPayments(payments) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Sort payments alphabetically by name
    payments.sort((a, b) => a.name.localeCompare(b.name));

    payments.forEach(payment => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${payment.name}</td>
            <td>${payment.telephone}</td>
            <td>${payment.amount.toFixed(2)}</td>
            <td>${payment.months.join(', ')}</td>
        `;
        tableBody.appendChild(newRow);
    });

    // Update total payments
    const totalPayments = payments.reduce((total, payment) => total + payment.amount, 0);
    document.getElementById('totalPayments').innerText = totalPayments.toFixed(2);
}


