# likee-api-wrapper
Враппер Likee API

## Установка
* npm - `npm install likee-api-wrapper`
* yarn - `yarn add likee-api-wrapper`

## Пример использования
```js
const likee = require("likee-api-wrapper")

let trendingVideos = await likee.getSquareVideos({
    language: "ru",
    country: "RU"
})

console.log(trendingVideos.data.videoList) // [ {...}, {...}, {...} ]
```

## Методы
### Likee.getVideoInfoURL(url)
* Получение информации о видео через URL.
```js
const url = "https://l.likee.video/v/IvliLU"
await likee.getVideoInfoURL(url) // { post_id: "7241964767279301831", ... }
```
### Likee.download(url)
* Скачать видео через URL.
```js
const url = "https://l.likee.video/v/IvliLU"
await likee.download(url) // { type: "video" || "photo", result: { url: "...", buffer: Buffer } }
```
> В случае, если видео состоит из картинок, в result возвращается массив с картинками.
### Likee.getSquareVideos(params?)
Получить рекомендованные видео.
```js
const params = { 
    language: "en", 
    country: "US", 
    startNum: 200, 
    fetchNum: 10, 
    lastPostId: "", 
    uid: "1", 
    deviceId: "1", 
    scene: "WELOG_POPULAR",
    cookie: ""
}

await likee.getSquareVideos(params) // { code: 0, data: { videoList: [ {...}, {...}, {...} ], dispatchId: null, userInfo: { uid: "...", deviceId: "...", cookie: "..." }, login: true | false }, message: "ok" }
```
> Можно передать cookie.
### Likee.getVideoInfo(params)
Получить информацию о видеороликах через их ID.
```js
const params = {
    postIds: "7241964767279301831" // Можно указывать несколько ID через запятую.
}

await likee.getVideoInfo(params) // { code: 0, data: { videoList: [ [ {...} ] ] }, message: "ok" }
```
### Likee.getCountry()
Получить страну.
```js
await likee.getCountry() // { code: 0, data: { country: "..." }, message: "ok" }
```
### Likee.getProducerList(params?)
Получить список популярных продюсеров в какой-либо стране.
```js
const params = {
    type: 0,
    country: "US"
}

await likee.getProducerList(params) // { code: 0, data: { country: "US", items: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.getRecommendHashtag(params?)
Получить список популярных хэштегов.
```js
const params = {
    language: "en",
    page: 1,
    pagesize: 10,
    country: "US"
}

await likee.getRecommendHashtag(params) // { code: 0, data: { eventList: [ {...}, {...}, {...} ], lastPostId: "..." }, message: "ok" }
```
### Likee.getProfileDetail(params)
Получить информацию о профиле.
```js
const params = {
    likeeId: "Likee_Russia"
}

await likee.getProfileDetail(params) // { code: 0, data: {...}, message: "ok" }
```
### Likee.getUserVideo(params?)
Получить список видеороликов пользователя.
```js
const params = {
    uid: "30004", 
    count: 30, 
    lastPostId: "", 
    tabType: 0
}

await likee.getUserVideo(params) // { code: 0, data: { otherValue: {...}, videoList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.getVideoComment(params)
Получить комментарии под видеороликом.
```js
const params = {
    post_id: "7241964767279301831", 
    page_size: 20, 
    last_comment_id: "0", 
    lang: "en"
}

await likee.getVideoComment(params) // { code: 0, data: [ {...}, {...}, {...} ], message: "ok" }
```
### Likee.getTopicDetail(params)
Получить информацию о хэштеге.
```js
const params = {
    hashtag: "Learn",
    lang: "en"
}

await likee.getTopicDetail(params) // { code: 0, data: {...}, message: "ok" }
```
### Likee.getEventVideo(params)
Получить видео из хэштега.
```js
const params = {
    topicId: "6455572190651759415", 
    page: 1, 
    pageSize: 30, 
    country: "US"
}

await likee.getEventVideo(params) // { code: 0, data: { videoList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.searchUser(params)
Поиск пользователей по запросу.
```js
const params = {
    keyword: "Likee",
    start: 0,
    limit: 5,
    countryCode: "US"
}

await likee.searchUser(params) // { code: 0, data: { userList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.searchTopic(params)
Поиск хэштегов по запросу.
```js
const params = {
    keyword: "Likee",
    start: 0,
    limit: 5,
    countryCode: "US"
}

await likee.searchTopic(params) // { code: 0, data: { hashtagList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.searchMusic(params)
Поиск музыки по запросу.
```js
const params = {
    query: "Likee",
    from: 0,
    limit: 5
}

