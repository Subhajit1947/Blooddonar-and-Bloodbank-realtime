import {Router} from 'express'
import {
    requestHistoryControllers,
    requestControllers,
    acceptrejectpendingBloodRequest,
    deletBloodRequestConrollers
} from '../controllers/bloodrequest.controllers.js'
import { jwtVarify } from '../middleware/auth.middleware.js'
const bloodrequestrouter=Router()
bloodrequestrouter.route('').post(jwtVarify,requestControllers)
bloodrequestrouter.route('/request-history').get(jwtVarify,requestHistoryControllers)

//admin panel
bloodrequestrouter.route('/bloodreqstatus/:id').put(jwtVarify,acceptrejectpendingBloodRequest)
bloodrequestrouter.route('/deletebloodreq/:id').delete(jwtVarify,deletBloodRequestConrollers)

export default bloodrequestrouter