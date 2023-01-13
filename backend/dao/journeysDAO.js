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
                const dateRange1 = new Date(filters ["departureDate"])
                const dateRange2 = new Date(filters ["departureDate"])
                query = {"Departure": { $gt: new Date(dateRange1.setDate(dateRange1.getDate() - 1)), $lt: new Date(dateRange2.setDate(dateRange2.getDate() + 1)) }}
            } else if ("returnDate" in filters) {
                query = {"Return": { $eq: filters ["returnDate"]}}
            } else if ("departureStationId" in filters) {
                query = {"Departure station id": { $eq: filters ["departureStationId"]}}
            } else if ("returnStationId" in filters) {
                query = {"Return station id": { $eq: filters ["returnStationId"]}}
            } else if ("duration" in filters) {
                query = {"Duration (s)": { $eq: filters ["duration"]}}
            } else if ("departureStationName" in filters) {
                query = {"Departure station name": { $eq: filters ["departureStationName"]}}
            } else if ("returnStationName" in filters) {
                query = {"Return station name": { $eq: filters ["returnStationName"]}}
            } else if ("coveredDistance" in filters) {
                query = {"Covered distance (m)": { $eq: filters ["coveredDistance"]}}
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