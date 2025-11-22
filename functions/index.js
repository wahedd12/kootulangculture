const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

// 🔐 Your Paystack Secret Key (Live or Test)
const PAYSTACK_SECRET = "sk_test_c8ca1c3994df29f667685b63c46fc128f9e12a8d"; 

exports.verifyPaystackPayment = functions.https.onRequest(async (req, res) => {
    functions.logger.log("Incoming request:", req.method, req.body);

    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    const { reference, userId } = req.body;

    if (!reference || !userId) {
        return res.status(400).json({ error: "Missing payment reference or userId" });
    }

    try {
        // 👉 Verify payment with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET}`,
                },
            }
        );

        const data = response.data;

        if (data.status !== true || data.data.status !== "success") {
            return res.status(400).json({ error: "Payment not successful" });
        }

        // 👉 Confirmed: Payment is successful
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);

        await db.collection("users").doc(userId).update({
            isPremium: true,
            premiumExpiry: expiry.toISOString(),
        });

        return res.json({ success: true, message: "Premium activated!" });

    } catch (err) {
        console.error("Paystack verify error:", err);
        return res.status(500).json({ error: "Server error verifying payment" });
    }
});
