const API_BASE_URL = 'http://localhost:8000/api/v1';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unexpected error occurred' }));
    
    let errorMessage = 'An unexpected error occurred';
    if (typeof errorData.detail === 'string') {
      errorMessage = errorData.detail;
    } else if (Array.isArray(errorData.detail)) {
      errorMessage = errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
}

// --- Companies API ---

export async function fetchCompanies(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('size', params.size.toString());
  
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.product) queryParams.append('product', params.product);

  const response = await fetch(`${API_BASE_URL}/companies/?${queryParams.toString()}`);
  return handleResponse(response);
}

export async function fetchCompanyById(id) {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`);
  return handleResponse(response);
}

export async function createCompany(companyData) {
  const response = await fetch(`${API_BASE_URL}/companies/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData),
  });
  return handleResponse(response);
}

export async function updateCompany(id, companyData) {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData),
  });
  return handleResponse(response);
}

export async function deleteCompany(id) {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 204) return true;
  return handleResponse(response);
}

// --- Contacts API ---

export async function fetchContacts(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('size', params.size.toString());
  
  if (params.search) queryParams.append('search', params.search);
  if (params.company_id) queryParams.append('company_id', params.company_id.toString());

  const response = await fetch(`${API_BASE_URL}/contacts/?${queryParams.toString()}`);
  return handleResponse(response);
}

export async function fetchContact(id) {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`);
  return handleResponse(response);
}

export async function createContact(contactData) {
  const response = await fetch(`${API_BASE_URL}/contacts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  return handleResponse(response);
}

export async function updateContact(id, contactData) {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  return handleResponse(response);
}

export async function deleteContact(id) {
  const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 204) return true;
  return handleResponse(response);
}
