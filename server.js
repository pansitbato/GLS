const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = "https://lzxproatazxlsyfybzev.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6eHByb2F0YXp4bHN5ZnliemV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMzk5ODksImV4cCI6MjA2NTYxNTk4OX0.NcfkoS1EsdPajn5tMyaHmeq3Q0niy8hODpz569XXKb0"; // ⚠️ Replace with your actual key, but keep it secure!
const supabase = createClient(supabaseUrl, supabaseKey);

const formatTimestamp = (time) => {
    if (!time) return null;

    const today = new Date();
    const [hours, minutes] = time.split(":"); // Extract hours and minutes
    today.setHours(hours, minutes, 0, 0);

    // Convert to local time manually instead of UTC
    return today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0") + " " +
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":00";
};




app.post("/register", async (req, res) => {
    const { firstname, lastname, email, contact, person, purpose, timein, timeout } = req.body;

    if (!firstname || !lastname || !email || !contact || !person || !purpose || !timein || !timeout) {
        console.error("Form Incomplete");
        return res.status(400).json({ error: "Form Incomplete" });
    }

    const formattedTimeIn = formatTimestamp(timein);
    const formattedTimeOut = formatTimestamp(timeout);

    try {
        const { data, error } = await supabase
            .from("guests")
            .insert([{ firstname, lastname, email, contact, person, purpose, timein: formattedTimeIn, timeout: formattedTimeOut }]);

        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: error.message || "Unknown error" });
        }

        const successResponse = { message: "Register Successful", data };
        console.log("Final Response Sent:", successResponse);  
        res.status(201).json(successResponse);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message || "Unexpected server error" });
    }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
