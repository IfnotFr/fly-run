#!/usr/bin/env node

const { spawn } = require('child_process')
const chalk = require('chalk')
const onExit = require('death')
const kill = require('tree-kill')
const IOSplit = require('iosplit')
const apps = require(process.argv[2])

/*
 * Handle input commands and split the screen
 */
const iosplit = new IOSplit()
iosplit.on('line', line => {
  try {
    if (line.startsWith('kill ')) {
      const name = line.replace('kill ', '')
      console.log(chalk.yellow('Sending kill to', name, ' ...'))
      kill(childs[name].pid)
    } else if (line.startsWith('start ')) {
      const name = line.replace('start ', '')
      run(apps.find(app => app.name === name))
    } else if (line.startsWith('restart ')) {
      const name = line.replace('restart ', '')
      console.log(chalk.yellow('Sending kill to', name, ' ...'))
      kill(childs[name].pid)
      const interval = setInterval(() => {
        if (!(name in childs)) {
          run(apps.find(app => app.name === name))
          clearInterval(interval)
        }
      }, 100)
    }
  } catch (err) {
    console.error(err)
  }
})
iosplit.start()

/*
 * Run the apps
 */
const childs = {}
const run = app => {
  const count = 'count' in app ? app.count : 1
  const output = 'output' in app ? app.output : true
  for (let i = 0; i < count; i++) {
    childs[app.name] = app.child = spawn(app.command, app.args, app.options)
    console.log(
      chalk.green(app.name) +
      ' - Spawning "' + app.command + ' ' +
      app.args.join(' ') + '" ' +
      (!output ? 'IN SILENT MODE ' : ' ') +
      '...'
    )

    if (output) {
      childs[app.name].stdout.on('data', data => {
        data.toString().split(/\r?\n/).forEach(line => {
          line = line.replace(/\s+$/, '')
          if (line !== '') console.log(chalk.blue(app.name) + ' - ' + line)
        })
      })
      childs[app.name].stderr.on('data', data => {
        data.toString().split(/\r?\n/).forEach(line => {
          line = line.replace(/~+$/, '')
          if (line !== '') console.log(chalk.red(app.name) + ' - ' + line)
        })
      })
    }
    childs[app.name].on('close', code => {
      console.log(chalk.red(app.name) + ' - CLOSED with code ' + code)
      delete childs[app.name]
    })
  }
}

apps.forEach(app => {
  if ('every' in app) {
    setInterval(() => {
      run(app)
    }, app.every * 1000)
  }

  run(app)
})

/*
 * Register exit process cleanups
 */
onExit(() => {
  setInterval(() => {
    const childCount = Object.entries(childs).length
    if (childCount === 0) {
      process.exit()
    }
  }, 100)

  for (const [name, child] of Object.entries(childs)) {
    console.log(chalk.yellow('Sending kill to', name, ' ...'))
    kill(child.pid)
  }
})