#!/usr/bin/env node
const ytdl = require('ytdl-core')
const FFmpeg = require('fluent-ffmpeg')
const { PassThrough } = require('stream')
const fs = require('fs')

if (!module.parent) {
  const youtubeUrl = process.argv.slice(2)[0]
  if (!youtubeUrl) throw new TypeError('youtube url not specified')
  streamify(youtubeUrl).pipe(process.stdout)
} else {
  module.exports = streamify
}

function streamify (uri, opt) {
  opt = {
    ...opt,
    videoFormat: 'mp4',
    quality: 'lowest',
    audioFormat: 'mp3',
    filter (format) {
      return format.container === opt.videoFormat && format.audioBitrate
    }
  }
  console.log(uri);
  const video = ytdl(uri, opt) //Download
  //const video = ytdl('https://soundcloud.com/feindrehstar/afrikatour_interview_mdr', opt)
  const { file, audioFormat } = opt
  // create stream in file
  const stream = file ? fs.createWriteStream(file) : new PassThrough()
  // at this point video is in still not in strean
  const ffmpeg = new FFmpeg(video)

  process.nextTick(() => {
    const output = ffmpeg.format(audioFormat).pipe(stream)

    ffmpeg.on('error_yts', error => stream.emit('error_yts_emit', error))
    output.on('error_yts', error => {
      video.end()
      stream.emit('error_yts', error)
    })
  })

  stream.video = video
  stream.ffmpeg = ffmpeg

  return stream
}
