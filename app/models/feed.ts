import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Feed extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rssFeedId: number | null

  @column()
  declare source: string | null

  @column()
  declare creator: string | null

  @column()
  declare title: string | null

  @column()
  declare link: string | null

  @column()
  declare content: string | null

  @column()
  declare imageUrl: string | null

  @column({ serializeAs: null })
  declare response: JSON | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
