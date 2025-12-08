import mongoose, { Schema } from 'mongoose';

export interface IBookIssue {
  bookId: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  issueDate: Date;
  returnDate?: Date;
  dueDate: Date;
  fine?: number;
}

const bookIssueSchema = new Schema<IBookIssue>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'LibraryMember', required: true },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    dueDate: { type: Date, required: true },
    fine: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BookIssue = mongoose.model('BookIssue', bookIssueSchema);
export default BookIssue;
