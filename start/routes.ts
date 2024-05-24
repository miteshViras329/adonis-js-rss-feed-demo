const RssFeedsController = () => import('#controllers/rss_feeds_controller')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return 'api is working.'
})

router.get('/rss-feed', [RssFeedsController, 'index'])
