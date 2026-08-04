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

// --- Follow-ups API ---

export async function fetchFollowUps(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('size', params.size.toString());
  
  if (params.company_id) queryParams.append('company_id', params.company_id.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.scheduled_after) queryParams.append('scheduled_after', params.scheduled_after);
  if (params.scheduled_before) queryParams.append('scheduled_before', params.scheduled_before);

  const response = await fetch(`${API_BASE_URL}/follow-ups/?${queryParams.toString()}`);
  return handleResponse(response);
}

export async function fetchFollowUp(id) {
  const response = await fetch(`${API_BASE_URL}/follow-ups/${id}`);
  return handleResponse(response);
}

export async function createFollowUp(followData) {
  const response = await fetch(`${API_BASE_URL}/follow-ups/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(followData),
  });
  return handleResponse(response);
}

export async function updateFollowUp(id, followData) {
  const response = await fetch(`${API_BASE_URL}/follow-ups/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(followData),
  });
  return handleResponse(response);
}

export async function deleteFollowUp(id) {
  const response = await fetch(`${API_BASE_URL}/follow-ups/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 204) return true;
  return handleResponse(response);
}

// --- Communication History API ---

export async function fetchCommunications(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('size', params.size.toString());

  if (params.search) queryParams.append('search', params.search);
  if (params.company_id) queryParams.append('company_id', params.company_id.toString());
  if (params.channel) queryParams.append('channel', params.channel);
  if (params.contact_person_id) queryParams.append('contact_person_id', params.contact_person_id.toString());
  if (params.date_after) queryParams.append('date_after', params.date_after);
  if (params.date_before) queryParams.append('date_before', params.date_before);

  const response = await fetch(`${API_BASE_URL}/communications/?${queryParams.toString()}`);
  return handleResponse(response);
}

export async function fetchCommunication(id) {
  const response = await fetch(`${API_BASE_URL}/communications/${id}`);
  return handleResponse(response);
}

export async function createCommunication(commData) {
  const response = await fetch(`${API_BASE_URL}/communications/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commData),
  });
  return handleResponse(response);
}

export async function updateCommunication(id, commData) {
  const response = await fetch(`${API_BASE_URL}/communications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commData),
  });
  return handleResponse(response);
}

export async function deleteCommunication(id) {
  const response = await fetch(`${API_BASE_URL}/communications/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 204) return true;
  return handleResponse(response);
}

// --- Products API ---

export async function fetchProducts(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('size', params.size.toString());

  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

  const response = await fetch(`${API_BASE_URL}/products/?${queryParams.toString()}`);
  return handleResponse(response);
}

export async function fetchProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return handleResponse(response);
}

export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 204) return true;
  return handleResponse(response);
}

