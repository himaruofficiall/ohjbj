import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html } = req.body;

  const payload = {
    name: 'html-upload',
    files: [
      {
        file: 'index.html',
        data: html
      }
    ]
  };

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  // ✅ Cek apakah alias tersedia
  const alias = data?.alias || (data?.aliases?.[0] ?? null);

  if (alias) {
    res.status(200).json({ url: `https://${alias}` });
  } else {
    console.error('Gagal mendapatkan alias:', data);
    res.status(500).json({ error: 'Gagal mendapatkan URL dari Vercel' });
  }
}
