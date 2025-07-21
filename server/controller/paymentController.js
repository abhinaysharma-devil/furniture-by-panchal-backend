import razorpay from "../config/razorpayClient.js";
import crypto from 'crypto';

export async function createOrderRzp(req, res) {
    const { amount } = req.body;
    const options = {
        amount: amount * 100, // convert to paisa
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Order creation failed' });
    }
}


export async function verifyPaymentRzp(req, res) {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');

    if (sign === razorpay_signature) {
        res.json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid signature' });
    }
}