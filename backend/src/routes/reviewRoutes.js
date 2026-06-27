import express from 'express';
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);          // <-- публичный доступ
router.post('/', createReview);       // <-- публичный доступ
router.put('/:id', auth, admin, updateReview);
router.delete('/:id', auth, admin, deleteReview);

export default router;