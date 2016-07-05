import { fromPairs, map, each, compact, pick } from 'lodash';

const fields = [
  'id',
  'active',
  'directory',
  'domain',
  'settings',
  'production',
];

const validation = {
  id: [],
  active: [
    (v) => (typeof v === 'boolean' ? null : 'must be true/false'),
  ],
  directory: [
    (v) => (v ? null : 'is empty'),
  ],
  domain: [
    (v) => (v ? null : 'is empty'),
    (v) => (/^[a-zA-Z0-9-\.]+$/.test(v) ? null : 'is invalid (a-z, 0-9, - or . only)'),
  ],
  settings: [
  ],
  production: [
    (v) => (typeof v === 'boolean' ? null : 'must be true/false'),
  ],
};

function checkField(name, value) {
  const tests = validation[name];
  let results;

  if (tests) {
    results = compact(map(tests, (test) => (test(value))));
  } else {
    results = ['not in model'];
  }

  return results;
}

function checkFields(values) {
  return fromPairs(map(fields, (field) => (
    [field, checkField(field, (values || [])[field])[0]]
  )));
}

function sanitize(content) {
  return fromPairs(compact(map(content, (c) => {
    const sanitized = (c.id ? [c.id, pick(c, fields)] : null);
    if (sanitized) {
      const errors = checkFields(sanitized);
      each(errors, (value, field) => {
        if (value) sanitized[field] = null;
      });
    }

    return sanitized;
  })));
}

export default {
  fields,
  validation,
  checkField,
  checkFields,
  sanitize,
};
