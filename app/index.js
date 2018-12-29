/** @format */

'use strict';

const Generator = require('yeoman-generator');
const kebabcase = require('lodash.kebabcase');
const superb = require('superb');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        name: 'appName',
        message: 'What do you want to name your app?',
        default: kebabcase(this.appname),
      },
      {
        name: 'description',
        message: 'What is your app description?',
        default: `My ${superb.random()} microservice`,
      },
      {
        name: 'username',
        message: 'What is your GitHub username?',
        store: true,
        validate: username =>
          username.length > 0 ? true : 'You have to provide a username',
      },
    ]).then(props => {
      const appName = kebabcase(props.appName);

      this.props = Object.assign(
        {
          name: this.user.git.name(),
          email: this.user.git.email(),
        },
        props,
        { appName }
      );
    });
  }

  writing() {
    const mv = (from, to) => {
      this.fs.move(this.destinationPath(from), this.destinationPath(to));
    };

    this.fs.copyTpl(
      [`${this.templatePath()}/**`],
      this.destinationPath(),
      this.props
    );

    mv('editorconfig', '.editorconfig');
    mv('gitignore', '.gitignore');
    mv('prettierignore', '.prettierignore');
    mv('prettierrc', '.prettierrc');
    mv('travis.yml', '.travis.yml');
    mv('_package.json', 'package.json');
  }

  install() {
    this.installDependencies({ bower: false });
  }
};
