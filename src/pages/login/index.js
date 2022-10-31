import { getFormData } from "../../scripts/forms.js";
import { clearToken, login } from "../../scripts/requests.js";

clearToken();

getFormData("login", login);