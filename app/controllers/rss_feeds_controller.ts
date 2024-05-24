import RssFeed from '#models/rss_feed'
import type { HttpContext } from '@adonisjs/core/http'

export default class RssFeedsController {
  async index({ response }: HttpContext) {
    const feeds = await RssFeed.query().exec()

    return response.json({ feeds: feeds })
  }
}
