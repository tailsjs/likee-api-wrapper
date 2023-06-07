const fetch = require("node-fetch"),
    cheerio = require("cheerio"),
    md5 = require("md5")

async function getVideoInfoURL(uri){
    const body = (await (await fetch(uri)).text())

    const $ = cheerio.load(body)

    const cheerioParsed = $("head script")
    try{
        const json = JSON.parse(cheerioParsed[cheerioParsed.length - 1].children[0].data.slice(14, -1))

        return json
    }catch(e){
        throw new Error("Video was deleted.")
    }
}

async function download(uri){
    const mediaData = await getVideoInfoURL(uri)

    let resultObject = {}

    if(mediaData.video_url != ""){
        const videoData = await fetch(mediaData.video_url)

        resultObject = {
            type: "video",
            result: {
                url: mediaData.video_url,
                buffer: Buffer.from(await videoData.arrayBuffer())
            }
        }
    }else{
        const photos = JSON.parse(mediaData.all_image)
        let photosData = []
        for(let photo of photos){
            let photoData = await fetch(photo)

            photosData.push({
                url: photo,
                buffer: Buffer.from(await photoData.arrayBuffer())
            })
        }

        resultObject = {
            type: "photo",
            result: photosData
        }
    }

    return resultObject
}

async function getSquareVideos(params = { 
    language: "en", 
    country: "RU", 
    startNum: 200, 
    fetchNum: 10, 
    lastPostId: "", 
    uid: "1", 
    deviceId: "1", 
    scene: "WELOG_POPULAR" ,
    cookie: ""
}){
    let headers = {
        "Content-Type": "application/json"
    }

    if(params.cookie != "" && params.cookie != undefined){
        headers["X-Auth-Token"] = params.cookie
        headers["X-Channel"] = "normal"
        headers["X-Client-Deviceid"] = params.deviceId
        headers["X-Uid"] = params.uid
    }

    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/getSquareVideos", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ 
            language: params.language ? params.language : "en", 
            country: params.country ? params.country : "RU", 
            startNum:  params.startNum ? params.startNum : 200, 
            fetchNum: params.fetchNum ? params.fetchNum : 10, 
            lastPostId: params.lastPostId ? params.lastPostId : "", 
            uid: params.uid ? params.uid : "1", 
            deviceId: params.deviceId ? params.deviceId : "1", 
            scene: params.scene ? params.scene : "WELOG_POPULAR" 
        })
    })

    return await result.json()
}
/**
 * getVideoInfo
 * @param { Object } params Parameters
 * @param { String } params.postIds VideoIDs (You can insert them separated by commas)
 * @returns { Object } Response
 */
async function getVideoInfo(params = { postIds: "" }){
    if(!params.postIds)throw new Error("Param 'postIds' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/getVideoInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })

    return await result.json()
}

async function getCountry(){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-api/user/getCountry")

    return await result.json()
}

async function getProducerList(params = { type: 0, country: "RU" }){
    const result = await fetch(`https://api.like-video.com/likee-activity-flow-micro/RecommendApi/getProducerList?type=${params.type ? params.type : 0}&country=${params.country ? params.country : "RU"}`)

    return await result.json()
}

async function getRecommendHashtag(params = {
    language: "en",
    page: 1,
    pagesize: 10,
    country: "RU"
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/RecommendApi/getRecommendHashtag", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            language: params.language ? params.language : "en",
            page: params.page ? params.page : 1,
            pagesize: params.pagesize ? params.pagesize : 10,
            country: params.country ? params.country : "RU"
        })
    })

    return await result.json()
}

async function getProfileDetail(params = {
    likeeId: "Likee_Russia"
}){
    if(!params.likeeId)throw new Error("Param 'likeeId' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/official_website/WebView/getProfileDetail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })

    return await result.json()
}

async function getUserVideo(params = {
    uid: "30004", 
    count: 30, 
    lastPostId: "", 
    tabType: 0
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/getUserVideo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uid: params.uid ? params.uid : "30004", 
            count: params.count ? params.count : 30, 
            lastPostId: params.lastPostId ? params.lastPostId : "", 
            tabType: params.tabType ? params.tabType : 0
        })
    })

    return await result.json()
}

