/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const teacherController = require('../controllers/teacherController');

// 2.2
router.get('/number', teacherController.getNumberUserTeacher);
router.get('/list/:page', teacherController.getAllUserTeacher);

// 2.5 - 2.6
router.get('/detail/:id', teacherController.getDetailTeacher);

// 4.1
router.post('/edit/intro', teacherController.editIntro);
router.post('/edit/info', teacherController.editInfo);
router.post('/edit/major-skill', teacherController.editMajorSkill);

// 2.4
router.post('/filter', teacherController.filterTeacher);

// none
router.post('/contract', teacherController.contractsAccept);


//
router.get('/income/:id', teacherController.getIncomeData);
module.exports = router;
