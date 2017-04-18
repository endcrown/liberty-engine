'use strict';

const express = require('express');
const router = express.Router();
const Response = require(global.rootdir + '/src/responses');
const models = require(global.rootdir + '/models');

router.get('/',
  async (req, res, next) => {
    try {
      const user = await models.User.findByUsername(req.query.username);
      if (!user) {
        new Response.BadRequest().send(res);
      }
      if (new Date() < user.confirmCodeExpiry && user.confirmCode === req.query.code) {
        user.update({
          emailConfirmed: true,
          confirmCode: null,
          confirmCodeExpiry: null,
        });
        res.redirect('http://localhost:8080');
      } else {
        new Response.BadRequest().send(res);
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
