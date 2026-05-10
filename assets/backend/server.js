import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the project root
app.use(express.static(rootDir));

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT || 5000}`);
});
