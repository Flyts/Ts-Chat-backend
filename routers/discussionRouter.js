const express = require("express"),
      router  = express.Router(),
      discussionController = require("../controllers/discussionController")


router.get("/friends/:id", discussionController.getFriends)


module.exports = router