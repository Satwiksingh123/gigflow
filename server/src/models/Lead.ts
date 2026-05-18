import { Schema, model, type Document, type Model, type Types } from "mongoose";
import { LEAD_STATUSES, LEAD_SOURCES } from "../types";
import type { LeadSource, LeadStatus } from "../types";

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      // Derive enum values from the authoritative const array — no hardcoding
      enum: LEAD_STATUSES,
      default: "New",
      index: true,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: true,
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 500 },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Compound text index for name + email full-text search
leadSchema.index({ name: "text", email: "text" });

export const Lead: Model<ILead> = model<ILead>("Lead", leadSchema);