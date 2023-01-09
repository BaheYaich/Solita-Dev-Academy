let journeys 

export default class JourneysDAO {
    static async injectDB(conn) {
        if (journeys) {
            return
        }
        try {
            journeys = await conn.db(process.env.NS).collection("May2021")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in Journeys`
            )
        }
    }

    static async getJourneys({
        filters = null,
        page = 0,
        journeysPerPage = 20,
    } = {})  {
        let query
        if (filters) {
            if ("departureDate" in filters) {
                query = {"departureDate": { $eq: filters ["departureDate"]}}
            } else if ("returnDate" in filters) {
                query = {"returnDate": { $eq: filters ["returnDate"]}}
            } else if ("departureStationId" in filters) {
                query = {"departureStationId": { $eq: filters ["departureStationId"]}}
            } else if ("returnStationId" in filters) {
                query = {"returnStationId": { $eq: filters ["returnStationId"]}}
            } else if ("duration" in filters) {
                query = {"duration": { $eq: filters ["duration"]}}
            }
        }

        let cursor 
        try {
            cursor = await journeys
            .find(query)
        } catch (e) {
            console.error(`Unable to find command, ${e}`)
            return {journeysList: [], totalNumJourneys: 0}
        }

        const displayCursor = cursor.limit(journeysPerPage).skip(journeysPerPage * page)
        
        try {
            const journeysList = await displayCursor.toArray()
            const totalNumJourneys = await journeys.countDocuments(query)
            return {journeysList, totalNumJourneys}
        } catch (e) {
            console.error (
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return {journeysList: [], totalNumJourneys: 0}
        }
    }
}