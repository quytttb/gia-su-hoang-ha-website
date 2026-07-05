import { describe, expect, it } from 'vitest';
import { emailSchema, nameSchema, phoneSchema } from '@/lib/validations/common';

describe('validation schemas', () => {
  it('accepts a valid Vietnamese phone number', () => {
    expect(phoneSchema.parse('0385 510 892')).toBe('0385510892');
  });

  it('rejects an invalid phone number', () => {
    expect(() => phoneSchema.parse('123')).toThrow('Số điện thoại không hợp lệ');
  });

  it('normalizes and validates email', () => {
    expect(emailSchema.parse('User@Example.COM')).toBe('user@example.com');
  });

  it('trims and validates name', () => {
    expect(nameSchema.parse('  Nguyễn Văn A  ')).toBe('Nguyễn Văn A');
  });
});
