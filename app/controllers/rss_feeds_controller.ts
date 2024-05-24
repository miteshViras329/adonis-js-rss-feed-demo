import Feed from '#models/feed'
import RssFeed from '#models/rss_feed'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import RssParser from 'rss-parser'

export default class RssFeedsController {
  private cronCallType: any = { minutes: 5 }

  async index({ response }: HttpContext) {
    const feeds = await RssFeed.query().exec()

    return response.json({ feeds: feeds })
  }

  async show({ response, params }: HttpContext) {
    const feed = await RssFeed.query().where('id', params.id).first()
    if (!feed) {
      return response.unprocessableEntity({ error: 'Feed not found.' })
    }

    // sync single feed
    await this.singleSync(feed)

    return response.json({
      feeds: await Feed.query().where('rss_feed_id', feed.id).orderBy('created_at', 'desc'),
    })
  }

  private parseDateTime(datetime: any): DateTime {
    // Try parsing as ISO 8601
    let parsedDate = DateTime.fromISO(datetime)
    if (parsedDate.isValid) {
      return parsedDate
    }

    // Try parsing as RFC 2822
    parsedDate = DateTime.fromRFC2822(datetime)
    if (parsedDate.isValid) {
      return parsedDate
    }

    return DateTime.now()
  }

  async sync({ response }: HttpContext) {
    const startDateTime = DateTime.now().toLocal().toFormat('yyyy-MM-dd HH:mm:ss')
    const endDateTime = DateTime.now()
      .plus(this.cronCallType)
      .toLocal()
      .toFormat('yyyy-MM-dd HH:mm:ss')

    const rssFeeds = await RssFeed.query()
      .whereBetween('recall_at', [startDateTime, endDateTime])
      .exec()

    for (const rssFeed of rssFeeds) {
      await this.singleSync(rssFeed)
    }

    return response.json({ success: 'sync completed.' })
  }

  private async singleSync(feed: RssFeed) {
    // here we recall the feed. so updated the recall_at time.
    await feed.merge({ recallAt: DateTime.now().plus(this.cronCallType) }).save()

    const parser = new RssParser()
    const result: any = await parser.parseURL(feed.sourceUrl)

    if (result.items.length > 0) {
      for (const aFeed of result.items) {
        const thisFeed: any = {
          creator: aFeed.creator ?? null,
          title: aFeed.title ?? null,
          link: aFeed.link ?? null,
          content: aFeed.content ?? null,
          published_at: this.parseDateTime(aFeed.pubDate),
          source: feed.sourceName ?? null,
          rss_feed_id: feed.id ?? null,
          response: JSON.stringify(aFeed) ?? null,
          image_url: aFeed.enclosure ? aFeed.enclosure.url : null,
        }

        await Feed.updateOrCreate({ title: thisFeed.title }, thisFeed)
      }
    }
  }
}
