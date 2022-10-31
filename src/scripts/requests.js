import { createToast } from "./popups.js";

const baseUrl = "http://localhost:6278";

export function clearToken () {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token");
  }
}

async function sendData (data) {
  const request = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return request;
}

export async function createUser (data) {
  const response = await sendData(data);
  let toast;

  if (response.ok) {
    toast = createToast("Criação de usuário<br>bem-sucedida");

  } else {
    toast = createToast("E-mail já cadastrados");
  }

  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animationName = "hide";
  }, 2000);

  setTimeout(() => {
    document.body.removeChild(document.querySelector("toast"));
  }, 500);
}

async function login (data) {
  const response = await sendData(data);
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