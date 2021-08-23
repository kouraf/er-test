import fs from 'fs'

export const bufferFile = (relPath, path) => {
  try {
    // as string
    return fs.readFileSync(path.join(__dirname, relPath), { encoding: 'utf8' })
    // as buffer
    // return fs.readFileSync(path.join(__dirname, relPath))
  } catch (e) {
    console.log('bufferFile err ', e)
  }
}

export const readFile = fullPath => {
  try {
    // as string
    return fs.readFileSync(fullPath, { encoding: 'utf8' })
    // as buffer
    // return fs.readFileSync(path.join(__dirname, relPath))
  } catch (e) {
    console.log('bufferFile err ', e)
  }
}

export const appendFile = (fullPath, data) => {
  try {
    fs.appendFileSync(fullPath, data)
  } catch (e) {
    console.log('appendFileSync err ', fullPath, e)
  }
}

export const writeFile = (fullPath, data) => {
  try {
    fs.writeFileSync(fullPath, data, { encoding: 'utf8', flag: 'w' })
  } catch (e) {
    console.log('writeFile err ', fullPath, e)
  }
}
