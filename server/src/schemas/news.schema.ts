import mongoose, { Schema } from 'mongoose';
import { INews } from '../models/news.model';

const newsSchema = new Schema<INews>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
});

newsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v; // remove the version key from the output
  },
});

const News = mongoose.model<INews>('News', newsSchema);

export default News;
