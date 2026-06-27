// backend/src/routes/categoryRoutes.js
import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', auth, admin, createCategory);
router.put('/:id', auth, admin, updateCategory);
router.delete('/:id', auth, admin, deleteCategory);

export default router;