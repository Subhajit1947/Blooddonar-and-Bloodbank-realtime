import { Router } from "express";
import {registerController,
    loginController,
    logoutController,
    refresh_token_endpoint,
    getCurrentUser,
    deleteuserControllers,
    alluserControllers,
    uploadprofileimageControllers
} from '../controllers/users.controllers.js'
import {upload} from '../middleware/multer.middleware.js'
import { jwtVarify } from "../middleware/auth.middleware.js";
const userRouter=Router()
userRouter.route("/register").post(registerController)
userRouter.route("/login").post(loginController)
userRouter.route('/logout').put(jwtVarify,logoutController)
userRouter.route('/currentuser').get(jwtVarify,getCurrentUser)
userRouter.route('/refresh').post(refresh_token_endpoint)
userRouter.route('/updateavater').put(upload.single('file'),jwtVarify,uploadprofileimageControllers)

userRouter.route('/admin').get(jwtVarify,alluserControllers)
userRouter.route('/admin/deleteuser/:id').delete(jwtVarify,deleteuserControllers)

export default userRouter