await likee.searchMusic(params) // { code: 0, data: { musics: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.searchVideo(params)
Поиск видео по запросу.
```js
const params = {
    keyword: "Likee",
    start: 0,
    limit: 5,
    countryCode: "US"
}

await likee.searchVideo(params) // { code: 0, data: { videoList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.quickSearch(params)
Быстрый поиск по запросу.
```js
const params = {
    keyword: "Likee"
}

await likee.quickSearch(params) // { code: 0, data: { hashtagList: [ {...}, {...}, {...} ], userList: [ {...}, {...}, {...} ], musicList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.getMusicDetail(params)
Получить информацию о музыке.
```js
const params = {
    musicId: ""
}

await likee.getMusicDetail(params) // { code: 0, data: {...}, message: "ok" }
```
### Likee.getMusicVideo(params)
Получить видео с указанной музыкой.
```js
const params = {
    musicId: "",
    page: 1, 
    pageSize: 30
}

await likee.getMusicVideo(params) // { code: 0, data: { videoList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.getCountryArticle(params?)
Получить статьи из блога.
```js
const params = {
    country: "RU", 
    lastArticleId: 0, 
    fetchNum: 20, 
    fetchTop: 1
}

await likee.getCountryArticle(params) // { code: 0, data: { topArticleList: [ {...}, {...}, {...} ], articleList: [ {...}, {...}, {...}  ] }, message: "ok" }
```
### Likee.getTagDetail(params?)
Получить информацию о тэге из блога.
```js
const params = {
    tagName: "Продукт",
    country: "RU"
}

await likee.getTagDetail(params) // { code: 0, data: { tagInfo: { ... } }, message: "ok" }
```
### Likee.getTagArticle(params?)
Получить статьи из тэга из блога.
```js
const params = {
    country: "RU", 
    lastArticleId: 0, 
    tagId: 8,
    fetchNum: 20, 
    fetchTop: 1
}

await likee.getTagArticle(params) // { code: 0, data: { topArticleList: [ {...}, {...}, {...} ], articleList: [ {...}, {...}, {...}  ] }, message: "ok" }
```
### Likee.getCountryTag(params?)
Получить список тэгов из блога определённой страны.
```js
const params = {
    country: "RU"
}

await likee.getCountryTag(params) // { code: 0, data: { tagList: [ {...}, {...}, {...} ] }, message: "ok" }
```
### Likee.getArticleDetail(params?)
Получить описание какой-либо статьи из блога.
```js
const params = {
    articleName: "Обновление-Как-создать-слайдшоу-в-Likee",
    country: "ru"
}

await likee.getArticleDetail(params) // { code: 0, data: { articleInfo: {...} }, message: "ok" }
```
### Likee.getLikeIdInfoH5(params)
Получить немного информации о пользователе.
```js
const params = {
    likeid: "Likee_Russia",
}

await likee.getLikeIdInfoH5(params) // { result: 0, userinfo: {...} }
```
### Likee.getIsCharged(params)
Получить непонятную статистику.
```js
const params = {
    uid: 30004
}

await likee.getIsCharged(params) // { result: 0, isCharged: 0 }
```
### Likee.getTreeH5(params)
Получить список платёжных средств.
```js
const params = {
    uid: 30004,
    country: "RU"
}

await likee.getTreeH5(params) // { result: 0, errorMsg: "success", data: [ {...}, {...}, {...} ], t: 0.2 }
```
### Likee.getCountries(params)
Получить список доступных стран.
```js
const params = {
    uid: 30004
}

await likee.getCountries(params) // { result: 0, data: [ {...}, {...}, {...} ], msg: "ok" }
```
### Likee.getPayH5(params)
Получить ссылку на оплату товара.
```js
const params = {
    uid: 30004,
    id: 778,
    product_id: 4450009,
    loc: ""
}

await likee.getPayH5(params) // { result: 0, errorMsg: "success", pay_url: "..." }
```
### Likee.loginByEmailAndPwd(params)
Авторизироваться через email.
```js
const params = {
    deviceId: "Example",
    account: "example@example.com",
    password: "133337",
    countryCode: "RU",
    lang: "en"
}

await likee.loginByEmailAndPwd(params) // { code: 0, data: { uid: "...", cookie: "...", deviceId: "...", newUser: true | false }, message: "ok" }
```
> Отсюда вам необходимо брать cookie для некоторых методов. Или из loginByTelAndPwd.
### Likee.loginByTelAndPwd(params)
Авторизироваться через номер телефона.
```js
const params = {
    deviceId: "Example",
    account: "+79630940599",
    password: "133337",
    countryCode: "RU",
    lang: "en"
}

