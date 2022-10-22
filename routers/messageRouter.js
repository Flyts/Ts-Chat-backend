const express = require("express"),
      router  = express.Router(),
      MessageControllers = require("../controllers/MessageControllers")

router.get("/messages", MessageControllers.getMessages)
router.post("/message", MessageControllers.createMessage)
router.delete("/messages", MessageControllers.deleteAllMessages)

module.exports = router