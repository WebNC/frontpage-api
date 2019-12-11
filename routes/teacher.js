/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const teacherController = require('../controllers/teacherController');


router.get('/number', teacherController.getNumberUserTeacher);
router.get('/list/:page', teacherController.getAllUserTeacher);
router.get('/detail/:id', teacherController.getDetailTeacher);

router.post('/edit/intro', teacherController.editIntro);
router.post('/edit/info', teacherController.editInfo);
router.post('/edit/major-skill', teacherController.editMajorSkill);
router.post('/filter', teacherController.filterTeacher);
module.exports = router;
