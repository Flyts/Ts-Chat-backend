const express = require("express"),
      router  = express.Router(),
      conversationController = require("../controllers/conversationController")

router.post("/conversation", conversationController.createConversation)

module.exports = router