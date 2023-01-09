import express from "express"
import JourneysController from "./journeys.contoller.js"

const router = express.Router()

router.route("/").get(JourneysController.apiGetJourneys)

export default router