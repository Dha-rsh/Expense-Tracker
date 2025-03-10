let expenses = [];

function addExpense(description, amount, category) {
    if (!description || amount <= 0 || isNaN(amount) || !category) {
        console.log("Invalid expense details.");
        return;
    }
    
    let expense = {
        id: expenses.length + 1,
        description: description,
        amount: parseFloat(amount),
        category: category,
        date: new Date().toLocaleString()
    };
    
    expenses.push(expense);
    console.log("Expense added successfully:", expense);
    displayExpenses();
    updateChart();
    
    document.getElementById("expenseForm").reset();
}

function handleAddExpense() {
    let description = document.getElementById("description").value;
    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;
    addExpense(description, parseFloat(amount), category);
}

function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;
    
    document.getElementById("description").value = expense.description;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    
    deleteExpense(id);
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    displayExpenses();
    updateChart();
}

function displayExpenses() {
    let expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = `
        <table class="expense-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            ${expenses.map(expense => `
                <tr class="expense-item">
                    <td>${expense.description}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>${expense.category}</td>
                    <td>${expense.date}</td>
                    <td class="actions">
                        <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
                    </td>
                </tr>
            `).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById("totalAmount").textContent = expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2);
}

function updateChart() {
    if (!expenses.length) {
        console.log("No expenses to display in chart.");
        return;
    }

    let categories = {};
    expenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    let ctx = document.getElementById("expenseChart");
    if (!ctx) {
        console.error("Canvas element with id 'expenseChart' not found.");
        return;
    }

    ctx = ctx.getContext("2d");

    if (window.expenseChartInstance) {
        window.expenseChartInstance.destroy();
    }

    window.expenseChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
            }]
        },
        options: {
            title: {
            display:true,
            text:"Pie chart"
            }
        }
    });

    console.log("Pie chart updated successfully.");
}

