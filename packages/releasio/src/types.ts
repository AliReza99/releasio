export type Log = {
  _id: string;
  token: string;
  date: string;
  version: string | null;
  commit: string;
  changes: string[];
};

export type GitLog = {
  message: string;
  author: string;
  date: string;
  commit: string;
};

export type LogPayload = Omit<Log, 'token' | 'date' | '_id'>;
