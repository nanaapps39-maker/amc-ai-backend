// ======================================================
// AMC Academy Tech AI R&D Labs
// Memory Engine v3 Routes
// ======================================================

import express from "express";

import {
  saveMemory,
  loadMemory,
  deleteMemory,
  continueSession
} from "./memoryService.js";

const router = express.Router();

// ======================================================
// SAVE MEMORY
// ======================================================

router.post("/save", (req, res) => {

  try {

    const {
      userId,
      role,
      lastTopic,
      lastModule,
      lastSummary
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    const result = saveMemory(
      userId,
      {
        role,
        lastTopic,
        lastModule,
        lastSummary
      }
    );

    res.json({
      success: true,
      memory: result
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

// ======================================================
// LOAD MEMORY
// ======================================================

router.get("/load/:userId", (req, res) => {

  try {

    const memory = loadMemory(
      req.params.userId
    );

    if (!memory) {

      return res.status(404).json({
        success: false,
        message: "Memory not found"
      });

    }

    res.json({
      success: true,
      memory
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

// ======================================================
// CONTINUE SESSION
// ======================================================

router.post("/continue", (req, res) => {

  try {

    const { userId } = req.body;

    const result = continueSession(
      userId
    );

    res.json(result);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

// ======================================================
// DELETE MEMORY
// ======================================================

router.delete("/:userId", (req, res) => {

  try {

    deleteMemory(
      req.params.userId
    );

    res.json({
      success: true,
      message: "Memory deleted"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

export default router;