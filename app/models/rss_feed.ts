import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RssFeed extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sourceName: string | null

  @column()
  declare sourceUrl: string

  @column.dateTime()
  declare recallAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
