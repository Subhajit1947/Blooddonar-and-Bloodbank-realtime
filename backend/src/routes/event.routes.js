import {Router} from 'express'
import {jwtVarify} from '../middleware/auth.middleware.js'
import {
    createeventControllers,
    fetchalleventControllers,
    deleteeventControlers
} from '../controllers/event.controllers.js'
const eventRouter=Router()
eventRouter.route('/createevent').post(jwtVarify,createeventControllers)
eventRouter.route('').get(fetchalleventControllers)
eventRouter.route('/deleteevent/:eid').delete(jwtVarify,deleteeventControlers)

export default eventRouter