async function getVideoComment(params = {
    post_id: "", 
    page_size: 20, 
    last_comment_id: "0", 
    lang: "en"
}){
    if(!params.post_id)throw new Error("Param 'post_id' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/getVideoComment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            post_id: params.post_id, 
            page_size: params.page_size ? params.page_size : 20, 
            last_comment_id: params.last_comment_id ? params.last_comment_id : "0", 
            lang: params.lang ? params.lang : "en"
        })
    })

    return await result.json()
}

async function getTopicDetail(params = {
    hashtag: "",
    lang: "en"
}){
    if(!params.hashtag)throw new Error("Param 'hashtag' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/official_website/WebView/getTopicDetail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            hashtag: params.hashtag, 
            lang: params.lang ? params.lang : "en"
        })
    })

    return await result.json()
}

async function getEventVideo(params = {
    topicId: "", 
    page: 1, 
    pageSize: 30, 
    country: "RU"
}){
    if(!params.topicId)throw new Error("Param 'topicId' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/getEventVideo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topicId: params.topicId, 
            page: params.page ? params.page : 1, 
            pageSize: params.pageSize ? params.pageSize : 30, 
            country: params.country ? params.country : "RU"
        })
    })

    return await result.json()
}

async function searchUser(params = {
    keyword: "",
    start: 0,
    limit: 5,
    countryCode: "RU"
}){
    if(!params.keyword)throw new Error("Param 'keyword' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/searchApi/searchUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            keyword: params.keyword,
            start: params.start ? params.start : 0,
            limit: params.limit ? params.limit : 5,
            countryCode: params.countryCode ? params.countryCode : "RU"
        })
    })

    return await result.json()
}

async function searchTopic(params = {
    keyword: "",
    start: 0,
    limit: 5,
    countryCode: "RU"
}){
    if(!params.keyword)throw new Error("Param 'keyword' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/searchApi/searchTopic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            keyword: params.keyword,
            start: params.start ? params.start : 0,
            limit: params.limit ? params.limit : 5,
            countryCode: params.countryCode ? params.countryCode : "RU"
        })
    })

    return await result.json()
}

async function searchMusic(params = {
    query: "",
    from: 0,
    limit: 5
}){
    if(!params.query)throw new Error("Param 'query' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/searchApi/searchMusic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: params.query,
            from: params.from ? params.from : 0,
            limit: params.limit ? params.limit : 5
        })
    })

    return await result.json()
}

async function searchVideo(params = {
    keyword: "",
    start: 0,
    limit: 5,
    countryCode: "RU"
}){
    if(!params.keyword)throw new Error("Param 'keyword' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/searchApi/searchVideo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            keyword: params.keyword,
            start: params.start ? params.start : 0,
            limit: params.limit ? params.limit : 5,
            countryCode: params.countryCode ? params.countryCode : "RU"
        })
    })

    return await result.json()
}

async function quickSearch(params = {
    keyword: ""
}){
    if(!params.keyword)throw new Error("Param 'keyword' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/searchApi/quickSearch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })

    return await result.json()
}

async function getMusicDetail(params = {
    musicId: ""
}){
    if(!params.musicId)throw new Error("Param 'musicId' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/official_website/WebView/getMusicDetail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })

    return await result.json()
}

async function getMusicVideo(params = {
    musicId: "",
    page: 1, 
    pageSize: 30
}){
    if(!params.musicId)throw new Error("Param 'musicId' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/getMusicVideo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            musicId: params.musicId,
            page: params.page ? params.page : 1,
            pageSize: params.pageSize ? params.pageSize : 30
        })
    })

    return await result.json()
}

