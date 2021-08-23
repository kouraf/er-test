import MongoMemoryHelper from './utils/mongoMemoryHelper'
const dbHelper = new MongoMemoryHelper()

beforeAll(async () => {
  await dbHelper.start()
})

afterAll(async () => {
  // await dbHelper.stop()
})

afterEach(async () => {
  await dbHelper.cleanup()
})
