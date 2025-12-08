import mongoose, { Schema } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copiesAvailable: number;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    copiesAvailable: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;
