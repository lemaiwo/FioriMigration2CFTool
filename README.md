<div id="top"></div>
<br />
<div align="center">

  <h3 align="center">Fiori Migration Tool</h3>

  <p align="center">
    Migration tool to migrate any UI5/Fiori app from on-premise to BTP CloudFoundry
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project


This project contains bash scripts to automate the migration of UI5/Fiori apps from one repo to another and make it reade for Business Technology Platform (BTP) - CloudFoundry (CF). With one command your app will run on the BTP Launchpad and will still be compatible with your on-premise system. In case you have a parallel landscape during the transition to BTP.

It can also be used for migrating apps from NEO to CF.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

You need to install the following tools before using this project:
* git
* git bash
* nodejs
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Install the project to use it:_

1. Clone the repo
   ```sh
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Open GitBash, navigate to this project and run the migration script by starting the following command:
```sh
sh migrate.sh
```
In case you want to migrate a specific branch to your target repo, you can use the following command:
```sh
sh migrate-branch.sh YourBranch repoFrom repoTo
```

The project comes with bash scripts that assume you also need to move the app from one GIT repo to another. In case you prefer to keep it in the current GIT repo, you can simply run the nodejs script after you cloned that specifc project inside the same folder. You'll have to add the source folder twice to make it work:
```sh
node index.js sourceFolder sourceFolder
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Merge scripts into one
- [ ] Update Fiori tooling

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch 
3. Commit your Changes 
4. Push to the Branch 
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSES/MIT.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Wouter Lemaire - [@wouter_lemaire](https://twitter.com/wouter_lemaire)

Project Link: [https://github.com/lemaiwo/FioriMigration2CFTool](https://github.com/lemaiwo/FioriMigration2CFTool)

<p align="right">(<a href="#top">back to top</a>)</p>