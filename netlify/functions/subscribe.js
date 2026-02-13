// Netlify Function to handle Acumbamail subscription
// Avoids CORS issues with direct API calls from browser

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    
    if (!email) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Email required' }) 
      };
    }

    // Acumbamail API
    const response = await fetch('https://acumbamail.com/api/1/addSubscriber/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        auth_token: '5bc0183af8aa4cdaa65ea20a037191fa',
        list_id: '1246898',
        email: email,
        double_optin: '1'  // Enable double opt-in for best practices
      })
    });

    const result = await response.text();
    
    if (response.ok) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true, message: 'Subscribed!' })
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: result })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
