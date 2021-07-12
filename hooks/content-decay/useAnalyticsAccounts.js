import useSWR from "swr";
import cookie from "js-cookie";
import axios from "axios";

export function useAnalyticsAccounts() {
  const fetcher = (url) =>
    axios
      .get(url, { params: { accessToken: cookie.get("GA_accessToken") } })
      .then((response) => response.data);

  const { data, error, isValidating, mutate } = useSWR(
    "/api/analytics/accounts",
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  return {
    isAccountsLoading: isValidating,
    accounts: data,
    accountsError: error,
    mutateAccounts: mutate,
  };
}