async function getCountryArticle(params = {
    country: "RU", 
    lastArticleId: 0, 
    fetchNum: 20, 
    fetchTop: 1
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-api/newsCenter/getCountryArticle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            country: params.country ? params.country : "RU",
            lastArticleId: params.lastArticleId ? params.lastArticleId : 0,
            fetchNum: params.fetchNum ? params.fetchNum : 20,
            fetchTop: params.fetchTop ? params.fetchTop : 1
        })
    })

    return await result.json()
}

async function getTagDetail(params = {
    tagName: "",
    country: "RU"
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-api/newsCenter/getTagDetail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tagName: params.tagName,
            country: params.country ? params.country : "RU",
        })
    })

    return await result.json()
}

async function getTagArticle(params = {
    country: "ru", 
    lastArticleId: 0, 
    tagId: 0,
    fetchNum: 20, 
    fetchTop: 1
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-api/newsCenter/getTagArticle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            country: params.country ? params.country : "ru",
            lastArticleId: params.lastArticleId ? params.lastArticleId : 0,
            tagId: params.tagId ? params.tagId : 0,
            fetchNum: params.fetchNum ? params.fetchNum : 20,
            fetchTop: params.fetchTop ? params.fetchTop : 1
        })
    })

    return await result.json()
}

async function getCountryTag(params = {
    country: "RU"
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-api/newsCenter/getCountryTag", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            country: params.country ? params.country : "RU"
        })
    })

    return await result.json()
}

async function getArticleDetail(params = {
    articleName: "",
    country: "ru"
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-api/newsCenter/getArticleDetail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            articleName: params.articleName,
            country: params.country ? params.country : "ru"
        })
    })

    return await result.json()
}

async function getLikeIdInfoH5(params = {
    likeid: ""
}){
    if(!params.likeid)throw new Error("Param 'likeid' is empty!")
    const result = await fetch("https://pay.like.video/live/pay/App_entrance/likeidInfoH5?likeid=" + params.likeid)

    return await result.json()
}

async function getIsCharged(params = {
    uid: 0
}){
    if(!params.uid || params.uid == 0)throw new Error("Param 'uid' is empty!")
    let formData = (require('form-data'))() 

    formData.append("uid", params.uid)

    const result = await fetch("https://pay.like.video/live/special/Paypal/isCharged", {
        method: "POST",
        body: formData
    })

    return await result.json()
}

async function getTreeH5(params = {
    uid: "",
    country: "RU"
}){
    const result = await fetch(`https://pay.like.video/live/pay/App_entrance/treeH5?uid=${params.uid}&country=${params.country ? params.country : "RU"}`)

    return await result.json()
}

async function getCountries(params = {
    uid: ""
}){
    const result = await fetch(`https://pay.like.video/live/pay/app_entrance/getCountry?uid=${params.uid}`)

    return await result.json()
}

async function getPayH5(params = {
    uid: 0,
    id: 0,
    product_id: 0,
    loc: ""
}){
    if(!params.uid || params.uid == 0)throw new Error("Param 'uid' is empty!") // 
    if(!params.id || params.id == 0)throw new Error("Param 'id' is empty!")
    if(!params.product_id || params.product_id == 0)throw new Error("Param 'product_id' is empty!")
    let formData = (require('form-data'))() 

    formData.append("uid", params.uid)
    formData.append("id", params.id)
    formData.append("product_id", params.product_id)
    formData.append("loc", params.loc ? params.loc : "")

    const result = await fetch("https://pay.like.video/live/pay/App_entrance/payH5", {
        method: "POST",
        body: formData
    })

    return await result.json()
}

async function loginByEmailAndPwd(params = {
    deviceId: "1",
    account: "",
    password: "",
    countryCode: "RU",
    lang: "en"
}){
    if(!params.account)throw new Error("Param 'account' is empty!")
    if(!params.password)throw new Error("Param 'password' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/accountApi/loginByEmailAndPwd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            deviceId: params.deviceId ? params.deviceId : "1",
            countryCode: params.countryCode ? params.countryCode : "RU",
            account: params.account,
            lang: params.lang ? params.lang : "en",
            password: md5(params.password)
        })
    })

    return await result.json()
}


