export default async function checkLoginStatus() {
    const response = await fetch('/logged_in', { headers: {"x-access-token" : localStorage.getItem('token')} });
    if(response.status != 200) {
        window.location.replace('/login')
    }
}