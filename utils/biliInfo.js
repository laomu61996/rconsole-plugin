import fetch from "node-fetch";
import axios from "axios";

async function getVideoInfo(url) {
    const baseVideoInfo = "http://api.bilibili.com/x/web-interface/view";
    const videoId = /video\/[^\?\/ ]+/.exec(url)[0].split("/")[1];
    // 获取视频信息，然后发送
    return fetch(`${baseVideoInfo}?bvid=${videoId}`)
        .then(async resp => {
            const respJson = await resp.json();
            const respData = respJson.data;
            return {
                title: respData.title,
                desc: respData.desc,
                duration: respData.duration,
                dynamic: respJson.data.dynamic,
                stat: respData.stat,
                aid: respData.aid,
                cid: respData.pages?.[0].cid,
                bvid: videoId,
        };
    });
}

async function getDynamic(dynamicId) {
    const dynamicApi = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${dynamicId}`
    return axios.get(dynamicApi, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
            'referer': 'https://www.bilibili.com',
        }
    }).then(resp => {
        const dynamicData = resp.data.data.card
        const card = JSON.parse(dynamicData.card)
        const dynamicOrigin = card.item
        const dynamicDesc = dynamicOrigin.description

        const pictures = dynamicOrigin.pictures
        let dynamicSrc = []
        for (let pic of pictures) {
            const img_src = pic.img_src
            dynamicSrc.push(img_src)
        }
        // console.log(dynamic_src)
        return {
            dynamicSrc,
            dynamicDesc
        }
    })
}

export { getVideoInfo, getDynamic };
