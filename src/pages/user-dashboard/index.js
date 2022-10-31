import { getUserInfo, redirectUser, verifyUserLevel } from "../../scripts/requests.js";

redirectUser();

await verifyUserLevel(false);
