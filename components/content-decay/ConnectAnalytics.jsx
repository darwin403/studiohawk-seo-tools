import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG } from "@fortawesome/free-brands-svg-icons";
import dynamic from "next/dynamic";
import cookie from "js-cookie";

import { useAnalyticsAccounts } from "@/hooks/content-decay";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const OAuth2Popup = dynamic(() => import("./OAuth2Popup"), { ssr: false });

export function ConnectAnalytics() {
  // cookies
  const accessToken = cookie.get("GA_accessToken");

  // hooks
  const { accounts, accountsError, isAccountsLoading, mutateAccounts } =
    useAnalyticsAccounts();

  // render: check if access given
  if (accessToken) {
    // request error
    if (accountsError && !isAccountsLoading) {
      return (
        <div className="callout alert">
          <h5>Error Occurred</h5>
          <p>
            {accountsError.response?.data?.message || accountsError.message}
          </p>
        </div>
      );
    }

    // username access given
    if (accounts?.username) return null;
  }

  // render: request access to analytics
  return (
    <div>
      {!isAccountsLoading ? (
        <p>
          Let's begin by signing in your <b>Google Analytics</b> account
        </p>
      ) : (
        <p>Loading ...</p>
      )}

      <OAuth2Popup
        openUrl="/api/oauth2/google"
        saveUrl="/api/oauth2/google/save"
        onSuccessText="oauth2:success"
        onSuccess={() => {
          mutateAccounts();
        }}
      >
        <img
          src={
            !isAccountsLoading
              ? "/google_login.png"
              : "/google_login_disabled.png"
          }
          style={{ cursor: "pointer" }}
          alt="Sign in with Google"
        />
      </OAuth2Popup>
    </div>
  );
}

export default ConnectAnalytics;
