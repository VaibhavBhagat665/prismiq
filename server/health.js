// Health check endpoint for Render
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'prismiq-backend'
  });
});

module.exports = router;
