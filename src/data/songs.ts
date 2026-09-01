import type { Song, Playlist } from "../types";

/**
 * ============================================================
 *  🎵  ADMIN PANEL — ADD SONGS & PLAYLISTS HERE
 * ============================================================
 *
 *  Anyone listening to the site does NOT need to log in.
 *  As the admin you control the whole catalog by editing this
 *  file. Just paste a song link and a thumbnail link.
 *
 *  ▸ audioUrl : any direct link to an audio file (.mp3, .ogg,
 *               .wav) or a streaming URL that the browser can
 *               play inside an <audio> element.
 *  ▸ coverUrl : any public image link (jpg/png/webp).
 *
 *  The id field must be unique (use a slug like "song-name").
 * ============================================================
 */

export const rawSongsCatalog: Song[] = [
 {
  id: "s45",
  title: "The Life Of Ram",
  artist: "Govind Vasantha, Pradeep Kumar",
  album: "96 Tamil",
  duration: "05:54",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16960/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/nPOjDpLAi7ThZ8-QVhDA0Rk3PEu6DtmqmODmhlBPuL0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2NlLzE3/L2QwL2NlMTdkMGM5/Y2E0MmMzZGQ2YzJl/MmRiZDdlNDcwNGIw/LmpwZw",
  genre: "",
  year: 2018,
  color: "#5b5058"
},

{
  id: "s46",
  title: "Vasantha Kaalangal",
  artist: "Chinmayi Sripaada, Govind Vasantha",
  album: "96 Tamil",
  duration: "04:56",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16961/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/kUyN0iXAr6Plk_qixox7jJxZZ5U3Qa228WeaMt_-p3Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDQ1MDAz/OTcuanBn",
  genre: "",
  year: 2018,
  color: "#5b5058"
},

{
  id: "s47",
  title: "Yean",
  artist: "Govind Vasantha, Gowri TP",
  album: "96 Tamil",
  duration: "02:24",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16962/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/nPOjDpLAi7ThZ8-QVhDA0Rk3PEu6DtmqmODmhlBPuL0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2NlLzE3/L2QwL2NlMTdkMGM5/Y2E0MmMzZGQ2YzJl/MmRiZDdlNDcwNGIw/LmpwZw",
  genre: "",
  year: 2018,
  color: "#5b5058"
},
{
  id: "s18",          // unique slug
  title: "Kadhal Oru Aagayam",        // display title
  artist: "Teejay, Al Rufian",
  album: "Imaikkaa Nodigal Tamil",        // optional
  duration: "2:41",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/DqVdU7XshJlFZwyx_CHZCw/1785523392/d128_cdn/16758/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/rpQUKP8QCO4xaulWOLDW6ZlxZO6C7Tyed0tEvam-PnU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmlsbWliZWF0/LmNvbS9pbWcvcG9w/Y29ybi9mYW5faW1h/Z2VzL21vdmllLzE1/NDUxL2ltYWlra2Fh/LW5vZGlnYWwtcGhv/dG9zLWltYWdlcy02/MTk4NS5qcGc",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2018,
  color: "#8b5cf6"            // accent color (hex)
 },
 {
  id: "s19",          // unique slug
  title: "Kadhalikathey",        // display title
  artist: "Hiphop Tamizha, Kaushik Krish",
  album: "Imaikkaa Nodigal Tamil",        // optional
  duration: "3:22",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/DqVdU7XshJlFZwyx_CHZCw/1785523392/d128_cdn/16762/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/rpQUKP8QCO4xaulWOLDW6ZlxZO6C7Tyed0tEvam-PnU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmlsbWliZWF0/LmNvbS9pbWcvcG9w/Y29ybi9mYW5faW1h/Z2VzL21vdmllLzE1/NDUxL2ltYWlra2Fh/LW5vZGlnYWwtcGhv/dG9zLWltYWdlcy02/MTk4NS5qcGc",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2018,
  color: "#8b5cf6"            // accent color (hex)
},
 
  {
  id: "s1",          // unique slug
  title: "Raavana Mavandaa song tamil",        // display title
  artist: "Anirudh Ravichander",
  album: "Jana Nayagan Tamil",        // optional
  duration: "1:47",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/Ed4Kr5baKkPOskZC1LPnUA/1785521417/d320_cdn/42769/MjAwMTo0ODYwOjc6NTA1OjpkOA==",   // 🔗 SONG LINK
  coverUrl: "https://cdn.phototourl.com/free/2026-07-27-561cfcff-d7b7-4f0c-af83-ab164dd93037.jpg", 
  year: 2026,
  color: "#8b5cf6"            // accent color (hex)
 },
{
  id: "s2",          // unique slug
  title: "Thalapathy Kacheri",        // display title
  artist: "Anirudh Ravichander, Vijay",
  album: "Jana Nayagan Tamil",        // optional
  duration: "3:17",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/Ed4Kr5baKkPOskZC1LPnUA/1785521417/d128_cdn/40846/MjAwMTo0ODYwOjc6NTA1OjpkOA==",   // 🔗 SONG LINK
  coverUrl: "https://cdn.phototourl.com/free/2026-07-27-561cfcff-d7b7-4f0c-af83-ab164dd93037.jpg",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#8b5cf6"            // accent color (hex)
 },
 {
  id: "s40",
  title: "Anthaathi",
  artist: "Chinmayi Sripaada, Govind Vasantha, Bhadra Rajin, M. Nassar",
  album: "96 Tamil",
  duration: "07:15",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16955/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/2HeJB-aKb_v7kmneHGX2kHkrwul1eLILS2fIMnAy63M/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk4yVmlORFU1/WTJFdE0yWmhOaTAw/Tm1GbUxXSTBNVGN0/TVRBNFlXUXhPVFU1/WXpNMlhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2018,
  color: "#5b5058"
},

{
  id: "s41",
  title: "Iravingu Theevai",
  artist: "Chinmayi Sripaada, Govind Vasantha",
  album: "96 Tamil",
  duration: "03:41",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16956/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/fSn8Z6aX-nV6La3lbpVUvLA7Hfs-BUExSwoRGM_5NJA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZWNkbi5yYWFnYS5j/b20vcmFhZ2FpbWcv/cl9pbWcvMjUwL3Qv/dDAwMDQ2ODEtMi5q/cGc",
  genre: "",
  year: 2018,
  color: "#5b5058"
},

{
  id: "s42",
  title: "Kaathalae Kaathalae",
  artist: "Chinmayi Sripaada, Govind Vasantha",
  album: "96 Tamil",
  duration: "03:13",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16958/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/nPOjDpLAi7ThZ8-QVhDA0Rk3PEu6DtmqmODmhlBPuL0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2NlLzE3/L2QwL2NlMTdkMGM5/Y2E0MmMzZGQ2YzJl/MmRiZDdlNDcwNGIw/LmpwZw",
  genre: "",
  year: 2018,
  color: "#5b5058"
},

{
  id: "s43",
  title: "Kaathalae Kaathalae (Duet Version)",
  artist: "Kalyani Menon, Govind Vasantha",
  album: "96 Tamil",
  duration: "03:14",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16957/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/2HeJB-aKb_v7kmneHGX2kHkrwul1eLILS2fIMnAy63M/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk4yVmlORFU1/WTJFdE0yWmhOaTAw/Tm1GbUxXSTBNVGN0/TVRBNFlXUXhPVFU1/WXpNMlhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2018,
  color: "#5b5058"
},

{
  id: "s44",
  title: "Thaabangale",
  artist: "Chinmayi Sripaada, Pradeep Kumar",
  album: "96 Tamil",
  duration: "03:58",
  audioUrl: "https://www.masstamilan.dev/downloader/c3CUSsgzHltwU3BE_Uv4YA/1785524206/d128_cdn/16959/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/kUyN0iXAr6Plk_qixox7jJxZZ5U3Qa228WeaMt_-p3Q/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDQ1MDAz/OTcuanBn",
  genre: "",
  year: 2018,
  color: "#5b5058"
},
{
  id: "s48",
  title: "Jillendru Oru Kaadhal",
  artist: "Tanvi Shah, Bhargavi Pillai",
  album: "Sillunu Oru Kadhal 2006 tamil",
  duration: "04:18",
  audioUrl: "https://www.masstamilan.dev/downloader/qBGnAyGR_3oZZm4GHO-Fng/1785521750/d128_cdn/160/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/6Fb0Vj7UI76Si2mDwqO4GjRcsZhMQJkrXf_JyArEd6o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzliLzhm/LzJkLzliOGYyZGFk/YjQ0M2ZmZmY5Yjg3/ZTM3NDQxODcxMDZj/LmpwZw",
  genre: "",
  year: 2006,
  color: "#1f1f23"
},

{
  id: "s49",
  title: "Kummi Adi Kummi",
  artist: "Naresh Iyer, Sular Nathalatha, Dr. Sirkali G. Siva Chidambaram",
  album: "Sillunu Oru Kadhal 2006 tamil",
  duration: "06:55",
  audioUrl: "https://www.masstamilan.dev/downloader/qBGnAyGR_3oZZm4GHO-Fng/1785521750/d128_cdn/162/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/Cm1zWktSNoD3YPOyqcNH6PFdJHKcB76mcOnJrZrAGiU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzU1LzI4/LzBlLzU1MjgwZTI2/NzIyYmFhOGNjMTlh/YWVkY2E5ZWQxNDBk/LmpwZw",
  genre: "",
  year: 2006,
  color: "#1f1f23"
},

{
  id: "s50",
  title: "Maaja Maaja Maja",
  artist: "S.P.B. Charan, Shreya Ghoshal",
  album: "Sillunu Oru Kadhal 2006 tamil",
  duration: "05:42",
  audioUrl: "https://www.masstamilan.dev/downloader/qBGnAyGR_3oZZm4GHO-Fng/1785521750/d128_cdn/166/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/6Fb0Vj7UI76Si2mDwqO4GjRcsZhMQJkrXf_JyArEd6o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzliLzhm/LzJkLzliOGYyZGFk/YjQ0M2ZmZmY5Yjg3/ZTM3NDQxODcxMDZj/LmpwZw",
  genre: "",
  year: 2006,
  color: "#1f1f23"
},

{
  id: "s51",
  title: "Maaricham Yatho",
  artist: "Mohammed Aslam, Korolisa, Krishna",
  album: "Sillunu Oru Kadhal 2006 tamil",
  duration: "06:08",
  audioUrl: "https://www.masstamilan.dev/downloader/qBGnAyGR_3oZZm4GHO-Fng/1785521750/d128_cdn/164/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/6Fb0Vj7UI76Si2mDwqO4GjRcsZhMQJkrXf_JyArEd6o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzliLzhm/LzJkLzliOGYyZGFk/YjQ0M2ZmZmY5Yjg3/ZTM3NDQxODcxMDZj/LmpwZw",
  genre: "",
  year: 2006,
  color: "#1f1f23"
},
{
  id: "s3",          // unique slug
  title: "Chella Magale",        // display title
  artist: "Anirudh Ravichander, Vijay",
  album: "Jana Nayagan Tamil",        // optional
  duration: "3:52",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/VkXlU3EHHllWMIbbSZw5UQ/1785521880/d128_cdn/42421/MjAwMTo0ODYwOjc6NDA1OjpkYw==",   // 🔗 SONG LINK
  coverUrl: "https://cdn.phototourl.com/free/2026-07-27-561cfcff-d7b7-4f0c-af83-ab164dd93037.jpg",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#8b5cf6"            // accent color (hex)
},

 {
  id: "s4",          // unique slug
  title: " Oru Pere Varalaaru",        // display title
  artist: "Anirudh Ravichander, Vishal",
  album: "Jana Nayagan Tamil",        // optional
  duration: "3:55",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/VkXlU3EHHllWMIbbSZw5UQ/1785521880/d128_cdn/41982/MjAwMTo0ODYwOjc6NDA1OjpkYw==",   // 🔗 SONG LINK
  coverUrl: "https://cdn.phototourl.com/free/2026-07-27-561cfcff-d7b7-4f0c-af83-ab164dd93037.jpg",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#8b5cf6"            // accent color (hex)
},
 {
  id: "s26",
  title: "Adi One Inch",
  artist: " S. P. Balasubrahmanyam, Sujatha Mohan",
  album: "Youth 2002 tamil",
  duration: "04:41",
  audioUrl: "https://www.masstamilan.dev/downloader/22Ff5dC_l4OCJoNU7MyAaQ/1785522005/d128_cdn/8860/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/flqo2Q22HTmcIEzVer7B5fMNTWm4x71aIgJFTLrpaEU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk9ERXhaamMz/T0RJdFlXSTROaTAw/T1dZMkxUZ3daRE10/TkdZellqRXhaV0Zq/WVRJeFhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2002,
  color: "#d6964e"
},

{
  id: "s27",
  title: "All Thotta Boopathi",
  artist: "Shankar Mahadevan",
  album: "Youth 2002 tamil",
  duration: "04:52",
  audioUrl: "https://www.masstamilan.dev/downloader/22Ff5dC_l4OCJoNU7MyAaQ/1785522005/d128_cdn/8862/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/flqo2Q22HTmcIEzVer7B5fMNTWm4x71aIgJFTLrpaEU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk9ERXhaamMz/T0RJdFlXSTROaTAw/T1dZMkxUZ3daRE10/TkdZellqRXhaV0Zq/WVRJeFhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2002,
  color: "#d6964e"
},

{
  id: "s28",
  title: "Sakhiye Sakhiye",
  artist: " Harini, Hariharan",
  album: "Youth 2002 tamil",
  duration: "05:42",
  audioUrl: "https://www.masstamilan.dev/downloader/22Ff5dC_l4OCJoNU7MyAaQ/1785522005/d128_cdn/8857/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/flqo2Q22HTmcIEzVer7B5fMNTWm4x71aIgJFTLrpaEU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk9ERXhaamMz/T0RJdFlXSTROaTAw/T1dZMkxUZ3daRE10/TkdZellqRXhaV0Zq/WVRJeFhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2002,
  color: "#d6964e"
},
 {
  id: "s52",
  title: "Machakari Machakari",
  artist: " Shankar Mahadevan, Vasundhara Das",
  album: "Sillunu Oru Kadhal 2006 tamil",
  duration: "05:31",
  audioUrl: "https://www.masstamilan.dev/downloader/qBGnAyGR_3oZZm4GHO-Fng/1785521750/d128_cdn/163/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/iA7QxM5x_F2BPjTdc7TE5OIIo4bioJHAxYZOlWnKnis/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDcwNjA4/NjEuanBn",
  genre: "",
  year: 2006,
  color: "#1f1f23"
},

{
  id: "s53",
  title: "Munbe Vaa",
  artist: "Naresh Iyer, Shreya Ghoshal",
  album: "Sillunu Oru Kadhal 2006 tamil",
  duration: "05:57",
  audioUrl: "https://www.masstamilan.dev/downloader/qBGnAyGR_3oZZm4GHO-Fng/1785521750/d128_cdn/165/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/iA7QxM5x_F2BPjTdc7TE5OIIo4bioJHAxYZOlWnKnis/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDcwNjA4/NjEuanBn",
  genre: "",
  year: 2006,
  color: "#1f1f23"
},

{
  id: "s54",
  title: "New York Nagaram",
  artist: "A.R. Rahman",
  album: "Sillunu Oru Kadhal 2006 tamil",
  duration: "06:18",
  audioUrl: "https://www.masstamilan.dev/downloader/qBGnAyGR_3oZZm4GHO-Fng/1785521750/d128_cdn/161/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/iA7QxM5x_F2BPjTdc7TE5OIIo4bioJHAxYZOlWnKnis/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDcwNjA4/NjEuanBn",
  genre: "",
  year: 2006,
  color: "#1f1f23"
},




{
  id: "s29",
  title: "Sakkarai Nilave",
  artist: "Harish Ragavendra",
  album: "Youth 2002 tamil",
  duration: "05:41",
  audioUrl: "https://www.masstamilan.dev/downloader/22Ff5dC_l4OCJoNU7MyAaQ/1785522005/d128_cdn/8861/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/flqo2Q22HTmcIEzVer7B5fMNTWm4x71aIgJFTLrpaEU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk9ERXhaamMz/T0RJdFlXSTROaTAw/T1dZMkxUZ3daRE10/TkdZellqRXhaV0Zq/WVRJeFhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2002,
  color: "#d6964e"
},

{
  id: "s30",
  title: "Santhosam Santhosam",
  artist: " S. P. Balasubrahmanyam",
  album: "Youth 2002 tamil",
  duration: "04:24",
  audioUrl: "https://www.masstamilan.dev/downloader/22Ff5dC_l4OCJoNU7MyAaQ/1785522005/d128_cdn/8858/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/flqo2Q22HTmcIEzVer7B5fMNTWm4x71aIgJFTLrpaEU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk9ERXhaamMz/T0RJdFlXSTROaTAw/T1dZMkxUZ3daRE10/TkdZellqRXhaV0Zq/WVRJeFhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2002,
  color: "#d6964e"
},


 {
  id: "s5",          // unique slug
  title: " Ulla Olicha Uyire",        // display title
  artist: "Anirudh Ravichander",
   album: "Jana Nayagan Tamil",        // optional
  duration: "3:48",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/VkXlU3EHHllWMIbbSZw5UQ/1785521880/d128_cdn/45007/MjAwMTo0ODYwOjc6NDA1OjpkYw==",   // 🔗 SONG LINK
  coverUrl: "https://cdn.phototourl.com/free/2026-07-27-561cfcff-d7b7-4f0c-af83-ab164dd93037.jpg",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#8b5cf6"            // accent color (hex)
},

 {
  id: "s31",
  title: "Anju Vanna Poove",
  artist: "A.R.Rahman, Charulatha Mani",
  album: "Thug Life Tamil",
  duration: "04:37",
  audioUrl: "https://www.masstamilan.dev/downloader/4XBRLOuRjSZ_y95A66dLtg/1785522413/d128_cdn/39505/MjQwMjozYTgwOjE5MTE6ZmNlOTplMDY2OjRkZmY6ZmVkNjplYmU5",
  coverUrl: "https://imgs.search.brave.com/N6HY0-21fT-pgMll3TgNwpw2Drqpv2rftQ4JLGXBbDg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL1RodWctTGlm/ZS1jb3ZlciUyMCgx/KS05ZjY2Yzk0MC00/MDQ1LTExZjAtYjQy/Ni1hNTA2NzFhY2Zj/MjQuanBn",
  genre: "",
  year: 2025,
  color: "#d20219"
},

{
  id: "s32",
  title: "Anju Vanna Poove (Reprise)",
  artist: "A.R.Rahman",
  album: "Thug Life Tamil",
  duration: "04:15",
  audioUrl: "https://www.masstamilan.dev/downloader/4XBRLOuRjSZ_y95A66dLtg/1785522413/d128_cdn/39506/MjQwMjozYTgwOjE5MTE6ZmNlOTplMDY2OjRkZmY6ZmVkNjplYmU5",
  coverUrl: "https://imgs.search.brave.com/N6HY0-21fT-pgMll3TgNwpw2Drqpv2rftQ4JLGXBbDg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL1RodWctTGlm/ZS1jb3ZlciUyMCgx/KS05ZjY2Yzk0MC00/MDQ1LTExZjAtYjQy/Ni1hNTA2NzFhY2Zj/MjQuanBn",
  genre: "",
  year: 2025,
  color: "#d20219"
},
 {
  id: "s36",
  title: " Aalaala Kandaa",
  artist: "Hariharan & MS.Viswanathan",
  album: "Sangamam 1999 tamil",
  duration: "02:18",
  audioUrl: "https://www.masstamilan.dev/downloader/T5bXzyYyvDNdB4xxvcuS1g/1785522512/d128_cdn/10614/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/MNIphEmTZ0WU7ypVpopsp7AYCwOK-Bz_0b13zhxWsGA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS50aGVtb3ZpZWRi/Lm9yZy90L3AvdzMw/MF9hbmRfaDQ1MF9m/YWNlLzZGMEVZVUJ6/YmxLa2hqaThFOXlQ/TkFjRWVwSy5qcGc",
  genre: "",
  year: 1999,
  color: "#2279d7"
},

{
  id: "s37",
  title: "Margazhi Thingal",
  artist: "Unnikrishnan & S.Janaki",
  album: "Sangamam 1999 tamil",
  duration: "06:56",
  audioUrl: "https://www.masstamilan.dev/downloader/T5bXzyYyvDNdB4xxvcuS1g/1785522512/d128_cdn/10613/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/MNIphEmTZ0WU7ypVpopsp7AYCwOK-Bz_0b13zhxWsGA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS50aGVtb3ZpZWRi/Lm9yZy90L3AvdzMw/MF9hbmRfaDQ1MF9m/YWNlLzZGMEVZVUJ6/YmxLa2hqaThFOXlQ/TkFjRWVwSy5qcGc",
  genre: "",
  year: 1999,
  color: "#2279d7"
},

{
  id: "s38",
  title: " Mazhaithuli Mazhaithuli Mannil",
  artist: "Hariharan & MS.Viswanathan",
  album: "Sangamam 1999 tamil",
  duration: "06:50",
  audioUrl: "https://www.masstamilan.dev/downloader/T5bXzyYyvDNdB4xxvcuS1g/1785522512/d128_cdn/10612/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/MNIphEmTZ0WU7ypVpopsp7AYCwOK-Bz_0b13zhxWsGA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS50aGVtb3ZpZWRi/Lm9yZy90L3AvdzMw/MF9hbmRfaDQ1MF9m/YWNlLzZGMEVZVUJ6/YmxLa2hqaThFOXlQ/TkFjRWVwSy5qcGc",
  genre: "",
  year: 1999,
  color: "#2279d7"
},

{
  id: "s39",
  title: "Varaha Nadikkarai Oram",
  artist: "Shankar Mahadevan",
  album: "Sangamam 1999 tamil",
  duration: "06:18",
  audioUrl: "https://www.masstamilan.dev/downloader/T5bXzyYyvDNdB4xxvcuS1g/1785522512/d128_cdn/10616/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/MNIphEmTZ0WU7ypVpopsp7AYCwOK-Bz_0b13zhxWsGA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS50aGVtb3ZpZWRi/Lm9yZy90L3AvdzMw/MF9hbmRfaDQ1MF9m/YWNlLzZGMEVZVUJ6/YmxLa2hqaThFOXlQ/TkFjRWVwSy5qcGc",
  genre: "",
  year: 1999,
  color: "#2279d7"
},



{
  id: "s33",
  title: "Jinguchaa song",
  artist: "A.R.Rahman, Vaishali Samant, Shakthisree Gopalan, Adithya RK",
  album: "Thug Life Tamil",
  duration: "04:20",
  audioUrl: "https://www.masstamilan.dev/downloader/YlrbClXW68lKRcGPmJQ_9g/1785522663/d128_cdn/39322/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/N6HY0-21fT-pgMll3TgNwpw2Drqpv2rftQ4JLGXBbDg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL1RodWctTGlm/ZS1jb3ZlciUyMCgx/KS05ZjY2Yzk0MC00/MDQ1LTExZjAtYjQy/Ni1hNTA2NzFhY2Zj/MjQuanBn",
  genre: "",
  year: 2025,
  color: "#d20219"
},

{
  id: "s34",
  title: " Muththa Mazhai",
  artist: "A.R.Rahman, Dhee",
  album: "Thug Life Tamil",
  duration: "04:01",
  audioUrl: "https://www.masstamilan.dev/downloader/YlrbClXW68lKRcGPmJQ_9g/1785522663/d128_cdn/39509/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/N6HY0-21fT-pgMll3TgNwpw2Drqpv2rftQ4JLGXBbDg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL1RodWctTGlm/ZS1jb3ZlciUyMCgx/KS05ZjY2Yzk0MC00/MDQ1LTExZjAtYjQy/Ni1hNTA2NzFhY2Zj/MjQuanBn",
  genre: "",
  year: 2025,
  color: "#d20219"
},

{
  id: "s35",
  title: " Muththa Mazhai (Chinmayi Version)",
  artist: "A.R.Rahman, Chinmayi Sripada",
  album: "Thug Life Tamil",
  duration: " 03:46",
  audioUrl: "https://www.masstamilan.dev/downloader/YlrbClXW68lKRcGPmJQ_9g/1785522663/d128_cdn/39612/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/N6HY0-21fT-pgMll3TgNwpw2Drqpv2rftQ4JLGXBbDg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL1RodWctTGlm/ZS1jb3ZlciUyMCgx/KS05ZjY2Yzk0MC00/MDQ1LTExZjAtYjQy/Ni1hNTA2NzFhY2Zj/MjQuanBn",
  genre: "",
  year: 2025,
  color: "#d20219"
},



{
  id: "s20",          // unique slug
  title: "Neeyum Naanum Anbe",        // display title
  artist: "Raghu Dixit, D. Sathyaprakash, Jithin Raj",
  album: "Imaikkaa Nodigal Tamil",        // optional
  duration: "4:45",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/3RdLIqfQHvjF_85cZdnkeA/1785522810/d128_cdn/16761/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/rpQUKP8QCO4xaulWOLDW6ZlxZO6C7Tyed0tEvam-PnU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmlsbWliZWF0/LmNvbS9pbWcvcG9w/Y29ybi9mYW5faW1h/Z2VzL21vdmllLzE1/NDUxL2ltYWlra2Fh/LW5vZGlnYWwtcGhv/dG9zLWltYWdlcy02/MTk4NS5qcGc",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2018,
  color: "#8b5cf6"            // accent color (hex)
},

 {
  id: "s6",          // unique slug
  title: "Roja Roja",        // display title
  artist: " Unnikrishnan",
  album: "Kadhalar Dhinam Tamil",        // optional
  duration: "5:47",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/QOZtfRPG0uNLN2U05rcTOw/1785522868/d128_cdn/8377/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/DOwWfIaGtcK3K9Wl7QTYKUK4cBlfBZ_tpJBSMuWYaSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL0thZGhhbGFy/LURoaW5hbV9Db3Zl/ci0wZjQ0YjhjMC0w/NzBjLTExZjEtYTFh/Zi1kM2RmNWI2MmNj/YzcuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 1999,
  color: "#812716"            // accent color (hex)
},

 {
  id: "s22",          // unique slug
  title: "Uyir Uruvaatha Song",        // display title
  artist: "D. Sathyaprakash, Chinmayi",
  album: "Iravukku Aayiram Kangal Tamil",        // optional
  duration: "4:13",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/jfkCzbgtuApVdfp04rP_Kg/1785522932/d128_cdn/16577/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/UyspsZcpR6IoC26ureRo82R71n48WMQrquAjsk2nRds/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/c3R1ZGlvZmxpY2tz/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyNi8wMy8wMjE3/MzAyNi9JcmF2dWtr/dS1BYXlpcmFtLUth/bmdhbC5qcGc",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2018,
  color: "#8b5cf6"            // accent color (hex)
},

 {
  id: "s7",          // unique slug
  title: "Dhandiya",        // display title
  artist: "Unnimenon, Sree Kumar, Kavitha Krishnamoorthy",
  album: "Kadhalar Dhinam Tamil",        // optional
  duration: "7:48",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/0CnIC5PIcSYS44kAn-PxyA/1785523005/d128_cdn/8379/NDUuMjUxLjM1LjQz",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/DOwWfIaGtcK3K9Wl7QTYKUK4cBlfBZ_tpJBSMuWYaSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL0thZGhhbGFy/LURoaW5hbV9Db3Zl/ci0wZjQ0YjhjMC0w/NzBjLTExZjEtYTFh/Zi1kM2RmNWI2MmNj/YzcuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 1999,
  color: "#812716"            // accent color (hex)
},

 {
  id: "s8",          // unique slug
  title: "Enna Vilai Azhagae",        // display title
  artist: "Unnimenon",
  album: "Kadhalar Dhinam Tamil",        // optional
  duration: "5:55",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/0CnIC5PIcSYS44kAn-PxyA/1785523005/d128_cdn/8378/NDUuMjUxLjM1LjQz",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/DOwWfIaGtcK3K9Wl7QTYKUK4cBlfBZ_tpJBSMuWYaSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL0thZGhhbGFy/LURoaW5hbV9Db3Zl/ci0wZjQ0YjhjMC0w/NzBjLTExZjEtYTFh/Zi1kM2RmNWI2MmNj/YzcuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 1999,
  color: "#812716"            // accent color (hex)
},

 {
  id: "s9",          // unique slug
  title: "Kaathalenum Thervezhuthi",        // display title
  artist: "S.P.Bala, Swarnalatha",
  album: "Kadhalar Dhinam Tamil",        // optional
  duration: "6:43",           // optional
  audioUrl: "",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/DOwWfIaGtcK3K9Wl7QTYKUK4cBlfBZ_tpJBSMuWYaSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL0thZGhhbGFy/LURoaW5hbV9Db3Zl/ci0wZjQ0YjhjMC0w/NzBjLTExZjEtYTFh/Zi1kM2RmNWI2MmNj/YzcuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "https://www.masstamilan.dev/downloader/0CnIC5PIcSYS44kAn-PxyA/1785523005/d128_cdn/8376/NDUuMjUxLjM1LjQz",
  year: 1999,
  color: "#812716"            // accent color (hex)
},
{
  id: "s10",          // unique slug
  title: "Nenichapadi Nenichapadi song",        // display title
  artist: "Sree Kumar, Srinivas",
  album: "Kadhalar Dhinam Tamil ",        // optional
  duration: "7:45",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/0CnIC5PIcSYS44kAn-PxyA/1785523005/d128_cdn/8380/NDUuMjUxLjM1LjQz",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/DOwWfIaGtcK3K9Wl7QTYKUK4cBlfBZ_tpJBSMuWYaSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL0thZGhhbGFy/LURoaW5hbV9Db3Zl/ci0wZjQ0YjhjMC0w/NzBjLTExZjEtYTFh/Zi1kM2RmNWI2MmNj/YzcuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 1999,
  color: "#812716"            // accent color (hex)
},
 {
  id: "s24",
  title: "Kaattumalli",
  artist: "Ilaiyaraaja, Ananya Bhat",
  album: "Viduthalai Tamil",
  duration: " 05:06",
  audioUrl: "https://www.masstamilan.dev/downloader/nPes5cVoAaUhxM6lg4lt4w/1785523152/d128_cdn/23806/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/q89nY0n5wW4L6wOFbuf_GW-EEzzbXbJcTj_bQjPB6h8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk16UTNZVEl3/TmpJdE56QmxaaTAw/T0dJMExUbGpZVEV0/WldWbFlUQTJZamd6/TldNNFhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2023,
  color: "#b1b6b6"
},

{
  id: "s25",
  title: "Onnoda Nadandhaa",
  artist: " Ilaiyaraaja, Dhanush, Ananya Bhat",
  album: "Viduthalai Tamil ",
  duration: "05:15",
  audioUrl: "https://www.masstamilan.dev/downloader/nPes5cVoAaUhxM6lg4lt4w/1785523152/d128_cdn/23807/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
  coverUrl: "https://imgs.search.brave.com/q89nY0n5wW4L6wOFbuf_GW-EEzzbXbJcTj_bQjPB6h8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk16UTNZVEl3/TmpJdE56QmxaaTAw/T0dJMExUbGpZVEV0/WldWbFlUQTJZamd6/TldNNFhrRXlYa0Zx/Y0djQC5qcGc",
  genre: "",
  year: 2023,
  color: "#b1b6b6"
},
{
  id: "s11",          // unique slug
  title: "Kannamma",        // display title
  artist: "Pradeep Kumar, Dhee, Ananthu",
  album: "Kaala ",        // optional
  duration: "4:49",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/HUEZynL06Ynm-TaJj_hslg/1785523221/d128_cdn/18588/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/62v2BGQS_-yA4KhY90Zo8a40gfAomVTXX0HewyhS9i8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNDI2/NTY4OS5qcGc",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2018,
  color: "#8b5cf6"            // accent color (hex)
},

 {
  id: "s23",          // unique slug
  title: "Neelothi",        // display title
  artist: "Sooraj Santhosh, Chinmayi Sripada, Justin Prabhakaran, Sarathi",
  album: "Sirai Tamil ",        // optional
  duration: "4:34",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/SBUvFmfsNptv7P7k9RDHeg/1785523257/d128_cdn/42771/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/FBNbLK11ou6yEffElmmirurOPu6PDClQifNpz-_Vdps/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/c2lyYWktcmV2aWV3/LW1lZ2F0aHJlYWQt/djAtc2E1NHkzOGZu/YzlnMS5qcGVnP3dp/ZHRoPTY0MCZjcm9w/PXNtYXJ0JmF1dG89/d2VicCZzPTMzNzcy/MjUxMjM4MjQzOThl/YzMwYTk3OTM1MWU1/ZmEzZmM0MWRmNzk",
  genre: "",
  year: 2025,
  color: "#8b5cf6"            // accent color (hex)
},

 {
  id: "s12",          // unique slug
  title: "Sambavakaari",        // display title
  artist: " Sean Roldan, Saindhavi",
  album: "Gatta Kusthi 2",        // optional
  duration: "3:59",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/1tiUO7Q9juyd9qh_Lxlp9A/1785523246/d128_cdn/44632/MjAwMTo0ODYwOjc6ODA1OjpiOA==",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/1qzfCA3cePmuz380Bh5dwchaScJlL3ddN081VCbpSzs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMtaW4uYm1zY2Ru/LmNvbS9pZWRiL21v/dmllcy9pbWFnZXMv/bW9iaWxlL3RodW1i/bmFpbC94bGFyZ2Uv/Z2F0dGEta3VzdGhp/LTItZXQwMDUwMjgw/Mi0xNzg0MjgzNzA5/LmpwZw",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#0096ac"            // accent color (hex)
},
{
  id: "s13",          // unique slug
  title: "God Mode",        // display title
  artist: "Sai Abhyankkar, Gana Muthu",
  album: "Karuppu Tamil",        // optional
  duration: "4:00",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/ONU6KjUoS94QysE8P0dY6Q/1785523320/d128_cdn/40686/MjQwMTo0OTAwOjg4ZDk6M2Q5YjoyY2UyOmQzNmM6OWNhZDoxYWU3",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/yTdhNN2onaiYgobc_gt3rq0TVJKrsWJ6spGPEj-uZPE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ibG9n/Z2VyLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS9pbWcvYi9SMjl2/WjJ4bC9BVnZYc0Vq/UUZGWEtXOVFFSlNL/a2h5S05WM3NzaVhp/UmJsM0ZWdHd5UE5K/MlI4Q2FSemg1WmNw/NjVvUjZ0a0dTM2dp/YWpZZ2QzSDRRMk9U/dHpfejY5c1ptSmJZ/LU5SeTI2Ym9xOTdP/MXVCbGk0Uy03MjZr/UEJVVllCcTVUNV9V/SDRlRWl3Z2ZGNE9i/ZzV3Vkk0MjZWUGtR/S2E1Sm5Pdy1JUl9K/RUZDZ0dyQjF2bTZp/eENXWDk4WUxCZ2R4/TUtFcUxSN2E1L3Mx/NTAwL0thcnVwcHUw/MDUuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#ffffff"            // accent color (hex)
},

 {
  id: "s21",          // unique slug
  title: "Vilambara Idaiveli",        // display title
  artist: "Christopher Stanley, Sudharshan Ashok, Srinisha Jayaseelan, Hiphop Tamizhaj",
  album: "Imaikkaa Nodigal Tamil",        // optional
  duration: "4:33",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/DqVdU7XshJlFZwyx_CHZCw/1785523392/d128_cdn/16760/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/rpQUKP8QCO4xaulWOLDW6ZlxZO6C7Tyed0tEvam-PnU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZmlsbWliZWF0/LmNvbS9pbWcvcG9w/Y29ybi9mYW5faW1h/Z2VzL21vdmllLzE1/NDUxL2ltYWlra2Fh/LW5vZGlnYWwtcGhv/dG9zLWltYWdlcy02/MTk4NS5qcGc",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2018,
  color: "#8b5cf6"            // accent color (hex)
},
 {
  id: "s14",          // unique slug
  title: "Raathu Raasan",        // display title
  artist: "Sai Abhyankkar, V.M. Mahalingam, Paal Dabba",
  album: "Karuppu Tamil",        // optional
  duration: "3:15",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/ONU6KjUoS94QysE8P0dY6Q/1785523320/d128_cdn/44419/MjQwMTo0OTAwOjg4ZDk6M2Q5YjoyY2UyOmQzNmM6OWNhZDoxYWU3",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/aP5Fz6hdHJeZxUZIuGN--bjvl8iy9vS_UvZfppjizAs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMtaW4uYm1zY2Ru/LmNvbS9pZWRiL21v/dmllcy9pbWFnZXMv/bW9iaWxlL3RodW1i/bmFpbC94bGFyZ2Uv/a2FydXBwdS1ldDAw/NDUwNTczLTE3NTMy/NTM1MTAuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#ffffff"            // accent color (hex)
},
  {
  id: "s15",          // unique slug
  title: "Naanga Naalu Peru",        // display title
  artist: "Sai Abhyankkar, Silambarasan Tr",
  album: "Karuppu Tamil",        // optional
  duration: "3:17",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/ONU6KjUoS94QysE8P0dY6Q/1785523320/d128_cdn/44263/MjQwMTo0OTAwOjg4ZDk6M2Q5YjoyY2UyOmQzNmM6OWNhZDoxYWU3",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/aP5Fz6hdHJeZxUZIuGN--bjvl8iy9vS_UvZfppjizAs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMtaW4uYm1zY2Ru/LmNvbS9pZWRiL21v/dmllcy9pbWFnZXMv/bW9iaWxlL3RodW1i/bmFpbC94bGFyZ2Uv/a2FydXBwdS1ldDAw/NDUwNTczLTE3NTMy/NTM1MTAuanBn",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#ffffff"            // accent color (hex)
},
  {
  id: "s16",          // unique slug
  title: "Karuppa Kooda Va",        // display title
  artist: " Sai Abhyankkar, V.M. Mahalingam",
  album: "Karuppu Tamil",        // optional
  duration: "4:10",           // optional
  audioUrl: "https://www.masstamilan.dev/downloader/ONU6KjUoS94QysE8P0dY6Q/1785523320/d128_cdn/44500/MjQwMTo0OTAwOjg4ZDk6M2Q5YjoyY2UyOmQzNmM6OWNhZDoxYWU3",   // 🔗 SONG LINK
  coverUrl: "https://imgs.search.brave.com/aP5Fz6hdHJeZxUZIuGN--bjvl8iy9vS_UvZfppjizAs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMtaW4uYm1zY2Ru/LmNvbS9pZWRiL21v/dmllcy9pbWFnZXMv/bW9iaWxlL3RodW1i/bmFpbC9",  // 🖼️ THUMBNAIL LINK
  genre: "",
  year: 2026,
  color: "#ffffff"            // accent color (hex)
},

  // --- MINNALE (2001) ---
  {
    id: "s55",
    title: "Azhagiya Theeye",
    artist: "Harish Raghavendra, Timmy",
    album: "Minnale 2001 tamil",
    duration: "05:56",
    audioUrl: "https://www.masstamilan.dev/downloader/EOgELI5iLJGzUIKAVva1dg/1785523491/d128_cdn/8515/MjQwMjozYTgwOjU4OjllMmQ6MDoxNzpiZTY6MzAwMQ==",
    coverUrl: "https://imgs.search.brave.com/QZGWRzXvLvQo7rpa6S4qY0loYd8NEOXIEGbH9G4OQYw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZGlnaXQuaW4v/T1RUL3YyL2ltYWdl/cy90cjpuLW90dF9o/b21lX2Nyb3VzZWwv/bWlubmFsZS04NDky/NzMuanBn",
    genre: "Romance",
    year: 2001,
    color: "#21e83b"
  },
  {
    id: "s56",
    title: "Nenjai Poopol",
    artist: "Harish Raghavendra",
    album: "Minnale 2001 tamil",
    duration: "01:01",
    audioUrl: "https://www.masstamilan.dev/downloader/EOgELI5iLJGzUIKAVva1dg/1785523491/d320_cdn/8518/MjQwMjozYTgwOjU4OjllMmQ6MDoxNzpiZTY6MzAwMQ==",
    coverUrl: "https://imgs.search.brave.com/QZGWRzXvLvQo7rpa6S4qY0loYd8NEOXIEGbH9G4OQYw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZGlnaXQuaW4v/T1RUL3YyL2ltYWdl/cy90cjpuLW90dF9o/b21lX2Nyb3VzZWwv/bWlubmFsZS04NDky/NzMuanBn",
    genre: "Romance",
    year: 2001,
    color: "#21e83b"
  },
  {
    id: "s57",
    title: "Vaseegara",
    artist: "Bombay Jayashri",
    album: "Minnale 2001 tamil",
    duration: "04:59",
    audioUrl: "https://www.masstamilan.dev/downloader/EOgELI5iLJGzUIKAVva1dg/1785523491/d128_cdn/8517/MjQwMjozYTgwOjU4OjllMmQ6MDoxNzpiZTY6MzAwMQ==",
    coverUrl: "https://imgs.search.brave.com/QZGWRzXvLvQo7rpa6S4qY0loYd8NEOXIEGbH9G4OQYw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZGlnaXQuaW4v/T1RUL3YyL2ltYWdl/cy90cjpuLW90dF9o/b21lX2Nyb3VzZWwv/bWlubmFsZS04NDky/NzMuanBn",
    genre: "Melody",
    year: 2001,
    color: "#21e83b"
  },
  {
    id: "s58",
    title: "Venmathiye",
    artist: "Tippu, Roop Kumar Rathod",
    album: "Minnale 2001 tamil",
    duration: "05:27",
    audioUrl: "https://www.masstamilan.dev/downloader/EOgELI5iLJGzUIKAVva1dg/1785523491/d128_cdn/8516/MjQwMjozYTgwOjU4OjllMmQ6MDoxNzpiZTY6MzAwMQ==",
    coverUrl: "https://imgs.search.brave.com/QZGWRzXvLvQo7rpa6S4qY0loYd8NEOXIEGbH9G4OQYw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZGlnaXQuaW4v/T1RUL3YyL2ltYWdl/cy90cjpuLW90dF9o/b21lX2Nyb3VzZWwv/bWlubmFsZS04NDky/NzMuanBn",
    genre: "Melody",
    year: 2001,
    color: "#21e83b"
  },
  {
    id: "s59",
    title: "Verenna Verenna (Ivan Yaro)",
    artist: "P. Unnikrishnan, Harini",
    album: "Minnale 2001 tamil",
    duration: "05:25",
    audioUrl: "https://www.masstamilan.dev/downloader/EOgELI5iLJGzUIKAVva1dg/1785523491/d128_cdn/8521/MjQwMjozYTgwOjU4OjllMmQ6MDoxNzpiZTY6MzAwMQ==",
    coverUrl: "https://imgs.search.brave.com/QZGWRzXvLvQo7rpa6S4qY0loYd8NEOXIEGbH9G4OQYw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZGlnaXQuaW4v/T1RUL3YyL2ltYWdl/cy90cjpuLW90dF9o/b21lX2Nyb3VzZWwv/bWlubmFsZS04NDky/NzMuanBn",
    genre: "Melody",
    year: 2001,
    color: "#21e83b"
  },

  // --- ALAIPAYUTHEY (2000) ---
  {
    id: "s60",
    title: "Alaipayuthey Kanna",
    artist: "Kalyani Menon, Harini & Neyveli Ramalakshmi Krishna",
    album: "Alaipayuthey tamil",
    duration: "03:41",
    audioUrl: "https://www.masstamilan.dev/downloader/q9M65ebfheYqD7m4KBYojg/1785523731/d128_cdn/8742/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
    coverUrl: "https://imgs.search.brave.com/sKGgYrA3gqVndZnnxQCNOUhJvI8yTXWKjy33cYzVESo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLnNh/cmVnYW1hLnRlY2gv/aW1hZ2UvYy9md180/ODUvNy9jMS83ZC9h/bGFpcGF5dXRoZXlf/dGFtaWxfMTY4NjEz/ODQyOS5qcGc",
    genre: "Classical Fusion",
    year: 2000,
    color: "#b246aa"
  },
  {
    id: "s61",
    title: "Evano Oruvan Vasikiran",
    artist: "Swarnalatha",
    album: "Alaipayuthey tamil",
    duration: "05:56",
    audioUrl: "https://www.masstamilan.dev/downloader/q9M65ebfheYqD7m4KBYojg/1785523731/d128_cdn/8746/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
    coverUrl: "https://imgs.search.brave.com/sKGgYrA3gqVndZnnxQCNOUhJvI8yTXWKjy33cYzVESo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLnNh/cmVnYW1hLnRlY2gv/aW1hZ2UvYy9md180/ODUvNy9jMS83ZC9h/bGFpcGF5dXRoZXlf/dGFtaWxfMTY4NjEz/ODQyOS5qcGc",
    genre: "Soulful",
    year: 2000,
    color: "#b246aa"
  },
  {
    id: "s62",
    title: "Kadhal Sadugudu",
    artist: "S.P.B. Charan & Naveen",
    album: "Alaipayuthey tamil",
    duration: "04:35",
    audioUrl: "https://www.masstamilan.dev/downloader/q9M65ebfheYqD7m4KBYojg/1785523731/d128_cdn/8741/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
    coverUrl: "https://imgs.search.brave.com/sKGgYrA3gqVndZnnxQCNOUhJvI8yTXWKjy33cYzVESo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLnNh/cmVnYW1hLnRlY2gv/aW1hZ2UvYy9md180/ODUvNy9jMS83ZC9h/bGFpcGF5dXRoZXlf/dGFtaWxfMTY4NjEz/ODQyOS5qcGc",
    genre: "Peppy",
    year: 2000,
    color: "#b246aa"
  },
  {
    id: "s63",
    title: "Pachchai Nirame",
    artist: "Hariharan & Clinton",
    album: "Alaipayuthey tamil",
    duration: "05:58",
    audioUrl: "https://www.masstamilan.dev/downloader/q9M65ebfheYqD7m4KBYojg/1785523731/d128_cdn/8748/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
    coverUrl: "https://imgs.search.brave.com/sKGgYrA3gqVndZnnxQCNOUhJvI8yTXWKjy33cYzVESo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLnNh/cmVnYW1hLnRlY2gv/aW1hZ2UvYy9md180/ODUvNy9jMS83ZC9h/bGFpcGF5dXRoZXlf/dGFtaWxfMTY4NjEz/ODQyOS5qcGc",
    genre: "Melody",
    year: 2000,
    color: "#b246aa"
  },
  {
    id: "s64",
    title: "Snehidhane",
    artist: "Sadhana Sargam & Srinivas",
    album: "Alaipayuthey tamil",
    duration: "04:52",
    audioUrl: "https://www.masstamilan.dev/downloader/q9M65ebfheYqD7m4KBYojg/1785523731/d128_cdn/8745/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
    coverUrl: "https://imgs.search.brave.com/sKGgYrA3gqVndZnnxQCNOUhJvI8yTXWKjy33cYzVESo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLnNh/cmVnYW1hLnRlY2gv/aW1hZ2UvYy9md180/ODUvNy9jMS83ZC9h/bGFpcGF5dXRoZXlf/dGFtaWxfMTY4NjEz/ODQyOS5qcGc",
    genre: "Romance",
    year: 2000,
    color: "#b246aa"
  },
  {
    id: "s65",
    title: "Yaro Yarodi",
    artist: "Mahalaxmi Iyer, Vaishali & Richa Sharma",
    album: "Alaipayuthey tamil",
    duration: "05:44",
    audioUrl: "https://www.masstamilan.dev/downloader/q9M65ebfheYqD7m4KBYojg/1785523731/d128_cdn/8740/MjQwMTo0OTAwOjYzMzU6MTdiZTo0NWRiOjQ4MzE6NDdjNjo0NDk=",
    coverUrl: "https://imgs.search.brave.com/sKGgYrA3gqVndZnnxQCNOUhJvI8yTXWKjy33cYzVESo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLnNh/cmVnYW1hLnRlY2gv/aW1hZ2UvYy9md180/ODUvNy9jMS83ZC9h/bGFpcGF5dXRoZXlf/dGFtaWxfMTY4NjEz/ODQyOS5qcGc",
    genre: "Folk / Festive",
    year: 2000,
    color: "#b246aa"
  },


];

