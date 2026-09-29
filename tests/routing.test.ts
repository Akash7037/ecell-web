describe('Routing', () => {
  jest.setTimeout(15000);
  it('should navigate to home page', async () => {
    const res = await fetch('http://localhost:3000');
    expect(res.status).toBe(200);
  });

  it('should navigate to about page', async () => {
    const res = await fetch('http://localhost:3000/about');
    expect(res.status).toBe(200);
  });

  it('should navigate to team page', async () => {
    const res = await fetch('http://localhost:3000/team');
    expect(res.status).toBe(200);
  });

  it('should navigate to events page', async () => {
    const res = await fetch('http://localhost:3000/events');
    expect(res.status).toBe(200);
  });

  it('should navigate to contact page', async () => {
    const res = await fetch('http://localhost:3000/contact');
    expect(res.status).toBe(200);
  });

  it('should navigate to admin login page', async () => {
    const res = await fetch('http://localhost:3000/admin/login');
    expect(res.status).toBe(200);
  });

  it('should have admin page at /admin', async () => {
    const res = await fetch('http://localhost:3000/admin');
    expect(res.status).toBe(200);
  });
});
