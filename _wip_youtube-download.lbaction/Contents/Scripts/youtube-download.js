// LaunchBar Action Script

function runWithString(string) {
	var result = LaunchBar.execute('/usr/local/bin/youtube-dl', '-F', string)
	LaunchBar.log(result)
// 	[youtube] xTlNMmZKwpA: Downloading webpage
// [youtube] xTlNMmZKwpA: Downloading video info webpage
// [info] Available formats for xTlNMmZKwpA:
// format code  extension  resolution note
// 249          webm       audio only DASH audio   60k , opus @ 50k, 1.64MiB
// 250          webm       audio only DASH audio   78k , opus @ 70k, 2.14MiB
// 140          m4a        audio only DASH audio  128k , m4a_dash container, mp4a.40.2@128k, 3.89MiB
// 171          webm       audio only DASH audio  131k , vorbis@128k, 3.76MiB
// 251          webm       audio only DASH audio  151k , opus @160k, 4.15MiB
// 394          mp4        256x144    144p   95k , av01.0.05M.08, 24fps, video only, 2.68MiB
// 278          webm       256x144    144p   95k , webm container, vp9, 24fps, video only, 2.85MiB
// 160          mp4        256x144    144p  110k , avc1.4d400c, 24fps, video only, 3.12MiB
// 395          mp4        426x240    240p  223k , av01.0.05M.08, 24fps, video only, 6.31MiB
// 242          webm       426x240    240p  226k , vp9, 24fps, video only, 5.87MiB
// 133          mp4        426x240    240p  344k , avc1.4d4015, 24fps, video only, 8.05MiB
// 396          mp4        640x360    360p  406k , av01.0.05M.08, 24fps, video only, 11.35MiB
// 243          webm       640x360    360p  413k , vp9, 24fps, video only, 11.01MiB
// 397          mp4        854x480    480p  733k , av01.0.05M.08, 24fps, video only, 20.01MiB
// 134          mp4        640x360    360p  734k , avc1.4d401e, 24fps, video only, 17.31MiB
// 244          webm       854x480    480p  776k , vp9, 24fps, video only, 20.50MiB
// 135          mp4        854x480    480p 1208k , avc1.4d401e, 24fps, video only, 28.18MiB
// 398          mp4        1280x720   720p 1448k , av01.0.05M.08, 24fps, video only, 38.13MiB
// 247          webm       1280x720   720p 1510k , vp9, 24fps, video only, 39.93MiB
// 136          mp4        1280x720   720p 1875k , avc1.4d401f, 24fps, video only, 42.47MiB
// 137          mp4        1920x1080  1080p 2324k , avc1.640028, 24fps, video only, 56.84MiB
// 248          webm       1920x1080  1080p 2640k , vp9, 24fps, video only, 62.86MiB
// 17           3gp        176x144    small   77k , mp4v.20.3, mp4a.40.2@ 24k (22050Hz), 2.39MiB
// 36           3gp        320x180    small  219k , mp4v.20.3, mp4a.40.2 (22050Hz), 6.73MiB
// 18           mp4        640x360    medium  691k , avc1.42001E, mp4a.40.2@ 96k (44100Hz), 21.16MiB (best)
var foo = `[youtube] xTlNMmZKwpA: Downloading webpage
[youtube] xTlNMmZKwpA: Downloading video info webpage
[info] Available formats for xTlNMmZKwpA:
format code  extension  resolution note
249          webm       audio only DASH audio   60k , opus @ 50k, 1.64MiB
250          webm       audio only DASH audio   78k , opus @ 70k, 2.14MiB
140          m4a        audio only DASH audio  128k , m4a_dash container, mp4a.40.2@128k, 3.89MiB
171          webm       audio only DASH audio  131k , vorbis@128k, 3.76MiB
251          webm       audio only DASH audio  151k , opus @160k, 4.15MiB
394          mp4        256x144    144p   95k , av01.0.05M.08, 24fps, video only, 2.68MiB
278          webm       256x144    144p   95k , webm container, vp9, 24fps, video only, 2.85MiB
160          mp4        256x144    144p  110k , avc1.4d400c, 24fps, video only, 3.12MiB
395          mp4        426x240    240p  223k , av01.0.05M.08, 24fps, video only, 6.31MiB
242          webm       426x240    240p  226k , vp9, 24fps, video only, 5.87MiB
133          mp4        426x240    240p  344k , avc1.4d4015, 24fps, video only, 8.05MiB
396          mp4        640x360    360p  406k , av01.0.05M.08, 24fps, video only, 11.35MiB
243          webm       640x360    360p  413k , vp9, 24fps, video only, 11.01MiB
397          mp4        854x480    480p  733k , av01.0.05M.08, 24fps, video only, 20.01MiB
134          mp4        640x360    360p  734k , avc1.4d401e, 24fps, video only, 17.31MiB
244          webm       854x480    480p  776k , vp9, 24fps, video only, 20.50MiB
135          mp4        854x480    480p 1208k , avc1.4d401e, 24fps, video only, 28.18MiB
398          mp4        1280x720   720p 1448k , av01.0.05M.08, 24fps, video only, 38.13MiB
247          webm       1280x720   720p 1510k , vp9, 24fps, video only, 39.93MiB
136          mp4        1280x720   720p 1875k , avc1.4d401f, 24fps, video only, 42.47MiB
137          mp4        1920x1080  1080p 2324k , avc1.640028, 24fps, video only, 56.84MiB
248          webm       1920x1080  1080p 2640k , vp9, 24fps, video only, 62.86MiB
17           3gp        176x144    small   77k , mp4v.20.3, mp4a.40.2@ 24k (22050Hz), 2.39MiB
36           3gp        320x180    small  219k , mp4v.20.3, mp4a.40.2 (22050Hz), 6.73MiB
18           mp4        640x360    medium  691k , avc1.42001E, mp4a.40.2@ 96k (44100Hz), 21.16MiB (best)`


var re = /^.+mp4.+video only.+$/gm

foo = foo.match(re)
foo = foo.pop()
foo = foo.match(/^\d+/gm)
console.log(foo[0])


}
