const express = require('express');
const {
  getAllUsers,
  createUser,
  getSingleUser,
  editUser,
  deleteUser,
} = require("../Controllers/userHandler");
const {signUpUser} = require('../Controllers/authHandler')


const router = express.Router();
router.post('/signUp', signUpUser)
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getSingleUser).patch(editUser).delete(deleteUser);

module.exports = router;