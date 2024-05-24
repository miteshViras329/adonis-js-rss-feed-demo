import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'feeds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('rss_feed_id').nullable()
      table.string('source').nullable()
      table.string('creator').nullable()
      table.string('title', 512).nullable()
      table.string('link', 512).nullable()
      table.text('content').nullable()
      table.string('image_url').nullable()
      table.json('response').nullable()
      table.dateTime('published_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
