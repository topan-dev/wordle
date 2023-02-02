[English](locales.md) | **简体中文** | [返回](../README.md)

为了修改方便，语言包使用 yaml 存储，而不是 json。

可能用到的基础 yaml 语法：

- `key: value` 表示当获取语言包中键值为 key 时返回的数据 value；
- `# Text` 表示注释。

例如：

```yaml
home: Home
login: Login
register: Register
settings: Settings
```

一个语言包中必须包含 `_self` 键值，表示在页脚切换语言时所显示的文本。

为了防止部分语言的键值暂时不存在的问题，将会在当前语言包中找不到该键值时，从英文语言包（`en.yaml`）查询键值；如果英文语言包也找不到，将在键值两边加上一对中括号返回。

如需要添加新语言，除了添加语言包文件外，还需要在 `locales/index.js` 的 `langs` 数组中添加该语言，以及在 `module.exports` 中添加一个函数。