describe('Admin Authorization', () => {
  it('should require authentication for admin panel', async () => {
    const res = await fetch('http://localhost:3000/api/auth/me');
    const data = await res.json();
    expect(data.authenticated).toBe(false);
  });

  it('should reject invalid login credentials', async () => {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@email.com', password: 'wrongpassword' }),
    });
    expect(res.status).toBe(401);
  });

  it('should return unauthorized without session token', async () => {
    const res = await fetch('http://localhost:3000/api/auth/me');
    expect(res.status).toBe(401);
  });
});
