import {Router} from 'express'
import {
    donateControllers,
    donarHistoryControllers,
    avaliablebankControllers,
    acceptrejectpendingDonarRequest,
    deletDonarRequestConrollers
} from '../controllers/bloodbank.controllers.js'
import { jwtVarify } from '../middleware/auth.middleware.js'
const blooddonarrouter=Router()
blooddonarrouter.route('').post(jwtVarify,donateControllers)
blooddonarrouter.route('/avaliable').get(jwtVarify,avaliablebankControllers)
blooddonarrouter.route('/donar-history').get(jwtVarify,donarHistoryControllers)

//admin route
blooddonarrouter.route('/donarstatus/:id').put(jwtVarify,acceptrejectpendingDonarRequest)
blooddonarrouter.route('/deletedonarreq/:id').delete(jwtVarify,deletDonarRequestConrollers)

export default blooddonarrouter