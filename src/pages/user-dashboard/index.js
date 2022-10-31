import { getUserInfo, redirectUser, verifyUserLevel } from "../../scripts/requests";

redirectUser();

verifyUserLevel(false);

async function setUserInfo () {
  const userInfo = await getUserInfo();
}

