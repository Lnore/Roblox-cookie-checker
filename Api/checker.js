const { spawn } = require("child_process");

export default function handler(req, res) {
  const checker = spawn("python3", ["checker.py"]);

  checker.on("close", () => {
    res.status(200).send("Checker selesai");
  });
}
