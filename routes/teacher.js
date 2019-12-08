/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const teacherController = require('../controllers/teacherController');


router.get('/number/:page', teacherController.getNumberUserTeacher);
router.get('/list', teacherController.getAllUserTeacher);
router.get('/detail', teacherController.getDetailTeacher);

router.post('/edit/info', teacherController.editIntro);
router.post('/edit/info', teacherController.editInfo);
router.post('/edit/major-skill', teacherController.editMajorSkill);
module.exports = router;
