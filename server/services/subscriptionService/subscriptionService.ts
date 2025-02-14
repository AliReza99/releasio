import { ObjectId } from "mongodb";
import { db } from "../../mongodb";

const collection = db.collection("subscriptions");

export class SubscriptionService {
  static async create(chatId: string, playlists: string[]) {
    return collection.updateOne(
      { chatId },
      { $set: { playlists, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  static async delete(id: string) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) return;
    throw new Error("Subscription not found");
  }

  static async getAll() {
    return collection.find().toArray();
  }

  static async getById(id: string) {
    return collection.findOne({ _id: new ObjectId(id) });
  }
}
