const { spawn } = require("child_process");

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const start = Date.now();
  const py = spawn("python3", ["checker.py"]);

  py.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.includes("✅") || line.includes("❌")) {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const matches = line.match(/Total cookie dicek: (\d+)/);
        const total = matches ? parseInt(matches[1]) : 0;
        const percent = Math.min((total / 100) * 100, 100); // estimasi
        res.write(`data: ${JSON.stringify({ total, percent, elapsed })}\n\n`);
      }
    });
  });

  py.on("close", () => {
    const total = 100;
    res.write(`data: ${JSON.stringify({ done: true, total })}\n\n`);
    res.end();
  });
}
