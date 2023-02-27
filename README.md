
### 安装

Windows系统安装
```
$ npm i tm-create-cli -g
```

Mac下安装
```
$ sudo npm i tm-create-cli -g
```

### 查看帮助信息

```
$ tm-create-cli
```


### 创建项目

```
# 指定项目名字创建项目
$ tm-create-cli create 模板名<template-name> 项目名字<project-name>

# 在当前目录创建项目
$ tm-create-cli create 模板名<template-name> .
```

### 查看所有支持的项目模板

```
$ tm-create-cli list
```

<!-- ### 添加项目模板

```
$ tm-create-cli add 模板名<template-name> 模板github仓库地址,支持ssh/https格式<git-repo-address>
```

### 删除项目模板

```
$ tm-create-cli delete 模板名<template-name>
```

### 发布到npm

执行pkg下的脚本, 自动发版并且生成changelog, travis就会执行检测后续自动发到npm.
```
npm run release
```



## TODOLIST

- 优化Node应用模板
- 优化Vue应用模板
- 添加单测 -->
