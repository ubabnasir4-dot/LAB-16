
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "student_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("MySQL Connected!");
    }
});

// GET
app.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, result) => {
        if (err) return res.status(500).json({ message: "Error fetching students" });
        res.json(result);
    });
});

// POST
app.post("/students", (req, res) => {
    const { name, email } = req.body;

    db.query(
        "INSERT INTO students (name, email) VALUES (?, ?)",
        [name, email],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error adding student" });
            res.json({ message: "Student added successfully!" });
        }
    );
});

// PUT
app.put("/students/:id", (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE students SET name = ?, email = ? WHERE id = ?",
        [name, email, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error updating student" });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
            res.json({ message: "Student updated successfully!" });
        }
    );
});

// DELETE
app.delete("/students/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting student" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted successfully!" });
    });
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
