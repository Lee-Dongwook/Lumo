const IS_PROD = process.env.GCLOUD_PROJECT === '' // todo temporarily we use janubit-4c20e to dev mode;

const SERVER_URL = IS_PROD ? '' : ''

export { IS_PROD, SERVER_URL }
// http://127.0.0.1:5001/janubit-prod/asia-northeast3/startServer
//https://startserver-6nlgphfoja-du.a.run.app
