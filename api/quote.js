// Server-side proxy for Finnhub quotes, so the API key never reaches the browser.
// The key lives in Vercel: Project Settings > Environment Variables > FINNHUB_KEY.
const ALLOWED = new Set(['SPY', 'QQQ', 'DIA', 'AAPL', 'MSFT', 'NVDA', 'AMZN', 'TSLA', 'GLD', 'USO', 'IEF', 'VIXY']);

module.exports = async (req, res) => {
  const symbol = String(req.query.symbol || '').toUpperCase();
  if (!ALLOWED.has(symbol)) return res.status(400).json({ error: 'symbol not allowed' });

  const key = process.env.FINNHUB_KEY;
  if (!key) return res.status(503).json({ error: 'quotes not configured' });

  try {
    const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`);
    const d = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(r.ok ? 200 : 502).json({ c: d.c, pc: d.pc });
  } catch (e) {
    return res.status(502).json({ error: 'upstream error' });
  }
};
