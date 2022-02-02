# Fly Run

Simple multiple process spawner and manager for developers.

## Quick start

**1. Install** the package globally with npm or yarn:
  - `npm global install @ifnot/fly-run`
  - (or) `yarn add -g @ifnot/fly-run`

**2. Configure** it with a js/json file (example `/home/me/fly-run.conf.js`) :

```js
module.exports = [
  {
    name: 'prog1',
    command: '/usr/bin/yarn',
    args: ['serve'],
    options: {
      cwd: '/home/me/projects/prog1',
    }
  },
  // Add more programs here
]
```

**3. Run** with configuration file as second argument `fly-sync /home/me/fly-run.conf.js`

## Commands

Fly run will listen inputs for running some actions :

- **CTRL + C**: Kill all spawned processes and exit the program
- `kill prog1`: Kill the process prog1
- `start prog1`: Start the process prog1
- `restart prog1`: Restart the process prog1

## Configuration (for each entries)

- **name** `string`: The name of the program (used for display and control commands)
- **command** `string`: The command to run
- (optionnal) **args** `array[string]`: The array of arguments used for the [spawn](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) command
- (optionnal) **options** `array[mixed]`: The array of options used for the [spawn](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options) command
- (optionnal) **every** `number`: Interval in seconds for running again this program
  - Only for self-closing programs, handy for running crons (eg. each minute with `every: 60`).
  
## Todo List :

- [ ] Major refactoring for splitting main features into modules
- [ ] Check for process before running it again with `start` command