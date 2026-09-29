describe('Responsive Interactions & Accessibility', () => {
  it('should have skip-link and nav in the rendered HTML', async () => {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    expect(html).toContain('skip-link');
    expect(html).toContain('<nav');
  });

  it('should include viewport and accessibility metadata', async () => {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    expect(html).toContain('viewport');
    expect(html).toContain('VSB');
  });
});
