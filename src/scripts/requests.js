import { createToast } from "./popups.js";

const baseUrl = "http://localhost:6278";

export function clearStoredData () {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
  }

  if (localStorage.getItem("is_admin")) {
    localStorage.removeItem("is_admin");
  }
}

export function redirectUser () {
  if (!localStorage.getItem("token") || !localStorage.getItem("is_admin")) {
    window.location.replace("../login/index.html");
  }
}

async function sendData (endpoint, data) {
  const request = await fetch(`${baseUrl}/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return request;
}

export async function createUser (data) {
  let toast;
  const response = await sendData("register", data);

  if (response.ok) {
    toast = createToast("Criação de usuário<br>bem-sucedida", "sucess");

    setTimeout(() => {
      window.location.assign("../login/index.html");
    }, 5500);
  } else {
    toast = createToast("E-mail já cadastrado", "alert");
  }

  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animationName = "hide";

    setTimeout(() => {
      document.body.removeChild(toast);
    }, 480);
  }, 5000);
}

export async function login (data) {
  let toast;
  const response = await sendData("login", data);
  const token = (await response.json()).token;

  if (response.ok) {
    const permission = await getPermissionByToken(token);
    
    localStorage.setItem("token", token);

    localStorage.setItem("is_admin", permission.is_admin);

    if (permission.is_admin) {
      window.location.assign("../admin-dashboard/index.html");
    } else {
      window.location.assign("../user-dashboard/index.html");
    }
  } else {
    toast = createToast("E-mail ou senha inválidos", "alert");
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animationName = "hide";
  
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 5000);
  }
}

async function getAllCompanies () {
  const request = await fetch(`${baseUrl}/companies`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const companies = await request.json();

  return companies;
}

async function getAllCompaniesBySector (sector) {
  const request = await fetch(`${baseUrl}/companies/${sector}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    }
  });

  const companies = request.json();

  return companies;
}

async function getAllSectors () {
  const token = localStorage.getItem("token");

  const request = await fetch(`${baseUrl}/sectors`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const sectors = await request.json();

  return sectors;
}

async function getUserInfo () {
  const token = localStorage.getItem("token");

  const request = await fetch(`${baseUrl}/users/profile`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const userData = await request.json();

  return userData;
}

async function getPermissionByToken (token) {
  const request = await fetch(`${baseUrl}/auth/validate_user`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const permission = await request.json();

  return permission;
}