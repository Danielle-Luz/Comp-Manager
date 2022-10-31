import { getFormData } from "../../scripts/forms.js";
import { clearStoredData, createUser } from "../../scripts/requests.js";

clearStoredData();

getFormData("signup", createUser);