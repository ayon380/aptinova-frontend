import { jwtDecode } from 'jwt-decode';

export const handleAuth = async (formData, type) => {
  try {
    const response = await fetch(`/api/auth/${type}`, {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        ...(type === 'register' ? { name: formData.get('name') } : {})
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Authentication failed');

    // Store the token
    localStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
};