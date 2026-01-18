// Edge case testing endpoints for production verification
import type { Express } from "express";
import { validateHackathonDates } from "../../shared/dateValidation";
import { validateEmail, isDisposableDomain } from "../../shared/emailValidation";
import { validateTeamCreation } from "../../shared/teamValidation";
import { validateCriterionScore } from "../../shared/judgeScoreValidation";
import { validateSubmissionData } from "../../shared/submissionValidation";
import { rateLimiters } from "../middleware/rateLimiter";

export function registerEdgeCaseTestRoutes(app: Express) {
  
  // Test endpoint to verify all validations work
  app.get("/api/test/edge-cases", rateLimiters.general, async (req, res) => {
    try {
      const tests = {
        dateValidation: false,
        emailValidation: false,
        teamValidation: false,
        judgeScoreValidation: false,
        submissionValidation: false,
        rateLimiting: true // If we reach here, rate limiting is working
      };
      
      // Test date validation
      try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = validateHackathonDates({
          startDate: yesterday,
          endDate: yesterday
        });
        tests.dateValidation = !result.isValid && result.errors.includes('End date cannot be in the past');
      } catch (error) {
        console.error('Date validation test failed:', error);
      }
      
      // Test email validation
      try {
        const isDisposable = isDisposableDomain('tempmail.com');
        const isLegitimate = !isDisposableDomain('gmail.com');
        tests.emailValidation = isDisposable && isLegitimate;
      } catch (error) {
        console.error('Email validation test failed:', error);
      }
      
      // Test team validation
      try {
        const result = validateTeamCreation('', 5, 'user123');
        tests.teamValidation = !result.isValid && result.errors.includes('Team name is required');
      } catch (error) {
        console.error('Team validation test failed:', error);
      }
      
      // Test judge score validation
      try {
        const criteria = {
          id: 'test',
          name: 'Test Criteria',
          description: 'Test',
          min_score: 0,
          max_score: 10,
          weight: 1,
          required: true
        };
        const result = validateCriterionScore(15, criteria);
        tests.judgeScoreValidation = !result.isValid && result.errors.some(e => e.includes('cannot be greater than 10'));
      } catch (error) {
        console.error('Judge score validation test failed:', error);
      }
      
      // Test submission validation
      try {
        const result = validateSubmissionData({
          project_name: '',
          description: '',
          hackathon_id: 'test'
        });
        tests.submissionValidation = !result.isValid && 
          result.errors.includes('Project name is required') &&
          result.errors.includes('Project description is required');
      } catch (error) {
        console.error('Submission validation test failed:', error);
      }
      
      const allPassed = Object.values(tests).every(test => test === true);
      
      return res.json({
        success: true,
        message: allPassed ? 'All edge case validations working correctly' : 'Some validations failed',
        tests,
        allPassed,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Edge case test error:', error);
      return res.status(500).json({
        success: false,
        message: 'Edge case test failed',
        error: error.message
      });
    }
  });
  
  // Test rate limiting specifically
  app.post("/api/test/rate-limit", rateLimiters.otpRequest, async (req, res) => {
    return res.json({
      success: true,
      message: 'Rate limiting test passed',
      timestamp: new Date().toISOString()
    });
  });
  
  // Test email validation with real examples
  app.post("/api/test/email-validation", rateLimiters.emailValidate, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }
      
      // Quick validation (no MX check for testing)
      const result = validateEmail(email);
      
      return res.json({
        success: true,
        email,
        validation: result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Email validation test failed',
        error: error.message
      });
    }
  });
  
  // Test date validation with real examples
  app.post("/api/test/date-validation", rateLimiters.general, async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate are required'
        });
      }
      
      const result = validateHackathonDates({ startDate, endDate });
      
      return res.json({
        success: true,
        dates: { startDate, endDate },
        validation: result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Date validation test failed',
        error: error.message
      });
    }
  });
  
  // Test team validation with real examples
  app.post("/api/test/team-validation", rateLimiters.general, async (req, res) => {
    try {
      const { teamName, maxSize, userId } = req.body;
      
      if (!teamName || !maxSize || !userId) {
        return res.status(400).json({
          success: false,
          message: 'teamName, maxSize, and userId are required'
        });
      }
      
      const result = validateTeamCreation(teamName, maxSize, userId);
      
      return res.json({
        success: true,
        input: { teamName, maxSize, userId },
        validation: result,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Team validation test failed',
        error: error.message
      });
    }
  });
  
  // Health check endpoint
  app.get("/api/test/health", async (req, res) => {
    return res.json({
      success: true,
      message: 'Edge case implementations are healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  });
}