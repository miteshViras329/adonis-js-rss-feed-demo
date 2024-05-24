import Feed from '#models/feed'
import RssFeed from '#models/rss_feed'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import RssParser from 'rss-parser'

export default class RssFeedsController {
  async index({ response }: HttpContext) {
    const feeds = await RssFeed.query().exec()

    return response.json({ feeds: feeds })
  }

  async show({ response, params }: HttpContext) {
    const feed = await RssFeed.query().where('id', params.id).first()
    if (!feed) {
      return response.unprocessableEntity({ error: 'Feed not found.' })
    }

    const parser = new RssParser()
    const result: any = await parser.parseURL(feed.sourceUrl)

    if (result.items.length > 0) {
      for (const aFeed of result.items) {
        const thisFeed: any = {
          creator: aFeed.creator,
          title: aFeed.title,
          link: aFeed.link,
          content: aFeed.content,
          published_at: aFeed.pubDate ? DateTime.fromRFC2822(aFeed.pubDate) : DateTime.now(),
          source: feed.sourceName,
          rss_feed_id: feed.id,
          response: JSON.stringify(aFeed),
          image_url: aFeed.enclosure ? aFeed.enclosure.url : '',
        }

        await Feed.updateOrCreate({ title: thisFeed.title }, thisFeed)
      }
      return response.json({
        feeds: await Feed.query().where('rss_feed_id', feed.id).orderBy('created_at'),
      })
    }

    return response.json({ feed: [] })
  }
}
