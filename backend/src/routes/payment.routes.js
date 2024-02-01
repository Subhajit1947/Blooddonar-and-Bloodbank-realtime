import Router from 'express'
import {orderControllers,ordersuccessControllers,alldonationControllers} from '../controllers/payment.controllers.js'
import { jwtVarify } from '../middleware/auth.middleware.js'
const paymentRouter=Router()
paymentRouter.route('').post(jwtVarify,orderControllers)
paymentRouter.route('/orderstatus').put(jwtVarify,ordersuccessControllers)
paymentRouter.route('/paymenthistory').get(jwtVarify,alldonationControllers)
export default paymentRouter