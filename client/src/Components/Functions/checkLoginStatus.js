export default async function checkLoginStatus() {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "x-access-token" : localStorage.getItem('token')},
    };

    const response = await fetch('/logged_in', requestOptions);
    if(response.status != 200) {
        window.location.replace('/login')
    }
}