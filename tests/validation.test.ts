import { z } from 'zod';
import { contactFormSchema, adminLoginSchema, eventSchema } from '@/lib/validators';

describe('Form Validation', () => {
  describe('contactFormSchema', () => {
    it('should validate valid contact form data', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Partnership Inquiry',
        message: 'I would like to discuss a potential collaboration.',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Hello',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const result = contactFormSchema.safeParse({
        name: 'J',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Hello',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short message', () => {
      const result = contactFormSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Hi',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('adminLoginSchema', () => {
    it('should validate valid admin login', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@vsb.ac.in',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty password', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@vsb.ac.in',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('eventSchema', () => {
    it('should validate valid event data', () => {
      const result = eventSchema.safeParse({
        title: 'Test Event',
        description: 'A test event description that is long enough.',
        date: new Date().toISOString(),
        location: 'Test Location',
      });
      expect(result.success).toBe(true);
    });
  });
});
