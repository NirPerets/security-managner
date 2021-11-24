export default function checkTripActive(startDate, finishDate) {
    const startDateSplit = startDate.split('/')
    const finishDateSplit = finishDate.split('/')
    const today = new Date()

    if (startDateSplit[1] == finishDateSplit[1]) {
        if (today.getDate() >= startDateSplit[0] && today.getDate() <= finishDateSplit[0]) return true
        else return false
    } else {
        if (today.getDate() >= startDateSplit[0] && today.getMonth() == (startDateSplit[1] - 1) || today.getDate() <= finishDateSplit[0] && today.getMonth() == (finishDateSplit[1] - 1)) return true
        else return false
    }

    return false
}