await likee.loginByTelAndPwd(params) // { code: 0, data: { uid: "...", cookie: "...", deviceId: "...", newUser: true | false }, message: "ok" }
```
> Отсюда вам необходимо брать cookie для некоторых методов. Или из loginByEmailAndPwd.
### Likee.getUserInfo(params)
Получить информацию о пользователе.
```js
const params = {
    uid: "30004"
}

await likee.getUserInfo(params) // { code: 0, data: {...}, message: "ok" }
```
### Likee.getLikePost(params)
Фильтрует список, который вы передаёте так, что в нём остаются только видео, которые вы лайкнули.
```js
const params = {
    postIds: [30004, 228, 666],
    cookie: "...",
    deviceId: "...",
    uid: "..."
}

await likee.getLikePost(params) // {code: 0, data: { followUidList: [ {...}, {...}, {...} ] }, message: "ok"}
```
> Данный метод требует cookie!
### Likee.getFollowStatus(params)
Фильтрует список, который вы передаёте так, что в нём остаются только те, на кого вы подписаны.
```js
const params = {
    uidList: [30004, 228, 666],
    cookie: "...",
    deviceId: "...",
    uid: "..."
}

await likee.getFollowStatus(params) // {code: 0, data: { followUidList: [ {...}, {...}, {...} ] }, message: "ok"}
```
> Данный метод требует cookie!
### Likee.getEventFollowStatus(params)
Фильтрует список, который вы передаёте так, что в нём остаются только те, на какие хэштэги вы подписаны.
```js
const params = {
    eventIdList: [30004, 228, 666],
    cookie: "...",
    deviceId: "...",
    uid: "..."
}

await likee.getEventFollowStatus(params) // {code: 0, data: { followEventIdList: [ {...}, {...}, {...} ] }, message: "ok"}
```
> Данный метод требует cookie!
### Likee.checkCookie(params)
Проверка ваших cookie.
```js
const params = {
    cookie: "...",
    deviceId: "...",
    uid: "..."
}

await likee.checkCookie(params) // {code: 0, data: null, message: null}
```
> Данный метод требует cookie!
### Likee.followUser(params)
Подписаться на чей-то аккаунт.
```js
const params = {
    cookie: "...",
    deviceId: "...",
    uid: "...",
    followUid: "30004",
    type: 1 // 1 - подписаться, 0 - отписаться
}

await likee.followUser(params) // {code: 0, data: null, message: null}
```
> Данный метод требует cookie!
### Likee.followEvent(params)
Подписаться на хэштег.
```js
const params = {
    cookie: "...",
    deviceId: "...",
    uid: "...",
    eventId: "30004",
    followType: 1 // 1 - подписаться, 0 - отписаться
}

await likee.followUser(params) // {code: 0, data: null, message: null}
```
> Данный метод требует cookie!
### Likee.likeVideo(params)
Поставить лайк на видео.
```js
const params = {
    cookie: "...",
    deviceId: "...",
    uid: "...",
    postId: "30004",
    type: 1 // 1 - подписаться, 0 - отписаться
}

await likee.likeVideo(params) // {code: 0, data: null, message: null}
```
> Данный метод требует cookie!
### Likee.getUploadVideoToken()
Получение BIGO-токена для опубликовки видео.
```js
await likee.getUploadVideoToken() // {code: 0, data: { token: "BIGO ..." }, message: "ok"}
```
> Отсюда потребуется токен для Likee.bigoNew()
### Likee.bigoNew(params)
Опубликовать видео на сервера Bigo.
```js
const params = {
    file: ReadStream,
    filename: "example.mp4",
    Authorization: "BIGO ..."
}

await likee.bigoNew(params) // { md5: "...", mime: "...", size: "...", ts: "...", url: "https://gdl.like.video/..." }
```
> Отсюда потребуется url для Likee.saveVideo().
### Likee.saveVideo(params)
Сохранить загруженное видео в профиль.
```js
const params = {
    cookie: "...",
    uid: "...",
    urls: "https://gdl.like.video/...",
    descriptions: "Test!"
}

await likee.saveVideo(params) // { code: 0, data: null, message: null }
```
> Данный метод требует cookie!

## Полезные ссылки
* [Примеры](https://github.com/tailsjs/likee-api-wrapper/)
* [Likee](https://likee.video/)
* [Блог автора](https://t.me/tjsblog/)

## Идеи
* Сохранение cookie в памяти (до входа)
* Написать примеры

## Интересные факты
* Данный враппер изначально подразумевался как модуль по скачке видео с Likee.
* Автор этого модуля немного перепил и помимо базы вставил ещё роуты платёжки и блога.