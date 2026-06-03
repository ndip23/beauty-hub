const axios = require('axios');

const payinApi = axios.create({ baseURL: 'https://api.accountpe.com/api/payin' });
const payoutApi = axios.create({ baseURL: 'https://api.accountpe.com/api/payout' });

const login = async () => {
  const { data } = await payinApi.post('/admin/auth', {
    email: process.env.SWYCHR_EMAIL,
    password: process.env.SWYCHR_PASSWORD,
  });
  return data.token;
};

const getFiatRate = async (token, countryCode, amount = 1) => {
  try {
    // We send amount: 1 to get the base rate for $1
    const { data } = await payoutApi.post('/pusd_to_fiat_rate', { 
      country_code: countryCode, 
      amount: amount 
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Check if Swychr returned the data object correctly
    if (data && data.data && data.data.local_amount) {
        console.log(`API SUCCESS for ${countryCode}: ${data.data.local_amount}`);
        return data.data.local_amount; // This is the real value (e.g., 12 or 595)
    }
    
    return 615; // Fallback only if data is missing
  } catch (error) {
    console.error("Rate Fetch Error:", error.response?.data || error.message);
    return 615; 
  }
};

const createPaymentLink = async (token, payload) => {
  const { data } = await payinApi.post('/create_payment_links', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
const getPaymentStatus = async (token, transactionId) => {
  const { data } = await payinApi.post('/payment_link_status', { transaction_id: transactionId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

module.exports = { login, createPaymentLink, getFiatRate, getPaymentStatus };
