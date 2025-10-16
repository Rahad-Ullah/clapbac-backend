import { z } from 'zod';
import { AnnounceAudience, AnnounceStatus } from './announce.constants';

// create announce validation
const createAnnounceZodSchema = z.object({
  body: z
    .object({
      title: z
        .string({ required_error: 'Title is required' })
        .nonempty('Title cannot be empty'),
      message: z
        .string({ required_error: 'Message is required' })
        .nonempty('Message cannot be empty'),
      url: z
        .string({ required_error: 'URL is required' })
        .url('Invalid URL format')
        .nonempty('URL cannot be empty'),
      audience: z.nativeEnum(AnnounceAudience),
      status: z.nativeEnum(AnnounceStatus).default(AnnounceStatus.DRAFT),
    })
    .strict('Unknown fields are not allowed'),
});

// update announce validation
const updateAnnounceZodSchema = z.object({
  body: z
    .object({
      title: z
        .string({ required_error: 'Title is required' })
        .nonempty('Title cannot be empty')
        .optional(),
      message: z
        .string({ required_error: 'Message is required' })
        .nonempty('Message cannot be empty')
        .optional(),
      url: z
        .string({ required_error: 'URL is required' })
        .url('Invalid URL format')
        .nonempty('URL cannot be empty')
        .optional(),
      audience: z.nativeEnum(AnnounceAudience).optional(),
      status: z.nativeEnum(AnnounceStatus).optional(),
    })
    .strict('Unknown fields are not allowed'),
});

export const AnnounceValidations = { createAnnounceZodSchema, updateAnnounceZodSchema };
