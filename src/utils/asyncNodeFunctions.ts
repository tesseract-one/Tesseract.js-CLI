import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { promisify } from 'util'

export const existsAsync = promisify(fs.exists)
export const renameAsync = promisify(fs.rename)
export const copyFileAsync = promisify(fs.copyFile)
export const spawnAsync = promisify(spawn)
export const readFileAsync = promisify(fs.readFile)
export const unlinkAsync = promisify(fs.unlink)
export const readdirAsync = promisify(fs.readdir)
export const lstatAsync = promisify(fs.lstat)
export const rmdirAsync = promisify(fs.rmdir)

const removeDirContentAsync = async (dir: string, file: string) => {
  const p = path.join(dir, file)
  const stat = await lstatAsync(p)
  stat.isDirectory()
    ? await removeDirAsync(p)
    : await unlinkAsync(p)
}

export const removeDirAsync = async (dir: string) => {
  const files = await readdirAsync(dir)
  await Promise.all(files.map(file => removeDirContentAsync(dir, file)))
  await rmdirAsync(dir)
}