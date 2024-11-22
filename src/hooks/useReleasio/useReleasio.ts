import useSWR from "swr";

export type UseReleasioParams = {
  token: string;
  commit: string;
};

export function useReleasio({ token, commit }: UseReleasioParams) {
  const { data, error, isLoading } = useSWR(`${token}:${commit}`, async (v) => {
    // console.log(`[v] `, v);

    const res = await fetch(
      `https://releasio.vercel.app/api/token/${token}/logs`
    );
    const data = await res.json();
    return data;
  });
}
