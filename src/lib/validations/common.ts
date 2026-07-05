import { z } from 'zod';

const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;

export const phoneSchema = z
  .string()
  .min(1, 'Số điện thoại không được để trống')
  .transform(v => v.replace(/\s+/g, '').trim())
  .refine(v => phoneRegex.test(v), 'Số điện thoại không hợp lệ');

export const nameSchema = z
  .string()
  .min(1, 'Họ tên không được để trống')
  .min(2, 'Họ tên phải có ít nhất 2 ký tự')
  .max(100, 'Họ tên không được quá 100 ký tự')
  .refine(v => !/[<>{}[\]\\]/.test(v), 'Họ tên chứa ký tự không hợp lệ')
  .transform(v => v.trim());

export const emailSchema = z
  .string()
  .min(1, 'Email không được để trống')
  .email('Email không hợp lệ')
  .transform(v => v.toLowerCase().trim())
  .refine(v => !v.includes('%') && !v.includes('..'), 'Email chứa ký tự không hợp lệ');

export const messageSchema = z
  .string()
  .min(1, 'Tin nhắn không được để trống')
  .min(10, 'Tin nhắn phải có ít nhất 10 ký tự')
  .max(1000, 'Tin nhắn không được quá 1000 ký tự')
  .transform(v => v.trim());

export const requiredString = (label: string) =>
  z
    .string()
    .min(1, `Vui lòng nhập ${label}`)
    .transform(v => v.trim());
