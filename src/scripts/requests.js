import { createToast } from "./popups.js";

const baseUrl = "http://localhost:6278";

export function clearStoredData () {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
  }
}

export function redirectUser () {
  if (!localStorage.getItem("token")) {
    window.location.replace("../homepage/index.html");
  }
}

export async function verifyUserLevel (level) {
 const isAdmin = (await getPermissionByToken(localStorage.getItem("token"))).is_admin;

 if (isAdmin != level) {
  window.location.replace("../homepage/index.html");
 }
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

export async function getAllCompanies () {
  const request = await fetch(`${baseUrl}/companies`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const companies = await request.json();

  return companies;
}

export async function getAllCompaniesBySector (sector) {
  const request = await fetch(`${baseUrl}/companies/${sector}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });

  const companies = request.json();

  return companies;
}

export async function getAllSectors () {
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

export async function getAllDepartments () {
  const token = localStorage.getItem("token");

  const request = await fetch(`${baseUrl}/departments`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const departments = await request.json();

  return departments;
}

export async function getUserInfo () {
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

export async function getCoworkers () {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/users/departments/coworkers`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const coworkers = await response.json();

  return coworkers;
}

export async function editLoggedUser (data) {
  const token = localStorage.getItem("token");

  const response =  await fetch(`${baseUrl}/users`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function getCompanySectors (id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${baseUrl}/departments/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })

  const sectors = await response.json();

  return sectors;
}