async function loginByTelAndPwd(params = {
    deviceId: "1",
    account: "",
    password: "",
    countryCode: "RU",
    lang: "en"
}){
    if(!params.account)throw new Error("Param 'account' is empty!")
    if(!params.password)throw new Error("Param 'password' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/accountApi/loginByTelAndPwd", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            deviceId: params.deviceId ? params.deviceId : "1",
            countryCode: params.countryCode ? params.countryCode : "RU",
            account: params.account,
            lang: params.lang ? params.lang : "en",
            password: md5(params.password)
        })
    })

    return await result.json()
}

async function getUserInfo(params = {
    uid: "1"
}){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/userApi/getUserInfo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uid: params.uid ? params.uid : "30004"
        })
    })

    return await result.json()
}

async function getLikePost(params = {
    cookie: "",
    deviceId: "1",
    uid: "",
    postIds: []
}){
    if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
    if(!params.uid)throw new Error("This method requires 'uid'!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/getLikePost", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": params.cookie,
            "X-Channel": "normal",
            "X-Client-Deviceid": params.deviceId ? params.deviceId : "1",
            "X-Uid": params.uid
        },
        body: JSON.stringify({
            postIds: params.postIds
        })
    })

    return await result.json()
}

async function getFollowStatus(params = {
    uidList: [],
    cookie: "",
    deviceId: "1",
    uid: ""
}){
    if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
    if(!params.uid)throw new Error("This method requires 'uid'!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/userApi/getFollowStatus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": params.cookie,
            "X-Channel": "normal",
            "X-Client-Deviceid": params.deviceId ? params.deviceId : "1",
            "X-Uid": params.uid
        },
        body: JSON.stringify({
            uidList: params.uidList ? params.uidList : []
        })
    })

    return await result.json()
}

async function getEventFollowStatus(params = {
    eventIdList: [],
    cookie: "",
    deviceId: "1",
    uid: ""
}){
    if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
    if(!params.uid)throw new Error("This method requires 'uid'!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/eventApi/getEventFollowStatus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": params.cookie,
            "X-Channel": "normal",
            "X-Client-Deviceid": params.deviceId ? params.deviceId : "1",
            "X-Uid": params.uid
        },
        body: JSON.stringify({
            eventIdList: params.eventIdList ? params.eventIdList : []
        })
    })

    return await result.json()
}

async function checkCookie(params = {
    cookie: "",
    deviceId: "1",
    uid: ""
}){
    if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
    if(!params.uid)throw new Error("This method requires 'uid'!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/accountApi/checkCookie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": params.cookie,
            "X-Channel": "normal",
            "X-Client-Deviceid": params.deviceId ? params.deviceId : "1",
            "X-Uid": params.uid
        },
        body: JSON.stringify({
            uid: params.uid
        })
    })

    return await result.json()
}

async function followUser(params = {
    cookie: "",
    deviceId: "1",
    uid: "",
    followUid: "",
    type: 1
}){
    if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
    if(!params.uid)throw new Error("This method requires 'uid'!")
    if(!params.followUid)throw new Error("Param 'followUid' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/userApi/followUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": params.cookie,
            "X-Channel": "normal",
            "X-Client-Deviceid": params.deviceId ? params.deviceId : "1",
            "X-Uid": params.uid
        },
        body: JSON.stringify({
            followUid: params.followUid,
            type: params.type ? params.type : 1
        })
    })

    return await result.json()
}

