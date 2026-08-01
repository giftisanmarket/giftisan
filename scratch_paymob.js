const { PAYMOB_SECRET_KEY, PAYMOB_INTEGRATION_IDS } = require('dotenv').config().parsed;

async function testPaymob() {
  const response = await fetch("https://accept.paymob.com/v1/intention/", {
    method: "POST",
    headers: {
      "Authorization": `Token ${PAYMOB_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: 92000,
      currency: "EGP",
      payment_methods: PAYMOB_INTEGRATION_IDS.split(",").map(id => parseInt(id.trim())),
      items: [
        {
          name: "Test Item",
          amount: 85000,
          description: "Test",
          quantity: 1
        },
        {
          name: "Shipping",
          amount: 7000,
          description: "Shipping",
          quantity: 1
        }
      ],
      billing_data: {
        first_name: "Test",
        last_name: "User",
        email: "test@test.com",
        phone_number: "+20123456789",
        street: "Test",
        city: "Test",
        country: "EG",
        floor: "NA",
        building: "NA",
        apartment: "NA"
      },
      special_reference: `test-${Date.now()}`
    })
  });
  
  const text = await response.text();
  console.log("Response:", response.status, text.substring(0, 100));
}

testPaymob();
