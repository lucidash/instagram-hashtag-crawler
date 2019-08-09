let data = []
const fs = require('fs');

const randomstring = require("randomstring");

(async() => {
  const usernames = fs.readFileSync('targets.txt', 'utf8').split('\n')
  usernames.pop()

  const tag = randomstring.generate(4)

  for (let username of usernames) {
    const json = require("./hashtags/" + username + ".json")
    data.push(json)
  }

  let imageUrls = []
  for (let d of data) {
    for (let post of d) {
      if (post.carousel_media) {
        for (let image of post.carousel_media) {
          try {
            imageUrls.push(image.image_versions2.candidates[0].url)
          } catch(err){
            console.log(err)
          }
        }
      } else {
        if (post.image_versions2) {
          imageUrls.push(post.image_versions2.candidates[0].url)
        }
      }
    }
  }

  let imageUrlSet = new Set(imageUrls)


  console.log("imageUrls # = ", imageUrls.length)
  console.log("imageUrlSet # = ", imageUrlSet.size)
  if (true) {
    let cnt = 0
    for (const url of imageUrls) {
      cnt += 1
      const options = {
        url: url,
        dest: `./images/${tag}_${cnt}.jpg`
      }
      try {
        const download = require('image-downloader')
        const { filename, image } = await download.image(options)
      } catch(err) {
        console.log(err)
      }

      console.log(url)
      console.log(options)
    }
  }
})()
