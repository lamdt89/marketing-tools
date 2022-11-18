module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    // 'subject-case': [2, 'always', ['lower-case', 'camel-case', 'pascal-case']],
    'type-case': [2, 'always', 'kebab-case'],
    'type-empty': [2, 'never']
  }
}
