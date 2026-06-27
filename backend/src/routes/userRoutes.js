import express from 'express';
import { register, login, getProfile, updateProfile, addAddress, removeAddress } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.post('/me/addresses', auth, addAddress);
router.delete('/me/addresses/:id', auth, removeAddress);

export default router;
