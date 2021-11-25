var axios = require('axios');

function sendSMS(trip, worker) {
    const url = 'http://uapi.upsend.co.il/SendMessageXml.ashx'
    var xmlBody = `
    <Inforu>
        <User>
            <Username>UPSEND13543</Username>
            <ApiToken>676939a8-2888-4a18-a1f8-cb0edd9b050c</ApiToken>
        </User>
        <Content Type="sms">
            <Message>
                שלום ${ worker.fullName }, הנך משובץ לטיול ${ trip.body } בתפקיד ${ worker.job == 'guard' ? 'מאבטח' : 'חובש' } עם ${ trip.school}. בתאריכים ${ trip.startDate } - ${ trip.finishDate }, סוג הלינה הוא ${ trip.sleep } איש קשר: ${ trip.contact } כתובת התייצבות: ${ trip.address } בשעה ${ trip.hour } לאישור קבלה השב - אישור
            </Message>
        </Content>
        <Recipients>
            <PhoneNumber>${ worker.phone }</PhoneNumber>
        </Recipients>
        <Settings>
            <Sender>0001</Sender>
        </Settings>
   </Inforu>`;

   axios.post(url, null, { params: { InforuXML : xmlBody } })
   .then(result => {return result.data})
}

module.exports = sendSMS