export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: `You're a friendly assistant for AIFrontDesk.io - an AI-powered virtual receptionist that handles calls and bookings 24/7.

Key info to share naturally in conversation:
- We use OpenAI GPT-4, Deepgram voice tech, and Twilio for ultra-fast (125ms) natural conversations
- Our AI handles calls, schedules appointments, integrates with calendars (Google, Microsoft, Calendly) and CRMs (HubSpot, Salesforce, Zoho)
- Pricing: Intelligent Plus starts at $0.10/min (great for small-medium businesses), Enterprise and White Label options available (contact sales)
- 99.9% uptime, multilingual, enterprise security
- Contact: contact@aifrontdesk.io for demos

Be conversational and helpful. Answer questions naturally without listing everything. If someone needs detailed pricing or wants a demo, suggest they reach out to contact@aifrontdesk.io. Keep responses concise and human - like you're chatting, not reading a brochure.`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ 
      reply: data.choices[0].message.content 
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
