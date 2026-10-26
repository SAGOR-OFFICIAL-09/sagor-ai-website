module.exports = async (req, res) => {
  const message = req.query.message;
  const model = req.query.model || "nemotron-3-ultra-550b-a55b:free";
  const key = process.env.UNOROUTER_API_KEY || "YOUR-UNOROUTER-KEY-HERE";

  if (!message) {
    return res.status(400).json({
      status: "error",
      author: "SAGOR",
      message: "message lagbe — use: /api/sagor?message=Hello",
    });
  }

  if (key.includes("YOUR-UNOROUTER-KEY-HERE")) {
    return res.status(500).json({
      status: "error",
      author: "SAGOR",
      message:
        "UnoRouter key bosano hoyni — Vercel dashboard-e UNOROUTER_API_KEY env var bosao, tarpor redeploy koro",
    });
  }

  try {
    const r = await fetch("https://api.unorouter.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: message }],
      }),
    });
    const text = await r.text();

    if (!r.ok) {
      return res.status(502).json({
        status: "error",
        author: "SAGOR",
        message: "chat API failed",
        detail: text.slice(0, 300),
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    const reply = data.choices?.[0]?.message?.content || null;

    return res.json({ status: "success", author: "SAGOR", reply, data });
  } catch (err) {
    return res.status(502).json({
      status: "error",
      author: "SAGOR",
      message: "chat API failed",
      detail: err.message,
    });
  }
};
