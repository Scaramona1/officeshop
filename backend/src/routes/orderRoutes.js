import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Создание заказа – доступно всем (гостям и авторизованным)
router.post('/', optionalAuth, createOrder);

// История заказов текущего пользователя – только для авторизованных
router.get('/my', auth, getUserOrders);

// Админские маршруты пока закомментированы
// router.get('/', auth, admin, getAllOrders);
// router.put('/:id/status', auth, admin, updateOrderStatus);

export default router;