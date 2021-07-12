import useSWR from "swr";
import cookie from "js-cookie";
import axios from "axios";

export function useAnalyticsData() {
  const fetcher = (url) =>
    axios
      .get(url, {
        params: {
          accessToken: cookie.get("GA_accessToken"),
          profileId: cookie.get("GA_profileId"),
        },
      })
      .then((response) => response.data);

  const { data, error, isValidating, mutate } = useSWR(
    "/api/analytics/data",
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  return {
    isDataLoading: isValidating,
    data: data,
    dataError: error,
    mutateData: mutate,
  };
}
