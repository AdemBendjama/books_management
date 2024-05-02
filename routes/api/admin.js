import express from 'express';

// Controllers
import authController from '../../controllers/authController.js';
import userController from '../../controllers/userController.js';
import bookController from '../../controllers/bookController.js';
import authorController from '../../controllers/authorController.js';
import genreController from '../../controllers/genreController.js';
import authorRequestController from '../../controllers/authorRequestController.js';

// Middlewares
import authMiddleware from '../../middlewares/authMiddleware.js';
import adminMiddleware from '../../middlewares/adminMiddleware.js';
import beforeAuthMiddleware from '../../middlewares/beforeAuth.js';

const router = express.Router();

// Auth routes
router.get('/register', authController.register);
router.get('/login', authController.login);
router.post('/register', authController.register);
router.post('/login', authController.login); // beforeAuthMiddleware
router.get('/logout', authController.logout)

// Admin with Users
router.get('/users', userController.readAll) // authMiddleware, adminMiddleware,
router.get('/users/:id', userController.readById) // authMiddleware, adminMiddleware,
router.delete('/users/:id', userController.delete)

// Admin with Books
router.get('/books', bookController.readAll) // authMiddleware, adminMiddleware,
router.get('/books/:id', bookController.readById) // authMiddleware, adminMiddleware,
// router.post('/books', bookController.createBook) //authMiddleware, adminMiddleware,
router.put('/books/:id', bookController.approveBook) //authMiddleware, adminMiddleware,
router.delete('/books/:id', bookController.delete) //authMiddleware, adminMiddleware,

// Admin with Authors
router.get('/authors', authorController.readAll) // authMiddleware, adminMiddleware, 
router.get('/authors/:id', authorController.readById) //authMiddleware, adminMiddleware,
router.delete('/author/:id', authorController.delete) //authMiddleware, adminMiddleware, 

// Admin with Authors Requests
router.get('/author-requests', authorRequestController.readAll) // authMiddleware, adminMiddleware,
router.get('/author-requests/:id', authorRequestController.readById) // authMiddleware, adminMiddleware,
router.post('/author-requests/:id', authorRequestController.apprveAuthorRequest) // authMiddleware, adminMiddleware,
router.delete('/author-requests/:id', authorRequestController.delete) // authMiddleware, adminMiddleware,

// Admin with Genres
router.get('/genres', genreController.readAll) // authMiddleware, adminMiddleware,
router.get('/genres/:id', genreController.readById) // authMiddleware, adminMiddleware,

export default router;