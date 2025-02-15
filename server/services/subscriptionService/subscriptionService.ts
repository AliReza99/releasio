import { ObjectId } from "mongodb";
import { db } from "../../config/db";

const collection = db.collection("subscriptions");

export class SubscriptionService {
  static async create(chatId: number, playlists: string[]) {
    return collection.updateOne(
      { chatId },
      { $set: { playlists, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  static async delete(id: string) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) return;
    throw new Error("not found");
  }

  static async getAll() {
    return collection.find().toArray();
  }

  static async getById(id: string) {
    return collection.findOne({ _id: new ObjectId(id) });
  }
}
