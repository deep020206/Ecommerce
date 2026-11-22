const axios = require("axios")

const CHAPA_URL = process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize"
const CHAPA_VERIFY_URL = process.env.CHAPA_VERIFY_URL || "https://api.chapa.co/v1/transaction/verify"
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || process.env.CHAPA_AUTH

const getChapaHeaders = () => {
    if (!CHAPA_SECRET_KEY) {
        return null
    }

    return {
        Authorization: CHAPA_SECRET_KEY.startsWith("Bearer ")
            ? CHAPA_SECRET_KEY
            : `Bearer ${CHAPA_SECRET_KEY}`
    }
}

const initializePayment = async (req, res) => {
    const headers = getChapaHeaders()
    if (!headers) {
        return res.status(503).json({ message: "CHAPA_SECRET_KEY is not configured" })
    }

    const config = {
        headers
    }

    // chapa redirect you to this url when payment is successful
    const CALLBACK_URL = process.env.CLIENT_URL || "http://localhost:3000"

    // a unique reference given to every transaction
    const TEXT_REF = "tx-myecommerce12345-" + Date.now()

    // form data
    const data = {
        amount: req.body.amount,
        currency: process.env.CHAPA_CURRENCY || "ETB",
        email: req.body.email || "customer@example.com",
        first_name: req.body.firstName || "Ecommerce",
        last_name: req.body.lastName || "Customer",
        tx_ref: TEXT_REF,
        callback_url: CALLBACK_URL
    }

    // post request to chapa
    await axios.post(CHAPA_URL, data, config)
        .then((response) => {
            res.send(response.data.data.checkout_url)
            console.log(response.data)
        })
        .catch((err) => {
            console.error("Payment initialization failed:", err.response?.data || err.message)
            return res.status(502).json({
                message: "Unable to initialize payment",
                error: err.response?.data || err.message
            })
        })
}

const verifyPayment = async (req, res) => {
        const headers = getChapaHeaders()
        if (!headers) {
            return res.status(503).json({ message: "CHAPA_SECRET_KEY is not configured" })
        }

        const config = {
            headers
        }

        await axios.get(CHAPA_VERIFY_URL + "/" + req.params.id, config)
            .then((response) => {
                return res.json({ status: response.data.status, data: response.data.data })
            }) 
            .catch((err) => {
                console.error("Payment cannot be verified:", err.response?.data || err.message)
                return res.status(502).json({
                    message: "Payment cannot be verified",
                    error: err.response?.data || err.message
                })
            })
}

module.exports = { initializePayment, verifyPayment }