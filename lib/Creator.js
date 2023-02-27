/*
 * @Author: wj
 * @Date: 2020-07-23 10:50:02
 * @LastEditors: wj_advance
 * @LastEditTime: 2022-12-21 16:26:42
 * @FilePath: /tm-create-cli/lib/Creator.js
 * @Description:
 */
const chalk = require('chalk')
const execa = require('execa') // 一个child_process封装库
const EventEmitter = require('events')
const fs = require('fs-extra')
const { clearConsole } = require('./util/clearConsole')
const { logWithSpinner, stopSpinner } = require('./util/spinner')
const { log, warn, error } = require('./util/logger')
const { hasGit, hasProjectGit } = require('./util/env')
const fetchRemotePreset = require('./util/loadRemotePreset')
const { readTemplateJson } = require('./util/readTemplateData')
const { exec } = require('child_process')

module.exports = class Creator extends EventEmitter {
  constructor(name, context) {
    super()
    this.name = name
    this.context = process.env.EASY_CLI_CONTEXT = context // 项目绝对路径
  }

  async create(cliOptions = {}) {
    const { name, context } = this
    const templateGitRepoJson = readTemplateJson()
    const gitRepoUrl = templateGitRepoJson[process.env.EASY_CLI_TEMPLATE_NAME]
    let tmpdir
    await clearConsole(true)
    log(`✨ Creating project in ${chalk.yellow(context)}.`)
    log()
    try {
      stopSpinner()
      logWithSpinner(
        `⠋`,
        `Download project template. This might take a while...`
      )
      tmpdir = await fetchRemotePreset(gitRepoUrl['download'])
    } catch (e) {
      stopSpinner()
      error(`Failed fetching remote git repo ${chalk.cyan(gitRepoUrl)}:`)
      throw e
    }
    // 拷贝到项目文件下
    try {
      fs.copySync(tmpdir, context)
    } catch (error) {
      return console.error(chalk.red.dim(`Error: ${error}`))
    }
    const shouldInitGit = this.shouldInitGit()
    if (shouldInitGit) {
      // 已经安装git
      stopSpinner()
      log()
      logWithSpinner(`🗃`, `Initializing git repository...`)
      this.emit('creation', { event: 'git-init' })
      // 执行git init
      await this.run('git init')
    }

    // commit init state
    let gitCommitFailed = false
    if (shouldInitGit) {
      await this.run('git add -A')
      try {
        await this.run('git', ['commit', '-m', 'init'])
      } catch (error) {
        gitCommitFailed = true
      }
    }

    stopSpinner()
    log()
    log(`🎉  Successfully created project ${chalk.yellow(name)}.`)
    log()
    logWithSpinner(`⠋`, `正在安装项目依赖,请稍等...`)
    log()
    exec(`cd ${name} && npm i`, error => {
      if (!error) {
        logWithSpinner(`🎉`, `依赖安装成功`)
      } else {
        logWithSpinner(`🙅‍♂️`, `依赖安装失败`)
      }
      stopSpinner()
    })
    log()
    this.emit('creation', { event: 'done' })
    if (gitCommitFailed) {
      // commit fail
      warn(
        `Skipped git commit due to missing username and email in git config.\n` +
          `You will need to perform the initial commit yourself.\n`
      )
    }
  }

  run(command, args) {
    if (!args) {
      ;[command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, { cwd: this.context })
  }

  shouldInitGit() {
    if (!hasGit()) {
      return false
    }
    return !hasProjectGit(this.context)
  }
}
