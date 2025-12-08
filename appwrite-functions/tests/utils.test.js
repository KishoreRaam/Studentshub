/**
 * Unit Tests for Utility Functions
 * 
 * Run with: npm test
 */

const assert = require('assert');
const {
  isAllowedDomain,
  checkRateLimit,
  safeJsonParse,
  sanitizeError
} = require('../shared/utils');

describe('Utility Functions', () => {
  
  describe('isAllowedDomain', () => {
    const allowedDomains = 'sathyabama.ac.in,mit.edu,student.edu';
    
    it('should return true for allowed domains', () => {
      assert.strictEqual(
        isAllowedDomain('student@sathyabama.ac.in', allowedDomains),
        true
      );
      assert.strictEqual(
        isAllowedDomain('john@mit.edu', allowedDomains),
        true
      );
    });
    
    it('should return false for non-allowed domains', () => {
      assert.strictEqual(
        isAllowedDomain('user@gmail.com', allowedDomains),
        false
      );
      assert.strictEqual(
        isAllowedDomain('test@yahoo.com', allowedDomains),
        false
      );
    });
    
    it('should handle case insensitivity', () => {
      assert.strictEqual(
        isAllowedDomain('STUDENT@SATHYABAMA.AC.IN', allowedDomains),
        true
      );
    });
    
    it('should handle whitespace', () => {
      assert.strictEqual(
        isAllowedDomain('student@sathyabama.ac.in  ', allowedDomains),
        true
      );
    });
    
    it('should return false for invalid input', () => {
      assert.strictEqual(isAllowedDomain(null, allowedDomains), false);
      assert.strictEqual(isAllowedDomain('', allowedDomains), false);
      assert.strictEqual(isAllowedDomain('notemail', allowedDomains), false);
    });
  });
  
  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit(null, 0, 3);
      assert.strictEqual(result.allowed, true);
      assert.strictEqual(result.remaining, 3);
    });
    
    it('should block after limit reached', () => {
      const oneHourAgo = Date.now() - (30 * 60 * 1000); // 30 min ago
      const result = checkRateLimit(oneHourAgo, 3, 3);
      assert.strictEqual(result.allowed, false);
      assert.strictEqual(result.remaining, 0);
    });
    
    it('should reset count after time window', () => {
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      const result = checkRateLimit(twoHoursAgo, 3, 3);
      assert.strictEqual(result.allowed, true);
      assert.strictEqual(result.remaining, 3);
    });
    
    it('should track remaining count correctly', () => {
      const thirtyMinAgo = Date.now() - (30 * 60 * 1000);
      const result = checkRateLimit(thirtyMinAgo, 1, 3);
      assert.strictEqual(result.allowed, true);
      assert.strictEqual(result.remaining, 2);
    });
  });
  
  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const result = safeJsonParse('{"key":"value"}');
      assert.deepStrictEqual(result, { key: 'value' });
    });
    
    it('should return fallback for invalid JSON', () => {
      const result = safeJsonParse('invalid json', { default: true });
      assert.deepStrictEqual(result, { default: true });
    });
    
    it('should return empty object by default', () => {
      const result = safeJsonParse('not json');
      assert.deepStrictEqual(result, {});
    });
  });
  
  describe('sanitizeError', () => {
    it('should sanitize error object', () => {
      const error = new Error('Database connection failed');
      error.code = 'DB_ERROR';
      
      const result = sanitizeError(error);
      
      assert.strictEqual(result.error, true);
      assert.strictEqual(result.message, 'Database connection failed');
      assert.strictEqual(result.code, 'DB_ERROR');
    });
    
    it('should handle error without code', () => {
      const error = new Error('Generic error');
      const result = sanitizeError(error);
      
      assert.strictEqual(result.code, 'UNKNOWN_ERROR');
    });
  });
  
});

describe('Integration Tests', () => {
  
  describe('Signup and Verification Flow', () => {
    it('should simulate complete flow', async () => {
      // Mock user data
      const user = {
        $id: 'test-user-123',
        email: 'student@sathyabama.ac.in',
        emailVerification: false
      };
      
      // Step 1: Check domain is allowed
      const domainAllowed = isAllowedDomain(
        user.email,
        'sathyabama.ac.in,mit.edu'
      );
      assert.strictEqual(domainAllowed, true);
      
      // Step 2: Check rate limit for resend
      const rateLimit = checkRateLimit(null, 0, 3);
      assert.strictEqual(rateLimit.allowed, true);
      
      // Step 3: Simulate verification
      user.emailVerification = true;
      
      // Step 4: Role should be assigned
      const role = domainAllowed && user.emailVerification ? 'student' : 'guest';
      assert.strictEqual(role, 'student');
    });
  });
  
  describe('Rate Limiting Scenario', () => {
    it('should enforce rate limit across multiple resends', () => {
      let lastResend = null;
      let resendCount = 0;
      const limit = 3;
      
      // First resend - allowed
      let check = checkRateLimit(lastResend, resendCount, limit);
      assert.strictEqual(check.allowed, true);
      lastResend = Date.now();
      resendCount = 1;
      
      // Second resend - allowed
      check = checkRateLimit(lastResend, resendCount, limit);
      assert.strictEqual(check.allowed, true);
      resendCount = 2;
      
      // Third resend - allowed
      check = checkRateLimit(lastResend, resendCount, limit);
      assert.strictEqual(check.allowed, true);
      resendCount = 3;
      
      // Fourth resend - blocked
      check = checkRateLimit(lastResend, resendCount, limit);
      assert.strictEqual(check.allowed, false);
      assert.strictEqual(check.remaining, 0);
    });
  });
  
});

// Run tests if this file is executed directly
if (require.main === module) {
  const tests = [
    ...Object.keys(describe.tests),
  ];
  
  console.log(`Running ${tests.length} test suites...\n`);
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(testName => {
    try {
      describe.tests[testName]();
      console.log(`✓ ${testName}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${testName}`);
      console.error(`  ${error.message}`);
      failed++;
    }
  });
  
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

module.exports = { describe };
