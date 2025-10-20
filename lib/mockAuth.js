// Mock authentication system for prototype
export const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator BKN',
    nip: '198501012010011001'
  },
  {
    id: '2',
    username: 'asn001',
    password: 'asn123',
    role: 'asn',
    name: 'Budi Santoso',
    nip: '199002152015031002'
  }
];

export function authenticateUser(username, password) {
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

export function generateMockToken(user) {
  return Buffer.from(JSON.stringify(user)).toString('base64');
}

export function verifyMockToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}