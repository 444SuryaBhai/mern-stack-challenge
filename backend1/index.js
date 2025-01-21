const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const uri = "mongodb+srv://msuryateja48:N48oG3FvENfMvV8I@cluster0.x0j21.mongodb.net/Transactions";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    sold: Boolean,
    category: String,
    image: String,
});

const Transaction = mongoose.model("Transaction", transactionSchema);

app.get("/", (req, res) => {
    res.send("Express app is running");
});

// Initialize Database API
app.get("/initialize-database", async (req, res) => {
    try {
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        const data = response.data;

        await Transaction.deleteMany(); // Clear existing data
        await Transaction.insertMany(data); // Insert new data

        res.json({ message: "Database initialized successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Transactions API
app.get("/transactions", async (req, res) => {
    const { search = "", page = 1, perPage = 5, month } = req.query;

    try {
        let priceSearch = null;
        if (!isNaN(Number(search))) {
            priceSearch = Number(search);
        }

        const regex = new RegExp(search, "i");
        const query = {
            $or: [
                { title: regex },
                { description: regex },
                ...(priceSearch !== null ? [{ price: priceSearch }] : []),
            ],
        };

        if (month && !isNaN(month) && month >= 1 && month <= 12) {
            query.$expr = { $eq: [{ $month: "$dateOfSale" }, parseInt(month, 10)] };
        }

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Statistics API
app.get("/statistics", async (req, res) => {
    const { month } = req.query;

    try {
        const matchQuery = {};
        if (month && !isNaN(month) && month >= 1 && month <= 12) {
            matchQuery.$expr = { $eq: [{ $month: "$dateOfSale" }, parseInt(month, 10)] };
        }

        const totalSales = await Transaction.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalSaleAmount: { $sum: "$price" },
                    totalSoldItems: { $sum: { $cond: ["$sold", 1, 0] } },
                    totalNotSoldItems: { $sum: { $cond: ["$sold", 0, 1] } },
                },
            },
        ]);

        res.json(totalSales[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bar Chart API
app.get("/bar-chart", async (req, res) => {
    const { month } = req.query;

    try {
        const matchQuery = {};
        if (month && !isNaN(month) && month >= 1 && month <= 12) {
            matchQuery.$expr = { $eq: [{ $month: "$dateOfSale" }, parseInt(month, 10)] };
        }

        const ranges = [
            [0, 100],
            [101, 200],
            [201, 300],
            [301, 400],
            [401, 500],
            [501, 600],
            [601, 700],
            [701, 800],
            [801, 900],
            [901, Infinity],
        ];

        const barChartData = await Promise.all(
            ranges.map(async ([min, max]) => {
                const count = await Transaction.countDocuments({
                    ...matchQuery,
                    price: { $gte: min, $lt: max === Infinity ? undefined : max },
                });
                return { range: `${min}-${max}`, count }; // Corrected template literal
            })
        );

        res.json(barChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pie Chart API
app.get("/pie-chart", async (req, res) => {
    const { month } = req.query;

    try {
        const matchQuery = {};
        if (month && !isNaN(month) && month >= 1 && month <= 12) {
            matchQuery.$expr = { $eq: [{ $month: "$dateOfSale" }, parseInt(month, 10)] };
        }

        const pieChartData = await Transaction.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Combined API
app.get("/combined", async (req, res) => {
    const { month } = req.query;

    try {
        const [statistics, barChart, pieChart] = await Promise.all([
            axios.get("http://localhost:4000/statistics", { params: { month } }), // Fixed URL
            axios.get("http://localhost:4000/bar-chart", { params: { month } }), // Fixed URL
            axios.get("http://localhost:4000/pie-chart", { params: { month } }), // Fixed URL
        ]);

        res.json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
