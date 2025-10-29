import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import authRoutes from "./authRoutes.js";

const app = express();

// ✅ CORS setup — allow both localhost & Vercel frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://nikkis-bouquet-eight.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.options(/.*/, cors());

app.use(express.json());

// ✅ Auth routes (if any)
app.use("/api/auth", authRoutes);

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nayanasurendranvb@gmail.com", // your Gmail
    pass: "rtsrahhnhvqcthlc", // your App Password (not normal password)
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ Contact form route
app.post("/api/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: "nayanasurendranvb@gmail.com",  // must be same as transporter user
    to: "nayanasurendranvb@gmail.com",    // where you want to receive messages
    replyTo: email,                       // allows replying to sender
    subject: `New message from ${name}`,
    text: `
You got a new message from Nikki’s Bouquet contact form 💐

Name: ${name}
Email: ${email}
Message:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Message sent successfully!");
    res.json({ success: true, msg: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, msg: "Failed to send email." });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🌸 Nikki’s Bouquet backend is live and working!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