async function getUploadVideoToken(){
    const result = await fetch("https://api.like-video.com/likee-activity-flow-api/token/getUploadVideoToken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })

    return await result.json()
}

async function bigoNew(params = {
    file: require("fs").ReadStream,
    filename: "",
    Authorization: ""
}){
    if(!params.file || typeof params.file != "object")throw new Error("Param 'file' is empty!")
    if(!params.filename)throw new Error("Param 'filename' is empty!")
    if(!params.Authorization)throw new Error("Param 'Authorization' is empty!")
    let formData = (require('form-data'))() 

    formData.append("file", params.file)
    formData.append("filename", params.filename)
    formData.append("Authorization", params.Authorization)

    const result = await fetch("https://bfs.bigo.sg/file/new?bucket=likee", {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data" + `; boundary=` + formData._boundary
        },
        body: formData
    })
    try{
        return await result.json()
    }catch(e){
        return await result.text()
    }
}

async function saveVideo(params = {
    cookie: "",
    uid: "",
    device_id: "1",
    urls: "",
    descriptions: ""
}){
    if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
    if(!params.uid)throw new Error("This method requires 'uid'!")
    if(!params.urls)throw new Error("Param 'urls' is empty!")
    const tempParams = {
        token: params.cookie,
        uid: params.uid,
        device_id: params.device_id ? params.device_id : "1",
        urls: params.urls,
        descriptions: params.descriptions ? params.descriptions : ""
    }
    let formBody = []
    for(let property in tempParams){
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(tempParams[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    const result = await fetch("https://api.like-video.com/likee-bs-flow-client/producer/video/saveVideo", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody
    })

    return await result.json()
}

async function followEvent(params = {
        cookie: "",
        deviceId: "1",
        uid: "",
        eventId: "",
        followType: 1
    }){
        if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
        if(!params.uid)throw new Error("This method requires 'uid'!")
        if(!params.eventId)throw new Error("Param 'eventId' is empty!")
        const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/eventApi/followEvent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Token": params.cookie,
                "X-Channel": "normal",
                "X-Client-Deviceid": params.deviceId ? params.deviceId : "1",
                "X-Uid": params.uid
            },
            body: JSON.stringify({
                followUid: params.eventId,
                type: params.followType ? params.followType : 1
            })
        })
    
        return await result.json()
}

async function likeVideo(params = {
    cookie: "",
    deviceId: "1",
    uid: "",
    postId: "",
    type: 1
}){
    if(!params.cookie)throw new Error("This method requires 'cookie'! Get one in loginByEmailAndPwd or loginByTelAndPwd method.")
    if(!params.uid)throw new Error("This method requires 'uid'!")
    if(!params.postId)throw new Error("Param 'postId' is empty!")
    const result = await fetch("https://api.like-video.com/likee-activity-flow-micro/videoApi/likeVideo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": params.cookie,
            "X-Channel": "normal",
            "X-Client-Deviceid": params.deviceId ? params.deviceId : "1",
            "X-Uid": params.uid
        },
        body: JSON.stringify({
            postId: params.postId,
            type: params.type ? params.type : 1
        })
    })

    return await result.json()
    // https://api.like-video.com/likee-activity-flow-micro/videoApi/likeVideo
    // {postId: "7241250162078046516", type: 1}
}

module.exports = {
    getVideoInfoURL,
    download,
    getSquareVideos,
    getVideoInfo,
    getCountry,
    getProducerList,
    getRecommendHashtag,
    getProfileDetail,
    getUserVideo,
    getVideoComment,
    getTopicDetail,
    getEventVideo,
    searchUser,
    searchTopic,
    searchMusic,
    searchVideo,
    quickSearch,
    getMusicDetail,
    getMusicVideo,
    getCountryArticle,
    getTagDetail,
    getTagArticle,
    getCountryTag,
    getArticleDetail,
    getLikeIdInfoH5,
    getIsCharged,
    getTreeH5,
    getCountries,
    getPayH5,
    loginByEmailAndPwd,
    loginByTelAndPwd,
    getUserInfo,
    getLikePost,
    getFollowStatus,
    getEventFollowStatus,
    checkCookie,
    followUser,
    followEvent,
    likeVideo,
    getUploadVideoToken,
    bigoNew,
    saveVideo
}