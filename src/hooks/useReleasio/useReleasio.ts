import useSWR from "swr";

export type UseReleasioParams = {
  token: string;
  commit: string;
};

export function useReleasio({ token, commit }: UseReleasioParams) {
  const { data, error } = useSWR(
    `${token}:${commit}`,
    async (v) => {
      const res = await fetch(
        `https://releasio.vercel.app/api/tokens/${token}/logs`
      );
      const data = await res.json();
      return data.data as {
        changes: string[];
        commit: string;
        date: string;
        token: string;
        version: string;
      }[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 5,
      errorRetryInterval: 10000,
      refreshInterval: 20000,
      // isPaused: () => alreadyWarned,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      // onSuccess: (data) => {
      //   const { version } = data;
      //   if (!version || version === buildVersion) return;
      //   alreadyWarned = true;
      //   showReloadNotification(
      //     t("Update available. Reload to apply new changes.")
      //   );
      // },
    }
  );

  return {
    updateAvailable: false,
    version: data?.[0]?.version,
    changelogs: data,
    error: error,
  };
}
