"use client";

import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import useSWR from "swr";
import type { Log } from "../../../../../../packages/releasio/src/types";
import ky from "ky";
import { to } from "await-to-js";

const api = ky.create({
  retry: 0,
});

export default function Page() {
  const { token, logId } = useParams<{
    token: string;
    logId: string;
  }>();

  const [log, setLog] = useState<Log | null>(null);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function refreshData() {
    const log = await api
      .get(`/api/tokens/${token}/logs/${logId}`)
      .json<{ data: Log }>()
      .then((el) => el.data);
    // const data = await res.json();
    setLog(log);
    // setValue();

    setValue(
      JSON.stringify(
        {
          version: log.version,
          changes: log.changes,
        },
        null,
        2
      )
    );
  }

  useEffect(() => {
    refreshData();
  }, [logId, token]);

  if (!log) return <></>;

  return (
    <>
      {/* <pre className="text-xs">{log && JSON.stringify(log, null, 2)}</pre> */}
      <button
        className="p-2 bg-slate-800 rounded-lg m-4"
        disabled={loading}
        onClick={async () => {
          let payload: Record<string, unknown> = {};
          setLoading(true);
          try {
            payload = JSON.parse(value);
          } catch (e) {
            alert("invalid json");
            return;
          }

          const [err] = await to(
            api
              .put(`/api/tokens/${token}/logs/${logId}`, {
                json: payload,
              })
              .json()
          );
          if (err) {
            alert(err.message);
          }

          setLoading(false);
        }}
      >
        Update
      </button>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={loading}
        rows={40}
        className={`text-sm bg-black w-full px-4 py-2 shadow-sm border-none outline-none resize-none`}
      />
    </>
  );
}
