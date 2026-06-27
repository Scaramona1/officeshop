import express from 'express';
import { getContact, updateContact } from '../controllers/contactController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getContact); // публичный доступ
router.put('/', auth, admin, updateContact); // только админ

export default router;