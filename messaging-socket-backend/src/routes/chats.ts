import { Router } from 'express'
import * as controller from '../controllers/chatController'

const router = Router();

router.post('/new', controller.newChat)

export default router;