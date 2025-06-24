
export const generateShortId = (): string => {
  // Generate a short alphanumeric ID (6 characters)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString().slice(-3);
  return result.slice(0, 3) + timestamp;
};
