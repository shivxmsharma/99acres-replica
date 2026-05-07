import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    enquiryType: {
      type: String,
      enum: ['general', 'visit', 'offer'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['pending', 'responded', 'closed', 'spam'],
      default: 'pending',
    },
    ownerResponse: {
      type: String,
      trim: true,
      maxlength: [1000, 'Response cannot exceed 1000 characters'],
    },
    isRead: { type: Boolean, default: false },
    visitDate: { type: Date },
    visitTime: { type: String, trim: true },
    visitStatus: {
      type: String,
      enum: ['requested', 'confirmed', 'cancelled', 'completed'],
    },
    isLeadAssigned: { type: Boolean, default: false },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

EnquirySchema.index({ property: 1 });
EnquirySchema.index({ buyer: 1 });
EnquirySchema.index({ owner: 1 });
EnquirySchema.index({ owner: 1, isRead: 1 });
EnquirySchema.index({ buyer: 1, enquiryType: 1 });

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
