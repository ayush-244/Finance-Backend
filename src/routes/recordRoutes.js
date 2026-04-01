const express = require("express");
const router = express.Router();

const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Admin only
router.post("/", protect, authorizeRoles("admin"), createRecord);

// Analyst + Admin
router.get("/", protect, authorizeRoles("analyst", "admin"), getRecords);

// Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateRecord);
router.delete("/:id", protect, authorizeRoles("admin"), deleteRecord);

module.exports = router;