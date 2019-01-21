# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Issue Creation

There are 2 issue templates available. When reporting a bugfix, try providing us with as much info as possible, the issue template should give you a general idea. Use the feature request template if you have an enhancement idea for Exteranto. For any other enquiries, feel free to create a custom issue or contact the owner directly via email at kouks.koch@gmail.com.

## Pull Request Process

Any pull requests including bugfixes and new features should be open on the `develop` branch.

* Make sure to pull latest changes from the `develop` branch and resolve any conflicts before opening the PR.
* Increment the version of all the packages in the framework respectively. This project uses the SemVer scheme, so please try to follow that.
  - +0.0.1 for small patches with no new functionality
  - +0.1.0 for backward compatible new API
  - +1.0.0 for breaking changes that are not compatible
* Fill out the provided PR template consciously, providing us with as much information as possbile. Each pull request should also reference an issue.
* All PRs have to pass a continuous integration pipeline checking for correct builds and code style (Exteranto uses the `tslint:recommended` template with small adjustments).
* At least one approving review has to be present on the PR before you can merge it.
