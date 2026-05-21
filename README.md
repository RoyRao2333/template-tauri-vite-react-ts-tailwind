<div align="center"><img src = "https://github.com/RoyRao2333/template-tauri-vite-react-ts-tailwind/assets/31413093/91cdcd1b-2387-4c01-9710-9b2f44c10329" height="100px" alt="Tauri"/><img src = "https://user-images.githubusercontent.com/31413093/197097625-5b3bd3cf-2bd6-4a3a-8059-a1fe9f28100b.svg" height="100px" alt="Vite"/></div>

<h2 align="center">template-tauri-vite-react-ts-tailwind</h2>

<div align="center">
<a href="https://reactjs.org/"><image src="https://img.shields.io/static/v1?label=React&message=^19&style=for-the-badge&labelColor=FFFFFF&logo=react&color=61DAFB"/></a> <a href="https://www.typescriptlang.org/"><image src="https://img.shields.io/static/v1?label=TypeScript&message=^5&style=for-the-badge&labelColor=FFFFFF&logo=typescript&color=3178C6"/></a>
</div>

<div align="center">
<a href="https://cn.vitejs.dev/"><image src="https://img.shields.io/static/v1?label=Vite&message=^7&style=for-the-badge&labelColor=FFFFFF&logo=vite&color=646CFF"/></a> <a href="https://tailwindcss.com/"><image src="https://img.shields.io/static/v1?label=Tailwind%20CSS&message=^4&style=for-the-badge&labelColor=FFFFFF&logo=tailwindcss&color=06B6D4"/></a> <a href="https://tauri.app/"><image src="https://img.shields.io/static/v1?label=Tauri&message=^2&style=for-the-badge&labelColor=FFFFFF&logo=tauri&color=FFC131"/></a>
</div>

## Introduction

A starter [Tauri](https://v2.tauri.app/) template, but with pnpm monorepo and some recommended configurations:

这是一个 [Tauri](https://v2.tauri.app/) 启动模板，已经整理成 pnpm monorepo 结构，并带了一些常用的推荐配置：

- Vite
- React
- TypeScript
- Tailwind CSS
- Oxc

## Install

> This project uses [pnpm](https://pnpm.io/) as its package manager. Go check it out if you don't have it locally installed. If you use other package managers like *Yarn* or *npm*, you may need to change some scripts in `tauri.conf.json` and `package.json`.
>
> 这个项目使用 [pnpm](https://pnpm.io/) 作为包管理器。如果本地还没安装，可以先去看一下 pnpm 的安装方式。如果你更习惯用 *Yarn* 或 *npm*，可能需要自己调整 `tauri.conf.json` 和 `package.json` 里的部分脚本。

> [!TIP]
> 
> The fastest way to use this template is to click the “Use this template” button on the top right of this repository. It will help you create a new repository quickly, and you can make any modifications to your own repository. If you still want to download this template separately, please continue reading.
> 
> 使用这个模板最快的方式，是点击仓库右上角的 “Use this template” 按钮。它会帮你快速创建一个新仓库，之后你就可以在自己的仓库里自由修改。如果你还是想单独下载一份模板，也可以继续往下看。

Then you need a copy of this repository. You can [download](https://github.com/RoyRao2333/template-tauri-vite-react-ts-tailwind/archive/refs/heads/main.zip) a copy as zip but [tiged](https://github.com/tiged/tiged) is recommended.

接着你需要把这个仓库复制到本地。你可以直接下载 [zip 压缩包](https://github.com/RoyRao2333/template-tauri-vite-react-ts-tailwind/archive/refs/heads/main.zip)，不过更推荐使用 [tiged](https://github.com/tiged/tiged)。

After you installed tiged, please excute the following command:

安装好 tiged 后，执行下面的命令：

```sh
$ cd path-to-save-your-project
$ tiged royrao2333/template-tauri-vite-react-ts-tailwind your-project-name
```

After getting a copy of this repository, you can use your package manager to install dependecies:

拿到项目代码后，进入项目目录并安装依赖：

```sh
$ cd path-to-your-project
$ pnpm install
```

## Rename Project

Before you start development, rename the template placeholders to your own project name and bundle identifier:

开始开发前，建议先把模板里的占位名称改成你自己的项目名称和 bundle identifier：

```sh
$ pnpm rename-project --name "My App" --id com.example.my-app
```

| Argument 参数 | Required 是否必填 | Default 默认值 | Example 示例         | Description 说明                                                                                                                                                                                                                                                                                                |
| ------------- | ----------------- | -------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--name`      | Yes 是            | None 无        | `"My App"`           | The project name you would enter as `Project name` in `create-tauri-app`.<br>也就是你在 `create-tauri-app` 里会填写的 `Project name`。它会用于 Tauri 的 `productName` 和窗口标题；归一化后的 package name 还会用于 `apps/<packageName>`、`@app/<packageName>`、Rust package name，以及 Rust 的 `xxx_lib` 名称。 |
| `--id`        | Yes 是            | None 无        | `com.example.my-app` | The bundle identifier you would enter as `Identifier` in `create-tauri-app`.<br>也就是你在 `create-tauri-app` 里会填写的 `Identifier`，会写入 `src-tauri/tauri.conf.json`。                                                                                                                                     |

| Usage 用途                                                 | Command 命令                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------- |
| Rename the template to `My App`<br>把模板重命名为 `My App` | `pnpm rename-project --name "My App" --id com.example.my-app` |

The package name follows the same normalization rules as `create-tauri-app`: it is lowercased, `:`, `;`, spaces, and `~` become `-`, `.`, `/`, and `\` are removed, leading digits and `-` are removed, and an empty result falls back to `tauri-app`.

package name 会使用和 `create-tauri-app` 一致的归一化规则：先转成小写；把 `:`、`;`、空格和 `~` 转成 `-`；移除 `.`、`/` 和 `\`；再移除开头的数字和 `-`。如果最后结果为空，就使用 `tauri-app` 作为默认值。

## Usage

Let's run!

现在可以启动项目了：

```sh
$ pnpm tauri dev
```

> We've already implemented some recommended configurations in ```.eslintrc.js```, ```.eslintignore```, ```.prettierrc.json5``` and ```.prettierignore```. Feel free to edit them if you have your own preferences.
>
> 模板里已经放好了一些推荐配置，比如 ```.eslintrc.js```、```.eslintignore```、```.prettierrc.json5``` 和 ```.prettierignore```。如果你有自己的偏好，可以按项目习惯继续调整。

## Related Efforts

相关项目：

- [Vite](https://github.com/vitejs/vite)
- [Tauri](https://github.com/tauri-apps/tauri)
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)

## Contributing

Feel free to dive in! [Open an issue](https://github.com/RoyRao2333/template-tauri-vite-react-ts-tailwind/issues/new) or submit PRs.

欢迎一起改进这个模板！你可以[提交 issue](https://github.com/RoyRao2333/template-tauri-vite-react-ts-tailwind/issues/new)，也可以直接发 PR。
