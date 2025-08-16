import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid request data'
        });
      }
    }
  };
};

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'USER']).optional()
});

export const farmerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  village: z.string().min(2, 'Village must be at least 2 characters'),
  contact: z.string().min(10, 'Contact must be at least 10 characters'),
  bankAcc: z.string().min(5, 'Bank account must be at least 5 characters')
});

export const milkRecordSchema = z.object({
  farmerId: z.string().uuid('Invalid farmer ID'),
  date: z.string().datetime('Invalid date format'),
  shift: z.enum(['MORNING', 'EVENING']),
  quantity: z.number().positive('Quantity must be positive'),
  fat: z.number().min(0).max(100, 'Fat percentage must be between 0 and 100'),
  degree: z.number().positive('Degree must be positive'),
  rate: z.number().positive('Rate must be positive')
});

export const feedRecordSchema = z.object({
  farmerId: z.string().uuid('Invalid farmer ID'),
  date: z.string().datetime('Invalid date format'),
  feedType: z.string().min(2, 'Feed type must be at least 2 characters'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive')
});

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});
