export default function (test) {
  test('Renderer', (assert) => {
    assert.plan(1);
    window.onload();
    assert.equal(document.getElementById('container').childNodes.length, 1,
      'Menu attached to container on load');
  });
}
