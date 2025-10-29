import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import authRoutes from "./authRoutes.js";

const app = express();

// ✅ CORS setup — add both frontend URLs (localhost + vercel)
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

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nayanasurendranvb@gmail.com",
    pass: "rtsrahhnhvqcthlc",
  },
});

// ✅ Contact form route
app.post("/api/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: "yourgmail@gmail.com",
    subject: `New message from ${name}`,
    text: `
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
app.get("/", (req, res) => {
  res.send("🌸 Nikki’s Bouquet backend is live and working!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
