**English** | [简体中文](locales_zh.md) | [Back](../README.md)

For the convenience of devloppe, the language package uses yaml storage instead of json.

Basic yaml syntax that may be used:

- `key: value` means the data value returned when the value in the acquired language package is key.
- `# Text` represents a comment.

For example:

```yaml
home: Home
login: Login
register: Register
settings: Settings
```

A language pack must contain `_self` key value, indicating the text displayed when the footer switches languages.

In order to prevent the problem that the key value of some languages does not exist temporarily, the key value will be queried from the English language package (`en.yaml`) when the key value cannot be found in the current language package; if it is not found in the English language package, either, it will be returned by adding a pair of brackets around the key.

If you need to add a new language, in addition to adding a language pack file, you need to add the language in the `langs` array of `locales/index.js`, and add a function in the `module.exports`.