const router = require("express").Router()
const route = router
const services = require("../helper/sevice")
const cheerio = require("cheerio")
const baseUrl = require("../constant/url")

route.get("/", (req, res) => {
    res.send({
        endpoint: {
            getOngoingAnime: "/api/v1/ongoing/:page",
            getCompletedAnime: "/api/v1/completed/:page",
            getAnimeSearch: "/api/v1/search/:q",
            getAnimeList: "/api/v1/anime-list",
            getAnimeDetail: "/api/v1/detail/:endpoint"
        }
    })
})

// Get Ongoing Anime -Done-
router.get("/api/v1/ongoing/:page", async (req, res) => {
    const page = req.params.page
    let url = page === 1 ? "https://otakudesu.bid/ongoing-anime/" : `https://otakudesu.bid/ongoing-anime/page/${page}/`
    try {
        const response = await services.fetchService(url, res)
        if (response.status === 200) {
            const $ = cheerio.load(response.data)
            const element = $(".rapi")
            let ongoing = []
            let title, thumb, total_episode, updated_on, updated_day, endpoint

            element.find("ul > li").each((index, el) => {
                title = $(el).find("h2").text().trim()
                thumb = $(el).find("img").attr("src")
                total_episode = $(el).find(".epz").text()
                updated_on = $(el).find(".newnime").text()
                updated_day = $(el).find(".epztipe").text()
                endpoint = $(el).find(".thumb > a").attr("href").replace(`${baseUrl}/anime/`, "")

                ongoing.push({
                    title,
                    thumb,
                    total_episode,
                    updated_on,
                    updated_day,
                    endpoint
                })
            })
            return res.status(200).json({
                status: true,
                message: "success",
                ongoing
            })
        }
        return res.send({
            message: response.status,
            ongoing: [],
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            message: error,
            ongoing: [],
        });
    }
})
// Get Completed Anime -Done-
router.get("/api/v1/completed/:page", async (req, res) => {
    const page = req.params.page
    let url = page === 1 ? "https://otakudesu.bid/complete-anime/" : `https://otakudesu.bid/complete-anime/page/${page}/`

    try {
        const response = await services.fetchService(url, res)
        if (response.status === 200) {
            const $ = cheerio.load(response.data)
            const element = $(".rapi")
            let completed = []
            let title, thumb, total_episode, updated_on, score, endpoint

            element.find("ul > li").each((index, el) => {
                title = $(el).find("h2").text().trim()
                thumb = $(el).find("img").attr("src")
                total_episode = $(el).find(".epz").text()
                updated_on = $(el).find(".newnime").text()
                score = $(el).find(".epztipe").text().trim()
                endpoint = $(el).find(".thumb > a").attr("href").replace(`${baseUrl}/anime/`, "")

                completed.push({
                    title,
                    thumb,
                    total_episode,
                    updated_on,
                    score,
                    endpoint
                })
            })

            return res.status(200).json({
                status: true,
                message: "success",
                completed
            })
        }
        return res.send({
            status: response.status,
            completed: []
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: false,
            message: error,
            completed: [],
        });
    }
})
// Get Search Anime -Done-
router.get("/api/v1/search/:q", async (req, res) => {
    const query = req.params.q
    let url = `https://otakudesu.bid/?s=${query}&post_type=anime`
    try {
        const response = await services.fetchService(url, res)
        if (response.status === 200) {
            const $ = cheerio.load(response.data)
            const element = $(".page")
            let search = []
            let title, thumb, genres, status, rating, endpoint

            element.find("li").each((index, el) => {
                title = $(el).find("h2 > a").text()
                thumb = $(el).find("img").attr("src")
                genres = $(el).find(".set > a").text().match(/[A-Z][a-z]+/g)
                status = $(el).find(".set").text().match("Ongoing") || $(el).find(".set").text().match("Completed")
                rating = $(el).find(".set").text().replace(/^\D+/g, '') || null
                endpoint = $(el).find("h2 > a").attr("href").replace(`${baseUrl}/anime/`, "")

                search.push({
                    title,
                    thumb,
                    genres,
                    status,
                    rating,
                    endpoint
                })
            })
            return res.status(200).json({
                status: true,
                message: "success",
                search
            })
        }
        return res.send({
            message: response.status,
            search: [],
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            message: error,
            search: [],
        });
    }
})
// Get Anime List -Done-
router.get("/api/v1/anime-list", async (req, res) => {
    let url = "https://otakudesu.bid/anime-list-2/"
    try {
        const response = await services.fetchService(url, res)
        if (response.status === 200) {
            const $ = cheerio.load(response.data)
            const element = $("#abtext")
            let anime_list = []
            let title, endpoint

            element.find(".penzbar").each((index, el) => {
                title = $(el).find("a").text() || null
                endpoint = $(el).find("a").attr("href")

                anime_list.push({
                    title,
                    endpoint
                })
            })

            // filter null title
            const datas = anime_list.filter((value) => value.title !== null)

            return res.status(200).json({
                status: true,
                message: "success",
                manga_list: datas
            })
        }
        return res.send({
            message: response.status,
            manga_list: [],
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            message: error,
            manga_list: [],
        });
    }
})
// Get Anime Detail -Done-  
route.get("/api/v1/detail/:endpoint", async (req, res) => {
    const endpoint = req.params.endpoint
    let url = `https://otakudesu.bid/anime/${endpoint}/`

    try {
        const response = await services.fetchService(url, res)
        if (response.status === 200) {
            const $ = cheerio.load(response.data)
            const infoElement = $(".fotoanime")
            const episodeElement = $(".episodelist")
            let anime_detail = []
            let episode_list = []
            let thumb, sinopsis = [], detail = [], episode_title, episode_endpoint, episode_date

            infoElement.each((index, el) => {
                thumb = $(el).find("img").attr("src")
                $(el).find(".sinopc > p").each((index, el) => {
                    sinopsis.push($(el).text())
                })
                $(el).find(".infozingle >  p").each((index, el) => {
                    detail.push($(el).text())
                })

                anime_detail.push({
                    thumb,
                    sinopsis,
                    detail
                })
            })

            episodeElement.find("li").each((index, el) => {
                episode_title = $(el).find("span > a").text()
                episode_endpoint = $(el).find("span > a").attr("href").replace(`${baseUrl}/episode/`, "").replace(`${baseUrl}/`, "")
                episode_date = $(el).find(".zeebr").text()


                episode_list.push({
                    episode_title,
                    episode_endpoint,
                    episode_date
                })
            })

            return res.status(200).json({
                status: true,
                message: "success",
                anime_detail,
                episode_list
            })
        }
        res.send({
            message: response.status,
            anime_detail: [],
            episode_list: []
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: false,
            message: error,
            anime_detail: [],
            episode_list: []
        });
    }
})

module.exports = route