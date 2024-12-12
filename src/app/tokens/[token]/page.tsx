import { db } from "@/lib/mongodb";
import React from "react";
import to from "await-to-js";
import { tokenExists } from "@/app/api/tokens/[token]/utils";
import { LogEditor } from "./components";
import ky from "ky";

function Pre({ children }: { children: React.ReactNode }) {
  return <pre className="text-sm">{children}</pre>;
}

const api = ky.create({
  retry: 0,
});

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [err] = await to(tokenExists(token));
  if (err) {
    return <>invalid token</>;
  }

  const logs = await db
    .collection("logs")
    .find(
      {
        token: token,
      },
      { limit: 10 }
    )
    .toArray();

  const isFirstLog = logs.length === 0;

  return (
    <div className="flex p-8 flex-col max-w-screen-lg mx-auto gap-8">
      <div>
        <h3 className="font-semibold mb-2">
          {isFirstLog
            ? "Generate your first release using:"
            : "Generate logs using:"}
        </h3>
        <div className="bg-slate-800 p-4 rounded-md">
          <code className="text-2xl select-all">npx releasio -t {token}</code>
        </div>
      </div>
      {isFirstLog && (
        <div className="font-semibold flex gap-2 items-center">
          <span className="flex size-2 bg-green-500 animate-pulse rounded-full"></span>
          waiting for your first log to be created
        </div>
      )}
      {!isFirstLog && (
        <div className="flex gap-4 flex-col">
          <div className="font-semibold">Logs:</div>
          <div className="bg-slate-900">
            <Pre>[</Pre>
            <div className="pl-4">
              {logs.map((el) => {
                const log = {
                  version: el.version,
                  changes: el.changes,
                };

                return (
                  <React.Fragment key={String(el._id)}>
                    <LogEditor
                      token={token}
                      logId={String(el._id)}
                      value={JSON.stringify(
                        {
                          version: log.version,
                          changes: log.changes,
                        },
                        null,
                        2
                      )}
                    />
                  </React.Fragment>
                );
              })}
            </div>
            <Pre>]</Pre>
          </div>
        </div>
      )}
    </div>
  );
}

export const revalidate = 0;
