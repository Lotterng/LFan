const BASE_URL = 'https://api.bgm.tv/'

const calendar = 'calendar'

const subjects = 'v0/subjects/{subject_id}'

const characters = 'v0/subjects/{subject_id}/characters'

const rank ='v0/subjects?type={type}&sort=rank&limit={limit}&offset={offset}'

const episodes = 'v0/episodes?subject_id={subject_id}&limit={limit}&offset={offset}'

const episodesInfo = 'v0/episodes/{subject_id}'
export { BASE_URL, calendar, subjects, characters, rank, episodes }