import express from 'express';
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../controllers/promotionController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// Публичный маршрут (для страницы Акции)
router.get('/', getPromotions);

// Админские маршруты (защищены)
router.post('/', auth, admin, createPromotion);
router.put('/:id', auth, admin, updatePromotion);
router.delete('/:id', auth, admin, deletePromotion);

export default router;