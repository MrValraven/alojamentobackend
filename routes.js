const express = require('express');

const router = express.Router();
const fileUpload = require('express-fileupload');
const authController = require('./src/controllers/authController');
const imagesController = require('./src/controllers/imagesController');
const postsController = require('./src/controllers/postsController');
const statusController = require('./src/controllers/statusController');
const usersController = require('./src/controllers/usersController');
const fileExtensionLimiter = require('./src/middleware/fileExtensionLimiter');
const fileSizeLimiter = require('./src/middleware/fileSizeLimiter');
const filesPayloadExists = require('./src/middleware/filesPayloadExists');
const verifyJWT = require('./src/middleware/verifyJWT');

router.post('/auth/jwt/verify', verifyJWT, (request, response) => {
  response.status(200).json({ message: 'Token verified' });
});
router.post('/auth/account/verify', authController.verifyAccount);
router.post('/auth/login', authController.handleLogin);
router.get('/auth/logout', authController.handleLogout);
router.post('/auth/password/forgot', authController.handleForgottenPassword);
router.post('/auth/password/reset', verifyJWT, authController.resetPassword);
router.get('/auth/refresh', authController.handleRefreshToken);

router.get('/users', usersController.getAllUsers);
router.post('/users', usersController.createNewUser);
router.patch('/users/:userId', usersController.editUserInfo);

router.get('/status', statusController.getStatus);

router.get('/posts', postsController.getAllPosts);
router.get('/posts/:postSlug', postsController.getPostById);
router.get('posts/:ownerId', postsController.getPostsByOwnerId);
router.post(
  '/posts',
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtensionLimiter,
  fileSizeLimiter,
  postsController.createPost,
);
router.delete('/posts/:postSlug', postsController.deletePostBySlug);
router.put('/posts/:postSlug', postsController.editPost);

router.get('images/:folder/:imageName', imagesController.getImage);

module.exports = router;
