// Netlify Function to handle Acumbamail subscription

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

    // Acumbamail API - use merge_fields[email] format
    const params = new URLSearchParams();
    params.append('auth_token', '5bc0183af8aa4cdaa65ea20a037191fa');
    params.append('list_id', '1246898');
    params.append('merge_fields[email]', email);
    params.append('double_optin', '0');  // Set to '1' for double opt-in

    const response = await fetch('https://acumbamail.com/api/1/addSubscriber/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    const result = await response.json();
    
    if (result.subscriber_id) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true, message: 'Subscribed!', id: result.subscriber_id })
      };
    } else if (result.error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: result.error })
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ success: true })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
