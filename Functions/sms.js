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
                שלום ${ worker.fullName }, הנך משובץ לטיול ${ trip.body } בתפקיד ${ worker.job == 'guard' ? 'מאבטח מע"ר' : 'חובש' } עם ${ trip.school}. בתאריכים ${ trip.startDate } - ${ trip.finishDate }, הלינה היא ${ trip.sleep } כתובת התייצבות: ${ trip.address } בשעה ${ trip.hour } איש קשר: ${ trip.contact } https://turismo-israel.herokuapp.com/ לאישור
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