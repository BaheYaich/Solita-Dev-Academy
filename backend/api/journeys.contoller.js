import JourneysDAO from "../dao/journeysDAO.js";

export default class JourneysController {
    static async apiGetJourneys (req, res, next) {
        const journeysPerPage = req.journeysPerPage ? parseInt(req.query.journeysPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.departureDate) {
            filters.departureDate = req.query.departureDate
        } else if (req.query.departureStationId) {
            filters.departureStationId = parseInt(req.query.departureStationId, 10)
        } else if (req.query.returnDate) {
            filters.returnDate = req.query.returnDate
        } else if (req.query.returnStationId) {
            filters.returnStationId = parseInt(req.query.returnStationId, 10)
        } else if (req.query.departureStationName) {
            filters.departureStationName = req.query.departureStationName
        } else if (req.query.returnStationName) {
            filters.returnStationName = req.query.returnStationName
        } else if (req.query.coveredDistance) {
            filters.coveredDistance = parseInt(req.query.coveredDistance, 10)
        } else if (req.query.duration) {
            filters.duration = parseInt(req.query.duration, 10)
        } 

        const { journeysList, totalNumJourneys } = await JourneysDAO.getJourneys({
            filters,
            page,
            journeysPerPage,
        })

        let response = {
            journeys: journeysList,
            page: page,
            filters: filters,
            entries_per_page: journeysPerPage,
            total_results: totalNumJourneys,
        }
        res.json(response)
    }
}