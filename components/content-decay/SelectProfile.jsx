import { useAnalyticsAccounts, useAnalyticsData } from "@/hooks/content-decay";
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cookie from "js-cookie";

export function SelectProfile() {
  // cookies
  const accessToken = cookie.get("GA_accessToken");
  const profileId = cookie.get("GA_profileId");

  // hooks
  const { accounts, isAccountsLoading, mutateAccounts } =
    useAnalyticsAccounts();
  const { isDataLoading, mutateData } = useAnalyticsData();

  // render: fallback
  if (!accessToken || profileId) return null;

  // render: exceptions
  if (accessToken) {
    if (accounts) {
      // no google analytics accounts
      if (!accounts.items || accounts.item?.length === 0) {
        return (
          <div className="callout warning">
            <h5>Google Analytics</h5>
            <p>Unable to retrieve any profiles for</p>
          </div>
        );
      }
    } else return null;
  }

  // compute: available profiles
  const profileRows = [];

  accounts.items.forEach((item) => {
    item.webProperties.forEach((property) => {
      property.profiles.forEach((profile) => {
        profileRows.push({
          // account
          accountId: item.id,
          accountName: item.name,
          // property
          propertyId: property.id,
          propertyUrl: property.websiteUrl,
          propertyName: property.name,
          // profile
          profileId: profile.id,
          profileName: profile.name,
        });
      });
    });
  });

  // render: select a profile
  return (
    <>
      <div className="padding-vertical-3">
        <h5>
          Select a Profile{" "}
          <span className="label secondary">
            {accounts.username}
            <FontAwesomeIcon
              icon={faTimes}
              style={{ marginLeft: "0.5em", cursor: "pointer" }}
              onClick={() => {
                cookie.remove("GA_accessToken");
                cookie.remove("GA_profileId");
                cookie.remove("GA_profileInfo");

                mutateData();
                mutateAccounts();
              }}
            />
          </span>
        </h5>
        <h6 className="subheader">
          We'll analyse articles for the below selected Google Analytics
          Profile.
        </h6>
      </div>
      {isAccountsLoading ? (
        <div>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{ marginRight: "0.5rem" }}
          />
          Fetching profiles ...
        </div>
      ) : (
        <table className="hover unstriped">
          <thead>
            <tr>
              <th>Account</th>
              <th>Property</th>
              <th>Profile</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {profileRows.map((profileRow, i) => (
              <tr key={i}>
                <td>{profileRow.accountName}</td>
                <td>
                  <b>{profileRow.propertyName}</b>{" "}
                  <span style={{ fontSize: "0.8em" }}>
                    ({profileRow.propertyId})
                  </span>
                  <p>
                    <a href={profileRow.propertyUrl} target="_blank">
                      {profileRow.propertyUrl}
                    </a>
                  </p>
                </td>
                <td>
                  <i>{profileRow.profileName}</i>{" "}
                  <p style={{ fontSize: "0.8em" }}>{profileRow.profileId}</p>
                </td>
                <td>
                  <div
                    className="button"
                    onClick={() => {
                      // TODO: Set 1 hour expiry for GA_profileId expiry
                      cookie.set("GA_profileId", profileRow.profileId);
                      cookie.set("GA_profileInfo", JSON.stringify(profileRow));

                      mutateData();
                    }}
                    disabled={isDataLoading}
                  >
                    Select Profile
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default SelectProfile;
