import mongoose from 'mongoose'
import { connect } from './db'
import { MongoMemoryServer } from 'mongodb-memory-server'
// Extend the default timeout so MongoDB binaries can download when first run
// jest.setTimeout(10000)

export default class MongoMemoryHelper {
  constructor() {
    this.server = MongoMemoryServer.create()
  }

  /**
   * Start the server and establish a connection
   */
  async start() {
    const server = await this.server
    const url = server.getUri()
    console.log('DB Helper : ', url)
    await connect(url)
  }

  /**
   * Close the connection and stop the server
   */
  async stop() {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await this.server.stop()
  }

  /**
   * Delete all collections and indexes
   */
  async cleanup() {
    const db = mongoose.connection.db

    await db.dropDatabase()
  }
}
