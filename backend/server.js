// We can use the import syntax thanks to the line we added on the package.json file for type: module
import express from "express"
import cors from "cors"
import journeys from "./api/journeys.route.js"

const app = express()

app.use(cors())

// This replaces the body parser package, 
// it is now included in express; 
// and this adds the ability for the server to read JSON syntax in the requests
app.use(express.json())

// This is the main route users will be using to interface with our journeys data
// This is a standard route pattern
app.use("/api/v1/journeys", journeys)

// This is to prevent wildcards thrown at us by the users
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

// We export the app as a module, to be able to import it somewhere else
export default app