// Fisher-Yates deterministic shuffle helper for catalog shuffling
function shuffleCatalog<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(((i * 9301 + 49297) % 233280) / 233280 * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

// Shuffled export of songs so the library playback & default views feature rich shuffle mix
export const songs: Song[] = shuffleCatalog(rawSongsCatalog);

/**
 *  Playlists group songs by id. Add as many as you like.
 */
export const playlists: Playlist[] = [
  {
    id: "all-songs",
    name: "All Songs",
    description: "Every track in the library, dynamically shuffled.",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop",
    songIds: songs.map((s) => s.id),
    color: "#8b5cf6",
  },
  {
    id: "shuffled-classics",
    name: "Shuffled Super Hits Mix",
    description: "A randomized shuffle mix of top romantic hits and classic album tracks.",
    coverUrl: "https://imgs.search.brave.com/QZGWRzXvLvQo7rpa6S4qY0loYd8NEOXIEGbH9G4OQYw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZGlnaXQuaW4v/T1RUL3YyL2ltYWdl/cy90cjpuLW90dF9o/b21lX2Nyb3VzZWwv/bWlubmFsZS04NDky/NzMuanBn",
    songIds: ["s57", "s74", "s64", "s58", "s70", "s63", "s75", "s55", "s61", "s69", "s76", "s62", "s66", "s59", "s68", "s60", "s71", "s72", "s73", "s67", "s56"],
    color: "#21e83b"
  },
  {
    id: "p-minnale",
    name: "Minnale 2001 Tamil Songs",
    description: "Azhagiya Theeye, Vaseegara, Venmathiye, Verenna Verenna, Nenjai Poopol",
    coverUrl: "https://imgs.search.brave.com/QZGWRzXvLvQo7rpa6S4qY0loYd8NEOXIEGbH9G4OQYw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZGlnaXQuaW4v/T1RUL3YyL2ltYWdl/cy90cjpuLW90dF9o/b21lX2Nyb3VzZWwv/bWlubmFsZS04NDky/NzMuanBn",
    songIds: ["s55", "s56", "s57", "s58", "s59"],
    color: "#21e83b"
  },
  {
    id: "p-alaipayuthey",
    name: "Alaipayuthey Tamil Songs",
    description: "Snehidhane, Pachchai Nirame, Evano Oruvan, Kadhal Sadugudu, Alaipayuthey Kanna, Yaro Yarodi",
    coverUrl: "https://imgs.search.brave.com/sKGgYrA3gqVndZnnxQCNOUhJvI8yTXWKjy33cYzVESo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zLnNh/cmVnYW1hLnRlY2gv/aW1hZ2UvYy9md180/ODUvNy9jMS83ZC9h/bGFpcGF5dXRoZXlf/dGFtaWxfMTY4NjEz/ODQyOS5qcGc",
    songIds: ["s60", "s61", "s62", "s63", "s64", "s65"],
    color: "#b246aa"
  },
  {
    id: "p-vaaranam",
    name: "Vaaranam Aayiram 2008 Tamil Songs",
    description: "Nenjukkul Peidhidum, Mundhinam Parthene, Annal Maelae, Ava Enna Enna, Vaaranam Aayiram, Yethi Yethi",
    coverUrl: "https://imgs.search.brave.com/brPJrJpvX9pMMWb-1bEqY56iMIseTm1CQZppnzQ7pp4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jLnNh/YXZuY2RuLmNvbS82/MzUvVmFhcmFuYW0t/QWF5aXJhbS1UYW1p/bC0yMDA4LTIwMTkw/NjI5MTQxMTI4LTUw/MHg1MDAuanBn",
    songIds: ["s66", "s67", "s68", "s69", "s70", "s71", "s72"],
    color: "#dca752"
  },
  {
    id: "p-vtv",
    name: "Vinnaithandi Varuvaya 2009 Tamil Songs",
    description: "Hosanna, Mannipaaya, Omana Penne, Anbil Avan",
    coverUrl: "https://imgs.search.brave.com/achiprrH0qgmI9gkjfceSWasexujrPpQne4C3P6pEA4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jLnNh/YXZuY2RuLmNvbS8y/NTMvVmlubmF0aGFh/bmRpLVZhcnV2YWF5/YWEtVGFtaWwtMjAx/MC0yMDE5MDczMTEz/NDEyMy01MDB4NTAw/LmpwZw",
    songIds: ["s73", "s74", "s75", "s76"],
    color: "#11bbe7"
  },

 {
  id: "p1",
  name: "Jana Nayagan Tamil songs ",
  description: " Thalapathy Kacheri, Chella Magale, Raavana Mavandaa, Adiye En Poonthene, The True Leader, Uravu, Oru Pere Varalaaru, Ulla Olicha Uyire, Thalapathy Vetri Kondan ",
  coverUrl: "https://cdn.phototourl.com/free/2026-07-27-561cfcff-d7b7-4f0c-af83-ab164dd93037.jpg",
  songIds: ["s1", "s2", "s3", "s4", "s5"],
  color: "#1db954"
},

 {
  id: "p2",
  name: "Kadhalar Dhinam Tamil songs",
  description: "",
  coverUrl: "https://imgs.search.brave.com/DOwWfIaGtcK3K9Wl7QTYKUK4cBlfBZ_tpJBSMuWYaSc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGlzdHJpY3QuaW4v/bW92aWVzLWFzc2V0/cy9pbWFnZXMvY2lu/ZW1hL0thZGhhbGFy/LURoaW5hbV9Db3Zl/ci0wZjQ0YjhjMC0w/NzBjLTExZjEtYTFh/Zi1kM2RmNWI2MmNj/YzcuanBn",
  songIds: ["s6", "s7", "s8", "s9", "s10"],
  color: "#812716"
},


];
