# vscode-icons
---

Bring icons to your [Visual Studio Code](https://code.visualstudio.com/) (**minimum supported version: `1.8.1`**)

---

## Installation

To install the extension just execute the following command:

```sh
ext install vscode-icons
```

Some people have reported that they cannot find the extension when they insert the installation command.

If you find yourself in the same position, try:

```sh
ext install icons
# or
ext install "vscode-icons"
```

## Usage

Once installed and after reloading `vscode`, you will be presented with a message to `Activate` the icons.

In case this doesn't happen, navigate to:

* `Linux` & `Windows` `=>` **File > Preferences > File Icon Theme > VSCode Icons**.
* `MacOS` `=>` **Code > Preferences > File Icon Theme > VSCode Icons**.

## Features

`vscode-icons` is being shipped with a lot of features, like:

* [Icons Customization](https://github.com/vscode-icons/vscode-icons/wiki/Customization)
* [Project Auto-Detection](https://github.com/vscode-icons/vscode-icons/wiki/Pad)
* [Custom Configuration](https://github.com/vscode-icons/vscode-icons/wiki/Configuration)

## Globalization

`vscode-icons` uses [Crowdin](https://crowdin.com/project/vscode-icons-i18n) to provide translations for `vscode` supported languages.

We are looking for translators and proofreaders for all `vscode` supported languages.

If you'd like to contribute, checkout the [translation section](https://github.com/vscode-icons/vscode-icons/wiki/Translation).

## Contributing

If you like to get involved with the source code, checkout the [build section](https://github.com/vscode-icons/vscode-icons/wiki/Build).

For those using [Docker](https://www.docker.com/) checkout the [docker section](https://github.com/vscode-icons/vscode-icons/wiki/Docker).

On the other hand, if you want to show the world your artistic side, checkout the [contributing section](https://github.com/vscode-icons/vscode-icons/wiki/Contributing).

In any case, please follow our [contribution guidelines](https://github.com/vscode-icons/vscode-icons/blob/master/.github/CONTRIBUTING.md).

## Documentation

In our [wiki](https://github.com/vscode-icons/vscode-icons/wiki) you can find info, like:

* [Extension's History](https://github.com/vscode-icons/vscode-icons/wiki/History)
* [Supported file icons](https://github.com/vscode-icons/vscode-icons/wiki/ListOfFiles).
* [Supported folder icons](https://github.com/vscode-icons/vscode-icons/wiki/ListOfFolders).


## Adding New icon

* add language to nativeLanguageCollection.ts [ bdd: ILanguage;]
* add parameter to languages.ts [bdd: { ids: 'bdd', defaultExtension: 'bdd' }]
* add icon details to supportedExtensions.ts
	[{icon: 'bdd',extensions: ['bdd'],languages: [languages.bdd],format: FileFormat.svg,}]
* add icon to icon folder like file_type_bdd.svg

* `Compile and Build new Icon`
	#####
		npm install -d
		npm run build

Note: New Build will be generated in qasout folder

**Enjoy!**
